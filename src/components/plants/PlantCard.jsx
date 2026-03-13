import Image from "next/image";

export default function PlantCard({ plant }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">

      {/* Plant Image */}
      <div className="relative w-full h-[180px]">
        <Image
          src={plant.image}
          alt={plant.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">

        {/* Plant Name */}
        <h3 className="text-lg font-semibold text-gray-800">
          {plant.name}
        </h3>

        {/* Price */}
        <p className="text-green-700 font-bold mt-1">
          ₹{plant.price}
        </p>

        {/* Rating */}
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          ⭐ {plant.rating}
        </div>

        {/* Add to Cart */}
        <button className="mt-3 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">
          Add to Cart
        </button>

      </div>
    </div>
  );
}