"use client";

import { useParams } from "next/navigation";
import { blogs } from "@/data/blogs";
import BlogContent from "@/components/blogs/BlogContent";
import Sidebar from "@/components/blogs/Sidebar";
import RelatedPosts from "@/components/blogs/RelatedPosts";

export default function BlogDetailPage() {
  const { id } = useParams();

  const blogId = Array.isArray(id) ? id[0] : id;

  const selectedBlog = blogs.find((b) => b.id === Number(blogId));

  if (!selectedBlog) {
    return <div className="p-8 text-gray-500">Blog not found</div>;
  }

  const relatedBlogs = blogs
    .filter((b) => selectedBlog.relatedIds?.includes(b.id))
    .slice(0, 3);

  const sidebarBlogs = blogs.slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-white  pt-8">
      <div className="max-w-6xl mx-auto ">

        {/* ── MAIN ROW: scrollable content + sticky sidebar ── */}
        <div style={{ display: "flex", flexDirection: "row", gap: "2rem", padding: "2rem", alignItems: "flex-start" }}>

          {/* LEFT — Scrollable content column */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              maxHeight: "80vh",
              overflowY: "auto",
              paddingRight: "1rem",
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
            <h1 className="text-[33px] font-bold tracking-[0.5px] leading-[1.3] font-[poppins] font-[600]  text-slate-800   mb-2"> 

              {selectedBlog.title}
            </h1>

            <p className="text-[18px] font-[poppins] tracking-[0.5px] font-[500] text-gray-800 mb-4">
              {selectedBlog.excerpt}
            </p>

            {/* Floated image — content wraps around it */}
            <div style={{ overflow: "hidden" }}>
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                style={{
                  float: "right",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginLeft: "1.5rem",
                  marginBottom: "1rem",
                }}
              />
              <BlogContent blog={selectedBlog} />
            </div>

            {/* CTA Button */}
            {/* <button className="mt-6 px-5 py-2 bg-[#3a7d44] text-white text-sm rounded-lg hover:bg-[#2e6438] transition">
              Call out to Action →
            </button> */}

          </div>

          {/* RIGHT — Sticky sidebar */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              position: "sticky",
              top: "2rem",
              maxHeight: "80vh",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Sidebar blogs={sidebarBlogs} />
          </div>

        </div>

        {/* ── RELATED POSTS — full width, proper padding, separated ── */}
        <div style={{
  padding: "1.5vw 2vw 4vw 2vw",
  backgroundColor: "#f8faf7",
}}>
  <RelatedPosts blogs={relatedBlogs} />
</div>

      </div>
    </div>
  );
}