"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb navigation for product pages.
 * Props:
 *  - crumbs: string[]  (e.g. ["Home", "Plants", "Product Details"])
 *  - productName: string
 */
const Breadcrumb = ({ crumbs = [], productName }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full bg-[#f7f7f5] border-b border-[#ebebeb] py-2.5 px-4 md:px-6"
    >
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 text-[12px] text-[#7a7a7a] sm:text-[13px]">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            <Link
              href={i === 0 ? "/" : `/${crumb.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[#5C7058] transition-colors"
            >
              {crumb}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#b0b0b0]" />
          </li>
        ))}
        <li
          className="truncate max-w-[180px] font-medium text-[#2d2d2d] sm:max-w-xs"
          aria-current="page"
        >
          {productName}
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
