"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/plants/plantCategories";
import FaqSection from "@/components/general/FaqSection";

function PlantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const highlightName = searchParams.get("highlight");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "Indoor",
  );
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  /** Updates both the URL and the selected-category state */
 

  // ── Plants data from API ──────────────────────────────────────
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState(null);


  // 1. Add page state
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState(null);

// 2. Update fetchPlants to accept a page argument and hit the right URL
const fetchPlants = useCallback(async (category, page = 1) => {
  setPlantsLoading(true);
  setPlantsError(null);
  try {
    const params = new URLSearchParams({ page, limit: 8 });
    if (category) params.set("category", category);

    const res = await fetch(`/api/plants?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load plants");
    const data = await res.json();
    setPlants(data.plants ?? []);
    setPagination(data.pagination ?? null);
  } catch (err) {
    setPlantsError(err.message);
  } finally {
    setPlantsLoading(false);
  }
}, []);

// 3. Re-fetch whenever category or page changes; reset page on category switch
useEffect(() => {
  fetchPlants(selectedCategory, currentPage);
}, [selectedCategory, currentPage, fetchPlants]);

// Reset to page 1 when the category changes (update selectCategory)
const selectCategory = useCallback((name) => {
  setCurrentPage(1);           // ← reset
  const params = new URLSearchParams(searchParams.toString());
  params.set("category", name);
  router.replace(`/plants?${params.toString()}`, { scroll: false });
}, [router, searchParams]);



  const faqs = [
    {
      question: "What are the different categories of plants available?",
      answer:
        "We offer a wide range of plant categories including indoor plants, outdoor plants, flowering plants, air-purifying plants, succulents, bonsai plants, hanging plants, and low-maintenance plants.",
    },
    {
      question: "Which plants are best suited for indoor spaces?",
      answer:
        "Indoor plants such as snake plant, pothos, peace lily, lucky bamboo, ZZ plant, and syngonium are popular choices because they are easy to maintain and adapt well to indoor conditions.",
    },
    {
      question:
        "Do you have outdoor plants for balconies, terraces, or gardens?",
      answer:
        "Yes, we offer outdoor plants that are suitable for balconies, terraces, patios, and gardens, including flowering plants, decorative foliage plants, and hardy green plants.",
    },
    {
      question: "Do you offer flowering plants?",
      answer:
        "Yes, we have flowering plants in different varieties that can add color and freshness to homes, balconies, gardens, and office spaces.",
    },
    {
      question: "Which plants are low-maintenance and easy to care for?",
      answer:
        "Low-maintenance plants like snake plant, jade plant, aloe vera, ZZ plant, cactus, and succulents are great options for beginners and busy plant owners.",
    },
    {
      question: "Do you have plants that help purify indoor air?",
      answer:
        "Yes, we offer air-purifying plants such as areca palm, spider plant, peace lily, pothos, and snake plant, which are commonly chosen for indoor environments.",
    },
    {
      question: "How often should I water my plants?",
      answer:
        "Watering depends on the type of plant, pot size, and environment. In general, most indoor plants should be watered only when the top layer of soil feels dry.",
    },
    {
      question: "How much sunlight do plants need?",
      answer:
        "Sunlight requirements vary by plant category. Some plants thrive in bright indirect light, while others prefer direct sunlight or partial shade. We recommend checking the care needs of each plant before purchase.",
    },
    {
      question: "Do you provide plant care tips for beginners?",
      answer:
        "Yes, we share basic care tips such as watering guidance, sunlight needs, pot placement, soil care, and general maintenance to help beginners care for their plants easily.",
    },
    {
      question: "How do I choose the right plant for my home or office?",
      answer:
        "The right plant depends on the space, available sunlight, maintenance preference, and purpose. Indoor low-maintenance plants are ideal for offices, while flowering and outdoor plants are better for open spaces and balconies.",
    },
  ];

  // const filteredPlants = plants.filter(
  //   (plant) => plant.category?.includes(selectedCategory)
  // );

  const filteredPlants = plants
    .filter((plant) => plant.categories?.includes(selectedCategory))
    .sort((a, b) => {
      if (a.name === highlightName) return -1;
      if (b.name === highlightName) return 1;
      return 0;
    });

  const itemsPerPage = 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const pageWidth = scrollRef.current.clientWidth;
    const currentPage = Math.round(scrollLeft / pageWidth);
    setActiveDot(currentPage);
  };

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    const pageWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: pageWidth * pageIndex,
      behavior: "smooth",
    });
    setActiveDot(pageIndex);
  };

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div className="bg-[url('/banner/banner.png')] bg-cover bg-center py-10 sm:py-12 md:py-16">
        <div className="w-full px-4 text-center sm:px-8">
          <h1 className="px-4 font-[poppins] text-[20px] leading-[1.25] font-[600] tracking-[0.5px] text-slate-700 sm:px-0 sm:text-[26px] sm:leading-[1.3] md:text-[30px] lg:text-[33px]">
            Bring Home Freshness, Beauty, and Nature One Plant at a Time
          </h1>
          <p className="mt-2 font-[inter] text-[13px] leading-[1.6] tracking-[0.3px] text-gray-700 sm:mt-3 sm:text-[16px] sm:leading-[1.4] md:text-[18px] lg:text-[19px]">
            Explore a wide range of indoor, outdoor, medicinal, and decorative
            plants to suit every space and lifestyle.{" "}
            <br className="hidden md:block" />
            Choose your category, view details, and grow your green space with
            ease.
          </p>
        </div>

        {/* Category Circles — Mobile: carousel, Desktop: grid */}
        <div className="mt-8 sm:mt-10">
          {/* MOBILE CAROUSEL — hidden on md+ */}
          <div className="block overflow-hidden md:hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="scrollbar-hide flex snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                overflowX: "auto",
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid min-w-full flex-shrink-0 snap-start grid-cols-4 gap-x-1 gap-y-5 px-4"
                >
                  {categories
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage,
                    )
                    .map((cat) => (
                      <div
                        key={cat.name}
                        onClick={() => selectCategory(cat.name)}
                        className="flex cursor-pointer flex-col items-center"
                      >
                        <div
                          className={`h-[64px] w-[64px] rounded-full p-[3px] transition-all duration-200 ${
                            selectedCategory === cat.name
                              ? "bg-brand-gradient"
                              : "bg-gray-200"
                          }`}
                        >
                          <div className="h-full w-full overflow-hidden rounded-full bg-white">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div
                          className={`mt-[4px] rounded-full px-[6px] py-[2px] text-center font-[inter] text-[10px] leading-snug whitespace-nowrap ${
                            selectedCategory === cat.name
                              ? "bg-brand-gradient font-[500] text-white"
                              : "font-[600] text-gray-700"
                          }`}
                        >
                          {cat.name}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="mt-5 flex justify-center gap-[6px]">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToPage(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeDot === i
                      ? "h-[7px] w-[22px] bg-[#83B930]"
                      : "h-[7px] w-[7px] bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP GRID — hidden on mobile */}
          <div className="mx-auto hidden max-w-7xl px-6 md:block">
            <div className="grid grid-cols-5 gap-x-2 gap-y-6">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => selectCategory(cat.name)}
                  className="flex cursor-pointer flex-col items-center"
                >
                  <div
                    className={`h-[105px] w-[105px] rounded-full p-[3px] lg:h-[120px] lg:w-[120px] ${
                      selectedCategory === cat.name
                        ? "bg-brand-gradient"
                        : "bg-gray-200"
                    }`}
                  >
                    <div className="h-full w-full overflow-hidden rounded-full bg-white">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    className={`mt-[3px] rounded-full px-3 py-1 text-center font-[inter] text-[13px] leading-snug lg:text-[16px] ${
                      selectedCategory === cat.name
                        ? "bg-brand-gradient font-[500] text-white"
                        : "font-[600] text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Plants Section */}
      <div className="w-full bg-[#f8faf7] px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12 md:px-[40px] md:pt-[24px] md:pb-16">
        {/* <h2 className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] font-[poppins] text-slate-800 text-center mb-6 sm:mb-8 md:mb-10">
          Featured {selectedCategory}
        </h2> */}
        <div className="mb-6 text-center sm:mb-8 md:mb-10">
          <span className="text-xs font-semibold tracking-widest text-green-600 uppercase sm:text-sm">
            Top Picks
          </span>
          <h2 className="mt-2 font-[poppins] text-[22px] leading-tight font-[600] text-[#2d2d2d] sm:text-[26px] md:text-[30px] lg:text-[33px]">
            <span className="text-[#3a7d44]">{selectedCategory}</span>
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#83B930] to-[#1992D5]" />
        </div>

        <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {plantsLoading ? (
            // Skeleton placeholders while loading
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 animate-pulse rounded-xl bg-gray-100"
              />
            ))
          ) : plantsError ? (
            <p className="col-span-full py-10 text-center text-red-500">
              {plantsError}
            </p>
          ) : filteredPlants.length === 0 ? (
            <p className="col-span-full py-10 text-center text-gray-500">
              No plants found in this category yet.
            </p>
          ) : (
            filteredPlants.map((plant, index) => (
              <PlantCard
                key={plant.id ?? index}
                plant={plant}
                selectedCategory={selectedCategory}
                isHighlighted={plant.name === highlightName}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination controls — place after the plant grid */}
{pagination && pagination.totalPages > 1 && (
  <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
    {/* Prev Arrow */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[#83B930] hover:enabled:text-[#3a7d44]"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    {/* Page Numbers */}
    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`flex h-8 w-8 items-center justify-center rounded-full font-[inter] text-[13px] font-[500] transition-all ${
          currentPage === page
            ? "bg-brand-gradient text-white shadow-sm"
            : "border border-gray-200 bg-white text-gray-600 hover:border-[#83B930] hover:text-[#3a7d44]"
        }`}
      >
        {page}
      </button>
    ))}

    {/* Next Arrow */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
      disabled={currentPage === pagination.totalPages}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[#83B930] hover:enabled:text-[#3a7d44]"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)}

      <FaqSection title="General FAQs" faqs={faqs} />
    </div>
  );
}
export default function PlantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf7]" />}>
      <PlantsContent />
    </Suspense>
  );
}
