import Image from "next/image";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          rating >= star ? 100 : rating >= star - 1 ? (rating - (star - 1)) * 100 : 0;
        return (
          <div key={star} className="relative w-3.5 h-3.5 sm:w-4 sm:h-4">
            <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-gray-300" fill="currentColor">
              <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor">
                <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PlantCard({ plant, selectedCategory }) {
  return (
    <div className="group rounded-xl p-[2px] bg-transparent hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition-all duration-300 hover:-translate-y-0.5 h-full">
      <div className="bg-white rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">

        {/* Image */}
        <div className="relative w-full h-[160px] sm:h-[185px] md:h-[200px] lg:h-[210px] overflow-hidden">
          <Image
            src={plant.image1}
            alt={plant.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
          />
          <Image
            src={plant.image2}
            alt={plant.name}
            fill
            className="object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.06]"
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3 className="text-[15px] sm:text-[17px] md:text-[18px] font-[600] font-[inter] text-gray-700 leading-snug">
            {plant.name}
          </h3>

          {/* Category Tags */}
          {plant.category
            ?.filter((cat) => cat !== selectedCategory)
            .slice(0, 2).length > 0 && (
            <div className="flex flex-wrap gap-[5px] mt-2">
              {plant.category
                ?.filter((cat) => cat !== selectedCategory)
                .slice(0, 2)
                .map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] sm:text-[11px] md:text-[12px] font-[500] font-[inter] px-2 py-[3px] rounded-lg bg-[#eef2f7] text-gray-600"
                  >
                    {cat}
                  </span>
                ))}
            </div>
          )}

          {/* Price + Rating */}
{/* Price + Rating */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[3px] sm:gap-2 mt-2 mb-2">
  <p className="text-[15px] sm:text-[16px] md:text-[18px] font-[inter] font-[600] text-gray-800 whitespace-nowrap">
    ₹{plant.price}
  </p>
  <div className="flex items-center gap-1">
    <StarRating rating={plant.rating} />
    <span className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-500 font-[inter] whitespace-nowrap">
      {plant.rating} ({plant.review})
    </span>
  </div>
</div>

          {/* Button */}
          <button className="mt-auto w-full font-[500] font-[inter] text-[14px] sm:text-[15px] md:text-[16px] text-white bg-[#3d5a3e] py-[9px] sm:py-[10px] rounded-lg hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}