// ─── Product Data ─────────────────────────────────────────────────────────────
// Central data source for product details. In a real app this would come from
// an API/CMS. Structured for easy extension.

export const PRODUCTS = [
  {
    slug: "snake-plant-sansevieria",
    name: "Snake Plant - Sansevieria",
    tagline: "The Air-Purifying Marvel",
    basePrice: 19.99,
    ratingScore: 4.8,
    reviewCount: 254,
    availability: "In Stock",
    category: "Plants",
    breadcrumb: ["Home", "Plants", "Product Details"],

    highlights: [
      "Indoor / Outdoor",
      "Low Maintenance",
      "Air-Purifying",
    ],

    images: [
      { id: "main", src: "/products/snakePlant.png", alt: "Snake Plant - front view" },
      { id: "thumb1", src: "/products/snakePlant.png", alt: "Snake Plant - angle view" },
    ],

    potOptions: [
      { id: "no-pot", label: "No Pot", sublabel: "(Plant Only)", price: 0, image: null },
      {
        id: "standard-plastic",
        label: "Standard Plastic Pot",
        sublabel: "(+$0.00)",
        price: 0,
        image: "/home/plasticPots.jpeg",
      },
      {
        id: "white-ceramic",
        label: "White Ceramic Pot",
        sublabel: "(+$12.00)",
        price: 12,
        image: "/home/ceramicPots.jpeg",
      },
      {
        id: "terracotta",
        label: "Terracotta Pot",
        sublabel: "(+$8.00)",
        price: 8,
        image: "/home/category.png",
      },
      {
        id: "modern-concrete",
        label: "Modern Concrete Planter",
        sublabel: "(+$15.00)",
        price: 15,
        image: "/home/designerPots.jpeg",
      },
    ],

    description: {
      botanical:
        "Sansevieria trifasciata, commonly known as the Snake Plant or Mother-in-Law's Tongue, is one of the most popular and hardy houseplants around. It is characterized by its sword-like leaves with a striking pattern of dark green with lighter grey-green horizontal stripes.",
      origin: "West Africa — Nigeria, Congo",
      benefits:
        "Excellent air purifier — removes toxins like formaldehyde, benzene, and xylene. Produces oxygen at night, making it ideal for bedrooms. Thrives on neglect.",
    },

    careInstructions: {
      sunlight: "Low to bright indirect light. Avoid prolonged direct sun.",
      watering: "Water every 2–6 weeks. Allow soil to dry completely between waterings.",
      maintenance: "Wipe leaves with a damp cloth to remove dust. Repot every 2–3 years.",
    },

    specifications: {
      height: "Approx. 15\" – 30\" (38 – 76 cm)",
      potSize: "6\" diameter nursery pot",
      weight: "~1.5 kg (with nursery pot)",
      soilType: "Well-draining cactus / succulent mix",
    },

    reviews: [
      {
        id: "r1",
        name: "Priya Sharma",
        avatar: "/home/reviewer1.png",
        rating: 5,
        date: "February 12, 2026",
        text: "Absolutely love this snake plant! It arrived in perfect condition, beautifully packed. The leaves are vibrant and healthy. It has been thriving in my living room with minimal care. Highly recommend to anyone looking for a low-maintenance yet stunning plant.",
        helpful: 34,
        unhelpful: 2,
      },
      {
        id: "r2",
        name: "Arjun Mehta",
        avatar: "/home/reviewer2.png",
        rating: 5,
        date: "January 28, 2026",
        text: "Great quality plant. The delivery was quick and it came well-wrapped. Placed it in my office and it's been growing beautifully. The white ceramic pot option I selected looks very premium. Would definitely purchase again from GreenZin.",
        helpful: 19,
        unhelpful: 1,
      },
    ],

    trustBadges: [
      { icon: "shield", label: "Secure Checkout" },
      { icon: "leaf", label: "Healthy Plant Guarantee" },
      { icon: "package", label: "Easy Returns" },
    ],
  },
];

/**
 * Find a product by its URL slug.
 * @param {string} slug
 * @returns {object|undefined}
 */
export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}
