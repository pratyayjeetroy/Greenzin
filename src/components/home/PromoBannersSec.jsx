"use client";

import React, { useState } from "react";
import Image from "next/image";
import BulkOrderModal from "./BulkOrderModal";
import DecorServiceModal from "./DecorServiceModal";

const PROMO_BANNERS = [
  {
    id: "bulk-orders",
    bg: "#eef2ec",
    title: "Bulk Orders",
    description: "Buy Plants in Large Quantities for Your Business",
    image: "/home/bulkOrderBanner.png",
    imageAlt: "Bulk Orders",
    buttons: [{ label: "Order Now", action: "bulk-modal" }],
  },
  {
    id: "decor",
    bg: "#ebeae6",
    title: "Decorate Your Home or Office",
    description: "Bring Nature to Your Space - Transform Your Environment",
    image: "/home/decorBanner.png",
    imageAlt: "Decorate Space",
    buttons: [
      { label: "Home Decor", action: "decor-modal", decorType: "home" },
      { label: "Office Decor", action: "decor-modal", decorType: "office" },
    ],
  },
];

const PromoBannersSec = () => {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [decorModalOpen, setDecorModalOpen] = useState(false);
  const [decorType, setDecorType] = useState("home");

  return (
    <>
      <section className="bg-white py-6 md:py-8">
        <div className="mx-auto flex w-[92%] flex-col gap-4 px-2 sm:w-[90%] sm:gap-5 sm:px-4 md:gap-6 md:px-5">
          {PROMO_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className="relative flex w-full min-h-30 flex-col justify-center overflow-hidden rounded-xl px-6 py-8 shadow-sm sm:min-h-37.5 sm:px-8 sm:py-10 md:min-h-45 md:px-12 md:py-14"
              style={{ backgroundColor: banner.bg }}
            >
              {/* Background overlay image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={banner.image}
                  alt={banner.imageAlt}
                  fill
                  className="object-cover opacity-40 mix-blend-multiply"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-xl space-y-2 sm:space-y-2.5">
                <h3 className="text-[18px] font-bold leading-tight text-[#2d2d2d] sm:text-[22px] md:text-[26px] lg:text-[28px]">
                  {banner.title}
                </h3>
                <p className="text-[13px] font-medium text-black sm:text-[15px] md:text-[16px] lg:text-[18px]">
                  {banner.description}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {banner.buttons.map((btn) =>
                    btn.action === "bulk-modal" ? (
                      <button
                        key="bulk-order-now"
                        id="bulk-order-now-btn"
                        onClick={() => setBulkModalOpen(true)}
                        className="inline-block rounded-full bg-[#3d5a3e] px-6 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#4a5c47] hover:-translate-y-0.5 hover:shadow-lg sm:px-8 sm:py-2.5 sm:text-[14px] md:text-[15px] cursor-pointer border-none"
                      >
                        {btn.label}
                      </button>
                    ) : btn.action === "decor-modal" ? (
                      <button
                        key={btn.decorType}
                        id={`decor-${btn.decorType}-btn`}
                        onClick={() => {
                          setDecorType(btn.decorType);
                          setDecorModalOpen(true);
                        }}
                        className="inline-block rounded-full bg-[#3d5a3e] px-6 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#4a5c47] hover:-translate-y-0.5 hover:shadow-lg sm:px-8 sm:py-2.5 sm:text-[14px] md:text-[15px] cursor-pointer border-none"
                      >
                        {btn.label}
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BulkOrderModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />

      <DecorServiceModal
        isOpen={decorModalOpen}
        onClose={() => setDecorModalOpen(false)}
        decorType={decorType}
      />
    </>
  );
};

export default PromoBannersSec;
