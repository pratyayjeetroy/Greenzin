#!/usr/bin/env python3
"""
Upload ALL plants from the Excel file to the GreenZin API.
Images are matched from public/uploads/<plant name>.png (slash variants normalised).
"""

import openpyxl
import json
import os
import subprocess
import sys

UPLOADS_DIR = "/Users/subh/SKS/greenzin/public/uploads"
API_URL = "http://localhost:3000/api/plants"
EXCEL_PATH = "/Users/subh/SKS/greenzin/plants_final_v2 (1).xlsx"

def find_image(name):
    """Locate the image file for a plant name.
    Tries exact match first, then strips ` / ` → ` ` to handle filenames
    like 'Ficus Microcarpa (Braided Lattice Bonsai).png' vs
    Excel name 'Ficus Microcarpa (Braided / Lattice Bonsai)'.
    """
    # Exact match
    path = os.path.join(UPLOADS_DIR, name + ".png")
    if os.path.exists(path):
        return path
    # Normalise: remove ' / ' and ' / '-style slashes
    normalised = name.replace(" / ", " ").replace("/", " ")
    path = os.path.join(UPLOADS_DIR, normalised + ".png")
    if os.path.exists(path):
        return path
    return None

def safe_str(val):
    """Return value as a full string, preserving semicolons and all characters."""
    if val is None:
        return ""
    return str(val)


def upload_plant(row_data, image_path):
    name = row_data[0].strip()
    price = safe_str(row_data[1])
    rating = safe_str(row_data[2])
    availability = safe_str(row_data[7]) if row_data[7] else "In Stock"
    tagline = safe_str(row_data[8])
    review_count = safe_str(row_data[9])
    desc_botanical = safe_str(row_data[10])
    desc_origin = safe_str(row_data[11])
    desc_benefits = safe_str(row_data[12])
    care_sunlight = safe_str(row_data[13])
    care_watering = safe_str(row_data[14])
    care_maintenance = safe_str(row_data[15])
    spec_height = safe_str(row_data[16])
    spec_pot = safe_str(row_data[17])
    spec_weight = safe_str(row_data[18])
    spec_soil = safe_str(row_data[19])

    # Bestseller: col 6 — "Yes" → 1, anything else → 0
    bestseller_raw = safe_str(row_data[6]).strip().lower()
    bestseller = 1 if bestseller_raw == "yes" else 0

    # Parse categories and highlights as JSON arrays
    cats_raw = safe_str(row_data[4])
    cats = [c.strip() for c in cats_raw.split(",") if c.strip()]
    cats_json = json.dumps(cats)

    highs_raw = safe_str(row_data[5])
    highs = [h.strip() for h in highs_raw.split(",") if h.strip()]
    highs_json = json.dumps(highs)

    cmd = [
        "curl", "--location", API_URL,
        # File uploads must use --form with @ prefix
        "--form", f"image1=@{image_path}",
        "--form", f"image2=@{image_path}",
        # All text fields use --form-string so semicolons are never misread as MIME params
        "--form-string", f"name={name}",
        "--form-string", f"basePrice={price}",
        "--form-string", f"quantity=15",
        "--form-string", f"bestseller={bestseller}",
        "--form-string", f"availability={availability}",
        "--form-string", f"ratingScore={rating}",
        "--form-string", f"reviewCount={review_count}",
        "--form-string", f"categories={cats_json}",
        "--form-string", f"highlights={highs_json}",
        "--form-string", f"tagline={tagline}",
        "--form-string", f"description_botanical={desc_botanical}",
        "--form-string", f"description_origin={desc_origin}",
        "--form-string", f"description_benefits={desc_benefits}",
        "--form-string", f"careInstructions_sunlight={care_sunlight}",
        "--form-string", f"careInstructions_watering={care_watering}",
        "--form-string", f"careInstructions_maintenance={care_maintenance}",
        "--form-string", f"specifications_height={spec_height}",
        "--form-string", f"specifications_potSize={spec_pot}",
        "--form-string", f"specifications_weight={spec_weight}",
        "--form-string", f"specifications_soilType={spec_soil}",
    ]

    print(f"\n{'='*60}")
    print(f"Uploading: {name}")
    print(f"Image: {image_path}")

    result = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Status: {result.returncode}")
    print(f"Response: {result.stdout[:500] if result.stdout else '(empty)'}")
    if result.stderr:
        print(f"Stderr: {result.stderr[:200]}")
    return result.returncode == 0


def main():
    wb = openpyxl.load_workbook(EXCEL_PATH)
    ws = wb.active

    success_count = 0
    fail_count = 0

    for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=True), 2):
        if not row[0]:
            continue

        name = row[0].strip()

        # Find the image file (handles slash-variant names)
        image_path = find_image(name)
        if not image_path:
            print(f"[ERROR] Image not found for '{name}'")
            fail_count += 1
            continue

        success = upload_plant(row, image_path)
        if success:
            success_count += 1
        else:
            fail_count += 1

    print(f"\n{'='*60}")
    print(f"DONE. Uploaded: {success_count} | Failed: {fail_count}")


if __name__ == "__main__":
    main()
