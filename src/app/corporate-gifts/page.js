"use client";

import { useState, useRef ,useEffect} from "react";
import { Headset, PhoneCall } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FaWhatsapp } from "react-icons/fa";
import PlantCard from "@/components/plants/PlantCard";
import { corporateGifts } from "@/data/corporate/corporateGifts";
import { categories } from "@/data/corporate/corporateCategories";
import FaqSection from "@/components/general/FaqSection";

function CorporateContent() {
  const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
      const highlightName = searchParams.get("highlight"); // ✅ read highlight param

  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl ||"Employee Appreciation");
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);
  const filteredPlants = corporateGifts.filter(
    (plant) => plant.category?.includes(selectedCategory)
  ).sort((a, b) => {
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
      question: "Can you include our company logo on the corporate gifts?",
      answer: "Yes, we can customize selected corporate gifts with your company logo and branding based on the product type and order quantity.",
    },
    {
      question: "Is there a minimum order quantity for corporate gifts?",
      answer: "Minimum order quantity depends on the product and customization type. Please contact us to discuss your specific requirement.",
    },
    {
      question: "How long does it take to fulfill corporate gift orders?",
      answer: "Order fulfillment timeline depends on the quantity and customization needs, but we always try to ensure timely delivery for your events and occasions.",
    },
    {
      question: "Can the gifts be customized for different occasions or campaigns?",
      answer: "Yes, we can customize gifts based on different occasions, events, festive campaigns, employee engagement activities, and client gifting requirements.",
    },
    {
      question: "Do you offer bulk corporate gifting solutions?",
      answer: "Yes, we provide bulk corporate gifting solutions for companies, teams, events, clients, and promotional requirements.",
    },
    {
      question: "Can you help us choose suitable gifts based on our budget?",
      answer: "Yes, we can suggest suitable corporate gifting options based on your budget, quantity, branding needs, and occasion.",
    },
  ];

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

  return (
    <div className="w-full">

      {/* Banner Section */}
      <div className="bg-[url('/banner/banner.png')] bg-cover bg-center py-10 sm:py-12 md:py-16">
        <div className="text-center w-full px-4 sm:px-8">
          <h1 className="text-[20px] sm:text-[26px] md:text-[30px] lg:text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.5px] leading-[1.25] sm:leading-[1.3] px-4 sm:px-0">
            Corporate Gifting Solutions with a Touch of Green
          </h1>
          <p className="text-gray-700 mt-2 sm:mt-3 text-[13px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-[inter] tracking-[0.3px] leading-[1.6] sm:leading-[1.4]">
            Explore premium corporate plant gifts ideal for client appreciation, employee engagement, festive hampers, and business events.{" "}
            <br className="hidden md:block" />
            Select thoughtful gifting options that reflect your brand values while creating a memorable and refreshing experience.
          </p>
        </div>

        {/* Category Circles */}
        <div className="mt-8 sm:mt-10">

          {/* MOBILE CAROUSEL */}
<div className="block md:hidden overflow-hidden">
  <div
    ref={scrollRef}
    onScroll={handleScroll}
    className="flex snap-x snap-mandatory"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowX: "auto" }}
  >
    {Array.from({ length: totalPages }).map((_, pageIndex) => (
      <div
        key={pageIndex}
        className="min-w-full flex-shrink-0 snap-start grid grid-cols-4 gap-y-5 gap-x-2 px-4"
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
                className={`w-[76px] h-[76px] rounded-full p-[3px] transition-all duration-200 ${
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
                className={`mt-[4px] text-[10px] font-[inter] px-[6px] py-[2px] rounded-full text-center leading-snug ${
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
  {totalPages > 1 && (
    <div className="flex justify-center gap-[6px] mt-5">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => scrollToPage(i)}
          className={`rounded-full transition-all duration-300 ${
            activeDot === i
              ? "w-[22px] h-[7px] bg-[#83B930]"
              : "w-[7px] h-[7px] bg-gray-300"
          }`}
        />
      ))}
    </div>
  )}
</div>

          {/* DESKTOP GRID */}
          <div className="hidden md:block max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-5 gap-y-6 gap-x-3">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`w-[140px] h-[140px] lg:w-[164px] lg:h-[164px] rounded-full p-[4px] ${
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
                    className={`mt-[2px] text-[14px] lg:text-[16px] font-[inter] px-3 py-1 rounded-full text-center leading-snug ${
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

      {/* Featured Products Section */}
      <div className="w-full px-4 sm:px-6 md:px-[40px] py-6 sm:py-8 md:py-[24px] bg-[#f8faf7]">
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
            <PlantCard key={index} plant={plant} selectedCategory={selectedCategory} isHighlighted={plant.name === highlightName}/>
          ))}
        </div>
      </div>

      {/* Call Now Banner */}
