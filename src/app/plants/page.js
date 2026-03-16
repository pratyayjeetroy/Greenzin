"use client";

import { useState } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { plants } from "@/data/plants";
import { categories } from "@/data/plantCategories";
import FaqSection from "@/components/general/FaqSection";


export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Indoor Plants");
  const faqs = [
  {
    question: "What are the different categories of plants available?",
    answer:
      "We offer a wide range of plant categories including indoor plants, outdoor plants, flowering plants, air-purifying plants, succulents, bonsai plants, hanging plants, and low-maintenance plants.",
  },
  {
    question: "Which plants are best suited for indoor spaces?",
    answer:
      "Indoor plants such as snake plant, pothos, peace lily, lucky bamboo, ZZ plant, and syngonium are popular choices because they are easy to maintain and adapt well to indoor conditions.",
  },
  {
    question: "Do you have outdoor plants for balconies, terraces, or gardens?",
    answer:
      "Yes, we offer outdoor plants that are suitable for balconies, terraces, patios, and gardens, including flowering plants, decorative foliage plants, and hardy green plants.",
  },
  {
    question: "Do you offer flowering plants?",
    answer:
      "Yes, we have flowering plants in different varieties that can add color and freshness to homes, balconies, gardens, and office spaces.",
  },
  {
    question: "Which plants are low-maintenance and easy to care for?",
    answer:
      "Low-maintenance plants like snake plant, jade plant, aloe vera, ZZ plant, cactus, and succulents are great options for beginners and busy plant owners.",
  },
  {
    question: "Do you have plants that help purify indoor air?",
    answer:
      "Yes, we offer air-purifying plants such as areca palm, spider plant, peace lily, pothos, and snake plant, which are commonly chosen for indoor environments.",
  },
  {
    question: "How often should I water my plants?",
    answer:
      "Watering depends on the type of plant, pot size, and environment. In general, most indoor plants should be watered only when the top layer of soil feels dry.",
  },
  {
    question: "How much sunlight do plants need?",
    answer:
      "Sunlight requirements vary by plant category. Some plants thrive in bright indirect light, while others prefer direct sunlight or partial shade. We recommend checking the care needs of each plant before purchase.",
  },
  {
    question: "Do you provide plant care tips for beginners?",
    answer:
      "Yes, we share basic care tips such as watering guidance, sunlight needs, pot placement, soil care, and general maintenance to help beginners care for their plants easily.",
  },
  {
    question: "How do I choose the right plant for my home or office?",
    answer:
      "The right plant depends on the space, available sunlight, maintenance preference, and purpose. Indoor low-maintenance plants are ideal for offices, while flowering and outdoor plants are better for open spaces and balconies.",
  },
];

  const filteredPlants = plants.filter(
  (plant) => plant.category?.includes(selectedCategory)
);

  return (
    <div className="w-full">

      {/* Banner Section */}

      <div className=" bg-[url('/banner/banner.png')] bg-cover bg-center py-16">
      <div className="text-center w-full">
  <h1 className="text-[33px] font-[600] text-slate-700 font-[poppins] tracking-[0.7px] leading-[1.3]">
    Bring Home Freshness, Beauty, and Nature One Plant at a Time
  </h1>

  <p className="text-gray-700 mt-3 text-[19px] font-[inter] tracking-[0.5px] leading-[1.4] ">
Explore a wide range of indoor, outdoor, medicinal, and decorative plants to suit every space and lifestyle.    <br />
    Choose your category, view details, and grow your green space with ease.
  </p>
</div>

      

        {/* Category Circles */}

        <div className="max-w-7xl mx-auto mt-10 px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-6 gap-x-2 ">

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