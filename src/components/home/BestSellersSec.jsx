import React from "react";
import Image from "next/image";
import Link from "next/link";

const BEST_SELLERS = [
  {
    id: "snake-plant",
    name: "Snake Plant",
    ratingText: "4.8",
    reviewCount: 86,
    price: "$19.99",
    originalPrice: "$24.99",
    badge: "Best Seller",
    image: "/home/category.png",
  },
  {
    id: "zz-plant-1",
    name: "ZZ Plant",
    ratingText: "4.8",
    reviewCount: 86,
    price: "$19.99",
    originalPrice: "$24.99",
    badge: "Popular",
    image: "/home/category.png",
  },
  {
    id: "zz-plant-2",
    name: "Pothos",
    ratingText: "4.8",
    reviewCount: 50,
    price: "$17.99",
    originalPrice: "$22.99",
    badge: null,
    image: "/home/category.png",
  },
  {
    id: "don-plant",
    name: "Peace Lily",
    ratingText: "4.8",
    reviewCount: 20,
    price: "$21.99",
    originalPrice: "$27.99",
    badge: "New",
    image: "/home/category.png",
  },
  {
    id: "zz-plant-3",
    name: "Monstera",
    ratingText: "4.8",
    reviewCount: 37,
    price: "$29.99",
    originalPrice: "$36.99",
    badge: null,
    image: "/home/category.png",
  },
  {
    id: "office-sets",
    name: "Office Set",
    ratingText: "4.8",
    reviewCount: 60,
    price: "$15.99",
    originalPrice: "$19.99",
    badge: "Sale",
    image: "/home/category.png",
  },
];

const BADGE_STYLES = {
  "Best Seller": "bg-[#5C7058] text-white",
  Popular: "bg-amber-500 text-white",
  New: "bg-sky-500 text-white",
  Sale: "bg-rose-500 text-white",
};

const StarRating = ({ score }) => {
  return (
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
};

const ProductCard = ({ name, ratingText, reviewCount, price, originalPrice, badge, image }) => {
  return (
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
      <button
        aria-label={`Add ${name} to wishlist`}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-rose-500 sm:h-8 sm:w-8"
      >
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative w-full aspect-[1.85/1] overflow-hidden bg-[#f7f8f5]">
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
          {originalPrice && (
            <span className="text-xs font-medium text-gray-400 line-through sm:text-sm">{originalPrice}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          aria-label={`Add ${name} to cart`}
          className="mt-3 w-full rounded-xl bg-[#5C7058] py-2 text-[12px] font-semibold tracking-wide text-white transition-all duration-200 hover:bg-[#4a5c47] active:scale-[0.98] sm:py-2.5 sm:text-[13px]"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

const BestSellersSec = () => {
  return (
    <section className="bg-[#f9faf7] py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[#5C7058] sm:text-sm">
              Our Top Picks
            </p>
            <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/best-sellers"
            className="shrink-0 rounded-full border border-[#5C7058] px-4 py-1.5 text-xs font-semibold text-[#5C7058] transition-all duration-200 hover:bg-[#5C7058] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
          >
            View All →
          </Link>
        </div>

        {/* Grid — 2 cols xs, 3 cols sm, 4 cols md, 6 cols xl */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4">
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSec;
