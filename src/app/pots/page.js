"use client";

import { useState, useRef ,useEffect } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { pots } from "@/data/pots/pots";
import { categories } from "@/data/pots/potCategories";
import FaqSection from "@/components/general/FaqSection";

function PotsContent() {
  const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const highlightName = searchParams.get("highlight"); // ✅ read highlight param

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl ||"Plastic Pots");
  const filteredPlants = pots
      .filter((plant) => plant.category?.includes(selectedCategory))
      .sort((a, b) => {
        if (a.name === highlightName) return -1;
        if (b.name === highlightName) return 1;
        return 0;
      });

   useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  

  const faqs = [
    {
      question: "What types of pots are available?",
      answer: "We offer different types of pots including ceramic pots, plastic pots, metal pots, decorative pots, hanging pots, tabletop planters, and modern designer planters.",
    },
    {
      question: "Which pots are best for indoor plants?",
      answer: "Ceramic pots, decorative planters, and compact tabletop pots are great for indoor plants because they look elegant and fit well in home and office spaces.",
    },
    {
      question: "Do you have pots for outdoor use?",
      answer: "Yes, we offer outdoor pots that are durable and suitable for balconies, terraces, patios, and gardens.",
    },
    {
      question: "Are lightweight pots available?",
      answer: "Yes, lightweight pots such as plastic and certain fiber planters are available and are easy to move and maintain.",
    },
    {
      question: "Do you offer decorative and designer pots?",
      answer: "Yes, we have decorative and designer pots in different colors, shapes, and finishes to match various home and office interiors.",
    },
    {
      question: "Which pot size should I choose for my plant?",
      answer: "The pot size depends on the plant type and root growth. A slightly larger pot than the current root size is usually recommended for healthy growth.",
    },
    {
      question: "Do the pots come with drainage holes?",
      answer: "Many of our pots come with drainage holes, which help prevent overwatering and support better plant health. Availability may vary depending on the pot design.",
    },
    {
      question: "Are these pots suitable for gifting?",
      answer: "Yes, many of our pots are selected especially for gifting and are available in stylish, decorative, and premium designs.",
    },
    {
      question: "Can I get pots in different colors and shapes?",
      answer: "Yes, we offer pots in a variety of colors, shapes, sizes, and styles to suit different décor preferences.",
    },
    {
      question: "How do I clean and maintain decorative pots?",
      answer: "Most decorative pots can be cleaned easily with a soft cloth and mild water cleaning. Proper handling and regular dusting help maintain their look for a long time.",
    },
  ];

  return (
    <div className="w-full">

      {/* Banner Section */}
      <div className="bg-[url('/banner/banner.png')] bg-cover bg-center py-10 sm:py-12 md:py-16">
        <div className="text-center w-full px-4 sm:px-8">
          <h1 className="text-[20px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.5px] leading-[1.25] sm:leading-[1.3] px-4 sm:px-0">
  Find the Perfect Pots and Planters for Every Space
</h1>
<p className="text-gray-700 mt-2 sm:mt-3 text-[13px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-[inter] tracking-[0.3px] leading-[1.6] sm:leading-[1.5]">
  Explore a versatile range of decorative pots and planters crafted to match every plant, style, and setting.{" "}
  <br className="hidden md:block" />
  Choose the perfect design to complement your plants and enhance your décor with ease.
</p>
        </div>

        {/* Category Circles */}
        <div className="max-w-7xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-y-5 gap-x-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              {/* Circle */}
              <div
                className={`w-[68px] h-[68px] sm:w-[90px] sm:h-[90px] md:w-[105px] md:h-[105px] lg:w-[120px] lg:h-[120px] rounded-full p-[3px] ${
                  selectedCategory === cat.name ? "bg-brand-gradient" : "bg-gray-200"
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
         {/* <h2 className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] font-[poppins] text-slate-800 text-center mb-6 sm:mb-8 md:mb-10">
          Featured {selectedCategory}
        </h2> */}
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
          {filteredPlants.map((plant, index) => (
            <PlantCard key={index} plant={plant} selectedCategory={selectedCategory}  isHighlighted={plant.name === highlightName} />
          ))}
        </div>
      </div>

      <FaqSection  faqs={faqs} />

    </div>
  );
}

export default function PotsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf7]" />}>
      <PotsContent />
    </Suspense>
  );
}