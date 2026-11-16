
#!/usr/bin/env python3

"""
GREENZIN POT BULK UPLOAD SCRIPT

Excel:
    Downloads/Merged_Planters_Catalogue.xlsx

Images:
    Downloads/final_pot_images/

API:
    http://localhost:3000/api/pots

Tracking:
    Downloads/pot_upload_tracking.xlsx

Features:
    1. Supports one or two images per product.
    2. Skips products already successfully uploaded.
    3. Detects existing MongoDB products through HTTP 409.
    4. Maintains an Excel tracking file.
    5. Saves tracking immediately after each product.
    6. Retries failed uploads on the next run.
    7. Supports JPG, JPEG, PNG, WEBP and AVIF.
"""

import openpyxl
import requests
import json
import re
import mimetypes

from pathlib import Path
from datetime import datetime
from openpyxl.styles import Font, PatternFill, Alignment


# ============================================================
# CONFIGURATION
# ============================================================

DOWNLOADS_DIR = Path.home() / "Downloads"

EXCEL_PATH = DOWNLOADS_DIR / "Merged_Planters_Catalogue (1).xls"

IMAGES_DIR = DOWNLOADS_DIR / "final_pot_images"

TRACKING_PATH = DOWNLOADS_DIR / "pot_upload_tracking.xlsx"

API_URL = "http://localhost:3000/api/pots"

IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif"
]

DEFAULT_QUANTITY = 15
DEFAULT_AVAILABILITY = "In Stock"

REQUEST_TIMEOUT = 120

# Statuses that should not be uploaded again.
FINAL_STATUSES = {
    "SUCCESS",
    "ALREADY_EXISTS"
}


# ============================================================
# BASIC HELPERS
# ============================================================

def safe_str(value):

    if value is None:
        return ""

    if isinstance(value, float) and value.is_integer():
        return str(int(value))

    return str(value).strip()


def parse_boolean(value):

    if isinstance(value, bool):
        return value

    return safe_str(value).lower() in [
        "true", "yes", "1", "y"
    ]


def parse_number(value, field_name, default=None):

    if value is None or safe_str(value) == "":
        return default

    try:

        number = float(value)

        if number.is_integer():
            return int(number)

        return number

    except (ValueError, TypeError):

        raise ValueError(
            f"Invalid numeric value for {field_name}: {value}"
        )


def parse_array(value):

    if value is None:
        return []

    raw = safe_str(value)

    if not raw:
        return []

    if raw.startswith("[") and raw.endswith("]"):

        try:

            parsed = json.loads(raw)

            if isinstance(parsed, list):

                return [
                    str(item).strip()
                    for item in parsed
                    if str(item).strip()
                ]

        except json.JSONDecodeError:
            pass

    return [
        item.strip()
        for item in raw.split(",")
        if item.strip()
    ]


# ============================================================
# IMAGE NAME PARSING
# ============================================================

def get_image_names(image_name):
    """
    Supports:

        32.png

        ["33.png", "34.png"]

        ['35.png', '36.png']

    One image:
        Same image will be uploaded as image1 and image2.

    Two images:
        First image -> image1
        Second image -> image2
    """

    if not image_name:
        return []

    raw = safe_str(image_name)

    try:

        parsed = json.loads(raw)

        if isinstance(parsed, list):

            return [
                str(item).strip()
                for item in parsed
                if str(item).strip()
            ]

        if isinstance(parsed, str):
            return [parsed.strip()] if parsed.strip() else []

    except json.JSONDecodeError:
        pass

    # Handle Python-style list strings using single quotes.
    if raw.startswith("[") and raw.endswith("]"):

        try:

            import ast

            parsed = ast.literal_eval(raw)

            if isinstance(parsed, list):

                return [
                    str(item).strip()
                    for item in parsed
                    if str(item).strip()
                ]

        except (ValueError, SyntaxError):
            pass

    return [raw]


# ============================================================
# IMAGE MATCHING
# ============================================================

