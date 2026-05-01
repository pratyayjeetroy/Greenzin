import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Plant } from "@/lib/models/plantSchema";
import Breadcrumb from "@/components/product/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

// ─── Static defaults (managed by their own collections in future) ─────────────

const STATIC_POT_OPTIONS = [
  { id: "no-pot", label: "No Pot", sublabel: "(Plant Only)", price: 0, image: null },
  { id: "standard-plastic", label: "Standard Plastic Pot", sublabel: "(+₹0)", price: 0, image: "/home/plasticPots.jpeg" },
  { id: "white-ceramic", label: "White Ceramic Pot", sublabel: "(+₹299)", price: 299, image: "/home/ceramicPots.jpeg" },
  { id: "terracotta", label: "Terracotta Pot", sublabel: "(+₹199)", price: 199, image: "/home/category.png" },
  { id: "modern-concrete", label: "Modern Concrete Planter", sublabel: "(+₹399)", price: 399, image: "/home/designerPots.jpeg" },
];

const STATIC_REVIEWS = [
  {
    id: "r1",
    name: "Priya Sharma",
    avatar: "/home/reviewer1.png",
    rating: 5,
    date: "February 12, 2026",
    text: "Absolutely love this plant! It arrived in perfect condition, beautifully packed. The leaves are vibrant and healthy. Highly recommend to anyone looking for a low-maintenance yet stunning plant.",
    helpful: 34,
    unhelpful: 2,
  },
  {
    id: "r2",
    name: "Arjun Mehta",
    avatar: "/home/reviewer2.png",
    rating: 5,
    date: "January 28, 2026",
    text: "Great quality plant. The delivery was quick and it came well-wrapped. Would definitely purchase again from GreenZin.",
    helpful: 19,
    unhelpful: 1,
  },
];

const STATIC_TRUST_BADGES = [
  { icon: "shield", label: "Secure Checkout" },
  { icon: "leaf", label: "Healthy Plant Guarantee" },
  { icon: "package", label: "Easy Returns" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single plant from the DB and normalise it into the shape the
 * existing product-detail components expect.
 */
async function getPlantBySlug(slug) {
  await connectDB();
  const doc = await Plant.findOne({ slug }).lean();
  if (!doc) return null;

  // Convert ObjectIds & Dates to plain strings
  const plant = JSON.parse(JSON.stringify(doc));

  // Map image1 / image2 → images array expected by ProductGallery
  plant.images = [
    { id: "img1", src: plant.image1, alt: plant.name },
    { id: "img2", src: plant.image2, alt: `${plant.name} – alternate view` },
  ];

  // Breadcrumb trail
  plant.breadcrumb = ["Home", "Plants"];

  // Pot options & reviews are static until their own collections are ready
  plant.potOptions = STATIC_POT_OPTIONS;
  plant.reviews = STATIC_REVIEWS;
  plant.trustBadges = STATIC_TRUST_BADGES;

  return plant;
}

// ─── Metadata (SEO) ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);

  if (!plant) return { title: "Plant Not Found | GreenZin" };

  return {
    title: `${plant.name}${plant.tagline ? ` – ${plant.tagline}` : ""} | GreenZin`,
    description: plant.description?.botanical?.slice(0, 160) ?? `Buy ${plant.name} online at GreenZin`,
    openGraph: {
      title: plant.name,
      description: plant.tagline ?? "",
      images: [{ url: plant.image1 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlantDetailPage({ params }) {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);

  if (!plant) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb crumbs={plant.breadcrumb} productName={plant.name} />

      {/* Page Wrapper */}
      <div className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-7xl w-[92%] sm:w-[90%] px-2 sm:px-4 py-6 md:py-10">

          {/* ── Hero: Gallery + Info ──────────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-4 lg:self-start">
              <ProductGallery images={plant.images} />
            </div>
            <div>
              <ProductInfo product={plant} />
              <ProductDetails product={plant} />
            </div>
          </div>

          {/* ── Reviews ──────────────────────────────────────────── */}
          <ProductReviews product={plant} />

          {/* ── Related Products ─────────────────────────────────── */}
          <RelatedProducts />
        </div>
      </div>
    </>
  );
}
