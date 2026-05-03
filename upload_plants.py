#!/usr/bin/env python3
"""
Upload remaining plants to the GreenZin API.
Skips already-uploaded rows: 14 (Holy Basil/Tulsi), 21 (Money Plant), 26 (Snake Plant)
"""

import openpyxl
import json
import os
import subprocess
import sys

UPLOADS_DIR = "/Users/subh/SKS/greenzin/public/uploads"
API_URL = "http://localhost:3000/api/plants"
EXCEL_PATH = "/Users/subh/SKS/greenzin/plants_final_v2 (1).xlsx"

# Excel row numbers (1-indexed) that are already uploaded
ALREADY_UPLOADED_ROWS = {14, 21, 26}

def upload_plant(row_data, image_path):
    name = row_data[0].strip()
    price = str(row_data[1])
    rating = str(row_data[2])
    availability = row_data[7] if row_data[7] else "In Stock"
    tagline = row_data[8]
    review_count = str(row_data[9])
    desc_botanical = row_data[10]
    desc_origin = row_data[11]
    desc_benefits = row_data[12]
    care_sunlight = row_data[13]
    care_watering = row_data[14]
    care_maintenance = row_data[15]
    spec_height = row_data[16]
    spec_pot = row_data[17]
    spec_weight = row_data[18]
    spec_soil = row_data[19]

    # Parse categories and highlights as JSON arrays
    cats_raw = row_data[4] or ""
    cats = [c.strip() for c in cats_raw.split(",") if c.strip()]
    cats_json = json.dumps(cats)

    highs_raw = row_data[5] or ""
    highs = [h.strip() for h in highs_raw.split(",") if h.strip()]
    highs_json = json.dumps(highs)

    cmd = [
        "curl", "--location", API_URL,
        "--form", f"image1=@{image_path}",
        "--form", f"image2=@{image_path}",
        "--form", f"name={name}",
        "--form", f"basePrice={price}",
        "--form", f"availability={availability}",
        "--form", f"ratingScore={rating}",
        "--form", f"reviewCount={review_count}",
        "--form", f"categories={cats_json}",
        "--form", f"highlights={highs_json}",
        "--form", f"tagline={tagline}",
        "--form", f"description_botanical={desc_botanical}",
        "--form", f"description_origin={desc_origin}",
        "--form", f"description_benefits={desc_benefits}",
        "--form", f"careInstructions_sunlight={care_sunlight}",
        "--form", f"careInstructions_watering={care_watering}",
        "--form", f"careInstructions_maintenance={care_maintenance}",
        "--form", f"specifications_height={spec_height}",
        "--form", f"specifications_potSize={spec_pot}",
        "--form", f"specifications_weight={spec_weight}",
        "--form", f"specifications_soilType={spec_soil}",
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
    skip_count = 0

    for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=True), 2):
        if not row[0]:
            continue

        excel_row = row_idx  # 1-indexed row in the Excel file

        if excel_row in ALREADY_UPLOADED_ROWS:
            print(f"[SKIP] Row {excel_row}: {row[0]} (already uploaded)")
            skip_count += 1
            continue

        name = row[0].strip()

        # Find the image file
        image_path = os.path.join(UPLOADS_DIR, name + ".png")
        if not os.path.exists(image_path):
            print(f"[ERROR] Image not found for '{name}': {image_path}")
            fail_count += 1
            continue

        success = upload_plant(row, image_path)
        if success:
            success_count += 1
        else:
            fail_count += 1

    print(f"\n{'='*60}")
    print(f"DONE. Uploaded: {success_count} | Failed: {fail_count} | Skipped: {skip_count}")


if __name__ == "__main__":
    main()
