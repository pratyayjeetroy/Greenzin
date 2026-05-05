"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/home/airPurifyingBanner.png",
    tag: "Air-Purifying Plants",
    subtitle: "Breathe Fresh, Live Healthy",
    cta: "View More",
    ctaHref: "/plants",
    accentColor: "#1a5c38",
  },
  {
    id: 2,
    image: "/home/potsHeroBanner.png",
    tag: "Indoor Garden Pots",
    subtitle: "Style Meets Nature",
    cta: "Shop Now",
    ctaHref: "/pots",
    accentColor: "#2e6b4f",
  },
  {
    id: 3,
    image: "/home/giftHeroBanner.png",
    tag: "Gift Green, Gift Life",
    subtitle: "Perfect for Every Occasion",
    cta: "Explore Gifts",
    ctaHref: "/gifting",
    accentColor: "#1a5c38",
  },
  {
    id: 4,
    image: "/home/corporateHeroBanner.png",
    tag: "Bulk & Corporate Orders",
    subtitle: "Green Spaces for Your Office",
    cta: "Get a Quote",
    ctaHref: "/bulk-orders",
    accentColor: "#2e6b4f",
  },
  {
    id: 5,
    image: "/home/bestSellerHeroBanner.png",
    tag: "Best Sellers",
    subtitle: "Loved by Thousands",
    cta: "Buy Now",
    ctaHref: "/bestseller",
    accentColor: "#1a5c38",
  },
   {
    id: 6,
    image: "/home/kidsComboBanner.png",
    tag: "Kids Gardening Combo",
    subtitle: "Grow a Bond with Nature",
    cta: "Shop Now",
    ctaHref: "/gardenshop",
    accentColor: "#2e6b4f",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" aria-label="Hero carousel">
      {/* ── Background Image wrapper — drives the section height ── */}
      <div className="relative w-full">
        <Image
          src={slide.image}
          alt={slide.tag}
          width={1440}
          height={600}
          className={`block h-auto w-full object-contain transition-opacity duration-500 overflow-hidden ease-in-out ${
            animating ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}

          priority
        />
        {/* Left-to-right white overlay for text legibility */}
        <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.5)_45%,rgba(255,255,255,0)_70%)]" />

        {/* ── Text Content ── */}
        <div
          className={`absolute inset-0 flex max-w-[75%] flex-col justify-center pl-[10%] transition-all duration-500 ${
            animating
              ? direction === "next"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {/* Heading — accentColor is runtime per-slide, so one inline style is unavoidable */}
          <h1
            className="font-[Tinos] text-[20px] leading-tight font-semibold sm:text-[28px] md:text-[40px] lg:text-[52px] xl:text-[60px]"
            style={{ color: slide.accentColor }}
          >
            {slide.tag} <span className="font-black text-[#228EC0]">&gt;</span>
          </h1>

          {/* Gradient underline */}
          <div className="mt-1 mb-2 h-0.5 w-15 rounded-full [background:var(--brand-gradient)] sm:mt-1.5 sm:mb-3 sm:h-0.75 sm:w-20 md:mt-2 md:mb-4 md:w-30" />

          {/* Subtitle */}
          <p className="text-[11px] text-gray-600 sm:text-[16px] md:text-[20px] lg:text-[26px] xl:text-[30px]">
            {slide.subtitle}
          </p>

          {/* CTA Button */}
          <a
            href={slide.ctaHref}
            className="mt-2.5 inline-flex w-fit items-center justify-center rounded-full px-3.5 py-1.5 text-[10px] text-white [box-shadow:0_4px_14px_rgba(56,189,248,0.35)] transition-all duration-300 [background:var(--brand-gradient)] hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:mt-3.5 sm:px-5 sm:py-2 sm:text-[13px] md:mt-5 md:px-7 md:py-2.5 md:text-[16px] lg:text-[18px] xl:text-[20px]"
          >
            {slide.cta}
          </a>
        </div>
      </div>

      {/* ── Left Arrow ── */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-1.5 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white text-white [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 [background:var(--brand-gradient)] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-2 sm:h-10 sm:w-10 md:left-2.5 md:h-12 md:w-12 lg:left-3 lg:h-15 lg:w-15"
      >
        <ChevronLeft className="h-[60%] w-[60%]" strokeWidth={2} />
      </button>

      {/* ── Right Arrow ── */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute top-1/2 right-1.5 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white text-white [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 [background:var(--brand-gradient)] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-2 sm:h-10 sm:w-10 md:right-2.5 md:h-12 md:w-12 lg:right-3 lg:h-15 lg:w-15"
      >
        <ChevronRight className="h-[60%] w-[60%]" strokeWidth={2} />
      </button>

      {/* ── Dot Indicators ── */}
      <div
        className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 sm:bottom-3 sm:gap-1.5 md:bottom-4 md:gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-label={`Go to slide ${i + 1}: ${s.tag}`}
            aria-selected={i === current}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            className="shrink-0 cursor-pointer rounded-full p-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              /* width/background depend on JS state → inline style is the right call */
              width: i === current ? "20px" : "8px",
              height: "8px",
              background:
                i === current
                  ? "var(--brand-gradient)"
                  : "rgba(255,255,255,0.55)",
              border:
                i === current ? "none" : "1.5px solid rgba(100,100,100,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
