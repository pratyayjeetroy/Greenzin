import Image from "next/image";
import Link from "next/link";

const RELATED_PRODUCTS = [
  {
    id: "zz-plant",
    name: "ZZ Plant",
    price: "$14.99",
    rating: 4.7,
    reviews: 132,
    image: "/home/category.png",
    href: "/products/zz-plant",
    badge: "Best Seller",
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    price: "$22.99",
    rating: 4.9,
    reviews: 89,
    image: "/home/floweringPlants.jpeg",
    href: "/products/peace-lily",
    badge: "Top Rated",
  },
  {
    id: "pothos",
    name: "Golden Pothos",
    price: "$12.99",
    rating: 4.8,
    reviews: 214,
    image: "/home/airPurifyingPlants.jpeg",
    href: "/products/golden-pothos",
    badge: null,
  },
  {
    id: "money-plant",
    name: "Money Plant",
    price: "$9.99",
    rating: 4.6,
    reviews: 167,
    image: "/home/vastuPlants.jpeg",
    href: "/products/money-plant",
    badge: "Vastu",
  },
];

const RelatedProductCard = ({ product }) => (
  <Link
    href={product.href}
    className="group relative flex flex-col rounded-2xl border border-[#e8e8e8] bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
  >
    {/* Badge */}
    {product.badge && (
      <span className="absolute top-3 left-3 z-10 rounded-full bg-[#3d5a3e] px-2.5 py-0.5 text-[10px] font-bold text-white">
        {product.badge}
      </span>
    )}

    {/* Image */}
    <div className="relative mb-3 w-full aspect-square overflow-hidden rounded-xl bg-[#f7f7f5]">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    {/* Info */}
    <h3 className="text-[13px] font-bold text-[#2d2d2d] sm:text-[14px]">{product.name}</h3>

    <div className="mt-1 flex items-center gap-1">
      <svg className="h-3.5 w-3.5 text-[#e5b248]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-[11px] text-[#7a7a7a]">
        {product.rating} ({product.reviews})
      </span>
    </div>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-[15px] font-bold text-[#2d2d2d]">{product.price}</span>
      <span className="rounded-full bg-[#3d5a3e]/10 px-3 py-1 text-[11px] font-semibold text-[#3d5a3e] group-hover:bg-[#3d5a3e] group-hover:text-white transition-colors duration-200">
        View
      </span>
    </div>
  </Link>
);

/**
 * "You may also like" section below the main product area.
 */
const RelatedProducts = () => {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#2d2d2d] sm:text-[22px]">
          You May Also <span className="text-[#3d5a3e]">Like</span>
        </h2>
        <Link
          href="/plants"
          className="bg-brand-gradient shrink-0 rounded-full px-4 py-1.5 text-[12px] text-white hover:opacity-90 transition-opacity"
        >
          View All &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {RELATED_PRODUCTS.map((p) => (
          <RelatedProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
