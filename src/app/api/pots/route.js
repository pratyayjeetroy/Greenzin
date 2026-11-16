
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { connectDB } from "@/lib/db";
import { Pot } from "@/lib/models/potSchema";
import {
  generateSlug,
  handleApiError,
  ErrorHandler,
} from "@/lib/utility";

export const runtime = "nodejs";

// ─── Configuration ────────────────────────────────────────────────

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploadedPots");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

// ─── Helper: Save image ────────────────────────────────────────────

async function saveImage(file, filename) {
  const extension = path.extname(file.name).toLowerCase();

  const safeExtension = ALLOWED_EXTENSIONS.has(extension)
    ? extension
    : ".jpg";

  const finalFilename = `${filename}${safeExtension}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  await fs.writeFile(
    path.join(UPLOAD_DIR, finalFilename),
    Buffer.from(await file.arrayBuffer())
  );

  return `/uploadedPots/${finalFilename}`;
}

// ─── Helper: Parse JSON arrays ──────────────────────────────────────

function parseArray(value, fieldName) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new ErrorHandler(
      `${fieldName} must be a valid JSON array`,
      400
    );
  }
}

// ─── Helper: Parse boolean ─────────────────────────────────────────

function parseBoolean(value) {
  return ["true", "yes", "1"].includes(
    String(value).trim().toLowerCase()
  );
}

// ─── Helper: Parse number ──────────────────────────────────────────

function parseNumber(value, fieldName, defaultValue = 0) {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new ErrorHandler(`${fieldName} must be a valid number`, 400);
  }

  return number;
}

// ─── GET /api/pots ─────────────────────────────────────────────────
// Supports:
// /api/pots
// /api/pots?page=1&limit=8
// /api/pots?category=Ceramic
// /api/pots?page=2&limit=8&category=Plastic

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(searchParams.get("limit") || "8", 10) || 8
      )
    );

    const category = searchParams.get("category");

const categoryMappings = {
  Clay: ["Clay", "Terracotta"],
  Metal: ["Metal", "Metallic"],
};

const matchingCategories = category
  ? categoryMappings[category] || [category]
  : [];

const filter = category
  ? {
      categories: {
        $in: matchingCategories.map(
          (value) => new RegExp(`^${value}$`, "i")
        ),
      },
    }
  : {};

    const skip = (page - 1) * limit;

    const [pots, totalCount] = await Promise.all([
      Pot.find(filter)
        .select(
          "slug name basePrice ratingScore reviewCount categories image1 image2 availability"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Pot.countDocuments(filter),
    ]);

    const serialized = pots.map(({ _id, ...pot }) => ({
      ...pot,
      id: _id.toString(),
    }));

    return NextResponse.json(
      {
        success: true,
        pots: serialized,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
          hasNextPage: page * limit < totalCount,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    return handleApiError(error);
  }
}

// ─── POST /api/pots ────────────────────────────────────────────────
// Accepts multipart/form-data.
//
// Required:
//   name
//   basePrice
//   image1
//
// Optional:
//   image2 (if omitted, image1 is used)
//
// Arrays must be sent as JSON strings:
//   categories
//   highlights

export async function POST(request) {
  const savedImagePaths = [];

  try {
    await connectDB();

    const formData = await request.formData();

    // ── Image validation ───────────────────────────────────────────

    const image1File = formData.get("image1");
    const image2File = formData.get("image2") || image1File;

    if (!image1File || typeof image1File === "string") {
      throw new ErrorHandler(
        "image1 is required and must be a file",
        400
      );
    }

    if (!image2File || typeof image2File === "string") {
      throw new ErrorHandler(
        "image2 must be a valid file",
        400
      );
    }

    if (!ALLOWED_TYPES.has(image1File.type)) {
      throw new ErrorHandler(
        "image1: unsupported type. Use JPEG, PNG, WebP, or AVIF",
        400
      );
    }

    if (!ALLOWED_TYPES.has(image2File.type)) {
      throw new ErrorHandler(
        "image2: unsupported type. Use JPEG, PNG, WebP, or AVIF",
        400
      );
    }

    // ── Required fields ────────────────────────────────────────────

    const name = formData.get("name")?.trim();
    const basePriceRaw = formData.get("basePrice");

    if (!name) {
      throw new ErrorHandler("name is required", 400);
    }

    if (basePriceRaw === null || basePriceRaw === "") {
      throw new ErrorHandler("basePrice is required", 400);
    }

    const basePrice = parseNumber(
      basePriceRaw,
      "basePrice"
    );

    if (basePrice < 0) {
      throw new ErrorHandler(
        "basePrice must be a non-negative number",
        400
      );
    }

    // ── Optional fields ────────────────────────────────────────────

    const slug =
      formData.get("slug")?.trim() || generateSlug(name);

    if (!slug) {
      throw new ErrorHandler("Unable to generate slug", 400);
    }

    const variant = formData.get("variant")?.trim() ?? "";
    const tagline = formData.get("tagline")?.trim() ?? "";

    const availability =
      formData.get("availability")?.trim() || "In Stock";

    const ratingScore = parseNumber(
      formData.get("ratingScore"),
      "ratingScore",
      0
    );

    const reviewCount = parseNumber(
      formData.get("reviewCount"),
      "reviewCount",
      0
    );

    const quantity = parseNumber(
      formData.get("quantity"),
      "quantity",
      15
    );

    const bestseller = parseBoolean(
      formData.get("bestseller")
    );

    if (ratingScore < 0 || ratingScore > 5) {
      throw new ErrorHandler(
        "ratingScore must be between 0 and 5",
        400
      );
    }

    if (reviewCount < 0 || quantity < 0) {
      throw new ErrorHandler(
        "reviewCount and quantity cannot be negative",
        400
      );
    }

    // ── Description ────────────────────────────────────────────────

    const description = {
      material:
        formData.get("description_material")?.trim() ?? "",

      usage:
        formData.get("description_usage")?.trim() ?? "",

      benefits:
        formData.get("description_benefits")?.trim() ?? "",
    };

    // ── Care instructions ──────────────────────────────────────────

    const careInstructions = {
      cleaning:
        formData.get("careInstructions_cleaning")?.trim() ?? "",

      maintenance:
        formData.get("careInstructions_maintenance")?.trim() ?? "",

      usage:
        formData.get("careInstructions_usage")?.trim() ?? "",
    };

    // ── Specifications ─────────────────────────────────────────────

    const specifications = {
      height:
        formData.get("specifications_height")?.trim() ?? "",

      diameter:
        formData.get("specifications_diameter")?.trim() ?? "",

      weight:
        formData.get("specifications_weight")?.trim() ?? "",

      material:
        formData.get("specifications_material")?.trim() ?? "",

      drainageHole:
        formData.get("specifications_drainageHole")?.trim() ?? "",

      colorFinish:
        formData.get("specifications_colorFinish")?.trim() ?? "",
    };

    // ── Arrays ─────────────────────────────────────────────────────

    const categories = parseArray(
      formData.get("categories"),
      "categories"
    );

    const highlights = parseArray(
      formData.get("highlights"),
      "highlights"
    );

    // ── Duplicate slug check ───────────────────────────────────────

    const existing = await Pot.findOne({ slug }).lean();

    if (existing) {
      throw new ErrorHandler(
        `A pot with slug "${slug}" already exists`,
        409
      );
    }

    // ── Save images ────────────────────────────────────────────────

    const timestamp = Date.now();

    const image1 = await saveImage(
      image1File,
      `${slug}-${timestamp}-1`
    );

    savedImagePaths.push(image1);

    let image2 = image1;

    // Avoid saving the same file twice when image2 is omitted.
    if (formData.get("image2")) {
      image2 = await saveImage(
        image2File,
        `${slug}-${timestamp}-2`
      );

      savedImagePaths.push(image2);
    }

    // ── Create MongoDB document ────────────────────────────────────

    const pot = await Pot.create({
      slug,
      name,
      variant,
      basePrice,
      quantity,
      bestseller,
      availability,
      ratingScore,
      reviewCount,
      categories,
      highlights,
      tagline,
      description,
      careInstructions,
      specifications,
      image1,
      image2,
    });

    const obj = pot.toObject();

    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;

    return NextResponse.json(
      {
        success: true,
        message: "Pot created successfully",
        pot: obj,
      },
      { status: 201 }
    );

  } catch (error) {
    // ── Cleanup images if creation fails ──────────────────────────

    for (const imagePath of savedImagePaths) {
      try {
        await fs.unlink(
          path.join(
            process.cwd(),
            "public",
            imagePath.replace(/^\/+/, "")
          )
        );
      } catch (cleanupError) {
        console.error("Image cleanup error:", cleanupError);
      }
    }

    return handleApiError(error);
  }
}
