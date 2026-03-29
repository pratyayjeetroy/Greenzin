"use client";

import { useRouter } from "next/navigation";

export default function RelatedPosts({ blogs }) {
  const router = useRouter();

  return (
    <div className="mt-4">
      <h2 className="text-[20px] md:text-[25px] font-semibold font-[poppins] text-gray-900 mb-4">
        Related Posts
      </h2>

      {/* Mobile: horizontal card (image left + text right) | Desktop: 3 col grid */}
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/blogs/${blog.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-[2px] border border-transparent hover:border-[#e5e7eb] transition-all duration-300 cursor-pointer overflow-hidden flex flex-row md:flex-col"
          >
            {/* IMAGE — small left on mobile, full width on desktop */}
            {/* <img
              src={blog.image}
              alt={blog.title}
              className="w-[110px] md:w-full md:h-[175px] object-cover shrink-0 self-stretch"
            /> */}
            <div className="w-[120px] aspect-[3/2] md:w-full md:h-[175px] shrink-0">
  <img
    src={blog.image}
    alt={blog.title}
className="w-full h-full object-contain md:object-cover bg-[#e8e8e8] md:bg-transparent rounded-l-xl md:rounded-none"  />
</div>

            {/* CONTENT */}
            <div className="p-3 md:p-4 flex flex-col justify-center">
              <h3 className="text-[14px] md:text-[17px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="mt-1 text-[12px] md:text-[15px] font-[inter] text-gray-600 line-clamp-2 leading-tight">
                {blog.excerpt}
              </p>
              <p className="mt-1 text-[#3a7d44] text-[12px] md:text-[13px] font-[inter] font-medium">
                Read More →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}