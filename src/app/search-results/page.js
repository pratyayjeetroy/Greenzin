"use client";
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PlantCard from "@/components/plants/PlantCard";
import { allProducts } from "@/data/searchData";
import { searchProducts } from "@/components/general/search";

const PREVIEW_LIMIT = 3;
const PAGE_SIZE = 9;

/* ─── Pagination Component ─────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-[13px] font-[500] rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#3a7d44] hover:text-[#3a7d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 py-2 text-gray-400 text-[13px]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] h-9 rounded-lg text-[13px] font-[500] border transition-colors ${
              p === currentPage
                ? "bg-[#3d5a3e] text-white border-[#3d5a3e] shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#3a7d44] hover:text-[#3a7d44]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-[13px] font-[500] rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#3a7d44] hover:text-[#3a7d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Main Search Content ───────────────────────────────────────────────────── */
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  // If "section=Plants" is in URL we go straight to plants expanded view
  const sectionParam = searchParams.get("section") || null;

  /* ── State ── */
  const [selectedSection, setSelectedSection] = useState(sectionParam || "All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(sectionParam);
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Plant API state ── */
  const [plantPreview, setPlantPreview] = useState([]);   // max 3 for overview
  const [plantTotalCount, setPlantTotalCount] = useState(0);
  const [plantPageData, setPlantPageData] = useState([]); // 9/page for expanded
  const [plantPagination, setPlantPagination] = useState(null);
  const [plantLoading, setPlantLoading] = useState(false);

  /* ── Front-end results (non-plant) ── */
  const nonPlantProducts = allProducts.filter(p => p.section !== "Plants");
  const rawOtherResults = searchProducts(query, nonPlantProducts);
  let otherResults = rawOtherResults
    .filter(p => selectedSection === "All" || p.section === selectedSection)
    .filter(p => minPrice === "" || p.price >= Number(minPrice))
    .filter(p => maxPrice === "" || p.price <= Number(maxPrice))
    .filter(p => selectedRating === 0 || p.rating >= selectedRating);
  if (sortBy === "price_asc") otherResults = [...otherResults].sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") otherResults = [...otherResults].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") otherResults = [...otherResults].sort((a, b) => b.rating - a.rating);

  /* ── Fetch plants preview (for "All" overview) ── */
  const fetchPlantPreview = useCallback(async () => {
    if (!query) { setPlantPreview([]); setPlantTotalCount(0); return; }
    try {
      const res = await fetch(`/api/search/plants?q=${encodeURIComponent(query)}&mode=preview`);
      const data = await res.json();
      setPlantPreview(data.plants || []);
      setPlantTotalCount(data.totalCount || 0);
    } catch { setPlantPreview([]); setPlantTotalCount(0); }
  }, [query]);

  /* ── Fetch paginated plants (for expanded plants view) ── */
  const fetchPlantPage = useCallback(async (page) => {
    if (!query) { setPlantPageData([]); setPlantPagination(null); return; }
    setPlantLoading(true);
    try {
      const res = await fetch(`/api/search/plants?q=${encodeURIComponent(query)}&mode=paginated&page=${page}`);
      const data = await res.json();
      setPlantPageData(data.plants || []);
      setPlantPagination(data.pagination || null);
    } catch { setPlantPageData([]); setPlantPagination(null); }
    finally { setPlantLoading(false); }
  }, [query]);

  useEffect(() => { fetchPlantPreview(); }, [fetchPlantPreview]);

  useEffect(() => {
    if (expandedSection === "Plants") {
      fetchPlantPage(currentPage);
    }
  }, [expandedSection, currentPage, fetchPlantPage]);

  // Scroll to top after new page data finishes loading
  const prevLoadingRef = React.useRef(false);
  useEffect(() => {
    if (prevLoadingRef.current === true && plantLoading === false && expandedSection === "Plants") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLoadingRef.current = plantLoading;
  }, [plantLoading, expandedSection]);

  /* ── Section counts for sidebar ── */
  const otherSectionCounts = rawOtherResults.reduce((acc, p) => {
    acc[p.section] = (acc[p.section] || 0) + 1; return acc;
  }, {});
  const sections = ["All", "Plants", ...Object.keys(otherSectionCounts)];

  const handleSeeMore = (section) => {
    setExpandedSection(section);
    setSelectedSection(section);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBackToAll = () => {
    setExpandedSection(null);
    setSelectedSection("All");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePageChange = (page) => { setCurrentPage(page); };
  const clearFilters = () => { setSelectedSection("All"); setExpandedSection(null); setMinPrice(""); setMaxPrice(""); setSelectedRating(0); setSortBy("relevance"); setCurrentPage(1); };

  const hasActiveFilters = selectedSection !== "All" || minPrice || maxPrice || selectedRating > 0;
  const activeFilterCount = [selectedSection !== "All", minPrice || maxPrice, selectedRating > 0].filter(Boolean).length;

  const totalResults = plantTotalCount + rawOtherResults.length;

  const FilterContent = () => (
    <>
      <p className="text-[11px] font-[600] text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">Filters</p>
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Section</p>
        {sections.map(sec => (
          <label key={sec} className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
            <input type="radio" name="section" checked={selectedSection === sec}
              onChange={() => { setSelectedSection(sec); setExpandedSection(sec === "All" ? null : sec); setCurrentPage(1); }}
              className="accent-[#3B6D11]" />
            {sec}{sec === "Plants" ? <span className="text-gray-400">({plantTotalCount})</span> : sec !== "All" && <span className="text-gray-400">({otherSectionCounts[sec] || 0})</span>}
          </label>
        ))}
      </div>
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Price range</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full text-[12px] px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none" />
          <span className="text-gray-400 text-[12px]">—</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full text-[12px] px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 outline-none" />
        </div>
      </div>
      <div className="mb-5">
        <p className="text-[13px] font-[500] text-gray-700 mb-2">Rating</p>
        {[4, 3, 2].map(r => (
          <label key={r} className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
            <input type="radio" name="rating" checked={selectedRating === r} onChange={() => setSelectedRating(r)} className="accent-[#3B6D11]" />
            <span className="text-yellow-500 text-[11px]">{"★".repeat(r)}</span> {r} & above
          </label>
        ))}
        <label className="flex items-center gap-2 text-[13px] text-gray-600 mb-2 cursor-pointer">
          <input type="radio" name="rating" checked={selectedRating === 0} onChange={() => setSelectedRating(0)} className="accent-[#3B6D11]" />
          All ratings
        </label>
      </div>
      <button onClick={clearFilters} className="w-full text-[12px] py-2 border border-gray-200 rounded-lg text-gray-500">Clear all filters</button>
    </>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8faf7]">
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl px-5 pt-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-[600] text-gray-800">Filters</p>
              <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 text-[20px] leading-none">×</button>
            </div>
            <FilterContent />
            <button onClick={() => setMobileFilterOpen(false)} className="w-full mt-4 py-3 bg-[#3d5a3e] text-white text-[14px] font-[500] rounded-xl">Show Results</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="text-[12px] text-gray-400 mb-4 flex items-center gap-2">
          <span>Home</span><span>›</span><span>Search</span><span>›</span>
          <span className="text-gray-600">"{query}"</span>
          {expandedSection && <><span>›</span><span className="text-gray-600">{expandedSection}</span></>}
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            {expandedSection ? (
              <>
                <button onClick={handleBackToAll} className="flex items-center gap-1.5 text-[13px] text-[#3a7d44] font-[500] mb-2 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back to all results
                </button>
                <h1 className="text-[18px] sm:text-[24px] font-[600] text-slate-800">
                  <span className="text-[#3a7d44]">{expandedSection}</span>{" "}
                  <span className="text-slate-500 text-[16px] sm:text-[18px]">— "{query}"</span>
                </h1>
                {expandedSection === "Plants" ? (
                  <p className="text-[13px] text-gray-500 mt-1">{plantTotalCount} plant{plantTotalCount !== 1 ? "s" : ""} found</p>
                ) : (
                  <p className="text-[13px] text-gray-500 mt-1">{otherResults.filter(p => p.section === expandedSection).length} products found</p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-[18px] sm:text-[24px] font-[600] text-slate-800">
                  Results for <span className="text-[#3a7d44]">"{query}"</span>
                </h1>
                <p className="text-[13px] text-gray-500 mt-1">{totalResults} product{totalResults !== 1 ? "s" : ""} found</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileFilterOpen(true)} className="md:hidden flex items-center gap-2 text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2M11 16h2" /></svg>
              Filters{activeFilterCount > 0 && <span className="bg-[#3B6D11] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-[600]">{activeFilterCount}</span>}
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-[13px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 outline-none">
              <option value="relevance">Sort: Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSection !== "All" && (
              <span className="flex items-center gap-1 text-[11px] px-3 py-1 bg-[#EAF3DE] text-[#3B6D11] rounded-full font-[500]">
                {selectedSection}
                <button onClick={() => { setSelectedSection("All"); setExpandedSection(null); }} className="ml-1 text-[13px] leading-none">×</button>
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
            <button onClick={clearFilters} className="text-[11px] px-3 py-1 border border-gray-200 rounded-full text-gray-500">Clear all</button>
          </div>
        )}

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div className="hidden md:block w-[220px] shrink-0 bg-white border border-gray-200 rounded-xl p-4">
            <FilterContent />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {totalResults === 0 && !plantLoading ? (
              <div className="text-center py-20">
                <p className="text-[40px] mb-4">🌿</p>
                <p className="text-[18px] font-[500] text-gray-600 mb-2">No products found for "{query}"</p>
                <p className="text-[14px] text-gray-400">Try searching with different keywords</p>
              </div>
            ) : expandedSection === "Plants" ? (
              /* ── EXPANDED PLANTS VIEW (paginated, 9/page from DB) ── */
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-[15px] sm:text-[16px] font-[600] text-slate-700">
                    Plants <span className="text-[13px] font-[400] text-gray-400">({plantTotalCount})</span>
                  </h2>
                  {plantPagination && (
                    <span className="text-[12px] text-gray-400">
                      Page {plantPagination.currentPage} of {plantPagination.totalPages}
                    </span>
                  )}
                </div>
                {plantLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse border border-gray-100" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {plantPageData.map((plant, i) => (
                      <PlantCard key={plant.slug || i} plant={{ ...plant, price: plant.basePrice, category: plant.categories }} selectedCategory={plant.categories?.[0]} />
                    ))}
                  </div>
                )}
                {plantPagination && (
                  <Pagination
                    currentPage={plantPagination.currentPage}
                    totalPages={plantPagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            ) : expandedSection && expandedSection !== "Plants" ? (
              /* ── EXPANDED OTHER SECTION VIEW (front-end) ── */
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-[15px] sm:text-[16px] font-[600] text-slate-700">
                    {expandedSection} <span className="text-[13px] font-[400] text-gray-400">({otherResults.filter(p => p.section === expandedSection).length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {otherResults.filter(p => p.section === expandedSection).map((product, i) => (
                    <PlantCard key={i} plant={product} selectedCategory={product.section} />
                  ))}
                </div>
              </div>
            ) : (
              /* ── ALL-SECTIONS OVERVIEW ── */
              <>
                {/* Plants preview section */}
                {(selectedSection === "All" || selectedSection === "Plants") && (plantPreview.length > 0 || plantLoading) && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <h2 className="text-[15px] sm:text-[16px] font-[600] text-slate-700">
                        Plants <span className="text-[13px] font-[400] text-gray-400">({plantTotalCount})</span>
                      </h2>
                      {plantTotalCount > PREVIEW_LIMIT && (
                        <button onClick={() => handleSeeMore("Plants")} className="flex items-center gap-1 text-[13px] text-[#3a7d44] font-[500] hover:underline shrink-0">
                          See all {plantTotalCount}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {plantLoading
                        ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse border border-gray-100" />)
                        : plantPreview.map((plant, i) => (
                            <PlantCard key={plant.slug || i} plant={{ ...plant, price: plant.basePrice, category: plant.categories }} selectedCategory={plant.categories?.[0]} />
                          ))
                      }
                    </div>
                    {plantTotalCount > PREVIEW_LIMIT && (
                      <div className="mt-4 flex justify-center">
                        <button onClick={() => handleSeeMore("Plants")} className="flex items-center gap-2 px-6 py-2.5 border border-[#3a7d44] text-[#3a7d44] text-[13px] font-[500] rounded-full hover:bg-[#EAF3DE] transition-colors">
                          See {plantTotalCount - PREVIEW_LIMIT} more plants
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Other sections preview */}
                {Object.entries(
                  otherResults.reduce((acc, p) => { if (!acc[p.section]) acc[p.section] = []; acc[p.section].push(p); return acc; }, {})
                ).map(([section, items]) => {
                  const hasMore = items.length > PREVIEW_LIMIT;
                  const previewItems = hasMore ? items.slice(0, PREVIEW_LIMIT) : items;
                  return (
                    <div key={section} className="mb-10">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                        <h2 className="text-[15px] sm:text-[16px] font-[600] text-slate-700">
                          {section} <span className="text-[13px] font-[400] text-gray-400">({items.length})</span>
                        </h2>
                        {hasMore && (
                          <button onClick={() => handleSeeMore(section)} className="flex items-center gap-1 text-[13px] text-[#3a7d44] font-[500] hover:underline shrink-0">
                            See all {items.length}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {previewItems.map((product, i) => (
                          <PlantCard key={i} plant={product} selectedCategory={product.section} />
                        ))}
                      </div>
                      {hasMore && (
                        <div className="mt-4 flex justify-center">
                          <button onClick={() => handleSeeMore(section)} className="flex items-center gap-2 px-6 py-2.5 border border-[#3a7d44] text-[#3a7d44] text-[13px] font-[500] rounded-full hover:bg-[#EAF3DE] transition-colors">
                            See {items.length - PREVIEW_LIMIT} more in {section}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
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