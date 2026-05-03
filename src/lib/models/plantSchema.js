import mongoose from "mongoose";

// ─── Main Schema ──────────────────────────────────────────────────────────────

const plantSchema = new mongoose.Schema(
  {
    // Identification
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },

    // Pricing & availability
    basePrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 15, min: 0 },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Pre-order"],
      default: "In Stock",
    },

    // Bestseller flag
    bestseller: { type: Boolean, default: false },

    // Ratings (kept separate from reviews for fast reads)
    ratingScore: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },

    // Categories (e.g. ["Indoor Plants", "Air Purifying Plants"])
    categories: [{ type: String, trim: true }],

    // Images — stored as public-folder-relative paths (/uploadedPlants/xxx.jpg)
    image1: { type: String, required: true },
    image2: { type: String, required: true },

    // Key highlights shown in the product info panel
    highlights: [{ type: String }],

    // Long-form description
    description: {
      botanical: { type: String, default: "" },
      origin: { type: String, default: "" },
      benefits: { type: String, default: "" },
    },

    // Care accordion
    careInstructions: {
      sunlight: { type: String, default: "" },
      watering: { type: String, default: "" },
      maintenance: { type: String, default: "" },
    },

    // Specs accordion
    specifications: {
      height: { type: String, default: "" },
      potSize: { type: String, default: "" },
      weight: { type: String, default: "" },
      soilType: { type: String, default: "" },
    },

  },
  { timestamps: true }
);

// ─── Pre-validate: auto-generate slug from name ───────────────────────────────
plantSchema.pre("validate", async function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// ─── Model (singleton-safe for Next.js HMR) ──────────────────────────────────
const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

export { Plant };
