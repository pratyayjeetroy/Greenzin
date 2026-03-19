"use client";
import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

/**
 * Product image gallery: large main image + thumbnail strip.
 * Props:
 *  - images: { id, src, alt }[]
 */
const ProductGallery = ({ images = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main Image ─────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-[#e8e8e8] bg-[#f7f7f5] shadow-sm group">
        <Image
          src={active.src}
          alt={active.alt}
          fill
          priority
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* ── Thumbnail Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActiveIdx(idx)}
            aria-label={`View ${img.alt}`}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 bg-[#f7f7f5] ${
              idx === activeIdx
                ? "border-[#5C7058] shadow-md scale-105"
                : "border-[#e8e8e8] hover:border-[#5C7058]/50 hover:scale-[1.02]"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain p-1.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
