"use client";

import Link from "next/link";
import { Leaf, Mail, Phone } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    body: "When you browse, order, or create an account with us, we collect details like your name, delivery address, phone number, email, and order history. We also collect basic device and browsing information — like the pages you visit — to keep the site running smoothly.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to process orders, arrange delivery, send order updates, and offer support if something needs fixing. With your consent, we may also use it to let you know about new plant arrivals, offers, or care tips.",
  },
  {
    title: "Cookies & Similar Technologies",
    body: "We use cookies to remember your cart, keep you signed in, and understand which pages people find useful. You can control cookies through your browser settings at any time — see our Cookie Policy for the full details.",
  },
  {
    title: "Sharing Your Information",
    body: "We share the minimum information needed with our delivery partners (to get your order to you) and payment gateways (to process payment securely). We never sell your personal information to advertisers or unrelated third parties.",
  },
  {
    title: "How We Protect Your Data",
    body: "We use standard security practices — encrypted checkout, restricted internal access, and secure storage — to keep your information safe. No online system is completely risk-free, but we take this seriously and review our practices as we grow.",
  },
  {
    title: "Your Choices & Rights",
    body: "You can ask us to update, correct, or delete your personal information at any time by writing to us. You can also opt out of marketing emails using the unsubscribe link in any message we send, or by contacting us directly.",
  },
  {
    title: "Children's Privacy",
    body: "GreenZin is intended for adults making purchases on behalf of themselves, their homes, or their businesses. We don't knowingly collect personal information from children.",
  },
  {
    title: "Changes to This Policy",
    body: "As GreenZin grows, this policy may be updated to reflect new features or practices. We'll post the updated version here with a new date, so it's worth checking back occasionally.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ── Header ── */}
      <section className="pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-[#e0ead7]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h1 className="font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
            Privacy Policy
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
            Want to update or remove your data? Just reach out.
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
          <Link href="/cookie" className="underline hover:text-[#3a7d44]">Cookie Policy</Link>.
        </p>
      </section>
    </div>
  );
}