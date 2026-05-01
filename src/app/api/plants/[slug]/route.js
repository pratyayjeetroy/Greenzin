import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import { handleApiError, ErrorHandler } from "@/lib/utility";

// ─── GET /api/plants/[slug] ───────────────────────────────────────────────────
// Returns the full plant document including reviews, care info, specs, etc.
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

// ─── DELETE /api/plants/[slug] ────────────────────────────────────────────────
// Removes the plant document and its uploaded image files.
export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const plant = await Plant.findOneAndDelete({ slug }).lean();
    if (!plant) throw new ErrorHandler("Plant not found", 404);

    // Best-effort removal of uploaded image files
    const tryRemove = async (imgPath) => {
      if (!imgPath) return;
      try {
        const filePath = path.join(process.cwd(), "public", imgPath);
        await fs.unlink(filePath);
      } catch {
        // File may have already been removed; non-fatal
      }
    };

    await Promise.all([tryRemove(plant.image1), tryRemove(plant.image2)]);

    return NextResponse.json({ success: true, message: "Plant deleted" }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