def normalize_filename(filename):

    filename = Path(filename).stem.lower()

    filename = filename.replace("/", " ")
    filename = filename.replace("\\", " ")

    filename = re.sub(r"[_-]+", " ", filename)
    filename = re.sub(r"\s+", " ", filename)

    return filename.strip()


def build_image_index():

    image_index = {}

    for file in IMAGES_DIR.iterdir():

        if not file.is_file():
            continue

        if file.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        image_index[file.name.lower()] = file

        normalized = normalize_filename(file.name)

        image_index.setdefault(
            normalized,
            file
        )

    return image_index


def find_image(image_name, image_index):

    if not image_name:
        return None

    image_name = safe_str(image_name)

    # Exact filename match
    direct = image_index.get(image_name.lower())

    if direct:
        return direct

    # Try extensions if no extension was provided
    if not Path(image_name).suffix:

        for ext in IMAGE_EXTENSIONS:

            candidate = image_index.get(
                (image_name + ext).lower()
            )

            if candidate:
                return candidate

    # Normalized filename match
    normalized = normalize_filename(image_name)

    return image_index.get(normalized)


# ============================================================
# TRACKING EXCEL
# ============================================================

TRACKING_HEADERS = [
    "Excel Row",
    "Product Name",
    "Image Name",
    "Status",
    "HTTP Status",
    "Message",
    "Last Attempt"
]


def initialize_tracking():

    if TRACKING_PATH.exists():

        wb = openpyxl.load_workbook(TRACKING_PATH)

        ws = wb.active

        # Validate existing tracking columns.
        existing_headers = [
            safe_str(cell.value)
            for cell in ws[1]
        ]

        if existing_headers != TRACKING_HEADERS:

            raise ValueError(
                "Tracking Excel headers do not match expected format. "
                "Please inspect the tracking file before proceeding."
            )

        return wb, ws

    wb = openpyxl.Workbook()

    ws = wb.active

    ws.title = "Upload Tracking"

    ws.append(TRACKING_HEADERS)

    # Header styling
    for cell in ws[1]:

        cell.font = Font(
            bold=True,
            color="FFFFFF"
        )

        cell.fill = PatternFill(
            start_color="1F4E78",
            end_color="1F4E78",
            fill_type="solid"
        )

        cell.alignment = Alignment(
            horizontal="center"
        )

    widths = {
        "A": 12,
        "B": 35,
        "C": 30,
        "D": 20,
        "E": 15,
        "F": 55,
        "G": 25
    }

    for column, width in widths.items():
        ws.column_dimensions[column].width = width

    ws.freeze_panes = "A2"

    wb.save(TRACKING_PATH)

    return wb, ws


def load_upload_status(ws):

    status = {}

    for row in ws.iter_rows(min_row=2, values_only=True):

        if not row[0]:
            continue

        excel_row = int(row[0])

        name = safe_str(row[1])

        key = (excel_row, name)

        status[key] = {
            "status": safe_str(row[3]),
            "http_status": safe_str(row[4]),
            "message": safe_str(row[5])
        }

    return status


def save_upload_status(
    wb,
    ws,
    excel_row,
    name,
    image_name,
    status,
    http_status="",
    message=""
):

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    existing_row = None

    # Find existing record using Excel row + product name.
    for row_number in range(2, ws.max_row + 1):

        existing_excel_row = ws.cell(
            row_number, 1
        ).value

        existing_name = safe_str(
            ws.cell(row_number, 2).value
        )

        if (
            existing_excel_row == excel_row
            and existing_name == name
        ):

            existing_row = row_number
            break

    values = [
        excel_row,
        name,
        image_name,
        status,
        http_status,
        message,
        timestamp
    ]

    if existing_row:

        for col, value in enumerate(values, start=1):

            ws.cell(
                existing_row,
                col
            ).value = value

    else:

        ws.append(values)

    # Status coloring
    status_cell = (
        ws.cell(existing_row, 4)
        if existing_row
        else ws.cell(ws.max_row, 4)
    )

    if status == "SUCCESS":
        color = "C6EFCE"

    elif status == "ALREADY_EXISTS":
        color = "BDD7EE"

    elif status == "FAILED":
        color = "FFC7CE"

    else:
        color = "FFEB9C"

    status_cell.fill = PatternFill(
        start_color=color,
        end_color=color,
        fill_type="solid"
    )

    # Save immediately after every product.
    wb.save(TRACKING_PATH)