<div className="w-full px-4 sm:px-6 md:px-[32px] pt-4 sm:pt-5 pb-8 sm:pb-10 md:pb-12 bg-[#f8faf7]">
        <div className="w-full rounded-[20px] md:rounded-[24px] bg-[url('/banner/banner.png')] bg-cover bg-center px-4 sm:px-6 md:px-[28px] py-5 sm:py-6 md:py-[22px] border border-[#e4ebe1] shadow-[0_6px_18px_rgba(0,0,0,0.05)]">

          {/* Desktop layout */}
          <div className="hidden sm:flex items-center gap-[18px]">
            <div className="w-[64px] h-[64px] rounded-full bg-[#edf5e8] flex items-center justify-center shrink-0 border border-[#dfe8da]">
              <Headset size={30} className="text-[#15803d]" strokeWidth={2.2} />
            </div>
            <div className="max-w-[900px]">
              <h3 className="text-[20px] md:text-[22px] lg:text-[25px] font-[600] font-[poppins] text-slate-800 leading-[1.25] tracking-[0.5px]">
                Let's Connect for Your Corporate Gifting Requirements
              </h3>
              <div className="mt-[12px] flex flex-wrap items-center gap-[14px]">
                
                 <a href="tel:+918282888600"
                  className="inline-flex items-center gap-[10px] rounded-full bg-white/90 px-[18px] py-[10px] border border-[#e3e8e0] text-slate-700 hover:border-[#15803d] hover:text-[#15803d] transition hover:-translate-y-0.5"
                >
                  <PhoneCall size={18} strokeWidth={2.2} />
                  <span className="text-[15px] md:text-[16px] font-[500] font-[inter]">
                    Call us: +91 82828 88600
                  </span>
                </a>
                
                 <a href="https://wa.me/8282888600"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-[10px] rounded-full bg-white/90 px-[18px] py-[10px] border border-[#e3e8e0] text-slate-700 hover:border-[#15803d] hover:text-[#15803d] transition hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="text-[18px]" />
                  <span className="text-[15px] md:text-[16px] font-[500] font-[inter]">
                    Chat on WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex flex-col items-center text-center gap-4 sm:hidden">
            <div className="w-[52px] h-[52px] rounded-full bg-[#edf5e8] flex items-center justify-center border border-[#dfe8da]">
              <Headset size={24} className="text-[#15803d]" strokeWidth={2.2} />
            </div>
            <h3 className="text-[16px] font-[600] font-[poppins] text-slate-800 leading-[1.3] tracking-[0.3px]">
              Let's Connect for Your Corporate Gifting Requirements
            </h3>
            <div className="flex flex-col w-full gap-[10px]">
              
               <a href="tel:+918282888600"
                className="inline-flex items-center justify-center gap-[8px] rounded-full bg-white/90 px-[16px] py-[10px] border border-[#e3e8e0] text-slate-700 active:border-[#15803d] active:text-[#15803d] transition"
              >
                <PhoneCall size={16} strokeWidth={2.2} />
                <span className="text-[14px] font-[500] font-[inter]">
                  Call us: +91 82828 88600
                </span>
              </a>
              
                <a href="https://wa.me/8282888600"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-[8px] rounded-full bg-white/90 px-[16px] py-[10px] border border-[#e3e8e0] text-slate-700 active:border-[#15803d] active:text-[#15803d] transition"
              >
                <FaWhatsapp className="text-[16px]" />
                <span className="text-[14px] font-[500] font-[inter]">
                  Chat on WhatsApp
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ Section */}
      <FaqSection title="General FAQs" faqs={faqs} />

    </div>
  );
}

export default function CorporatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf7]" />}>
      <CorporateContent />
    </Suspense>
  );
}