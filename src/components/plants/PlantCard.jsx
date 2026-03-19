import Image from "next/image";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          rating >= star ? 100 : rating >= star - 1 ? (rating - (star - 1)) * 100 : 0;

        return (
          <div key={star} className="relative w-4 h-4">
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 w-full h-full text-gray-300"
              fill="currentColor"
            >
              <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
            </svg>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
              >
                <path d="M12 2l2.9 6.26 6.9.6-5.2 4.73 1.56 6.81L12 16.9 5.84 20.4 7.4 13.59 2.2 8.86l6.9-.6L12 2z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// export default function PlantCard({ plant }) {
//   return (
//     <div className="group rounded-xl p-[2px] bg-transparent hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition-all duration-300 hover:-translate-y-0.5">
//       <div className="bg-white rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
//         <div className="relative w-full h-[180px] overflow-hidden">
          
//           <Image
//     src={plant.image1}
//     alt={plant.name}
//     fill
//     className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
//   />

//   <Image
//     src={plant.image2}
//     alt={plant.name}
//     fill
//     className="object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.06]"
//   />

//         </div>

//         <div className="p-4">
//           <h3 className="text-[20px] font-[600] font-[inter] text-gray-700">
//             {plant.name}
//           </h3>
          
//           <div className="flex items-start justify-between gap-2 mt-2">
//   <p className="text-gray-800 text-[18px] font-[inter] font-[600]">
//     ₹{plant.price}
//   </p>

//   <div className="flex flex-wrap justify-end gap-1 max-w-[60%]">
//     {plant.category?.slice(1, 3).map((cat) => (
//       <span
//         key={cat}
//         className="text-[11px] font-[500] font-[inter] px-2 py-[3px] rounded-full bg-gray-100 text-gray-700 whitespace-nowrap"
//       >
//         {cat}
//       </span>
//     ))}
//   </div>
// </div>
//           <div className="flex items-center gap-2 mt-1">
//         <StarRating rating={plant.rating}  />
//         <span className="text-sm text-gray-600 font-[inter]">
//         {plant.rating}  ({plant.review})
//         </span>
//       </div>


//           <button className="mt-3 w-full font-[500] font-[inter] text-[18px] text-[#ffffff] bg-[#3d5a3e] py-2 rounded-lg hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default function PlantCard({ plant }) {
//   return (
//     <div className="group rounded-xl p-[2px] bg-transparent hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition-all duration-300 hover:-translate-y-0.5">
//       <div className="bg-white rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
//         <div className="relative w-full h-[180px] overflow-hidden">
//           <Image
//             src={plant.image1}
//             alt={plant.name}
//             fill
//             className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
//           />

//           <Image
//             src={plant.image2}
//             alt={plant.name}
//             fill
//             className="object-cover opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.06]"
//           />
//         </div>

//         <div className="p-4">
//           <h3 className="text-[20px] font-[600] font-[inter] text-gray-700">
//             {plant.name}
//           </h3>

//           {plant.category?.length > 1 && (
//             <div className="flex flex-wrap gap-2 mt-2">
//               {plant.category.slice(1, 3).map((cat) => (
//                 <span
//                   key={cat}
//                   className="text-[11px] font-[500] font-[inter] px-2 py-[4px] rounded-full bg-[#f1f5f9] text-gray-700"
//                 >
//                   {cat}
//                 </span>
//               ))}
//             </div>
//           )}

//           <p className="text-gray-800 text-[18px] font-[inter] font-[600] mt-2">
//             ₹{plant.price}
//           </p>

//           <div className="flex items-center gap-2 mt-1">
//             <StarRating rating={plant.rating} />
//             <span className="text-sm text-gray-600 font-[inter]">
//               {plant.rating} ({plant.review})
//             </span>
//           </div>

//           <button className="mt-3 w-full font-[500] font-[inter] text-[18px] text-[#ffffff] bg-[#3d5a3e] py-2 rounded-lg hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function PlantCard({ plant , selectedCategory}) {
  return (
    <div className="group rounded-xl p-[2px] bg-transparent hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="bg-white rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative w-full h-[200px] overflow-hidden">
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

        <div className="p-4">
          <h3 className="text-[20px] font-[600] font-[inter] text-gray-700">
            {plant.name}
          </h3>

          {plant.category
  ?.filter((cat) => cat !== selectedCategory)
  .slice(0, 2).length > 0 && (
  <div className="flex flex-wrap gap-[6px] mt-2.5">
    {plant.category
      ?.filter((cat) => cat !== selectedCategory)
      .slice(0, 2)
      .map((cat) => (
        <span
          key={cat}
          className="text-[12px] font-[500] font-[inter] px-2 py-[4px] rounded-lg bg-[#eef2f7] text-gray-700"
        >
          {cat}
        </span>
      ))}
  </div>
)}

          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="text-gray-800 text-[18px] font-[inter] font-[600] whitespace-nowrap">
              ₹{plant.price}
            </p>

            <div className="flex items-center gap-2">
              <StarRating rating={plant.rating} />
              <span className="text-[14px]text-gray-600 font-[inter] whitespace-nowrap">
                {plant.rating} ({plant.review})
              </span>
            </div>
          </div>

          <button className="mt-3 w-full font-[500] font-[inter] text-[18px] text-[#ffffff] bg-[#3d5a3e] py-2 rounded-lg hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

