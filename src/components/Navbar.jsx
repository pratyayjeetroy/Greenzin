"use client"
import { useState } from "react";
import Link from "next/link";
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
    { label: "Blogs", href: "/blogs" },
    { label: "Best Seller", href: "/best-seller" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav style={{ width: "100%", fontFamily: "sans-serif", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "12px",
          paddingBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <Link href="/">
            <img
              src="/greenZinLogo.jpeg"
              alt="GreenZin - The Best Gardening Brand"
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: "672px", marginLeft: "16px", marginRight: "16px" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // handle search submit
            }}
            role="search"
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f3f4f6",
              borderRadius: "9999px",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              gap: "12px",
              border: "1px solid #e5e7eb",
              transition: "border-color 0.2s",
            }}
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for plants, pots & more.."
              aria-label="Search for plants, pots and more"
              style={{
                flex: 1,
                backgroundColor: "transparent",
                color: "#4b5563",
                fontSize: "14px",
                outline: "none",
                border: "none",
              }}
            />
            <button
              type="submit"
              aria-label="Submit search"
              style={{
                color: "#9ca3af",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "20px", width: "20px" }}
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
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "20px", width: "20px" }}
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
            <span>Login / Register</span>
          </Link>

          <Link
            href="/cart"
            style={{
              position: "relative",
              color: "#374151",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            aria-label="Cart with 0 items"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "24px", width: "24px" }}
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
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#22c55e",
                color: "#ffffff",
                fontSize: "12px",
                borderRadius: "9999px",
                height: "16px",
                width: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              0
            </span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            style={{
              display: "none",
              color: "#4b5563",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            className="lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "24px", width: "24px" }}
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
        className="hidden lg:block"
        style={{ backgroundColor: "#3d5a3e" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "24px",
            paddingRight: "24px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: 500,
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    transition: "background-color 0.2s",
                    whiteSpace: "nowrap",
                    borderBottom: isActive ? "2px solid #ffffff" : "2px solid transparent",
                    textDecoration: "none",
                    backgroundColor: "transparent",
                  }}
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
          className="lg:hidden"
          style={{ backgroundColor: "#3d5a3e" }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li
                  key={label}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 500,
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      transition: "background-color 0.2s, color 0.2s",
                      textDecoration: "none",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.8)",
                      backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                    }}
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
