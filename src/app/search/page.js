"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PlantCard from "@/components/plants/PlantCard";
import { allProducts } from "@/data/searchData";
import { searchProducts } from "@/components/general/search";

const PREVIEW_LIMIT = 3;
const PAGE_SIZE = 6; // items per page in expanded view

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedSection, setSelectedSection] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // null = show all categories; string = expanded single category view
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rawResults = searchProducts(query, allProducts);

  const sectionCounts = rawResults.reduce((acc, p) => {
    acc[p.section] = (acc[p.section] || 0) + 1;
    return acc;
  }, {});

  const sections = ["All", ...Object.keys(sectionCounts)];

  let results = rawResults
    .filter((p) => selectedSection === "All" || p.section === selectedSection)
    .filter((p) => (minPrice === "" ? true : p.price >= Number(minPrice)))
    .filter((p) => (maxPrice === "" ? true : p.price <= Number(maxPrice)))
    .filter((p) => (selectedRating === 0 ? true : p.rating >= selectedRating));

  if (sortBy === "price_asc") results = [...results].sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") results = [...results].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);

  // When in expanded section view, further filter to just that section
  const expandedResults = expandedSection
    ? results.filter((p) => p.section === expandedSection)
    : null;

  // Pagination derived values (only used in expanded view)
  const totalPages = expandedResults ? Math.ceil(expandedResults.length / PAGE_SIZE) : 1;
  const paginatedResults = expandedResults
    ? expandedResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : null;

  const clearFilters = () => {
    setSelectedSection("All");
    setExpandedSection(null); // go back to all-sections view
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating(0);
    setSortBy("relevance");
  };

  const handleSeeMore = (section) => {
    setExpandedSection(section);
    setSelectedSection(section); // sync sidebar to this section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAll = () => {
    setExpandedSection(null);
    setSelectedSection("All"); // reset sidebar back to All
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = selectedSection !== "All" || minPrice || maxPrice || selectedRating > 0;

  const activeFilterCount = [
    selectedSection !== "All",
    minPrice || maxPrice,
    selectedRating > 0,
  ].filter(Boolean).length;

  // Reusable filter content
  const FilterContent = () => (
    <>
      <p className="text-[11px] font-[600] text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
        Filters
      </p>

      {/* Section */}
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Section</p>
        {(expandedSection ? sections.filter(s => s === "All" || s === expandedSection) : sections).map((sec) => (
          <label key={sec} className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
            <input
              type="radio"
              name="section"
              checked={selectedSection === sec}
              onChange={() => {
                setSelectedSection(sec);
                if (sec !== "All") {
                  setExpandedSection(sec);
                } else {
                  setExpandedSection(null);
                }
              }}
              className="accent-[#3B6D11]"
            />
            {sec} {sec !== "All" && <span className="text-gray-400">({sectionCounts[sec]})</span>}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Price range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full text-[12px] px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none"
          />
          <span className="text-gray-400 text-[12px]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full text-[12px] px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Rating</p>
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={selectedRating === r}
              onChange={() => setSelectedRating(r)}
              className="accent-[#3B6D11]"
            />
            <span className="text-yellow-500 text-[11px]">{"★".repeat(r)}</span> {r} & above
          </label>
        ))}
        <label className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
          <input
            type="radio"
            name="rating"
            checked={selectedRating === 0}
            onChange={() => setSelectedRating(0)}
            className="accent-[#3B6D11]"
          />
          All ratings
        </label>
      </div>

      <button
        onClick={clearFilters}
        className="w-full text-[12px] py-2 border border-gray-200 rounded-lg text-gray-500"
      >
        Clear all filters
      </button>
    </>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8faf7]">

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl px-5 pt-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-[600] text-gray-800">Filters</p>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-400 text-[20px] leading-none"
              >
                ×
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-4 py-3 bg-[#3d5a3e] text-white text-[14px] font-[500] rounded-xl"
            >
              Show {expandedSection ? expandedResults.length : results.length} Results
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">

        {/* Breadcrumb */}
        <div className="text-[12px] text-gray-400 mb-4 flex items-center gap-2">
          <span>Home</span>
          <span>›</span>
          <span>Search</span>
          <span>›</span>
          <span className="text-gray-600">"{query}"</span>
          {expandedSection && (
            <>
              <span>›</span>
              <span className="text-gray-600">{expandedSection}</span>
            </>
          )}
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            {expandedSection ? (
              <>
                {/* Back button + title for expanded section view */}
                <button
                  onClick={handleBackToAll}
                  className="flex items-center gap-1.5 text-[13px] text-[#3a7d44] font-[500] mb-2 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to all results
                </button>
                <h1 className="text-[18px] sm:text-[24px] font-[600] font-[poppins] text-slate-800">
                  <span className="text-[#3a7d44]">{expandedSection}</span>{" "}
                  <span className="text-slate-500 text-[16px] sm:text-[18px]">— "{query}"</span>
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  {expandedResults.length} product{expandedResults.length !== 1 ? "s" : ""} found
                </p>
              </>
            ) : (
              <>
                <h1 className="text-[18px] sm:text-[24px] font-[600] font-[poppins] text-slate-800">
                  Results for <span className="text-[#3a7d44]">"{query}"</span>
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">
                  {results.length} product{results.length !== 1 ? "s" : ""} found
                </p>
              </>
            )}
          </div>

          {/* Sort + Mobile Filter button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2M11 16h2" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#3B6D11] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-[600]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSection !== "All" && (
              <span className="flex items-center gap-1 text-[11px] px-3 py-1 bg-[#EAF3DE] text-[#3B6D11] rounded-full font-[500]">
                {selectedSection}
                <button
                  onClick={() => {
                    setSelectedSection("All");
                    setExpandedSection(null);
                  }}
                  className="ml-1 text-[13px] leading-none"
                >×</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1 text-[11px] px-3 py-1 bg-[#EAF3DE] text-[#3B6D11] rounded-full font-[500]">
                ₹{minPrice || "0"} — ₹{maxPrice || "∞"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="ml-1 text-[13px] leading-none">×</button>
              </span>
            )}
            {selectedRating > 0 && (
              <span className="flex items-center gap-1 text-[11px] px-3 py-1 bg-[#EAF3DE] text-[#3B6D11] rounded-full font-[500]">
                {selectedRating}★ & above
                <button onClick={() => setSelectedRating(0)} className="ml-1 text-[13px] leading-none">×</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[11px] px-3 py-1 border border-gray-200 rounded-full text-gray-500">
              Clear all
            </button>
          </div>
        )}

        {/* Layout */}
        <div className="flex gap-6 items-start">

          {/* Sidebar — desktop only */}
          <div className="hidden md:block w-[220px] shrink-0 bg-white border border-gray-200 rounded-xl p-4">
            <FilterContent />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[40px] mb-4">🌿</p>
                <p className="text-[18px] font-[500] text-gray-600 mb-2">No products found for "{query}"</p>
                <p className="text-[14px] text-gray-400">Try searching with different keywords</p>
              </div>
            ) : expandedSection ? (
              /* ── EXPANDED SINGLE-SECTION VIEW ── */
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-[15px] sm:text-[16px] font-[600] font-[poppins] text-slate-700">
                    {expandedSection}{" "}
                    <span className="text-[13px] font-[400] text-gray-400">({expandedResults.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {expandedResults.map((product, index) => (
                    <PlantCard
                      key={index}
                      plant={product}
                      selectedCategory={product.section}
                    />
                  ))}
                </div>
                {expandedResults.length === 0 && (
                  <div className="text-center py-16 text-gray-400 text-[14px]">
                    No products match the current filters in this section.
                  </div>
                )}
              </div>
            ) : (
              /* ── ALL-SECTIONS VIEW WITH PREVIEW + SEE MORE ── */
              Object.entries(
                results.reduce((acc, p) => {
                  if (!acc[p.section]) acc[p.section] = [];
                  acc[p.section].push(p);
                  return acc;
                }, {})
              ).map(([section, items]) => {
                const hasMore = items.length > PREVIEW_LIMIT;
                const previewItems = hasMore ? items.slice(0, PREVIEW_LIMIT) : items;

                return (
                  <div key={section} className="mb-10">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h2 className="text-[15px] sm:text-[16px] font-[600] font-[poppins] text-slate-700">
                        {section}{" "}
                        <span className="text-[13px] font-[400] text-gray-400">({items.length})</span>
                      </h2>
                      {hasMore && (
                        <button
                          onClick={() => handleSeeMore(section)}
                          className="flex items-center gap-1 text-[13px] text-[#3a7d44] font-[500] hover:underline shrink-0"
                        >
                          See all {items.length}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Cards grid — preview only */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {previewItems.map((product, index) => (
                        <PlantCard
                          key={index}
                          plant={product}
                          selectedCategory={product.section}
                        />
                      ))}
                    </div>

                    {/* See More button below grid */}
                    {hasMore && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={() => handleSeeMore(section)}
                          className="flex items-center gap-2 px-6 py-2.5 border border-[#3a7d44] text-[#3a7d44] text-[13px] font-[500] rounded-full hover:bg-[#EAF3DE] transition-colors"
                        >
                          See {items.length - PREVIEW_LIMIT} more in {section}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf7]" />}>
      <SearchContent />
    </Suspense>
  );
}