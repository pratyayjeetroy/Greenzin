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
    viewAllHref: "/plants",
    cards: [
      {
        id: "flowering-plants",
        label: "Flowering Plants",
        href: "/plants?category=Flowering",
        image: "/home/floweringPlants.png",
      },
      {
        id: "air-purifying-plants",
        label: "Air Purifying Plants",
        href: "/plants?category=Air Purifying",
        image: "/home/airPurifyingPlants.png",
      },
      {
        id: "vastu-plants",
        label: "Vastu Plants",
        href: "/plants?category=Vastu",
        image: "/home/vastu.png",
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
        image: "/home/ceramic.png",
      },
      {
        id: "designer-pots",
        label: "Designer",
        href: "/categories/pots/designer",
        image: "/home/designer.png",
      },
      {
        id: "plastic-pots",
        label: "Plastic",
        href: "/categories/pots/plastic",
        image: "/home/plastic.png",
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
        image: "/home/birthdayPlant.png",
      },
      {
        id: "housewarming-gifts",
        label: "Housewarming Gifts",
        href: "/categories/gifts/housewarming",
        image: "/home/housewarming.png",
      },
      {
        id: "office-sets",
        label: "Office Sets",
        href: "/categories/gifts/office",
        image: "/home/officePlant.png",
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Renders the coloured heading markup from the `headingParts` array */
const SectionHeading = ({ parts }) => (
  <>
    <h2 className="text-center font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold leading-tight text-[#2d2d2d]">
      {parts.map((part, i) =>
        part.highlight ? (
          <span key={i} className="text-[#3a7d44]">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </h2>
    <div className="mt-3 mx-auto h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
  </>
);

/** Individual category card */
const CategoryCard = ({ label, href, image }) => (
  <Link
    href={href}
    className="group relative block overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
  >
    <div className="relative w-full aspect-3/2 overflow-hidden bg-[#f4f5f4]">
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="py-2 text-center sm:py-2.5">
      <p className="text-[13px] font-semibold text-[#2d2d2d] sm:text-[14px] md:text-[15px] lg:text-[16px]">
        {label}
      </p>
    </div>
  </Link>
);

/** One full category section (heading + subheading + "View All" + 3 cards) */
const CategorySection = ({ headingParts, subheading, viewAllHref, cards }) => (
  <div className="mb-8 md:mb-10 last:mb-0">
    {/* Header row */}
    <div className="relative mb-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className="text-center">
        <SectionHeading parts={headingParts} />
        {subheading && (
          <p className="mt-1 text-[12px] text-[#6b6b6b] sm:text-[13px]">
            {subheading}
          </p>
        )}
      </div>
      <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
        <Link
          href={viewAllHref}
          className="bg-brand-gradient shrink-0 rounded-full px-4 py-1.5 text-[13px] text-white transition-opacity duration-200 hover:opacity-90 sm:text-[14px] md:text-[15px] lg:text-[16px]"
        >
          View All &gt;
        </Link>
      </div>
    </div>

    {/* Cards grid */}
    <div className="mt-3 grid grid-cols-3 gap-3 md:gap-[3%]">
      {cards.map((card) => (
        <CategoryCard
          key={card.id}
          label={card.label}
          href={card.href}
          image={card.image}
        />
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CategoriesSec = () => {
  return (
    <section className="bg-white py-6 md:py-8">
      <div className="mx-auto w-[92%] sm:w-[90%] px-2 sm:px-4 md:px-5">
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
