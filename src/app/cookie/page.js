"use client";

import Link from "next/link";
import { Leaf, Mail, Phone } from "lucide-react";

const sections = [
  {
    title: "What Are Cookies",
    body: "Cookies are small text files a website stores on your device to remember information about your visit — like what's in your cart, or that you're signed in. They don't harm your device and can't run programs on their own.",
  },
  {
    title: "Cookies We Use",
    body: "Essential cookies keep the site working — things like your shopping cart and login session. Performance cookies help us understand which pages are popular and where people run into trouble. Functional cookies remember small preferences, like your delivery city. We don't use cookies for third-party advertising.",
  },
  {
    title: "How We Use This Information",
    body: "We use cookie data to keep your session running smoothly, prevent your cart from resetting between pages, and understand which parts of the GreenZin catalogue people enjoy browsing most — so we can keep improving the shopping experience.",
  },
  {
    title: "Managing Your Cookie Preferences",
    body: "Most browsers let you view, delete, or block cookies through their settings menu. Blocking essential cookies may affect features like your cart or checkout, so we recommend only disabling non-essential ones if you'd prefer a lighter footprint.",
  },
  {
    title: "Third-Party Cookies",
    body: "Some features — like our payment gateway — may set their own cookies to process transactions securely. These are governed by the respective provider's own cookie and privacy policies.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this policy as our website and tools evolve. Any changes will be posted here with a new date, so feel free to check back from time to time.",
  },
];

export default function CookiePage() {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ── Header ── */}
      <section className="pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-[#e0ead7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h1 className="font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
            Cookie Policy
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
            Have a question about how we use cookies? Ask away.
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
          See also our <Link href="/terms" className="underline hover:text-[#3a7d44]">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-[#3a7d44]">Privacy Policy</Link>.
        </p>
      </section>
    </div>
  );
}