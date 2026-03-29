"use client";

import { useRouter } from "next/navigation";
import { blogs } from "@/data/blogs";

export default function BlogsPage() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#f8faf7] py-6 md:py-8 px-4 md:px-8">

      {/* TITLE */}
      <h1 className="text-[24px] md:text-[33px] font-semibold font-[poppins] mb-4 md:mb-6">
        All Blogs
      </h1>

      {/* GRID: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/blogs/${blog.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-[2px] border border-transparent hover:border-[#e5e7eb] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={blog.image}
              className="w-full h-[180px] md:h-[210px] object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-[16px] md:text-[17px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="mt-1 text-[14px] md:text-[15px] font-[inter] text-gray-600 line-clamp-2 leading-tight">
                {blog.excerpt}
              </p>
              <p className="mt-2 text-[#3a7d44] text-[13px] font-[inter] font-medium">
                Read More →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}