# ============================================================
# PREPARE API DATA
# ============================================================

def prepare_pot_data(row_data):

    name = safe_str(row_data.get("name"))

    if not name:
        raise ValueError("Pot name is missing")

    base_price = parse_number(
        row_data.get("basePrice"),
        "basePrice"
    )

    if base_price is None:
        raise ValueError("basePrice is required")

    if base_price < 0:
        raise ValueError("basePrice cannot be negative")

    quantity = parse_number(
        row_data.get("quantity"),
        "quantity",
        DEFAULT_QUANTITY
    )

    rating_score = parse_number(
        row_data.get("ratingScore"),
        "ratingScore",
        0
    )

    review_count = parse_number(
        row_data.get("reviewCount"),
        "reviewCount",
        0
    )

    if quantity < 0 or review_count < 0:
        raise ValueError(
            "Quantity and reviewCount cannot be negative"
        )

    if rating_score < 0 or rating_score > 5:
        raise ValueError(
            "ratingScore must be between 0 and 5"
        )

    data = {

        "name": name,

        "variant": safe_str(
            row_data.get("variant")
        ),

        "basePrice": str(base_price),

        "quantity": str(quantity),

        "bestseller": str(
            parse_boolean(
                row_data.get("bestseller")
            )
        ).lower(),

        "availability": (
            safe_str(
                row_data.get("availability")
            ) or DEFAULT_AVAILABILITY
        ),

        "ratingScore": str(rating_score),

        "reviewCount": str(review_count),

        "categories": json.dumps(
            parse_array(
                row_data.get("categories")
            )
        ),

        "highlights": json.dumps(
            parse_array(
                row_data.get("highlights")
            )
        ),

        "tagline": safe_str(
            row_data.get("tagline")
        ),

        # Description
        "description_material": safe_str(
            row_data.get("description_material")
        ),

        "description_usage": safe_str(
            row_data.get("description_usage")
        ),

        "description_benefits": safe_str(
            row_data.get("description_benefits")
        ),

        # Care instructions
        "careInstructions_cleaning": safe_str(
            row_data.get("careInstructions_cleaning")
        ),

        "careInstructions_maintenance": safe_str(
            row_data.get("careInstructions_maintenance")
        ),

        "careInstructions_usage": safe_str(
            row_data.get("careInstructions_usage")
        ),

        # Specifications
        "specifications_height": safe_str(
            row_data.get("specifications_height")
        ),

        "specifications_diameter": safe_str(
            row_data.get("specifications_diameter")
        ),

        "specifications_weight": safe_str(
            row_data.get("specifications_weight")
        ),

        "specifications_material": safe_str(
            row_data.get("specifications_material")
        ),

        "specifications_drainageHole": safe_str(
            row_data.get("specifications_drainageHole")
        ),

        "specifications_colorFinish": safe_str(
            row_data.get("specifications_colorFinish")
        )
    }

    return data


# ============================================================
# UPLOAD FUNCTION
# ============================================================

