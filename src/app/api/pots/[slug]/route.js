
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

import { connectDB } from "@/lib/db";
import { Pot } from "@/lib/models/potSchema";
import {
  generateSlug,
  handleApiError,
  ErrorHandler,
} from "@/lib/utility";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploadedPots"
);

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const SAFE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

// ─── Helper functions ────────────────────────────────────────────────────────

const getString = (formData, key) => {
  const value = formData.get(key);

  if (value === null) return undefined;

  if (typeof value !== "string") {
    throw new ErrorHandler(`${key} must be a string`, 400);
  }

  return value.trim();
};

const parseNumber = (value, field, min = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < min) {
    throw new ErrorHandler(
      `${field} must be a valid number greater than or equal to ${min}`,
      400
    );
  }

  return number;
};

const parseBoolean = (value) => {
  return ["true", "yes", "1"].includes(
    String(value).trim().toLowerCase()
  );
};

const parseArray = (value, field) => {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new ErrorHandler(
      `${field} must be a valid JSON array string`,
      400
    );
  }
};

// Save uploaded image and return its public URL.
async function saveImage(file, filenamePrefix) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new ErrorHandler("Invalid image file", 400);
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ErrorHandler(
      "Unsupported image type. Use JPEG, PNG, WebP, or AVIF",
      400
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const rawExt = path.extname(file.name || "").toLowerCase();
  const extension = SAFE_EXTS.has(rawExt) ? rawExt : ".jpg";

  const filename = `${filenamePrefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploadedPots/${filename}`;
}

// Delete only images belonging to uploadedPots.
async function deleteImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploadedPots/")) return;

  const filename = path.basename(imageUrl);
  const imagePath = path.join(UPLOAD_DIR, filename);

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to delete image:", error);
    }
  }
}

// ─── GET /api/pots/[slug] ────────────────────────────────────────────────────

