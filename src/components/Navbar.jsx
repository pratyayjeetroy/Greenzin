"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Plants", href: "/plants" },
    { label: "Pots", href: "/pots" },
    { label: "Gifting", href: "/gifting" },
    { label: "Corporate Gifs", href: "/corporate-gifts" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Blogs", href: "/blogs/1" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full font-sans shadow-md">
      {/* Top Bar */}
      <div className="bg-white px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/">
            <Image
              src="/greenZinLogo.png"
              alt="GreenZin - The Best Gardening Brand"
              width={200}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Search Bar — hidden on very small screens to prevent overflow */}
        <div className="hidden sm:block flex-1 max-w-2xl mx-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // handle search submit
            }}
            role="search"
            className="flex items-center bg-gray-100 rounded-full px-5 py-2.5 gap-3 border border-gray-200 transition-colors duration-200"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for plants, pots & more.."
              aria-label="Search for plants, pots and more"
              className="flex-1 bg-transparent text-gray-600 text-sm outline-none border-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="text-gray-400 bg-transparent border-none cursor-pointer p-0 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-700 text-xl font-medium transition-colors hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">Login / Register</span>
          </Link>

          <Link
            href="/cart"
            className="relative text-gray-700 transition-colors hover:text-gray-900"
            aria-label="Cart with 0 items"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm8 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"
              />
            </svg>
            <span
              className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold"
            >
              0
            </span>
          </Link>

          {/* Mobile Hamburger — display controlled only by Tailwind (lg:flex → lg:hidden) */}
          <button
            className="text-gray-600 bg-transparent border-none cursor-pointer p-0 flex items-center lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div
        className="hidden lg:block bg-[#3d5a3e]"
        role="navigation"
        aria-label="Main navigation"
      >
        <ul className="flex items-center justify-center px-6 list-none m-0 p-0">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-white text-xl font-medium px-4 py-3.5 transition-colors whitespace-nowrap bg-transparent border-b-2 ${
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
        <div
          id="mobile-menu"
          className="lg:hidden bg-[#3d5a3e]"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="list-none m-0 p-0">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li
                  key={label}
                  className="border-b border-white/10"
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-sm font-medium px-6 py-3 transition-colors ${
                      isActive ? "text-white bg-white/20" : "text-white/80 bg-transparent"
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
