"use client";

import { useState } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { plants } from "@/data/plants";
import { categories } from "@/data/potCategories";

export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Plastic Pots");

  const filteredPlants = plants.filter(
    (plant) => plant.category === selectedCategory
  );

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

      <div className="w-full px-[40px] py-[24px] border">
<h2 className="text-[33px] font-[600] font-[poppins] text-slate-800 text-center mb-10">
  Featured {selectedCategory}
</h2>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {filteredPlants.map((plant, index) => (
            <PlantCard key={index} plant={plant} />
          ))}

        </div>

      </div>

    </div>
  );
}