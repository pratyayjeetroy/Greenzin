"use client";

import { useRouter } from "next/navigation";
import { blogs } from "@/data/blogs";

export default function BlogsPage() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#f8faf7] py-[2vw] px-[4vw]">
      
      {/* TITLE */}
      <h1 className="text-[33px] font-semibold font-[poppins] mb-[1vw]">
        All Blogs
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-4 gap-[2vw]">

        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/blogs/${blog.id}`)}
           className="bg-white rounded-[1vw] shadow-md hover:shadow-xl hover:-translate-y-[2px] border border-transparent hover:border-[#e5e7eb] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            
            {/* IMAGE */}
            <img
              src={blog.image}
              className="w-full h-[200px] object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-[17px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="mt-1 text-[15px] font-[inter] text-gray-600 line-clamp-2 leading-tight">
                {blog.excerpt}
              </p>
              <p className="mt-1 text-[#3a7d44] text-gray-600 text-[13px] font-[inter] font-medium">
                Read More →
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}