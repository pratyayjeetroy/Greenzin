"use client";

import { useState } from "react";
import { Headset, PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PlantCard from "@/components/plants/PlantCard";
import { gifts } from "@/data/gifting";
import { categories } from "@/data/giftingCategories";
import FaqSection from "@/components/general/FaqSection";


export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Birthday");


  const filteredPlants = gifts.filter(
    (plant) => plant.category?.includes(selectedCategory)
  );
const faqs = [
  {
    question: "Do you offer bulk gifting for personal and special occasions?",
    answer:
      "Yes, we offer gifting solutions for bulk orders for birthdays, anniversaries, festive occasions, return gifts, and special events.",
  },
  {
    question: "Can the gifts be customized?",
    answer:
      "Yes, selected gifts can be customized with special packaging, tags, messages, and personalized touches based on your requirements.",
  },
  {
    question: "Do you deliver gifts across India?",
    answer:
      "Yes, we deliver to multiple locations across India depending on the product and delivery availability.",
  },
  {
    question: "What types of gifts are available?",
    answer:
      "We offer a wide variety of gifts including plants, pots, hampers, decorative items, festive gifts, and customized gifting options.",
  },
  {
    question: "Can you help me choose a gift based on the occasion?",
    answer:
      "Yes, we can suggest suitable gifting options based on the occasion, budget, recipient type, and customization preference.",
  },
  {
    question: "Are gifting options available for festivals and special celebrations?",
    answer:
      "Yes, we provide gifting options for festivals, birthdays, anniversaries, housewarming, weddings, and many other special celebrations.",
  },
];

  return (
    <div className="w-full">

      {/* Banner Section */}

      <div className=" bg-[url('/banner/banner.png')] bg-cover bg-center py-16">
      <div className="text-center w-full">
  <h1 className="text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.7px] leading-[1.3]">
  Thoughtful Plant Gifts for Every Celebration
</h1>

<p className="text-gray-700 mt-3 text-[19px] font-[inter] tracking-[0.5px] leading-[1.4]">
  Find meaningful and elegant plant gifts for birthdays, anniversaries, housewarmings, appreciation, and other special occasions. <br />
  Browse by category, explore curated gift ideas, and share a refreshing touch of greenery with your loved ones.
</p>
</div>

      

        {/* Category Circles */}

        <div className="max-w-5xl mx-auto mt-10 px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-6 gap-x-3 ">

          {categories.map((cat) => (

            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
  className={`w-[164px] h-[164px] rounded-full p-[4px] ${
    selectedCategory === cat.name
      ? "bg-brand-gradient"
      : "bg-gray-200"
  }`}
>
  <div className="w-[156px] h-[156px] rounded-full overflow-hidden bg-white">
    <img
      src={cat.image}
      alt={cat.name}
      className="w-full h-full object-cover"
    />
  </div>
</div>

<div
  className={`mt-[2px] text-[18px]  font-[inter] px-3 py-1 rounded-full inline-block ${
    selectedCategory === cat.name
      ? "bg-brand-gradient text-white font-[500]"
      : "bg-none text-gray-700 font-[600]"
  }`}
>
  {cat.name}
</div>

            </div>

          ))}

        </div>

      </div>

      {/* Featured Plants Section */}

      <div className="w-full px-[40px] py-[24px] bg-[#f8faf7]">
<h2 className="text-[33px] font-[600] font-[poppins] text-slate-800 text-center mb-10">
  Featured {selectedCategory}
</h2>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {filteredPlants.map((plant, index) => (
            <PlantCard key={index} plant={plant} selectedCategory={selectedCategory} />
          ))}

        </div>

      </div>

                <div className="w-full px-[32px] pb-[18px] pt-[18px] bg-[#f8faf7]">
  <div className="w-full rounded-[24px] bg-[url('/banner/banner.png')] bg-cover bg-center px-[28px] py-[22px] border border-[#e4ebe1] shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
    <div className="flex items-center gap-[18px]">
      
      <div className="w-[64px] h-[64px] rounded-full bg-[#edf5e8] flex items-center justify-center shrink-0 border border-[#dfe8da]">
        <Headset size={30} className="text-[#15803d]" strokeWidth={2.2} />
      </div>

      <div className="max-w-[900px]">
        <h3 className="text-[25px] font-[600] font-[poppins] text-slate-800 leading-[1.25] tracking-[0.5px]">
          Let’s Connect for Your Corporate Gifting Requirements
        </h3>

        <div className="mt-[12px] flex flex-wrap items-center gap-[14px]">
          <a
            href="tel:+918282888600"
            className="inline-flex items-center gap-[10px] rounded-full bg-white/90 px-[18px] py-[10px] border border-[#e3e8e0] text-slate-700 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:border-[#15803d] hover:text-[#15803d] transition hover:-translate-y-0.5"
          >
            <PhoneCall size={18} strokeWidth={2.2} />
            <span className="text-[16px] font-[500] font-[inter]">
              Call us: +91 82828 88600
            </span>
          </a>

          <a
            href="https://wa.me/8282888600"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[10px] rounded-full bg-white/90 px-[18px] py-[10px] border border-[#e3e8e0] text-slate-700 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:border-[#15803d] hover:text-[#15803d] transition hover:-translate-y-0.5"
          >
            <FaWhatsapp className="text-[18px] " />
            <span className="text-[16px] font-[500] font-[inter]">
              Chat on WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* FAQ Section */}
      {/* <div className="w-full px-[40px] pb-[40px] bg-[#f8faf7]">
        <h2 className="text-[32px] font-[600] font-[poppins] text-slate-800 text-center mb-[24px]">
          General FAQs
        </h2>

        <div className="flex flex-col gap-[14px]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#d7d9de] rounded-[14px] shadow-l overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-[22px] py-[18px] flex items-center justify-between text-left"
              >
                <p className="text-[20px] font-[500] font-[inter] text-slate-800">
                  {faq.question}
                </p>
                <span className="text-[30px] text-slate-800 leading-none cursor-pointer">
                  {openFaq === index ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-[22px] pb-[18px]">
                  <p className="text-[17px] font-[inter] text-slate-800 leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div> */}
   <FaqSection title="General FAQs" faqs={faqs} />
    </div>
  );
}