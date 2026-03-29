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
    <div className="w-full border min-h-screen bg-white pt-6 md:pt-7">
      <div className="max-w-7xl mx-auto">

        {/* ── MAIN ROW ── */}
        <div className="flex flex-col md:flex-row md:gap-8 md:pb-8 md:items-start p-4">

          {/* ── LEFT: Content ── */}
          <div
            className="w-full md:flex-1 md:min-w-0"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              paddingRight: "0.5rem",
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
            {/* Title */}
            <h1 className="text-[24px] md:text-[33px] font-bold tracking-[0.5px] leading-[1.3] font-[poppins] font-[600] text-slate-800 mb-2">
              {selectedBlog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-[15px] md:text-[18px] font-[poppins] tracking-[0.5px] font-[600] text-slate-600 mb-4">
              {selectedBlog.excerpt}
            </p>

            {/* MOBILE: full width image */}
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="block md:hidden w-full h-[200px] object-cover rounded-xl mb-4"
            />

            {/* DESKTOP: floated image, content wraps */}
            <div style={{ overflow: "hidden" }}>
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="hidden md:block"
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

            {/* MOBILE: sidebar below content */}
            <div className="block md:hidden mt-6">
              <Sidebar blogs={sidebarBlogs} />
            </div>

          </div>

          {/* ── RIGHT: Sticky sidebar — desktop only ── */}
          <div
            className="hidden md:block md:w-[280px] md:shrink-0"
            style={{
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

        {/* ── RELATED POSTS ── */}
        <div
          className="mx-4  mb-6 rounded-2xl"
          style={{
            padding: "1.25rem 1.5rem 2rem 1.5rem",
            backgroundColor: "#f8faf7",
          }}
        >
          <RelatedPosts blogs={relatedBlogs} />
        </div>

      </div>
    </div>
  );
}