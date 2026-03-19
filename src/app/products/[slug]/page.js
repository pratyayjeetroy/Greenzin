import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import Breadcrumb from "@/components/product/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

// ─── Metadata (SEO) ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | GreenZin" };
  }

  return {
    title: `${product.name} – ${product.tagline} | GreenZin`,
    description: `Buy ${product.name} online. ${product.description.botanical.slice(0, 155)}...`,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0]?.src }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb crumbs={product.breadcrumb} productName={product.name} />

      {/* Page Wrapper */}
      <div className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-7xl w-[92%] sm:w-[90%] px-2 sm:px-4 py-6 md:py-10">

          {/* ── Hero Section: Gallery + Info (2-col on lg) ─────────── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <ProductGallery images={product.images} />
            </div>

            {/* Info */}
            <div>
              <ProductInfo product={product} />
              {/* Accordions sit inside info column on desktop */}
              <ProductDetails product={product} />
            </div>
          </div>

          {/* ── Reviews ───────────────────────────────────────────────── */}
          <ProductReviews product={product} />

          {/* ── Related Products ──────────────────────────────────────── */}
          <RelatedProducts />
        </div>
      </div>
    </>
  );
}
