"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/home/homeBanner1.png",
    tag: "Air-Purifying Plants",
    subtitle: "BreatheFresh, Live Healthy",
    cta: "View More",
    ctaHref: "/plants",
    accentColor: "#1a5c38",
  },
  {
    id: 2,
    image: "/home/homeBanner1.png",
    tag: "Indoor Garden Pots",
    subtitle: "Style Meets Nature",
    cta: "Shop Now",
    ctaHref: "/pots",
    accentColor: "#2e6b4f",
  },
  {
    id: 3,
    image: "/home/homeBanner1.png",
    tag: "Gift Green, Gift Life",
    subtitle: "Perfect for Every Occasion",
    cta: "Explore Gifts",
    ctaHref: "/gifting",
    accentColor: "#1a5c38",
  },
  {
    id: 4,
    image: "/home/homeBanner1.png",
    tag: "Bulk & Corporate Orders",
    subtitle: "Green Spaces for Your Office",
    cta: "Get a Quote",
    ctaHref: "/bulk-orders",
    accentColor: "#2e6b4f",
  },
  {
    id: 5,
    image: "/home/homeBanner1.png",
    tag: "Best Sellers",
    subtitle: "Loved by Thousands",
    cta: "Buy Now",
    ctaHref: "/best-seller",
    accentColor: "#1a5c38",
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
        <img
          src={slide.image}
          alt={slide.tag}
          className={`block h-auto w-full object-contain transition-opacity duration-500 ease-in-out ${
            animating ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}
        />
        {/* Left-to-right white overlay for text legibility */}
        <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.38)_42%,rgba(255,255,255,0)_65%)]" />

        {/* ── Text Content ── */}
        <div
          className={`absolute inset-0 flex max-w-[60%] flex-col justify-center px-[8%] transition-all duration-500 ${
            animating
              ? direction === "next"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {/* Heading — accentColor is runtime per-slide, so one inline style is unavoidable */}
          <h1
            className="font-[Tinos] text-[60px] leading-tight font-semibold"
            style={{ color: slide.accentColor }}
          >
            {slide.tag} <span className="font-black text-[#228EC0]">&gt;</span>
          </h1>

          {/* Gradient underline */}
          <div className="mt-[8px] mb-[16px] h-[3px] w-[120px] rounded-full [background:var(--brand-gradient)]" />

          {/* Subtitle */}
          <p className="text-[30px] text-gray-600">{slide.subtitle}</p>

          {/* CTA Button */}
          <a
            href={slide.ctaHref}
            className="mt-[20px] inline-flex w-fit items-center justify-center rounded-full px-[28px] py-[10px] text-[20px] text-white [box-shadow:0_4px_14px_rgba(56,189,248,0.35)] transition-all duration-300 [background:var(--brand-gradient)] hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            {slide.cta}
          </a>
        </div>
      </div>

      {/* ── Left Arrow ── */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-[12px] z-10 flex h-[60px] w-[60px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 border-[1px] border-white text-white [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 [background:var(--brand-gradient)] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft className="h-[60%] w-[60%]" strokeWidth={2} />
      </button>

      {/* ── Right Arrow ── */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute top-1/2 right-[12px] z-10 flex h-[60px] w-[60px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 border-[1px] border-white text-white [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 [background:var(--brand-gradient)] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight className="h-[60%] w-[60%]" strokeWidth={2} />
      </button>

      {/* ── Dot Indicators ── */}
      <div
        className="absolute bottom-[16px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-[8px]"
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
              width: i === current ? "28px" : "11px",
              height: "11px",
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
