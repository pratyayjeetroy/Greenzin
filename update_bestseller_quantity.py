#!/usr/bin/env python3
"""
Update `bestseller` (from Excel col 6) and `quantity=15` for all plants in MongoDB.
Matches plants by name. Prints a summary at the end.
"""

import openpyxl
from pymongo import MongoClient

MONGO_URI  = "mongodb+srv://subh5030_db_user:5030@cluster0.ycihb89.mongodb.net/greenzin"
EXCEL_PATH = "/Users/subh/SKS/GreenZin/plants_final_v2 (1).xlsx"

def main():
    # ── Load Excel ────────────────────────────────────────────────────────────
    wb = openpyxl.load_workbook(EXCEL_PATH)
    ws = wb.active

    # Build a lookup: name → bestseller bool
    excel_data = {}
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=True):
        if not row[0]:
            continue
        name = row[0].strip()
        bestseller_raw = str(row[6]).strip().lower() if row[6] is not None else ""
        excel_data[name] = bestseller_raw == "yes"

    print(f"Loaded {len(excel_data)} plants from Excel.\n")

    # ── Connect to MongoDB ────────────────────────────────────────────────────
    client = MongoClient(MONGO_URI)
    db     = client["greenzin"]
    col    = db["plants"]

    updated   = []
    not_found = []

    for name, bestseller in excel_data.items():
        result = col.update_one(
            {"name": name},
            {"$set": {"quantity": 15, "bestseller": bestseller}},
        )

        if result.matched_count == 0:
            not_found.append(name)
            print(f"  [NOT FOUND] {name!r}")
        else:
            status = "modified" if result.modified_count else "already up-to-date"
            updated.append(name)
            print(f"  [OK] {name!r:55s} bestseller={bestseller} | {status}")

    # ── Summary ───────────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"Updated : {len(updated)}")
    print(f"Not found in DB: {len(not_found)}")
    if not_found:
        print("Missing plants:")
        for n in not_found:
            print(f"  - {n}")

if __name__ == "__main__":
    main()
