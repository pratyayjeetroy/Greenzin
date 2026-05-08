import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";

const PREVIEW_LIMIT = 3;
const PAGE_SIZE = 9;

/**
 * GET /api/search/plants?q=<query>&mode=preview|paginated&page=<n>
 *
 * mode=preview  (default) → returns first 3 matching plants + totalCount
 * mode=paginated           → returns PAGE_SIZE (9) plants per page with full pagination meta
 *
 * Matching: case-insensitive partial-word regex on `name` and `categories[]`
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const mode  = searchParams.get("mode") || "preview";  // "preview" | "paginated"
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

    if (!query) {
      return NextResponse.json(
        { success: true, plants: [], totalCount: 0, pagination: null },
        { status: 200 }
      );
    }

    // Split query into individual words and build an $or filter so that a plant
    // is returned if ANY word from the query matches its name or any category.
    // e.g. "indoor plant" → matches docs containing "indoor" OR "plant" in name/categories.
    const words = query.split(/\s+/).filter(Boolean);
    const wordConditions = words.map((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      return {
        $or: [
          { name: { $regex: regex } },
          { categories: { $regex: regex } },
        ],
      };
    });

    // Use $or across all word conditions — match if ANY word hits
    const filter = { $or: wordConditions };

    const selectFields = "slug name basePrice ratingScore reviewCount categories image1 image2 availability bestseller";

    if (mode === "paginated") {
      const skip = (page - 1) * PAGE_SIZE;

      const [plants, totalCount] = await Promise.all([
        Plant.find(filter)
          .select(selectFields)
          .skip(skip)
          .limit(PAGE_SIZE)
          .lean(),
        Plant.countDocuments(filter),
      ]);

      const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

      return NextResponse.json(
        {
          success: true,
          plants: serialised,
          totalCount,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / PAGE_SIZE),
            pageSize: PAGE_SIZE,
            hasNextPage: page < Math.ceil(totalCount / PAGE_SIZE),
            hasPrevPage: page > 1,
          },
        },
        { status: 200 }
      );
    }

    // Default: preview mode — 3 results + total count
    const [plants, totalCount] = await Promise.all([
      Plant.find(filter)
        .select(selectFields)
        .limit(PREVIEW_LIMIT)
        .lean(),
      Plant.countDocuments(filter),
    ]);

    const serialised = plants.map(({ _id, ...p }) => ({ ...p, id: _id.toString() }));

    return NextResponse.json(
      {
        success: true,
        plants: serialised,
        totalCount,
        pagination: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/search/plants] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
