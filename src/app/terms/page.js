"use client";

import Link from "next/link";
import { Leaf, Mail, Phone } from "lucide-react";

const sections = [
  {
    title: "Using the GreenZin Website",
    body: "By browsing or ordering from greenzin.in, you agree to these terms. If you don't agree with any part of them, please don't use the site — and feel free to reach out if something needs clarifying. We may update these terms as GreenZin grows; the version posted here is always the current one.",
  },
  {
    title: "Orders & Payments",
    body: "When you place an order, you're making an offer to buy — we confirm it once payment is verified. Prices are listed in INR and include applicable taxes unless stated otherwise. Occasionally a listed plant may sell out before your order is confirmed; if that happens, we'll contact you with a substitute option or a full refund, whichever you prefer.",
  },
  {
    title: "Shipping & Delivery",
    body: "We currently deliver across a small number of cities, with delivery windows shown at checkout. Plants are living things, so we pack every order with care — but weather, transit time, and handling can occasionally affect condition on arrival. If your plant arrives damaged or unwell, see our Returns section below.",
  },
  {
    title: "Returns, Replacements & Plant Health",
    body: "Because plants are perishable, we ask you to inspect your order within 24 hours of delivery. If a plant arrives damaged, wilted, or clearly unhealthy, send us a photo at greenzincare@gmail.com and we'll arrange a replacement or refund. Pots, tools, and accessories can be returned unused and in original packaging within 7 days.",
  },
  {
    title: "Plant Care Disclaimer",
    body: "We share care instructions with every plant to give it the best chance to thrive in your home. Growth and survival depend on light, water, and conditions we can't control after delivery, so we can't guarantee long-term results — but our team is always happy to help troubleshoot if something looks off.",
  },
  {
    title: "Your Account",
    body: "If you create an account with us, you're responsible for keeping your login details secure and for any activity under your account. Let us know right away if you think someone else has access to it.",
  },
  {
    title: "Content & Intellectual Property",
    body: "Everything on this site — photos, descriptions, logos, and design — belongs to GreenZin unless noted otherwise. You're welcome to share our pages, but please don't copy or reuse our content commercially without asking us first.",
  },
  {
    title: "Limitation of Liability",
    body: "We work hard to describe our plants and products accurately, but natural variation is normal — no two plants look exactly alike. GreenZin isn't liable for indirect losses arising from delivery delays or plant care outcomes beyond our reasonable control.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of India, and any disputes will be handled by the courts of Kolkata, West Bengal.",
  },
];

export default function TermsPage() {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ── Header ── */}
      <section className="pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-[#e0ead7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h1 className="font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-gray-500 text-[12.5px] sm:text-[13.5px]">Last updated: September 2026</p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 sm:gap-10">
            {sections.map(({ title, body }, i) => (
              <div key={title} className="flex gap-4 sm:gap-5">
                <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f5eb] border border-[#e0ead7] flex items-center justify-center text-[#2e6b4f] font-bold text-[13px] sm:text-[14px]">
                  {i + 1}
                </div>
                <div>
                  <h2 className="font-[Tinos] text-[17px] sm:text-[19px] md:text-[21px] font-bold text-[#2d2d2d] mb-1.5">
                    {title}
                  </h2>
                  <p className="text-gray-600 text-[13.5px] sm:text-[14.5px] leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="border-t border-[#e0ead7] py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13.5px] text-gray-600 text-center sm:text-left">
            Questions about these terms? We're happy to walk you through them.
          </p>
          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <a href="mailto:greenzincare@gmail.com" className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#2e6b4f] hover:text-[#3a7d44]">
              <Mail className="w-4 h-4" /> greenzincare@gmail.com
            </a>
            <a href="tel:+918282888600" className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#2e6b4f] hover:text-[#3a7d44]">
              <Phone className="w-4 h-4" /> +91 82828 88600
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-[12px] text-gray-400">
          <Leaf className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-[#3a7d44]" />
          See also our <Link href="/privacy" className="underline hover:text-[#3a7d44]">Privacy Policy</Link> and{" "}
          <Link href="/cookie" className="underline hover:text-[#3a7d44]">Cookie Policy</Link>.
        </p>
      </section>
    </div>
  );
}