import React from "react";
import Image from "next/image";
import Link from "next/link";

const COLLECTIONS_DATA = [
  {
    id: "plant-care-guides",
    date: "October 26, 2023",
    title: "Plant Care Guides",
    authorLine: "BY AUTHOR NAME OCT 26, 2023",
    image: "/blogs/blog1.png",
    link: "/collections/plant-care-guides",
  },
  {
    id: "interior-design-tips",
    date: "October 26, 2023",
    title: "Interior Design Tips",
    authorLine: "BY AUTHOR NAME OCT 26, 2023",
    image: "/blogs/blog2.png",
    link: "/collections/interior-design-tips",
  },
  {
    id: "wellness-green-living",
    date: "October 26, 2023",
    title: "Wellness & Green Living",
    authorLine: "BY AUTHOR NAME OCT 26, 2023",
    image: "/blogs/blog3.png",
    link: "/collections/wellness-green-living",
  },
];

const FeaturedCollectionsSec = () => {
  return (
    <section className="py-6 pb-10 md:py-12 md:pb-16">
      <div className="mx-auto w-[92%] px-2 sm:w-[90%] sm:px-4 md:px-5">
        {/* Header */}
        <div className="mb-5 flex flex-col items-center gap-3 sm:mb-8 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex-1 text-center">
            <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold leading-tight text-[#2d2d2d]">
              Featured <span className="text-[#3a7d44]">Collections</span> by
              Professional
            </h2>
            <div className="mt-3 mx-auto h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
          </div>
          <Link
            href="/collections"
            className="bg-brand-gradient shrink-0 rounded-full px-4 py-1.5 text-[13px] text-white transition-opacity duration-200 hover:opacity-90 sm:text-[14px] md:text-[15px] lg:text-[16px]"
          >
            View All &gt;
          </Link>
        </div>

        {/* Grid — stacks on mobile, 3-col on md+ */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-[3%]">
          {COLLECTIONS_DATA.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              className="group flex flex-col overflow-hidden bg-transparent transition-all duration-300"
            >
              <div className="relative mb-3 w-full aspect-3/2 overflow-hidden rounded-2xl border border-[#e8e8e8] bg-[#f4f5f4] shadow-sm md:mb-4 md:rounded-[20px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-3"
                />
              </div>
              <div className="flex flex-col px-1 sm:px-2">
                <span className="mb-1 text-[13px] font-medium text-[#4a4a4a] sm:text-[14px] md:text-[15px]">
                  {post.date}
                </span>
                <h3 className="mb-1 text-[18px] font-bold text-[#2d2d2d] sm:text-[19px] md:text-[20px] lg:text-[22px] md:mb-2">
                  {post.title}
                </h3>
                <span className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#7a7a7a] sm:text-[12px] md:mb-4 md:text-[13px]">
                  {post.authorLine}
                </span>
                <p className="text-[14px] font-semibold text-[#3d5a3e] transition-colors group-hover:text-[#4a5c47] md:text-[15px] lg:text-[16px]">
                  Read More &gt;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionsSec;
