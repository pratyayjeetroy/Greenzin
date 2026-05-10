"use client";

import { useState, useRef ,useEffect } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { tools } from "@/data/tools/tools";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toolCategories } from "@/data/tools/toolCategories";
import FaqSection from "@/components/general/FaqSection";

function ToolsPage() {
   const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
 

  const [selectedCategory, setSelectedCategory] = useState("Gardening Tools");


   useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  const filteredTools = tools.filter(
    (tool) => tool.categories?.includes(selectedCategory)
  );

 

  const faqs = [
    {
      question: "What types of gardening tools are available?",
      answer: "We offer pruning tools, watering tools, grow bags, seedling trays, safety gear, and the Captain Green kids activity kit.",
    },
    {
      question: "Are the tools suitable for beginners?",
      answer: "Yes, most of our tools are beginner-friendly and come with easy-to-use designs suitable for home gardeners and terrace gardens.",
    },
    {
      question: "What is Captain Green?",
      answer: "Captain Green is a fun gardening combo kit designed for kids and families. It includes a small tub, mini pot, cocopeat packet, wooden stick, and seeds — perfect for school projects or home activities.",
    },
    {
      question: "Are grow bags reusable?",
      answer: "Yes, our grow bags are made from durable UV-resistant fabric and can be reused across multiple growing seasons with proper care.",
    },
    {
      question: "Which watering tool is best for indoor plants?",
      answer: "A pressure sprayer or a small watering can with a narrow spout works best for indoor plants as it gives better control over water flow.",
    },
    {
      question: "Do you offer safety gear for gardening?",
      answer: "Yes, we offer garden gloves, rubber gloves, and knee pads to keep you safe and comfortable while gardening.",
    },
    {
      question: "Is the Captain Green kit suitable for school projects?",
      answer: "Absolutely! The Captain Green School Pack is designed specifically for classroom workshops and comes with supplies for 5 kids.",
    },
    {
      question: "What size grow bags do you offer?",
      answer: "We offer grow bags in multiple sizes including 12x12 and 15x15 inches, as well as value packs of 5 bags for terrace and balcony gardens.",
    },
    {
      question: "Are seedling trays biodegradable?",
      answer: "We have both reusable plastic seedling trays and eco-friendly coco peat trays that are biodegradable and great for seed starting.",
    },
    {
      question: "Can I gift these tools?",
      answer: "Yes! The Captain Green kits in particular make wonderful gifts for children. Our pruning and watering tool sets are also great gifting options for gardening enthusiasts.",
    },
  ];

  return (
    <div className="w-full">

      {/* Banner Section */}
      <div className="bg-[url('/banner/banner.png')] bg-cover bg-center py-10 sm:py-12 md:py-16">
        <div className="text-center w-full px-4 sm:px-8">
          <h1 className="text-[20px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.5px] leading-[1.25] sm:leading-[1.3] px-4 sm:px-0">
            Everything Your Garden Needs, All in One Place

          </h1>
          <p className="text-gray-700 mt-2 sm:mt-3 text-[13px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-[inter] tracking-[0.3px] leading-[1.6] sm:leading-[1.5]">
            Discover a versatile range of gardening essentials crafted to match every plant, space, and skill level.{" "}
            <br className="hidden md:block" />
From handy tools to kids kits — grow and care for your garden with ease.          </p>
        </div>

        {/* Category Circles — 6 categories, always 6 columns on md+ */}
        <div className="max-w-6xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6 flex justify-center gap-x-10 sm:grid-cols-6 md:grid-cols-6 gap-y-5 gap-x-2">
          {toolCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              {/* Circle */}
              <div
                className={`w-[68px] h-[68px] sm:w-[90px] sm:h-[90px] md:w-[105px] md:h-[105px] lg:w-[120px] lg:h-[120px] rounded-full p-[3px] ${
                  selectedCategory === cat.name
                    ? "bg-brand-gradient"
                    : "bg-gray-200"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Label */}
              <div
                className={`mt-[3px] text-[10px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-[inter] px-2 py-[3px] rounded-full text-center leading-snug ${
                  selectedCategory === cat.name
                    ? "bg-brand-gradient text-white font-[500]"
                    : "text-gray-700 font-[600]"
                }`}
              >
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
<div className="w-full px-4 sm:px-6 md:px-[40px] pt-6 sm:pt-8 md:pt-[24px] pb-10 sm:pb-12 md:pb-16 bg-[#f8faf7]"> 
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
    <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
      Top Picks
    </span>
    <h2 className="mt-2 font-[poppins] text-[22px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] text-[#2d2d2d] leading-tight">
      Featured <span className="text-[#3a7d44]">{selectedCategory}</span>
    </h2>
    <div className="mt-3 mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-[#83B930] to-[#1992D5]" />
  </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-8 items-stretch">
          {filteredTools.map((tool, index) => (
            <PlantCard key={index} plant={tool} selectedCategory={selectedCategory} />
          ))}
        </div>
      </div>

      <FaqSection title="Gardening Tools FAQs" faqs={faqs} />

    </div>
  );
}

export default function GardenShop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf7]" />}>
      <ToolsPage />
    </Suspense>
  );
}