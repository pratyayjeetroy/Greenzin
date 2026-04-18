"use client";

import { useState, useRef ,useEffect} from "react";
import PlantCard from "@/components/plants/PlantCard";
import { plants } from "@/data/plants";
import { categories } from "@/data/plantCategories";
import FaqSection from "@/components/general/FaqSection";

export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Indoor Plants");
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  const faqs = [
    {
      question: "What are the different categories of plants available?",
      answer: "We offer a wide range of plant categories including indoor plants, outdoor plants, flowering plants, air-purifying plants, succulents, bonsai plants, hanging plants, and low-maintenance plants.",
    },
    {
      question: "Which plants are best suited for indoor spaces?",
      answer: "Indoor plants such as snake plant, pothos, peace lily, lucky bamboo, ZZ plant, and syngonium are popular choices because they are easy to maintain and adapt well to indoor conditions.",
    },
    {
      question: "Do you have outdoor plants for balconies, terraces, or gardens?",
      answer: "Yes, we offer outdoor plants that are suitable for balconies, terraces, patios, and gardens, including flowering plants, decorative foliage plants, and hardy green plants.",
    },
    {
      question: "Do you offer flowering plants?",
      answer: "Yes, we have flowering plants in different varieties that can add color and freshness to homes, balconies, gardens, and office spaces.",
    },
    {
      question: "Which plants are low-maintenance and easy to care for?",
      answer: "Low-maintenance plants like snake plant, jade plant, aloe vera, ZZ plant, cactus, and succulents are great options for beginners and busy plant owners.",
    },
    {
      question: "Do you have plants that help purify indoor air?",
      answer: "Yes, we offer air-purifying plants such as areca palm, spider plant, peace lily, pothos, and snake plant, which are commonly chosen for indoor environments.",
    },
    {
      question: "How often should I water my plants?",
      answer: "Watering depends on the type of plant, pot size, and environment. In general, most indoor plants should be watered only when the top layer of soil feels dry.",
    },
    {
      question: "How much sunlight do plants need?",
      answer: "Sunlight requirements vary by plant category. Some plants thrive in bright indirect light, while others prefer direct sunlight or partial shade. We recommend checking the care needs of each plant before purchase.",
    },
    {
      question: "Do you provide plant care tips for beginners?",
      answer: "Yes, we share basic care tips such as watering guidance, sunlight needs, pot placement, soil care, and general maintenance to help beginners care for their plants easily.",
    },
    {
      question: "How do I choose the right plant for my home or office?",
      answer: "The right plant depends on the space, available sunlight, maintenance preference, and purpose. Indoor low-maintenance plants are ideal for offices, while flowering and outdoor plants are better for open spaces and balconies.",
    },
  ];

  const filteredPlants = plants.filter(
    (plant) => plant.category?.includes(selectedCategory)
  );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const pageWidth = scrollRef.current.clientWidth;
    const currentPage = Math.round(scrollLeft / pageWidth);
    setActiveDot(currentPage);
  };

  const scrollToPage = (pageIndex) => {
    if (!scrollRef.current) return;
    const pageWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: pageWidth * pageIndex,
      behavior: "smooth",
    });
    setActiveDot(pageIndex);
  };

   useEffect(() => {
    fetch('http://localhost:5000/api/plants')
      .then(res => res.json())
      .then(data => console.log(data))  // open browser console to see
  }, []);

  return (
    <div className="w-full">

      {/* Banner Section */}
      <div className="bg-[url('/banner/banner.png')] bg-cover bg-center py-10 sm:py-12 md:py-16">
        <div className="text-center w-full px-4 sm:px-8">
          <h1 className="text-[20px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.5px] leading-[1.25] sm:leading-[1.3] px-4 sm:px-0">
            Bring Home Freshness, Beauty, and Nature One Plant at a Time
          </h1>
          <p className="text-gray-700 mt-2 sm:mt-3 text-[13px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-[inter] tracking-[0.3px] leading-[1.6] sm:leading-[1.4]">
            Explore a wide range of indoor, outdoor, medicinal, and decorative plants to suit every space and lifestyle.{" "}
            <br className="hidden md:block" />
            Choose your category, view details, and grow your green space with ease.
          </p>
        </div>

        {/* Category Circles — Mobile: carousel, Desktop: grid */}
        <div className="mt-8 sm:mt-10">

          {/* MOBILE CAROUSEL — hidden on md+ */}
          <div className="block md:hidden overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowX: "auto" }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full flex-shrink-0 snap-start grid grid-cols-4 gap-y-5 gap-x-1 px-4"
                >
                  {categories
                    .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                    .map((cat) => (
                      <div
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div
                          className={`w-[64px] h-[64px] rounded-full p-[3px] transition-all duration-200 ${
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
                        <div
                          className={`mt-[4px] text-[10px] font-[inter] px-[6px] py-[2px] rounded-full text-center leading-snug whitespace-nowrap ${
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
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-[6px] mt-5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToPage(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeDot === i
                      ? "w-[22px] h-[7px] bg-[#83B930]"
                      : "w-[7px] h-[7px] bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP GRID — hidden on mobile */}
          <div className="hidden md:block max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-5 gap-y-6 gap-x-2">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-[105px] h-[105px] lg:w-[120px] lg:h-[120px] rounded-full p-[3px] ${
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
                  <div
                    className={`mt-[3px] text-[13px] lg:text-[16px] font-[inter] px-3 py-1 rounded-full text-center leading-snug ${
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

        </div>
      </div>

      {/* Featured Plants Section */}
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
            <PlantCard key={index} plant={plant} selectedCategory={selectedCategory} />
          ))}
        </div>
      </div>

      <FaqSection title="General FAQs" faqs={faqs} />

    </div>
  );
}