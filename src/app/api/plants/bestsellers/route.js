import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import { handleApiError } from "@/lib/utility";

// ─── GET /api/plants/bestsellers ──────────────────────────────────────────────
// Returns all bestseller plants grouped by their categories.
// No pagination — bestsellers are always a small curated list.
//
// Response shape:
// {
//   success: true,
//   grouped: {
//     "Indoor Plants": [ ...plants ],
//     "Air Purifying":  [ ...plants ],
//   }
// }
export async function GET() {
  try {
    await connectDB();

    const plants = await Plant.find({ bestseller: true })
      .select("slug name basePrice ratingScore reviewCount categories image1 image2 availability bestseller")
      .lean();

    const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

    // Group by each category a plant belongs to
    // (a plant with multiple categories appears in each group)
    const grouped = {};
    for (const plant of serialised) {
      for (const category of plant.categories) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(plant);
      }
    }

    return NextResponse.json({ success: true, grouped }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}