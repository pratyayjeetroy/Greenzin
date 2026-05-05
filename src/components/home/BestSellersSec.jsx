import React from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Real data from /api/plants/bestsellers (deduplicated, indoor/care focus) ─
const BEST_SELLERS = [
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    ratingText: "4.6",
    reviewCount: 900,
    price: "₹199",
    badge: "Best Seller",
    image: "/uploadedPlants/aloe-vera-1777806970321-1.png",
    slug: "aloe-vera",
  },
  {
    id: "holy-basil-tulsi",
    name: "Holy Basil (Tulsi)",
    ratingText: "4.8",
    reviewCount: 600,
    price: "₹149",
    badge: "Top Rated",
    image: "/uploadedPlants/holy-basil-tulsi-1777806971453-1.png",
    slug: "holy-basil-tulsi",
  },
  {
    id: "aparajita-plant",
    name: "Aparajita Plant",
    ratingText: "4.6",
    reviewCount: 320,
    price: "₹399",
    badge: "Popular",
    image: "/uploadedPlants/aparajita-plant-1777806970420-1.png",
    slug: "aparajita-plant",
  },
  {
    id: "hibiscus-china-rose",
    name: "Hibiscus (China Rose)",
    ratingText: "4.5",
    reviewCount: 750,
    price: "₹349",
    badge: null,
    image: "/uploadedPlants/hibiscus-china-rose-1777806971357-1.png",
    slug: "hibiscus-china-rose",
  },
  {
    id: "aglaonema-lipstick-plant",
    name: "Aglaonema Lipstick Plant",
    ratingText: "4.5",
    reviewCount: 500,
    price: "₹193",
    badge: "Trending",
    image: "/uploadedPlants/aglaonema-lipstick-plant-1777806970213-1.png",
    slug: "aglaonema-lipstick-plant",
  },
];

const BADGE_STYLES = {
  "Best Seller": "bg-[#3d5a3e] text-white",
  "Top Rated":   "bg-amber-500 text-white",
  Popular:       "bg-sky-500 text-white",
  Trending:      "bg-rose-500 text-white",
  New:           "bg-purple-500 text-white",
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ score }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
        fill={star <= Math.round(score) ? "#f59e0b" : "#d1d5db"}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ name, ratingText, reviewCount, price, badge, image, slug }) => (
  <Link href={`/plants/${slug}`}>
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Badge */}
      {badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide sm:text-[11px] ${BADGE_STYLES[badge] ?? "bg-gray-700 text-white"}`}
        >
          {badge}
        </span>
      )}

      {/* Wishlist button */}
      {/* <button
        aria-label={`Add ${name} to wishlist`}
        onClick={(e) => e.preventDefault()}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-rose-500 sm:h-8 sm:w-8"
      >
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button> */}

      {/* Image */}
      <div className="relative aspect-3/2 w-full overflow-hidden bg-[#f7f8f5]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="mb-1.5 truncate text-sm font-semibold text-gray-800 sm:text-[15px]">{name}</h3>

        {/* Rating row */}
        <div className="mb-2 flex items-center gap-1.5">
          <StarRating score={parseFloat(ratingText)} />
          <span className="text-[11px] text-gray-500 sm:text-xs">
            {ratingText} <span className="text-gray-400">({reviewCount})</span>
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900 sm:text-lg">{price}</span>
        </div>

        {/* Add to Cart */}
        <button
          aria-label={`Add ${name} to cart`}
          onClick={(e) => e.preventDefault()}
          className="mt-3 w-full rounded-xl bg-[#3d5a3e] py-2 text-[12px] font-semibold tracking-wide text-white transition-all duration-200 hover:bg-[#4a5c47] active:scale-[0.98] sm:py-2.5 sm:text-[13px]"
        >
          Add to Cart
        </button>
      </div>
    </article>
  </Link>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const BestSellersSec = () => (
  <section className="bg-[#f9faf7] py-10 md:py-14">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-green-600 sm:text-sm">
            Our Top Picks
          </span>
          <h2 className="mt-2 font-[Tinos] text-[24px] font-bold leading-tight text-[#2d2d2d] sm:text-[30px] md:text-[34px]">
            Best <span className="text-[#3a7d44]">Sellers</span>
          </h2>
          <div className="mt-3 h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
        </div>
        <Link
          href="/bestseller"
          className="shrink-0 rounded-full border border-[#3d5a3e] px-4 py-1.5 text-xs font-semibold text-[#3d5a3e] transition-all duration-200 hover:bg-[#3d5a3e] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
        >
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4">
        {BEST_SELLERS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

    </div>
  </section>
);

export default BestSellersSec;