def upload_pot(row_data, image1_path, image2_path):

    name = safe_str(row_data.get("name"))

    data = prepare_pot_data(row_data)

    mime1, _ = mimetypes.guess_type(
        str(image1_path)
    )

    mime2, _ = mimetypes.guess_type(
        str(image2_path)
    )

    mime1 = mime1 or "image/jpeg"
    mime2 = mime2 or "image/jpeg"

    print("\n" + "=" * 70)

    print(f"Uploading: {name}")

    print(f"Image 1: {image1_path.name}")

    print(f"Image 2: {image2_path.name}")

    try:

        with open(image1_path, "rb") as image1_file, \
             open(image2_path, "rb") as image2_file:

            files = {

                "image1": (
                    image1_path.name,
                    image1_file,
                    mime1
                ),

                "image2": (
                    image2_path.name,
                    image2_file,
                    mime2
                )
            }

            response = requests.post(
                API_URL,
                data=data,
                files=files,
                timeout=REQUEST_TIMEOUT
            )

        print(
            f"HTTP Status: {response.status_code}"
        )

        try:

            response_data = response.json()

            print(
                "Response:",
                json.dumps(
                    response_data,
                    indent=2,
                    ensure_ascii=False
                )[:1500]
            )

            message = safe_str(
                response_data.get("message")
                or response_data.get("error")
                or response_data
            )

        except ValueError:

            message = response.text[:1000]

            print("Response:", message)

        if response.status_code == 201:

            print(f"[SUCCESS] {name}")

            return (
                "SUCCESS",
                response.status_code,
                message
            )

        elif response.status_code == 409:

            print(
                f"[ALREADY EXISTS] {name}"
            )

            return (
                "ALREADY_EXISTS",
                response.status_code,
                message
            )

        else:

            print(f"[FAILED] {name}")

            return (
                "FAILED",
                response.status_code,
                message
            )

    except requests.RequestException as error:

        print(
            f"[NETWORK ERROR] {name}: {error}"
        )

        return (
            "FAILED",
            "",
            str(error)
        )


