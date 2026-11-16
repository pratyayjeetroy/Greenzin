
import mongoose from "mongoose";

const potSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    variant: {
      type: String,
      default: "",
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      default: 15,
      min: 0,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    availability: {
      type: String,
      default: "In Stock",
    },

    ratingScore: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    categories: {
      type: [String],
      default: [],
    },

    highlights: {
      type: [String],
      default: [],
    },

    tagline: {
      type: String,
      default: "",
    },

    description: {
      material: { type: String, default: "" },
      usage: { type: String, default: "" },
      benefits: { type: String, default: "" },
    },

    careInstructions: {
      cleaning: { type: String, default: "" },
      maintenance: { type: String, default: "" },
      usage: { type: String, default: "" },
    },

    specifications: {
      height: { type: String, default: "" },
      diameter: { type: String, default: "" },
      weight: { type: String, default: "" },
      material: { type: String, default: "" },
      drainageHole: { type: String, default: "" },
      colorFinish: { type: String, default: "" },
    },

    image1: {
      type: String,
      required: true,
    },

    image2: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Pot =
  mongoose.models.Pot ||
  mongoose.model("Pot", potSchema);
