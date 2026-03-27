"use client";

import { useRouter } from "next/navigation";

export default function Sidebar({ blogs }) {
  const router = useRouter();

  return (
    <div className="space-y-6">

      {/* Recent Articles */}
      <div className="bg-gray-50 p-4 rounded-2xl">
        <p className="text-s font-semibold text-gray-400 uppercase font-[poppins] tracking-widest mb-1">
          Popular Posts
        </p>
        <h2 className="text-lg font-bold font-[poppins] text-gray-900 mb-4">
          Recent Articles
        </h2>

        {blogs.map((blog) => (
          <div
  key={blog.id}
  onClick={() => router.push(`/blogs/${blog.id}`)}
  onMouseEnter={(e) => e.currentTarget.style.borderLeft = "2px solid #3a7d44"}
  onMouseLeave={(e) => e.currentTarget.style.borderLeft = "2px solid transparent"}
  className="flex gap-3 mb-3 cursor-pointer hover:shadow-md hover:bg-white p-2 rounded-xl transition-all"
  style={{ borderLeft: "4px solid transparent" }}
>
            <img
              src={blog.image}
              alt={blog.title}
              className="w-14 h-14 object-cover rounded-lg shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-gray-800 font-[inter] leading-snug">
                {blog.title}
              </p>
              <p className="text-xs text-gray-400 font-[inter] mt-1">3 min | Read</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => router.push("/blogs")}
          className="mt-1 text-sm text-green-600 font-[inter] font-medium hover:underline"
        >
          View All →
        </button>
      </div>
     

      {/* Visit Store Card */}
<div className="bg-[#f0f7f1] border-[#c8e6c9] p-4 rounded-2xl text-center">
  <h3 className="text-base font-[poppins] font-bold text-gray-900 mb-1">
    🌿 Shop Our Plants
  </h3>
  <p className="text-xs font-[inter] text-gray-500 mb-2">
  Explore plants, pots, gifts & more — all in one place.
  </p>
 <button
  onClick={() => router.push("/plants")}
  className=" w-full font-[500] font-[inter] text-[18px] text-[#ffffff] bg-[#3d5a3e] py-2 rounded-lg hover:[background:linear-gradient(to_right,#83B930,#1992D5)] transition"
>
  Visit Our Store →
</button>
</div>

    </div>
  );
}