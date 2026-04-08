import React from "react";
import Image from "next/image";
import Link from "next/link";

const GIFTS_DATA = [
  {
    id: "bulk-office",
    label: "Bulk Office Plants",
    image: "/home/bulkOfficePlants.png",
  },
  {
    id: "employee-appreciation",
    label: "Employee Appreciation",
    image: "/home/employeeGift.png",
  },
  {
    id: "custom-branded",
    label: "Custom Branded Gifts",
    image: "/home/customBrandedGift.png",
  },
];

const CorporateGiftsSec = () => {
  return (
    <section className="bg-white py-6 md:py-8">
      <div className="mx-auto w-[92%] px-2 sm:w-[90%] sm:px-4 md:px-5">
        {/* Header row */}
        <div className="relative mb-4 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:justify-center">
          <div className="text-center">
            <h2 className="text-[20px] font-bold leading-tight text-[#2d2d2d] sm:text-[22px] md:text-[26px] lg:text-[28px]">
              Explore <span className="text-[#3d5a3e]">Corporate Gifts</span>
            </h2>
          </div>
          <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
            <Link
              href="/corporate-gifts"
              className="bg-brand-gradient shrink-0 rounded-full px-4 py-1.5 text-[13px] text-white transition-opacity duration-200 hover:opacity-90 sm:text-[14px] md:text-[15px] lg:text-[16px]"
            >
              View All &gt;
            </Link>
          </div>
        </div>

        {/* Cards grid — stacks on mobile, 3-col on md+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-[3%]">
          {GIFTS_DATA.map((item) => (
            <Link
              key={item.id}
              href={`/corporate-gifts/${item.id}`}
              className="group relative block w-full overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="relative w-full aspect-3/2 overflow-hidden bg-[#f4f5f4]">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="py-2 text-center sm:py-2.5">
                <p className="text-[13px] font-semibold text-[#2d2d2d] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                  {item.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateGiftsSec;
