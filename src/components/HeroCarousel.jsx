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
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero carousel"
    >
      {/* ── Background Image wrapper — drives the section height ── */}
      <div className="relative w-full">
        <img
          src={slide.image}
          alt={slide.tag}
          className={`w-full h-auto object-contain block transition-opacity duration-500 ease-in-out ${
            animating ? "opacity-0" : "opacity-100"
          }`}
          draggable={false}
        />
        {/* Left-to-right white overlay for text legibility */}
        <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.38)_42%,rgba(255,255,255,0)_65%)]" />

        {/* ── Text Content ── */}
        <div
          className={`absolute inset-0 flex flex-col justify-center px-[6%] max-w-[52%] transition-all duration-500 ${
            animating
              ? direction === "next"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {/* Heading — accentColor is runtime per-slide, so one inline style is unavoidable */}
          <h1
            className="font-extrabold leading-tight tracking-tight text-[clamp(26px,3.2vw,52px)]"
            style={{ color: slide.accentColor }}
          >
            {slide.tag} <span className="font-black text-[#265735]">&gt;</span>
          </h1>

          {/* Gradient underline */}
          <div className="mt-2 mb-4 rounded-full h-[3px] w-[clamp(80px,10vw,160px)] [background:var(--brand-gradient)]" />

          {/* Subtitle */}
          <p className="font-medium text-gray-700 text-[clamp(13px,1.5vw,22px)]">
            {slide.subtitle}
          </p>

          {/* CTA Button */}
          <a href={slide.ctaHref}
            className="mt-5 w-fit inline-flex items-center justify-center font-semibold text-white rounded-full px-7 py-2.5 text-[clamp(13px,1.2vw,18px)] [background:var(--brand-gradient)] [box-shadow:0_4px_14px_rgba(56,189,248,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            {slide.cta}
          </a>
        </div>
      </div>

      {/* ── Left Arrow ── */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-[clamp(36px,3.5vw,50px)] h-[clamp(36px,3.5vw,50px)] rounded-full text-white border-0 cursor-pointer [background:var(--brand-gradient)] [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft className="w-[50%] h-[50%]" strokeWidth={2.5} />
      </button>

      {/* ── Right Arrow ── */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-[clamp(36px,3.5vw,50px)] h-[clamp(36px,3.5vw,50px)] rounded-full text-white border-0 cursor-pointer [background:var(--brand-gradient)] [box-shadow:0_4px_16px_rgba(56,189,248,0.4)] transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight className="w-[50%] h-[50%]" strokeWidth={2.5} />
      </button>

      {/* ── Dot Indicators ── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
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
            className="rounded-full p-0 shrink-0 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              /* width/background depend on JS state → inline style is the right call */
              width:
                i === current
                  ? "clamp(22px, 2vw, 32px)"
                  : "clamp(9px, 0.9vw, 13px)",
              height: "clamp(9px, 0.9vw, 13px)",
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

    </section>
  );
}
