"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PlantCard from "@/components/plants/PlantCard";

// ─── Stat Strip ──────────────────────────────────────────────────────────────
function StatStrip() {
  const stats = [
    { value: "500+", label: "Plants sold this month" },
    { value: "4.8★", label: "Average customer rating" },
    { value: "98%", label: "Happy plant parents" },
    { value: "48hr", label: "Express delivery" },
  ];
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col items-center justify-center gap-0.5 px-4 py-5 ${
            i < stats.length - 1 ? "border-b border-gray-100 md:border-b-0 md:border-r" : ""
          }`}
        >
          <span className="font-[poppins] text-[22px] font-[700] text-[#3a7d44] sm:text-[26px]">
            {s.value}
          </span>
          <span className="font-[inter] text-[11px] tracking-wide text-gray-500 sm:text-[13px]">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Sort / Filter Bar ────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

const FILTER_TAGS = ["All", "Indoor", "Outdoor", "Low Maintenance", "Air Purifying", "Flowering"];

function FilterBar({ activeFilter, setActiveFilter, activeSort, setActiveSort }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter tags */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`rounded-full border px-3 py-1 font-[inter] text-[12px] font-[500] transition-all duration-200 sm:text-[13px] ${
              activeFilter === tag
                ? "border-transparent bg-brand-gradient text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#83B930] hover:text-[#3a7d44]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Sort dropdown — wrapped for gradient border effect */}
      <div className={`self-start rounded-lg p-[1.5px] sm:self-auto ${
        activeSort !== "default" ? "bg-brand-gradient" : "bg-gray-200"
      }`}>
        <select
          value={activeSort}
          onChange={(e) => setActiveSort(e.target.value)}
          className="rounded-[6px] bg-white px-3 py-1.5 font-[inter] text-[12px] text-gray-700 outline-none sm:text-[13px]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
export function RankBadge({ rank }) {
  const colors = {
    1: "bg-[#FFD700] text-[#7a5c00]",   // gold
    2: "bg-[#C0C0C0] text-[#4a4a4a]",   // silver
    3: "bg-[#CD7F32] text-white",        // bronze
  };
  const style = colors[rank] ?? "bg-[#e8f5e9] text-[#3a7d44]";
  return (
    <div
      className={`absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full font-[poppins] text-[11px] font-[700] shadow ${style}`}
    >
      #{rank}
    </div>
  );
}

// ─── Bestseller Card wrapper ──────────────────────────────────────────────────
function BestsellerCard({ plant, rank }) {
  return (
    <div className="relative">
      <RankBadge rank={rank} />
      {/* Reuse your existing PlantCard — pass through normally */}
      <PlantCard plant={plant} selectedCategory={plant.categories?.[0]} />
      {/* Sold count pill */}
      {plant.soldCount && (
        <div className="mt-1.5 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 font-[inter] text-[11px] font-[500] text-[#3a7d44]">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            {plant.soldCount} sold
          </span>
        </div>
      )}
    </div>
  );
}

const ITEMS_PER_PAGE = 8;

// ─── Pagination Component ─────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[#83B930] hover:enabled:text-[#3a7d44]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-full font-[inter] text-[13px] font-[500] transition-all ${
            currentPage === page
              ? "bg-brand-gradient text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#83B930] hover:text-[#3a7d44]"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:enabled:border-[#83B930] hover:enabled:text-[#3a7d44]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BestsellersPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filter or sort changes
  const handleFilterChange = (val) => { setActiveFilter(val); setCurrentPage(1); };
  const handleSortChange = (val) => { setActiveSort(val); setCurrentPage(1); };

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchBestsellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Change endpoint to your bestsellers API if you have one,
      // or filter client-side from /api/plants using a `bestseller: true` flag.
      const res = await fetch("/api/plants?bestseller=true");
      if (!res.ok) throw new Error("Failed to load bestsellers");
      const data = await res.json();
      setPlants(data.plants ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestsellers();
  }, [fetchBestsellers]);

  // ── Filter + Sort ────────────────────────────────────────────────────────
  const filtered = plants
    .filter((p) =>
      activeFilter === "All" ? true : p.categories?.includes(activeFilter)
    )
    .sort((a, b) => {
      if (activeSort === "price_asc") return (a.basePrice ?? 0) - (b.basePrice ?? 0);
      if (activeSort === "price_desc") return (b.basePrice ?? 0) - (a.basePrice ?? 0);
      if (activeSort === "rating") return (b.ratingScore ?? 0) - (a.ratingScore ?? 0);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );



  return (
    <div className="w-full bg-[#f8faf7]">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-4 py-6 sm:px-6 md:px-[40px]">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-1.5 font-[inter] text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#3a7d44]">Home</Link>
          <span>/</span>
          <Link href="/plants" className="hover:text-[#3a7d44]">Plants</Link>
          <span>/</span>
          <span className="text-[#3a7d44]">Bestsellers</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <h1 className="font-[poppins] text-[22px] font-[700] leading-tight text-[#2d2d2d] sm:text-[26px] md:text-[28px]">
            🌿 Bestselling Plants
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 font-[inter] text-[11px] font-[600] text-[#3a7d44]">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Customer Favourites
          </span>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="px-4 pt-6 pb-12 sm:px-6 md:px-[40px] md:pb-16">

        {/* Filter Bar */}
        <div className="mb-5 sm:mb-6">
          <FilterBar
            activeFilter={activeFilter}
            setActiveFilter={handleFilterChange}
            activeSort={activeSort}
            setActiveSort={handleSortChange}
          />
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className="mb-4 font-[inter] text-[12px] text-gray-400 sm:text-[13px]">
            Showing{" "}
            <span className="font-[600] text-gray-600">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-[600] text-gray-600">{filtered.length}</span>{" "}
            bestseller{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "All" && (
              <span>
                {" "}in{" "}
                <span className="font-[600] text-[#3a7d44]">{activeFilter}</span>
              </span>
            )}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-3/4 animate-pulse rounded-xl bg-gray-100" />
            ))
          ) : error ? (
            <div className="col-span-full py-16 text-center">
              <p className="font-[inter] text-red-500">{error}</p>
              <button
                onClick={fetchBestsellers}
                className="mt-3 rounded-full bg-[#83B930] px-5 py-2 font-[inter] text-[13px] font-[500] text-white"
              >
                Retry
              </button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="font-[inter] text-gray-500">
                No bestsellers found for{" "}
                <span className="font-[600] text-[#3a7d44]">{activeFilter}</span>.
              </p>
              <button
                onClick={() => handleFilterChange("All")}
                className="mt-3 rounded-full border border-[#83B930] px-5 py-2 font-[inter] text-[13px] font-[500] text-[#3a7d44]"
              >
                Clear filter
              </button>
            </div>
          ) : (
            displayed.map((plant, index) => (
              <BestsellerCard
                key={plant.id ?? index}
                plant={plant}
                rank={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
              />
            ))
          )}
        </div>

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ── Stat Strip ───────────────────────────────────────────────────── */}
        {!loading && displayed.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <StatStrip />
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        {!loading && displayed.length > 0 && (
          <div className="mt-8 text-center sm:mt-10">
            <p className="mb-3 font-[inter] text-[13px] text-gray-500">
              Looking for something specific?
            </p>
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#83B930] to-[#1992D5] px-6 py-2.5 font-[inter] text-[14px] font-[500] text-white shadow-md transition-opacity hover:opacity-90"
            >
              Browse All Plants
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}