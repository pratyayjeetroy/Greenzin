import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import { generateSlug, handleApiError, ErrorHandler } from "@/lib/utility";

// ─── Allowed image MIME types ─────────────────────────────────────────────────
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

// ─── GET /api/plants ──────────────────────────────────────────────────────────
// Returns all plants. Optionally filter by ?category=Indoor+Plants
// Returns only listing-card fields (avoids sending heavy data).
// export async function GET(request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get("category");

//     const filter = category ? { categories: category } : {};

//     const plants = await Plant.find(filter)
//       .select("slug name basePrice ratingScore reviewCount categories image1 image2 availability")
//       .lean();

//     const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

//     return NextResponse.json({ success: true, plants: serialised }, { status: 200 });
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1", 10));
    const limit    = Math.max(1, parseInt(searchParams.get("limit") || "8", 10));
    const skip     = (page - 1) * limit;

    const filter = category ? { categories: category } : {};

    const [plants, totalCount] = await Promise.all([
      Plant.find(filter)
        .select("slug name basePrice ratingScore reviewCount categories image1 image2 availability")
        .skip(skip)
        .limit(limit)
        .lean(),
      Plant.countDocuments(filter),
    ]);

    const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

    return NextResponse.json(
      {
        success: true,
        plants: serialised,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── POST /api/plants ─────────────────────────────────────────────────────────
// Accepts multipart/form-data with individual fields:
//
//   Files (required):
//     image1                        — primary plant image
//     image2                        — hover / alternate image
//
//   Scalars (required):
//     name                          — plant display name
//     basePrice                     — number
//
//   Scalars (optional):
//     slug                          — auto-generated from name if omitted
//     tagline
//     availability                  — "In Stock" | "Out of Stock" | "Pre-order"
//     ratingScore                   — 0-5
//     reviewCount                   — integer
//     description_botanical
//     description_origin
//     description_benefits
//     careInstructions_sunlight
//     careInstructions_watering
//     careInstructions_maintenance
//     specifications_height
//     specifications_potSize
//     specifications_weight
//     specifications_soilType
//
//   Arrays (optional, send as JSON strings):
//     categories                    — e.g. '["Indoor Plants","Easy Care"]'
//     highlights                    — e.g. '["Low Maintenance","Air-Purifying"]'
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    // ── Files ─────────────────────────────────────────────────────
    const image1File = formData.get("image1");
    const image2File = formData.get("image2");

    if (!image1File || typeof image1File === "string") {
      throw new ErrorHandler("image1 is required and must be a file", 400);
    }
    if (!image2File || typeof image2File === "string") {
      throw new ErrorHandler("image2 is required and must be a file", 400);
    }
    if (!ALLOWED_TYPES.has(image1File.type)) {
      throw new ErrorHandler("image1: unsupported type. Use JPEG, PNG, or WebP", 400);
    }
    if (!ALLOWED_TYPES.has(image2File.type)) {
      throw new ErrorHandler("image2: unsupported type. Use JPEG, PNG, or WebP", 400);
    }

    // ── Required scalar fields ────────────────────────────────────
    const name = formData.get("name")?.trim();
    const basePriceRaw = formData.get("basePrice");

    if (!name) throw new ErrorHandler("name is required", 400);
    if (basePriceRaw == null || basePriceRaw === "") {
      throw new ErrorHandler("basePrice is required", 400);
    }
    const basePrice = Number(basePriceRaw);
    if (isNaN(basePrice) || basePrice < 0) {
      throw new ErrorHandler("basePrice must be a non-negative number", 400);
    }

    // ── Optional scalar fields ────────────────────────────────────
    const slug = (formData.get("slug")?.trim()) || generateSlug(name);
    const tagline = formData.get("tagline")?.trim() ?? "";
    const availability = formData.get("availability")?.trim() ?? "In Stock";
    const ratingScore = Number(formData.get("ratingScore") ?? 0);
    const reviewCount = Number(formData.get("reviewCount") ?? 0);
    const quantity   = Number(formData.get("quantity") ?? 15);
    const bestseller = formData.get("bestseller") === "true";

    // ── Nested objects (underscore-separated field names) ─────────
    const description = {
      botanical: formData.get("description_botanical")?.trim() ?? "",
      origin:    formData.get("description_origin")?.trim() ?? "",
      benefits:  formData.get("description_benefits")?.trim() ?? "",
    };

    const careInstructions = {
      sunlight:    formData.get("careInstructions_sunlight")?.trim() ?? "",
      watering:    formData.get("careInstructions_watering")?.trim() ?? "",
      maintenance: formData.get("careInstructions_maintenance")?.trim() ?? "",
    };

    const specifications = {
      height:   formData.get("specifications_height")?.trim() ?? "",
      potSize:  formData.get("specifications_potSize")?.trim() ?? "",
      weight:   formData.get("specifications_weight")?.trim() ?? "",
      soilType: formData.get("specifications_soilType")?.trim() ?? "",
    };

    // ── Arrays (sent as JSON strings) ─────────────────────────────
    let categories = [];
    let highlights = [];
    try {
      const rawCats = formData.get("categories");
      if (rawCats) categories = JSON.parse(rawCats);
    } catch {
      throw new ErrorHandler("categories must be a valid JSON array string, e.g. '[\"Indoor Plants\"]'", 400);
    }
    try {
      const rawHL = formData.get("highlights");
      if (rawHL) highlights = JSON.parse(rawHL);
    } catch {
      throw new ErrorHandler("highlights must be a valid JSON array string, e.g. '[\"Low Maintenance\"]'", 400);
    }

    // ── Duplicate slug check ──────────────────────────────────────
    const existing = await Plant.findOne({ slug }).lean();
    if (existing) throw new ErrorHandler(`A plant with slug "${slug}" already exists`, 409);

    // ── Persist image files ───────────────────────────────────────
    const uploadDir = path.join(process.cwd(), "public", "uploadedPlants");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
    const rawExt1 = path.extname(image1File.name).toLowerCase();
    const rawExt2 = path.extname(image2File.name).toLowerCase();
    const ext1 = safeExts.has(rawExt1) ? rawExt1 : ".jpg";
    const ext2 = safeExts.has(rawExt2) ? rawExt2 : ".jpg";

    const ts = Date.now();
    const filename1 = `${slug}-${ts}-1${ext1}`;
    const filename2 = `${slug}-${ts}-2${ext2}`;

    await fs.writeFile(
      path.join(uploadDir, filename1),
      Buffer.from(await image1File.arrayBuffer())
    );
    await fs.writeFile(
      path.join(uploadDir, filename2),
      Buffer.from(await image2File.arrayBuffer())
    );

    // ── Create plant document ─────────────────────────────────────
    const plant = await Plant.create({
      slug,
      name,
      tagline,
      basePrice,
      availability,
      ratingScore,
      reviewCount,
      quantity,
      bestseller,
      categories,
      highlights,
      description,
      careInstructions,
      specifications,
      image1: `/uploadedPlants/${filename1}`,
      image2: `/uploadedPlants/${filename2}`,
    });

    const obj = plant.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json({ success: true, plant: obj }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}


