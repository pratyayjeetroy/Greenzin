"use client";
import Image from "next/image";
import { ThumbsUp, ThumbsDown } from "lucide-react";

// ─── Star Row ─────────────────────────────────────────────────────────────────

const StarRow = ({ score }) => (
  <div className="flex text-[#e5b248]">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill={i < score ? "#e5b248" : "#d1d5db"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard = ({ review }) => (
  <article className="flex flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    {/* Header */}
    <div className="flex items-center gap-3">
      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#e8e8e8] shrink-0">
        <Image src={review.avatar} alt={review.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-bold text-[#2d2d2d]">{review.name}</span>
        <StarRow score={review.rating} />
      </div>
      <span className="ml-auto text-[11px] text-[#aaa] shrink-0">{review.date}</span>
    </div>

    {/* Body */}
    <p className="text-[13px] text-[#4a4a4a] leading-relaxed">{review.text}</p>

    {/* Helpful */}
    <div className="mt-1 flex items-center gap-4 text-[12px] text-[#7a7a7a]">
      <span className="font-medium">Helpful?</span>
      <button className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] px-3 py-1 hover:border-[#3d5a3e] hover:text-[#3d5a3e] transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" />
        {review.helpful}
      </button>
      <button className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] px-3 py-1 hover:border-red-400 hover:text-red-400 transition-colors">
        <ThumbsDown className="w-3.5 h-3.5" />
        {review.unhelpful}
      </button>
    </div>
  </article>
);

// ─── Rating Summary ───────────────────────────────────────────────────────────

const RatingSummary = ({ score, count }) => {
  const bars = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 17 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start rounded-2xl border border-[#e8e8e8] bg-[#f9f9f7] p-5 mb-6">
      {/* Overall Score */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-[52px] font-extrabold text-[#2d2d2d] leading-none">{score}</span>
        <div className="flex text-[#e5b248]">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill={i < Math.floor(score) ? "#e5b248" : "#d1d5db"}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-[12px] text-[#7a7a7a]">Based on {count} reviews</span>
      </div>

      {/* Bar Chart */}
      <div className="flex flex-col gap-2 flex-1 w-full">
        {bars.map(({ stars, pct }) => (
          <div key={stars} className="flex items-center gap-2.5">
            <span className="shrink-0 w-4 text-[12px] text-[#7a7a7a] text-right">{stars}</span>
            <svg className="h-3.5 w-3.5 shrink-0 text-[#e5b248]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 h-2 rounded-full bg-[#e8e8e8] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#e5b248] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 w-8 text-right text-[11px] text-[#7a7a7a]">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Ratings & Reviews section.
 * Props: product (full product object)
 */
const ProductReviews = ({ product }) => {
  return (
    <section id="reviews" className="mt-8">
      <h2 className="text-[20px] font-bold text-[#2d2d2d] mb-5 sm:text-[22px]">
        Ratings &amp; Reviews
      </h2>

      <RatingSummary score={product.ratingScore} count={product.reviewCount} />

      <div className="flex flex-col gap-4">
        {product.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Write a Review CTA */}
      <div className="mt-6 flex justify-center">
        <button
          id="write-review-btn"
          className="rounded-full border-2 border-[#3d5a3e] px-6 py-2.5 text-[14px] font-semibold text-[#3d5a3e] hover:bg-[#3d5a3e] hover:text-white transition-all duration-200"
        >
          Write a Review
        </button>
      </div>
    </section>
  );
};

export default ProductReviews;
