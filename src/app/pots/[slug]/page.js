import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Pot } from "@/lib/models/potSchema";
import Breadcrumb from "@/components/product/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import PotInfo from "@/components/pots/PotInfo";
import PotDetails from "@/components/pots/PotDetails";

// ─── Static reviews (placeholder until a reviews collection is ready) ─────────

const STATIC_REVIEWS = [
  {
    id: "r1",
    name: "Meera Nair",
    avatar: "/home/reviewer1.png",
    rating: 5,
    date: "March 5, 2026",
    text: "Beautiful pot! The finish is smooth and the quality is excellent. It fits my indoor plants perfectly and looks stunning on my shelf.",
    helpful: 28,
    unhelpful: 1,
  },
  {
    id: "r2",
    name: "Rahul Verma",
    avatar: "/home/reviewer2.png",
    rating: 4,
    date: "February 18, 2026",
    text: "Very sturdy and well-made. Came securely packaged with no damage. Would definitely buy again from GreenZin.",
    helpful: 15,
    unhelpful: 0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch a single pot from the DB and normalise it for the detail-page components.
 */
async function getPotBySlug(slug) {
  await connectDB();
  const doc = await Pot.findOne({ slug }).lean();
  if (!doc) return null;

  // Convert ObjectIds & Dates to plain strings
  const pot = JSON.parse(JSON.stringify(doc));

  // Map image1 / image2 → images array expected by ProductGallery
  pot.images = [
    { id: "img1", src: pot.image1, alt: pot.name },
    { id: "img2", src: pot.image2, alt: `${pot.name} – alternate view` },
  ];

  // Breadcrumb trail
  pot.breadcrumb = ["Home", "Pots"];

  // Static reviews until a real reviews collection is ready
  pot.reviews = STATIC_REVIEWS;

  return pot;
}

// ─── Metadata (SEO) ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pot = await getPotBySlug(slug);

  if (!pot) return { title: "Pot Not Found | GreenZin" };

  return {
    title: `${pot.name}${pot.tagline ? ` – ${pot.tagline}` : ""} | GreenZin`,
    description:
      pot.description?.material?.slice(0, 160) ??
      `Buy ${pot.name} online at GreenZin`,
    openGraph: {
      title: pot.name,
      description: pot.tagline ?? "",
      images: [{ url: pot.image1 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PotDetailPage({ params }) {
  const { slug } = await params;
  const pot = await getPotBySlug(slug);

  if (!pot) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb crumbs={pot.breadcrumb} productName={pot.name} />

      {/* Page Wrapper */}
      <div className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto w-[92%] max-w-7xl px-2 py-6 sm:w-[90%] sm:px-4 md:py-10">
          {/* ── Hero: Gallery + Info ──────────────────────────────── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-4 lg:self-start">
              <ProductGallery images={pot.images} />
            </div>
            <div>
              <PotInfo pot={pot} />
              <PotDetails pot={pot} />
            </div>
          </div>

          {/* ── Reviews ──────────────────────────────────────────── */}
          <ProductReviews product={pot} />
        </div>
      </div>
    </>
  );
}
