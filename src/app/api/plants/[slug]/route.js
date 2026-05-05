import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import { generateSlug, handleApiError, ErrorHandler } from "@/lib/utility";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const SAFE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// ─── GET /api/plants/[slug] ───────────────────────────────────────────────────
export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const plant = await Plant.findOne({ slug }).lean();
    if (!plant) throw new ErrorHandler("Plant not found", 404);

    const { _id, ...rest } = plant;
    return NextResponse.json(
      { success: true, plant: { ...rest, id: _id.toString() } },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── PATCH /api/plants/[slug] ─────────────────────────────────────────────────
// Partial update — only fields you include in the form-data are changed.
// Everything else stays untouched.
//
// Scalar fields:
//   name, tagline, basePrice, quantity, availability,
//   ratingScore, reviewCount, bestseller, slug
//
// Nested fields (underscore-separated):
//   description_botanical, description_origin, description_benefits
//   careInstructions_sunlight, careInstructions_watering, careInstructions_maintenance
//   specifications_height, specifications_potSize, specifications_weight, specifications_soilType
//
// Array fields (send as JSON strings):
//   categories  →  '["Indoor Plants","Easy Care"]'
//   highlights  →  '["Low Maintenance","Air-Purifying"]'
//
// Image files:
//   image1, image2  →  replaces the file and deletes the old one from disk
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const plant = await Plant.findOne({ slug });
    if (!plant) throw new ErrorHandler("Plant not found", 404);

    const formData = await request.formData();
    const update = {};

    // Returns trimmed string only if the key was actually sent in the request
    const str = (key) => {
      const val = formData.get(key);
      return val !== null ? val.trim() : undefined;
    };

    // ── Scalar fields ─────────────────────────────────────────────────────────
    const name = str("name");
    if (name !== undefined) {
      if (!name) throw new ErrorHandler("name cannot be empty", 400);
      update.name = name;
    }

    const tagline = str("tagline");
    if (tagline !== undefined) update.tagline = tagline;

    const availability = str("availability");
    if (availability !== undefined) update.availability = availability;

    const basePriceRaw = formData.get("basePrice");
    if (basePriceRaw !== null) {
      const basePrice = Number(basePriceRaw);
      if (isNaN(basePrice) || basePrice < 0)
        throw new ErrorHandler("basePrice must be a non-negative number", 400);
      update.basePrice = basePrice;
    }

    const quantityRaw = formData.get("quantity");
    if (quantityRaw !== null) {
      const quantity = Number(quantityRaw);
      if (isNaN(quantity) || quantity < 0)
        throw new ErrorHandler("quantity must be a non-negative number", 400);
      update.quantity = quantity;
    }

    const ratingScoreRaw = formData.get("ratingScore");
    if (ratingScoreRaw !== null) update.ratingScore = Number(ratingScoreRaw);

    const reviewCountRaw = formData.get("reviewCount");
    if (reviewCountRaw !== null) update.reviewCount = Number(reviewCountRaw);

    const bestsellerRaw = formData.get("bestseller");
    if (bestsellerRaw !== null) {
      update.bestseller = bestsellerRaw === "true" || bestsellerRaw === true;
    }

    // ── Slug rename (check for conflicts first) ───────────────────────────────
    const newSlug = str("slug") || (name ? generateSlug(name) : undefined);
    if (newSlug && newSlug !== slug) {
      const conflict = await Plant.findOne({ slug: newSlug }).lean();
      if (conflict) throw new ErrorHandler(`A plant with slug "${newSlug}" already exists`, 409);
      update.slug = newSlug;
    }

    // ── Nested: description ───────────────────────────────────────────────────
    const descBotanical = str("description_botanical");
    const descOrigin    = str("description_origin");
    const descBenefits  = str("description_benefits");
    if (descBotanical !== undefined) update["description.botanical"] = descBotanical;
    if (descOrigin    !== undefined) update["description.origin"]    = descOrigin;
    if (descBenefits  !== undefined) update["description.benefits"]  = descBenefits;

    // ── Nested: careInstructions ──────────────────────────────────────────────
    const careSunlight    = str("careInstructions_sunlight");
    const careWatering    = str("careInstructions_watering");
    const careMaintenance = str("careInstructions_maintenance");
    if (careSunlight    !== undefined) update["careInstructions.sunlight"]    = careSunlight;
    if (careWatering    !== undefined) update["careInstructions.watering"]    = careWatering;
    if (careMaintenance !== undefined) update["careInstructions.maintenance"] = careMaintenance;

    // ── Nested: specifications ────────────────────────────────────────────────
    const specHeight  = str("specifications_height");
    const specPotSize = str("specifications_potSize");
    const specWeight  = str("specifications_weight");
    const specSoil    = str("specifications_soilType");
    if (specHeight  !== undefined) update["specifications.height"]   = specHeight;
    if (specPotSize !== undefined) update["specifications.potSize"]  = specPotSize;
    if (specWeight  !== undefined) update["specifications.weight"]   = specWeight;
    if (specSoil    !== undefined) update["specifications.soilType"] = specSoil;

    // ── Arrays ────────────────────────────────────────────────────────────────
    const rawCats = formData.get("categories");
    if (rawCats !== null) {
      try { update.categories = JSON.parse(rawCats); }
      catch { throw new ErrorHandler("categories must be a valid JSON array string", 400); }
    }

    const rawHL = formData.get("highlights");
    if (rawHL !== null) {
      try { update.highlights = JSON.parse(rawHL); }
      catch { throw new ErrorHandler("highlights must be a valid JSON array string", 400); }
    }

    // ── Image files ───────────────────────────────────────────────────────────
    const uploadDir = path.join(process.cwd(), "public", "uploadedPlants");
    const effectiveSlug = update.slug ?? slug;
    const ts = Date.now();

    for (const key of ["image1", "image2"]) {
      const imgNum = key === "image1" ? 1 : 2;
      const file = formData.get(key);

      if (!file || typeof file === "string") continue; // not sent → skip

      if (!ALLOWED_TYPES.has(file.type))
        throw new ErrorHandler(`${key}: unsupported type. Use JPEG, PNG, WebP, or AVIF`, 400);

      await fs.mkdir(uploadDir, { recursive: true });

      const rawExt = path.extname(file.name).toLowerCase();
      const ext = SAFE_EXTS.has(rawExt) ? rawExt : ".jpg";
      const filename = `${effectiveSlug}-${ts}-${imgNum}${ext}`;

      // Delete old image from disk (non-fatal if missing)
      if (plant[key]) {
        await fs.unlink(path.join(process.cwd(), "public", plant[key])).catch(() => {});
      }

      await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
      update[key] = `/uploadedPlants/${filename}`;
    }

    // ── Guard: nothing to update ──────────────────────────────────────────────
    if (Object.keys(update).length === 0)
      throw new ErrorHandler("No updatable fields were provided", 400);

    // ── Apply ─────────────────────────────────────────────────────────────────
    const updated = await Plant.findOneAndUpdate(
      { slug },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    const { _id, ...rest } = updated;
    return NextResponse.json(
      { success: true, plant: { ...rest, id: _id.toString() } },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── DELETE /api/plants/[slug] ────────────────────────────────────────────────
export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const plant = await Plant.findOneAndDelete({ slug }).lean();
    if (!plant) throw new ErrorHandler("Plant not found", 404);

    const tryRemove = async (imgPath) => {
      if (!imgPath) return;
      try {
        await fs.unlink(path.join(process.cwd(), "public", imgPath));
      } catch {
        // Non-fatal
      }
    };

    await Promise.all([tryRemove(plant.image1), tryRemove(plant.image2)]);

    return NextResponse.json({ success: true, message: "Plant deleted" }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}