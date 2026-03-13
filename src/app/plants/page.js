"use client";

import { useState } from "react";
import PlantCard from "@/components/plants/PlantCard";
import { plants } from "@/data/plants";
import { categories } from "@/data/plantCategories";

export default function PlantsPage() {

  const [selectedCategory, setSelectedCategory] = useState("Indoor Plants");

  const filteredPlants = plants.filter(
    (plant) => plant.category === selectedCategory
  );

  return (
    <div className="w-full">

      {/* Banner Section */}

      <div className="w-screen bg-[url('/banner/banner.png')] bg-cover bg-center py-16">

        <div className="text-center w-full">

          <h1 className="text-[30px] font-semibold text-slate-700 font-[tinos] tracking-[1px]">
            Bring Home Freshness One Plant at a Time
          </h1>

          <p className="text-gray-600 mt-4">
            Explore a wide range of indoor, outdoor, medicinal, and decorative plants.
            Choose your category and grow your green space with ease.
          </p>

        </div>

        {/* Category Circles */}

        <div className="max-w-7xl mx-auto mt-10 px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">

          {categories.map((cat) => (

            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >

              <div
                className={`w-28 h-28 rounded-full overflow-hidden border-4
                ${selectedCategory === cat.name
                    ? "border-green-700"
                    : "border-gray-200"}
                `}
              >

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />

              </div>

              <p className="mt-2 text-sm font-medium">
                {cat.name}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Featured Plants Section */}

      <div className="max-w-7xl mx-auto px-6 py-14">

        <h2 className="text-2xl font-semibold text-center">
          Featured Plants
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-10">
          Showing results for {selectedCategory}
        </p>

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