export async function GET(_request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const pot = await Pot.findOne({ slug }).lean();

    if (!pot) {
      throw new ErrorHandler("Pot not found", 404);
    }

    const { _id, __v, ...rest } = pot;

    return NextResponse.json(
      {
        success: true,
        pot: {
          ...rest,
          id: _id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── PATCH /api/pots/[slug] ──────────────────────────────────────────────────
// Partial update: only the fields included in FormData are changed.
//
// Scalar fields:
// name, variant, tagline, availability,
// basePrice, quantity, ratingScore, reviewCount,
// bestseller, slug
//
// Nested fields:
// description_material
// description_usage
// description_benefits
//
// careInstructions_cleaning
// careInstructions_maintenance
// careInstructions_usage
//
// specifications_height
// specifications_diameter
// specifications_weight
// specifications_material
// specifications_drainageHole
// specifications_colorFinish
//
// Arrays (JSON strings):
// categories, highlights
//
// Images:
// image1, image2

export async function PATCH(request, { params }) {
  const newImagePaths = [];

  try {
    await connectDB();

    const { slug } = await params;

    const pot = await Pot.findOne({ slug });

    if (!pot) {
      throw new ErrorHandler("Pot not found", 404);
    }

    const formData = await request.formData();
    const update = {};

    // ── Scalar fields ────────────────────────────────────────────────────────

    const name = getString(formData, "name");

    if (name !== undefined) {
      if (!name) {
        throw new ErrorHandler("name cannot be empty", 400);
      }

      update.name = name;
    }

    const variant = getString(formData, "variant");
    if (variant !== undefined) update.variant = variant;

    const tagline = getString(formData, "tagline");
    if (tagline !== undefined) update.tagline = tagline;

    const availability = getString(formData, "availability");
    if (availability !== undefined) update.availability = availability;

    // ── Number fields ────────────────────────────────────────────────────────

    const numberFields = [
      "basePrice",
      "quantity",
      "ratingScore",
      "reviewCount",
    ];

    for (const field of numberFields) {
      const value = formData.get(field);

      if (value !== null) {
        update[field] = parseNumber(value, field);
      }
    }

    // ── Bestseller ──────────────────────────────────────────────────────────

    const bestseller = formData.get("bestseller");

    if (bestseller !== null) {
      update.bestseller = parseBoolean(bestseller);
    }

    // ── Slug update ─────────────────────────────────────────────────────────

    const suppliedSlug = getString(formData, "slug");

    const newSlug =
      suppliedSlug !== undefined
        ? suppliedSlug
        : name !== undefined
        ? generateSlug(name)
        : undefined;

    if (newSlug !== undefined) {
      if (!newSlug) {
        throw new ErrorHandler("slug cannot be empty", 400);
      }

      if (newSlug !== slug) {
        const conflict = await Pot.findOne({
          slug: newSlug,
          _id: { $ne: pot._id },
        }).lean();

        if (conflict) {
          throw new ErrorHandler(
            `A pot with slug "${newSlug}" already exists`,
            409
          );
        }

        update.slug = newSlug;
      }
    }

    // ── Nested: description ──────────────────────────────────────────────────

    const descriptionFields = [
      "material",
      "usage",
      "benefits",
    ];

    for (const field of descriptionFields) {
      const value = getString(
        formData,
        `description_${field}`
      );

      if (value !== undefined) {
        update[`description.${field}`] = value;
      }
    }

    // ── Nested: careInstructions ─────────────────────────────────────────────

    const careFields = [
      "cleaning",
      "maintenance",
      "usage",
    ];

    for (const field of careFields) {
      const value = getString(
        formData,
        `careInstructions_${field}`
      );

      if (value !== undefined) {
        update[`careInstructions.${field}`] = value;
      }
    }

    // ── Nested: specifications ───────────────────────────────────────────────

    const specificationFields = [
      "height",
      "diameter",
      "weight",
      "material",
      "drainageHole",
      "colorFinish",
    ];

    for (const field of specificationFields) {
      const value = getString(
        formData,
        `specifications_${field}`
      );

      if (value !== undefined) {
        update[`specifications.${field}`] = value;
      }
    }

    // ── Arrays ───────────────────────────────────────────────────────────────

    const rawCategories = formData.get("categories");

    if (rawCategories !== null) {
      update.categories = parseArray(
        rawCategories,
        "categories"
      );
    }

    const rawHighlights = formData.get("highlights");

    if (rawHighlights !== null) {
      update.highlights = parseArray(
        rawHighlights,
        "highlights"
      );
    }

    // ── Images ───────────────────────────────────────────────────────────────

    const oldImages = [pot.image1, pot.image2];
    const effectiveSlug = update.slug || pot.slug;
    const timestamp = Date.now();

    const image1File = formData.get("image1");
    const image2File = formData.get("image2");

    const hasImage1 =
      image1File !== null && typeof image1File !== "string";

    const hasImage2 =
      image2File !== null && typeof image2File !== "string";

    // If image1 is uploaded without image2,
    // both image fields will point to the new image1.
    if (hasImage1) {
      const newImage1 = await saveImage(
        image1File,
        `${effectiveSlug}-1-${timestamp}`
      );

      newImagePaths.push(newImage1);

      update.image1 = newImage1;

      if (!hasImage2) {
        update.image2 = newImage1;
      }
    }

    // If image2 is uploaded, update it independently.
    if (hasImage2) {
      const newImage2 = await saveImage(
        image2File,
        `${effectiveSlug}-2-${timestamp}`
      );

      newImagePaths.push(newImage2);

      update.image2 = newImage2;
    }

    // ── Guard: nothing to update ─────────────────────────────────────────────

    if (Object.keys(update).length === 0) {
      throw new ErrorHandler(
        "No updatable fields were provided",
        400
      );
    }

    // ── Apply update ─────────────────────────────────────────────────────────

    const updated = await Pot.findOneAndUpdate(
      { slug },
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      throw new ErrorHandler("Pot not found", 404);
    }

    // Delete old images only after successful database update.
    const imagesToKeep = new Set([
      updated.image1,
      updated.image2,
    ]);

    const uniqueOldImages = [...new Set(oldImages)];

    for (const oldImage of uniqueOldImages) {
      if (oldImage && !imagesToKeep.has(oldImage)) {
        await deleteImage(oldImage);
      }
    }

    const { _id, __v, ...rest } = updated;

    return NextResponse.json(
      {
        success: true,
        message: "Pot updated successfully",
        pot: {
          ...rest,
          id: _id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Remove newly uploaded images if the update fails.
    await Promise.all(
      newImagePaths.map((image) => deleteImage(image))
    );

    return handleApiError(error);
  }
}

// ─── DELETE /api/pots/[slug] ─────────────────────────────────────────────────

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const pot = await Pot.findOneAndDelete({ slug }).lean();

    if (!pot) {
      throw new ErrorHandler("Pot not found", 404);
    }

    // Delete both images. Set prevents duplicate deletion
    // when image1 and image2 contain the same URL.
    const images = [...new Set([pot.image1, pot.image2])];

    await Promise.all(
      images.map((image) => deleteImage(image))
    );

    return NextResponse.json(
      {
        success: true,
        message: "Pot deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
