import React from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────
// Each `section` has a heading (with optional colored keyword) and its cards.
// To add/remove a section or swap an image later, only edit this array.

const CATEGORY_SECTIONS = [
  {
    id: "plants",
    headingParts: [
      { text: "Explore ", highlight: false },
      { text: "Plants", highlight: true },
      { text: " by Category", highlight: false },
    ],
    subheading: "Fresh, vibrant plants — perfect for every space",
    viewAllHref: "/categories/plants",
    cards: [
      {
        id: "flowering-plants",
        label: "Flowering Plants",
        href: "/categories/plants/flowering",
      },
      {
        id: "air-purifying-plants",
        label: "Air Purifying Plants",
        href: "/categories/plants/air-purifying",
      },
      {
        id: "vastu-plants",
        label: "Vastu Plants",
        href: "/categories/plants/vastu",
      },
    ],
  },
  {
    id: "pots",
    headingParts: [
      { text: "Explore ", highlight: false },
      { text: "Pots", highlight: true },
      { text: " by Category", highlight: false },
    ],
    subheading: "Stylish pots to complement every plant and interior",
    viewAllHref: "/categories/pots",
    cards: [
      {
        id: "ceramic-pots",
        label: "Ceramic",
        href: "/categories/pots/ceramic",
      },
      {
        id: "designer-pots",
        label: "Designer",
        href: "/categories/pots/designer",
      },
      {
        id: "plastic-pots",
        label: "Plastic",
        href: "/categories/pots/plastic",
      },
    ],
  },
  {
    id: "gifts",
    headingParts: [
      { text: "Popular ", highlight: false },
      { text: "Plant Gift", highlight: true },
      { text: " Options", highlight: false },
    ],
    subheading: "Thoughtful green gifts for every occasion",
    viewAllHref: "/categories/gifts",
    cards: [
      {
        id: "birthday-gifts",
        label: "Birthday Gifts",
        href: "/categories/gifts/birthday",
      },
      {
        id: "housewarming-gifts",
        label: "Housewarming Gifts",
        href: "/categories/gifts/housewarming",
      },
      {
        id: "office-sets",
        label: "Office Sets",
        href: "/categories/gifts/office",
      },
    ],
  },
];

// Shared dummy image path (replace individually once real assets are ready)
const DUMMY_IMG = "/home/category.png";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Renders the coloured heading markup from the `headingParts` array */
const SectionHeading = ({ parts }) => (
  <h2 className="text-center text-[28px] leading-tight font-bold text-[#2d2d2d]">
    {parts.map((part, i) =>
      part.highlight ? (
        <span key={i} className="text-[#228EC0]">
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      ),
    )}
  </h2>
);

/** Individual category card */
const CategoryCard = ({ label, href }) => (
  <Link
    href={href}
    className="group relative block overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
  >
    <div className="relative h-60 w-full overflow-hidden">
      <Image
        src={DUMMY_IMG}
        alt={label}
        fill
        className="w-[25%] object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="py-2.5 text-center">
      <p className="text-[16px] font-semibold text-[#2d2d2d]">{label}</p>
    </div>
  </Link>
);

/** One full category section (heading + subheading + "View All" + 3 cards) */
const CategorySection = ({ headingParts, subheading, viewAllHref, cards }) => (
  <div className="mb-10">
    {/* Header row */}
    <div className="mb-1.5 flex items-center justify-between gap-4">
      <div className="flex-1 text-center">
        <SectionHeading parts={headingParts} />
        {subheading && (
          <p className="mt-1 text-[13px] text-[#6b6b6b]">{subheading}</p>
        )}
      </div>
      <Link
        href={viewAllHref}
        className="bg-brand-gradient font shrink-0 rounded-full px-4 py-1.5 text-[16px] text-white transition-colors duration-200"
      >
        View All &gt;
      </Link>
    </div>

    {/* Cards grid */}
    <div className="mt-[16px] grid grid-cols-3 gap-[3%]">
      {cards.map((card) => (
        <CategoryCard key={card.id} label={card.label} href={card.href} />
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CategoriesSec = () => {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto w-[90%] px-5">
        {CATEGORY_SECTIONS.map((section) => (
          <CategorySection
            key={section.id}
            headingParts={section.headingParts}
            subheading={section.subheading}
            viewAllHref={section.viewAllHref}
            cards={section.cards}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSec;
