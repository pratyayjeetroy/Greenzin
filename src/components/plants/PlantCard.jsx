"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          rating >= star
            ? 100
            : rating >= star - 1
              ? (rating - (star - 1)) * 100
              : 0;
        return (
          <div
            key={star}
            className="relative h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
          >
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 h-full w-full text-gray-300"
              fill="currentColor"
            >
              <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-yellow-500 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                fill="currentColor"
              >
                <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PlantCard({ plant, selectedCategory, isHighlighted }) {
  const cardRef = useRef(null);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (isHighlighted) {
      setGlowing(true);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = setTimeout(() => setGlowing(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <Link
      href={plant.slug ? `/plants/${plant.slug}` : "#"}
      className="block h-full"
    >
      <div
        ref={cardRef}
        className={`group h-full rounded-xl bg-transparent p-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:[background:linear-gradient(to_right,#83B930,#1992D5)] ${
          glowing
            ? "scale-[1.02] shadow-lg shadow-green-200 [background:linear-gradient(to_right,#83B930,#1992D5)]"
            : ""
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-md transition-all duration-300 hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={plant.image1}
              alt={plant.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
            />
            <Image
              src={plant.image2}
              alt={plant.name}
              fill
              className="scale-100 object-cover opacity-0 transition-all duration-500 group-hover:scale-[1.06] group-hover:opacity-100"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-2 sm:p-3 md:p-4">
            {/* Plant Name */}
            <h3 className="font-[inter] text-[13px] leading-snug font-[600] text-gray-700 sm:text-[15px] md:text-[17px] lg:text-[18px]">
              {plant.name}
            </h3>

            {/* Category Tags */}
            {plant.categories
              ?.filter((cat) => cat !== selectedCategory)
              .slice(0, 2).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-[3px] sm:mt-1.5 sm:gap-[5px]">
                {plant.categories
                  ?.filter((cat) => cat !== selectedCategory)
                  .slice(0, 2)
                  .map((cat) => (
                    <span
                      key={cat}
                      className="rounded-lg bg-[#eef2f7] px-1.5 py-[2px] font-[inter] text-[9px] font-[500] text-gray-600 sm:px-2 sm:py-[3px] sm:text-[10px] md:text-[11px] lg:text-[12px]"
                    >
                      {cat}
                    </span>
                  ))}
              </div>
            )}

            {/* Price + Rating */}
            <div className="mt-2 mb-2 flex items-center justify-between gap-1">
              <p className="font-[inter] text-[13px] font-[600] whitespace-nowrap text-gray-800 sm:text-[15px] md:text-[17px] lg:text-[18px]">
                ₹{plant.basePrice}
              </p>
              <div className="flex items-center gap-[2px] sm:gap-1">
                <StarRating rating={plant.ratingScore} />
                <span className="font-[inter] text-[9px] whitespace-nowrap text-gray-500 sm:text-[11px] md:text-[12px] lg:text-[13px]">
                  {plant.ratingScore} ({plant.reviewCount})
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => e.preventDefault()}
              className="mt-auto w-full rounded-lg bg-[#3d5a3e] py-[7px] font-[inter] text-[12px] font-[500] text-white transition hover:[background:linear-gradient(to_right,#83B930,#1992D5)] sm:py-[9px] sm:text-[14px] md:py-[10px] md:text-[15px] lg:text-[16px]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
