"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { allProducts, allCategories } from "@/data/searchData";
import { searchProducts } from "@/components/general/search";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoryResults, setCategoryResults] = useState([]);
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef();
  const mobileSearchRef = useRef();
  const router = useRouter();

  useEffect(() => {
    let touchMoved = false;
    const handleTouchMove = () => { touchMoved = true; };
    const handleOutsideTouch = (e) => {
      if (touchMoved) { touchMoved = false; return; }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setMobileSearchOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideTouch);
    document.addEventListener("touchend", handleOutsideTouch);
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("mousedown", handleOutsideTouch);
      document.removeEventListener("touchend", handleOutsideTouch);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setCategoryResults([]);
      setSearchOpen(false);
      return;
    }
    const found = searchProducts(val, allProducts);
    setSearchResults(found.slice(0, 4)); // max 4 products

    // ✅ match from start of word only — no irrelevant suggestions
    const matchedCats = allCategories
      .filter(cat =>
        cat.toLowerCase().split(" ")
          .some(word => word.startsWith(val.toLowerCase()))
      )
      .slice(0, 3); // max 3 suggestions
    setCategoryResults(matchedCats);

    setSearchOpen(found.length > 0 || matchedCats.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search-results?q=${encodeURIComponent(searchQuery.trim())}`,
      );
      setSearchQuery("");
      setSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const handleProductClick = (product) => {
    router.push(`/search-results?q=${encodeURIComponent(product.name)}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleCategoryClick = (cat) => {
    router.push(`/search-results?q=${encodeURIComponent(cat)}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleViewAll = () => {
    router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Plants", href: "/plants" },
    { label: "Pots", href: "/pots" },
    { label: "Gifting", href: "/gifting" },
    { label: "Corporate Gifts", href: "/corporate-gifts" },
    { label: "Garden Shop", href: "/garden-shop" },
    { label: "Best Sellers", href: "/bestseller" },
    { label: "Blogs", href: "/blogs" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  const SearchDropdown = () => (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.stopPropagation()}
      className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto"
    >
      {/* Search for line */}
      <div
        onClick={handleViewAll}
        onTouchEnd={(e) => { e.stopPropagation(); handleViewAll(); }}
        className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 active:bg-green-100 cursor-pointer border-b border-gray-100 transition-colors duration-150"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-700 flex-1">
          Search for <span className="text-[#3a7d44] font-[600]">"{searchQuery}"</span>
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Category suggestions */}
      {categoryResults.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[11px] font-[700] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
            Suggestions
          </div>
          {categoryResults.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat)}
              onTouchEnd={(e) => { e.stopPropagation(); handleCategoryClick(cat); }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 active:bg-green-100 cursor-pointer border-b border-gray-50 transition-colors duration-150"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EAF3DE] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3B6D11]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <p className="text-sm font-[500] text-gray-700 flex-1">{cat}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Product results grouped by section */}
      {Object.entries(
        searchResults.reduce((acc, product) => {
          if (!acc[product.section]) acc[product.section] = [];
          acc[product.section].push(product);
          return acc;
        }, {})
      ).map(([section, items]) => (
        <div key={section}>
          <div className="px-4 py-2 text-[11px] font-[700] text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
            {section}
          </div>
          {items.map((product, i) => (
            <div
              key={i}
              onClick={() => handleProductClick(product)}
              onTouchEnd={(e) => { e.stopPropagation(); handleProductClick(product); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 active:bg-green-100 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150"
            >
              <img
                src={product.image1}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-[500] text-gray-700 truncate">{product.name}</p>
                <p className="text-xs text-green-600 font-[500] mt-0.5">₹ {product.price}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      ))}

      {/* ✅ View all results at bottom */}
      {searchResults.length > 0 && (
        <div
          onClick={handleViewAll}
          onTouchEnd={(e) => { e.stopPropagation(); handleViewAll(); }}
          className="px-4 py-3 text-center text-[13px] text-[#3a7d44] font-[500] hover:bg-green-50 active:bg-green-100 cursor-pointer border-t border-gray-100 transition-colors duration-150"
        >
          View all results for "{searchQuery}" →
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full font-sans shadow-md">

      {/* Top Bar */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <div className="shrink-0">
          <Link href="/">
            <Image
              src="/greenZinLogo.png"
              alt="GreenZin - The Best Gardening Brand"
              width={200}
              height={56}
              className="h-10 sm:h-14 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop & Tablet Search Bar */}
        <div ref={searchRef} className="hidden sm:block flex-1 max-w-2xl mx-4 relative">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex items-center bg-gray-100 rounded-full px-5 py-2.5 gap-3 border border-gray-200 focus-within:border-green-400 focus-within:bg-white transition-colors duration-200"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for plants, pots & more.."
              aria-label="Search for plants, pots and more"
              className="flex-1 bg-transparent text-gray-600 text-sm outline-none border-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="text-gray-400 hover:text-green-600 bg-transparent border-none cursor-pointer p-0 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>
          {searchOpen && <SearchDropdown />}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Mobile Search Icon */}
          <button
            className="sm:hidden text-gray-600 bg-transparent border-none cursor-pointer p-0 flex items-center"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Open search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-700 text-sm sm:text-base font-medium transition-colors hover:text-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
            </svg>
            <span className="hidden sm:inline">Login / Register</span>
          </Link>

          <Link
            href="/cart"
            className="relative text-gray-700 transition-colors hover:text-green-700"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm8 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="text-gray-600 bg-transparent border-none cursor-pointer p-0 flex items-center lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div ref={mobileSearchRef} className="sm:hidden bg-white px-4 pb-3 pt-2 relative border-t border-gray-100">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-3 border border-gray-200 focus-within:border-green-400 focus-within:bg-white transition-colors duration-200"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for plants, pots & more.."
              aria-label="Search"
              autoFocus
              className="flex-1 bg-transparent text-gray-600 text-sm outline-none border-none"
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-green-600 bg-transparent border-none cursor-pointer p-0 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>
          {searchOpen && <SearchDropdown />}
        </div>
      )}

      {/* Desktop Nav Links */}
      <div className="hidden lg:block bg-[#3d5a3e]" role="navigation" aria-label="Main navigation">
        <ul className="flex items-center justify-center px-6 list-none m-0 p-0">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-white text-[15px] font-medium px-4 py-3.5 transition-colors whitespace-nowrap bg-transparent border-b-2 hover:border-white/60 ${
                    isActive ? "border-white" : "border-transparent"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-[#3d5a3e]" role="navigation" aria-label="Mobile navigation">
          <ul className="list-none m-0 p-0">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={label} className="border-b border-white/10">
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-sm font-medium px-6 py-3 transition-colors ${
                      isActive ? "text-white bg-white/20" : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;