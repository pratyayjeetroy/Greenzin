import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import { handleApiError } from "@/lib/utility";
import { categories } from "@/data/plants/plantCategories"; // adjust path if needed

// Only group by categories that exist in your defined categories list
const VALID_CATEGORIES = new Set(categories.map((c) => c.name));

// ─── GET /api/plants/bestsellers ──────────────────────────────────────────────
// Returns all bestseller plants grouped by their valid categories only.
// No pagination — bestsellers are always a small curated list.
//
// Response shape:
// {
//   success: true,
//   grouped: {
//     "Indoor":       [ ...plants ],
//     "Life Care":    [ ...plants ],
//   }
// }
export async function GET() {
  try {
    await connectDB();

    const plants = await Plant.find({ bestseller: true })
      .select("slug name basePrice ratingScore reviewCount categories image1 image2 availability bestseller")
      .lean();

    const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

    // Group by each category a plant belongs to,
    // skipping any category not present in the defined categories list
    const grouped = {};
    for (const plant of serialised) {
      for (const category of plant.categories) {
        if (!VALID_CATEGORIES.has(category)) continue;
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(plant);
      }
    }

    return NextResponse.json({ success: true, grouped }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}