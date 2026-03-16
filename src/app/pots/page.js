"use client";

import { useState } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { plants } from "@/data/pots";
import { categories } from "@/data/potCategories";
import FaqSection from "@/components/general/FaqSection";


export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Plastic Pots");

  const filteredPlants = plants.filter(
    (plant) => plant.category?.includes(selectedCategory)
  );
  const faqs = [
  {
    question: "What types of pots are available?",
    answer:
      "We offer different types of pots including ceramic pots, plastic pots, metal pots, decorative pots, hanging pots, tabletop planters, and modern designer planters.",
  },
  {
    question: "Which pots are best for indoor plants?",
    answer:
      "Ceramic pots, decorative planters, and compact tabletop pots are great for indoor plants because they look elegant and fit well in home and office spaces.",
  },
  {
    question: "Do you have pots for outdoor use?",
    answer:
      "Yes, we offer outdoor pots that are durable and suitable for balconies, terraces, patios, and gardens.",
  },
  {
    question: "Are lightweight pots available?",
    answer:
      "Yes, lightweight pots such as plastic and certain fiber planters are available and are easy to move and maintain.",
  },
  {
    question: "Do you offer decorative and designer pots?",
    answer:
      "Yes, we have decorative and designer pots in different colors, shapes, and finishes to match various home and office interiors.",
  },
  {
    question: "Which pot size should I choose for my plant?",
    answer:
      "The pot size depends on the plant type and root growth. A slightly larger pot than the current root size is usually recommended for healthy growth.",
  },
  {
    question: "Do the pots come with drainage holes?",
    answer:
      "Many of our pots come with drainage holes, which help prevent overwatering and support better plant health. Availability may vary depending on the pot design.",
  },
  {
    question: "Are these pots suitable for gifting?",
    answer:
      "Yes, many of our pots are selected especially for gifting and are available in stylish, decorative, and premium designs.",
  },
  {
    question: "Can I get pots in different colors and shapes?",
    answer:
      "Yes, we offer pots in a variety of colors, shapes, sizes, and styles to suit different décor preferences.",
  },
  {
    question: "How do I clean and maintain decorative pots?",
    answer:
      "Most decorative pots can be cleaned easily with a soft cloth and mild water cleaning. Proper handling and regular dusting help maintain their look for a long time.",
  },
];

  return (
    <div className="w-full">

      {/* Banner Section */}

      <div className=" bg-[url('/banner/banner.png')] bg-cover bg-center py-16">
      <div className="text-center w-full">
  <h1 className="text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.7px] leading-[1.3]">
  Find the Perfect Pots and Planters for Every Space
</h1>

<p className="text-gray-700 mt-3 text-[19px] font-[inter] tracking-[0.5px] leading-[1.4]">
  Explore a versatile range of decorative pots and planters crafted to match every plant, style, and setting. <br />
  Choose the perfect design to complement your plants and enhance your décor with ease.
</p>
</div>

      

        {/* Category Circles */}

        <div className="max-w-7xl mx-auto mt-10 px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-y-6 gap-x-2 ">

          {categories.map((cat) => (

            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
  className={`w-[120px] h-[120px] rounded-full p-[4px] ${
    selectedCategory === cat.name
      ? "bg-brand-gradient"
      : "bg-gray-200"
  }`}
>
  <div className="w-[112px] h-[112px] rounded-full overflow-hidden bg-white">
    <img
      src={cat.image}
      alt={cat.name}
      className="w-full h-full object-cover"
    />
  </div>
</div>

<div
  className={`mt-[2px] text-[16px]  font-[inter] px-3 py-1 rounded-full inline-block ${
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
   <FaqSection title="General FAQs" faqs={faqs} />

    </div>
  );
}