# ============================================================
# MAIN FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("GREENZIN POT UPLOAD SCRIPT")
    print("=" * 70)

    # --------------------------------------------------------
    # Check paths
    # --------------------------------------------------------

    if not EXCEL_PATH.is_file():

        print(
            f"[ERROR] Excel file not found: {EXCEL_PATH}"
        )

        return

    if not IMAGES_DIR.is_dir():

        print(
            f"[ERROR] Image folder not found: {IMAGES_DIR}"
        )

        return

    # --------------------------------------------------------
    # Load source Excel
    # --------------------------------------------------------

    workbook = openpyxl.load_workbook(
        EXCEL_PATH,
        data_only=True
    )

    worksheet = workbook.active

    headers = [
        safe_str(cell.value)
        for cell in worksheet[1]
    ]

    required_headers = [
        "name",
        "basePrice",
        "image_name"
    ]

    missing_headers = [
        header
        for header in required_headers
        if header not in headers
    ]

    if missing_headers:

        print(
            f"[ERROR] Missing Excel columns: {missing_headers}"
        )

        workbook.close()
        return

    # --------------------------------------------------------
    # Initialize tracking
    # --------------------------------------------------------

    tracking_wb, tracking_ws = initialize_tracking()

    upload_status = load_upload_status(
        tracking_ws
    )

    # --------------------------------------------------------
    # Build image index
    # --------------------------------------------------------

    image_index = build_image_index()

    print(f"\nSource Excel: {EXCEL_PATH}")

    print(f"Images folder: {IMAGES_DIR}")

    print(f"Tracking Excel: {TRACKING_PATH}")

    print(f"API: {API_URL}")

    print(
        f"Images found: {len(image_index)} index entries"
    )

    # --------------------------------------------------------
    # Counters
    # --------------------------------------------------------

    success_count = 0
    duplicate_count = 0
    fail_count = 0
    skipped_count = 0

    # --------------------------------------------------------
    # Process Excel rows
    # --------------------------------------------------------

    for row_idx, row in enumerate(
        worksheet.iter_rows(
            min_row=2,
            values_only=True
        ),
        start=2
    ):

        row_data = dict(
            zip(headers, row)
        )

        name = safe_str(
            row_data.get("name")
        )

        if not name:
            continue

        image_name = safe_str(
            row_data.get("image_name")
        )

        print("\n" + "-" * 70)

        print(f"Excel Row: {row_idx}")

        print(f"Product: {name}")

        print(f"Image Name: {image_name}")

        # ----------------------------------------------------
        # Check tracking status
        # ----------------------------------------------------

        previous = upload_status.get(
            (row_idx, name)
        )

        if previous:

            previous_status = previous["status"]

            if previous_status in FINAL_STATUSES:

                print(
                    f"[SKIPPED] Already processed: {name}"
                )

                skipped_count += 1
                continue

        # ----------------------------------------------------
        # Parse one or two image names
        # ----------------------------------------------------

        image_names = get_image_names(
            image_name
        )

        if not image_names or len(image_names) > 2:

            message = (
                "Invalid image_name. Expected one or two image filenames."
            )

            print(f"[ERROR] {message}")

            save_upload_status(
                tracking_wb,
                tracking_ws,
                row_idx,
                name,
                image_name,
                "FAILED",
                "",
                message
            )

            upload_status[(row_idx, name)] = {
                "status": "FAILED"
            }

            fail_count += 1
            continue

        # ----------------------------------------------------
        # Find first image
        # ----------------------------------------------------

        image1_path = find_image(
            image_names[0],
            image_index
        )

        if not image1_path:

            message = (
                f"Image not found: {image_names[0]}"
            )

            print(f"[ERROR] {message}")

            save_upload_status(
                tracking_wb,
                tracking_ws,
                row_idx,
                name,
                image_name,
                "FAILED",
                "",
                message
            )

            upload_status[(row_idx, name)] = {
                "status": "FAILED"
            }

            fail_count += 1
            continue

        # ----------------------------------------------------
        # Find second image
        # ----------------------------------------------------

        if len(image_names) == 2:

            image2_path = find_image(
                image_names[1],
                image_index
            )

            if not image2_path:

                message = (
                    f"Image not found: {image_names[1]}"
                )

                print(f"[ERROR] {message}")

                save_upload_status(
                    tracking_wb,
                    tracking_ws,
                    row_idx,
                    name,
                    image_name,
                    "FAILED",
                    "",
                    message
                )

                upload_status[(row_idx, name)] = {
                    "status": "FAILED"
                }

                fail_count += 1
                continue

        else:

            # Only one image: use it for both fields.
            image2_path = image1_path

        # ----------------------------------------------------
        # Upload
        # ----------------------------------------------------

        try:

            status, http_status, message = upload_pot(
                row_data,
                image1_path,
                image2_path
            )

            # Save result immediately.
            save_upload_status(
                tracking_wb,
                tracking_ws,
                row_idx,
                name,
                image_name,
                status,
                http_status,
                message
            )

            upload_status[(row_idx, name)] = {
                "status": status,
                "http_status": http_status,
                "message": message
            }

            if status == "SUCCESS":

                success_count += 1

            elif status == "ALREADY_EXISTS":

                duplicate_count += 1

            else:

                fail_count += 1

        except (ValueError, TypeError) as error:

            message = str(error)

            print(
                f"[DATA ERROR] {name}: {message}"
            )

            save_upload_status(
                tracking_wb,
                tracking_ws,
                row_idx,
                name,
                image_name,
                "FAILED",
                "",
                message
            )

            upload_status[(row_idx, name)] = {
                "status": "FAILED"
            }

            fail_count += 1

        except Exception as error:

            message = str(error)

            print(
                f"[UNEXPECTED ERROR] {name}: {message}"
            )

            save_upload_status(
                tracking_wb,
                tracking_ws,
                row_idx,
                name,
                image_name,
                "FAILED",
                "",
                message
            )

            upload_status[(row_idx, name)] = {
                "status": "FAILED"
            }

            fail_count += 1

    # --------------------------------------------------------
    # Final summary
    # --------------------------------------------------------

    print("\n")

    print("=" * 70)

    print("UPLOAD SUMMARY")

    print("=" * 70)

    print(
        f"New successful uploads : {success_count}"
    )

    print(
        f"Already existed        : {duplicate_count}"
    )

    print(
        f"Skipped from tracking  : {skipped_count}"
    )

    print(
        f"Failed uploads         : {fail_count}"
    )

    print("=" * 70)

    print(
        f"Tracking saved at: {TRACKING_PATH}"
    )

    print("=" * 70)

    tracking_wb.close()

    workbook.close()


if __name__ == "__main__":

    main()
