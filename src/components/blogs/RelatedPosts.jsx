"use client";

import { useRouter } from "next/navigation";

export default function RelatedPosts({ blogs }) {
  const router = useRouter();

  return (
    <div className="mt-4">
      <h2 className="text-[20px] md:text-[25px] font-semibold font-[poppins] text-gray-900 mb-4">
        Related Posts
      </h2>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/blogs/${blog.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-[2px] border border-transparent hover:border-[#e5e7eb] transition-all duration-300 cursor-pointer overflow-hidden flex flex-row md:flex-col"
          >
            {/* IMAGE */}
            {/* Mobile: fixed width + fixed height | Desktop: full width + aspect ratio */}
            <div className="w-[110px] h-[100px] md:w-full md:h-auto md:aspect-[3/2] shrink-0 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover rounded-l-xl md:rounded-t-xl md:rounded-l-none"
              />
            </div>

            {/* CONTENT */}
            <div className="p-3 md:p-4 flex flex-col justify-center flex-1 min-w-0">
              <h3 className="text-[13px] md:text-[16px] font-semibold font-[poppins] text-gray-900 line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="mt-1 text-[11px] md:text-[14px] font-[inter] text-gray-600 line-clamp-2 leading-tight">
                {blog.excerpt}
              </p>
              <p className="mt-1 md:mt-2 text-[#3a7d44] text-[11px] md:text-[13px] font-[inter] font-medium">
                Read More →
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}