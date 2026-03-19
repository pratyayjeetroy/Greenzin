"use client";

import CategoriesSec from "@/components/home/CategoriesSec";
import HeroCarousel from "@/components/home/HeroCarousel";
import BestSellersSec from "@/components/home/BestSellersSec";
import CorporateGiftsSec from "@/components/home/CorporateGiftsSec";
import PromoBannersSec from "@/components/home/PromoBannersSec";
import FeaturedCollectionsSec from "@/components/home/FeaturedCollectionsSec";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <CategoriesSec/>
      <BestSellersSec />
      <CorporateGiftsSec />
      <PromoBannersSec />
      <FeaturedCollectionsSec />
    </>
  );
}
