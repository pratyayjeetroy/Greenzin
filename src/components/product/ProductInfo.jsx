"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Zap, Shield, Leaf, Package } from "lucide-react";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Star rating display */
const StarRating = ({ score, count }) => (
  <div className="flex items-center gap-2">
    <div className="flex text-[#e5b248]">
      {[...Array(5)].map((_, i) => {
        const filled = i < Math.floor(score);
        const half = !filled && i < score;
        return (
          <svg key={i} className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="#e5b248" />
                    <stop offset="50%" stopColor="#d1d5db" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${i})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </>
            ) : (
              <path
                fill={filled ? "#e5b248" : "#d1d5db"}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            )}
          </svg>
        );
      })}
    </div>
    <a
      href="#reviews"
      className="text-[13px] text-[#228EC0] hover:underline transition-colors"
    >
      ({count} reviews)
    </a>
  </div>
);

/** Single pot option button */
const PotOption = ({ option, selected, onSelect }) => (
  <button
    onClick={() => onSelect(option.id)}
    aria-pressed={selected}
    title={option.label}
    className={`group flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition-all duration-200 ${
      selected
        ? "border-[#3d5a3e] bg-[#3d5a3e]/5 shadow-md scale-105"
        : "border-[#e8e8e8] hover:border-[#3d5a3e]/50 hover:scale-[1.02] bg-white"
    }`}
  >
    <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-lg bg-[#f4f5f4]">
      {option.image ? (
        <Image src={option.image} alt={option.label} fill className="object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-[#aaa] text-[10px] font-medium">
          None
        </div>
      )}
    </div>
    <span className="text-center text-[10px] leading-tight text-[#2d2d2d] font-medium">
      {option.label}
    </span>
    <span className="text-center text-[10px] text-[#6b6b6b]">{option.sublabel}</span>
  </button>
);

/** Trust badge */
const TrustBadge = ({ icon, label }) => {
  const icons = {
    shield: Shield,
    leaf: Leaf,
    package: Package,
  };
  const Icon = icons[icon] ?? Shield;

  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-3 text-center">
      <Icon className="w-5 h-5 text-[#3d5a3e]" />
      <span className="text-[11px] font-semibold text-[#2d2d2d] leading-tight">{label}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Product details / purchase panel — right column on desktop.
 * Props: product (full product object from data)
 */
const ProductInfo = ({ product }) => {
  const [selectedPotId, setSelectedPotId] = useState(product.potOptions[0]?.id ?? null);
  const [pincode, setPincode] = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const selectedPot =
    product.potOptions.find((p) => p.id === selectedPotId) ?? product.potOptions[0];
  const totalPrice = (product.basePrice + (selectedPot?.price ?? 0)) * quantity;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Name & Tagline ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-[22px] font-bold leading-snug text-[#1a1a1a] sm:text-[26px] md:text-[30px]">
          {product.name}
          <span className="block text-[#3d5a3e] text-[18px] font-semibold sm:text-[22px] md:text-[24px]">
            {product.tagline}
          </span>
        </h1>

        {/* Rating */}
        <div className="mt-2">
          <StarRating score={product.ratingScore} count={product.reviewCount} />
        </div>
      </div>

      {/* ── Price & Availability ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <span className="text-[13px] font-medium text-[#6b6b6b]">Price: </span>
          <span className="text-[18px] font-bold text-[#2d2d2d] sm:text-[20px]">
            ₹{product.basePrice.toFixed(2)}
          </span>
          <span className="ml-1 text-[12px] text-[#7a7a7a]">(Plant Only)</span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-bold ${
            product.availability === "In Stock"
              ? "bg-[#e7f5e8] text-[#2d7a35]"
              : "bg-[#fdecea] text-[#c62828]"
          }`}
        >
          {product.availability}
        </span>
      </div>

      {/* ── Key Highlights ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#e8e8e8] bg-[#f9f9f7] p-3.5">
        <p className="mb-2 text-[13px] font-bold text-[#2d2d2d] sm:text-[14px]">Key Highlights:</p>
        <ul className="flex flex-col gap-1.5">
          {product.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px] text-[#4a4a4a]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3d5a3e] shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Pot Selector ───────────────────────────────────────────── */}
      <div>
        <p className="mb-2.5 text-[13px] font-bold text-[#2d2d2d] sm:text-[14px]">Select a Pot:</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {product.potOptions.map((opt) => (
            <PotOption
              key={opt.id}
              option={opt}
              selected={selectedPotId === opt.id}
              onSelect={setSelectedPotId}
            />
          ))}
        </div>
      </div>

      {/* ── Quantity + Total ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-0 rounded-full border border-[#e8e8e8] overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-[18px] text-[#3d5a3e] font-bold hover:bg-[#f0f0ed] transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-4 py-2 text-[15px] font-semibold text-[#2d2d2d] min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2 text-[18px] text-[#3d5a3e] font-bold hover:bg-[#f0f0ed] transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div>
          <span className="text-[13px] text-[#6b6b6b] font-medium">Total Price: </span>
          <span className="text-[20px] font-bold text-[#1a1a1a] sm:text-[22px]">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── CTA Buttons ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAddToCart}
          id="add-to-cart-btn"
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 px-6 text-[14px] font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
            addedToCart
              ? "bg-[#2d7a35]"
              : "bg-[#3d5a3e] hover:bg-[#4a5c47]"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedToCart ? "Added!" : "Add to Cart"}
        </button>

        <button
          id="buy-now-btn"
          className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 px-6 text-[14px] font-semibold text-white bg-brand-gradient transition-all duration-200 hover:opacity-90 shadow-md hover:shadow-lg active:scale-95"
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </button>

        <button
          id="wishlist-btn"
          onClick={() => setWishlist((w) => !w)}
          aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex items-center justify-center rounded-full border-2 p-3 transition-all duration-200 hover:scale-110 active:scale-95 ${
            wishlist
              ? "border-red-400 bg-red-50 text-red-500"
              : "border-[#e8e8e8] bg-white text-[#aaa] hover:border-red-300 hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 transition-all ${wishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* ── Delivery Check ─────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[13px] font-bold text-[#2d2d2d] sm:text-[14px]">Check Delivery:</p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="pincode-input"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter Pincode"
            maxLength={6}
            className="flex-1 rounded-full border border-[#ddd] bg-[#f9f9f7] px-4 py-2.5 text-[13px] text-[#333] placeholder-[#aaa] focus:outline-none focus:border-[#3d5a3e] transition-colors"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#3d5a3e] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#4a5c47] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Trust Badges ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 divide-x divide-[#e8e8e8] rounded-2xl border border-[#e8e8e8] bg-[#f9f9f7]">
        {product.trustBadges.map((badge) => (
          <TrustBadge key={badge.icon} icon={badge.icon} label={badge.label} />
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
