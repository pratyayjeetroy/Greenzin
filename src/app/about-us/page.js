"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Heart, Globe, Award, Users, Sprout } from "lucide-react";

const stats = [
  { value: "500+", label: "Happy Customers", icon: Heart },
  { value: "150+", label: "Plant Varieties", icon: Leaf },
  { value: "2+", label: "Cities Covered", icon: Globe },
  { value: "1+", label: "Year of Passion", icon: Award },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "Every plant we source is ethically grown. We partner with local nurseries that follow eco-conscious cultivation practices, reducing our carbon footprint at every step.",
  },
  {
    icon: Heart,
    title: "Customer Love",
    description:
      "We don't just sell plants — we build relationships. Our team is always on hand to guide you through your green journey with personalised care tips.",
  },
  {
    icon: Sprout,
    title: "Quality Assured",
    description:
      "Each plant undergoes a rigorous quality check before it reaches your doorstep. We guarantee healthy, thriving plants delivered with love and care.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "GreenZin was born from a community of plant lovers. We grow together, celebrate milestones, and inspire each other to bring more green into everyday spaces.",
  },
];

const team = [
  {
    name: "Sangita Burman",
    role: "Founder & CEO",
    image: "",
    initials: "SB",
    bio: "Passionate plant lover turned entrepreneur, Sangita started GreenZin with a simple mission — make plants accessible to everyone.",
  },
  {
    name: "Tamali Roy",
    role: "Customer Experience Lead",
    image: "",
    initials: "TR",
    bio: "Tamali leads our care-first support team, ensuring every customer gets the right advice and the best plant experience possible.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="w-full bg-white overflow-x-hidden">

      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden" aria-label="About GreenZin">
        <div className="relative w-full aspect-[12/5] max-h-[420px] min-h-[180px]">
          <Image
            src="/aboutUsBanner.png"
            alt="GreenZin team and plant nursery"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(20,60,30,0.88)_0%,rgba(20,60,30,0.60)_55%,rgba(20,60,30,0.15)_100%)]" />
          {/* Text block — constrained so it never overflows on any screen */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-[7%]">
            <div className="max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[55%]">
              <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-green-300 mb-1.5 sm:mb-2">
                Our Story
              </span>
              <h1 className="font-[Tinos] text-xl sm:text-3xl md:text-[44px] lg:text-[54px] font-bold leading-tight text-white">
                Born from a Love of{" "}
                <span className="text-[#3a7d44]">Green</span>
              </h1>
              <div className="mt-2 mb-3 h-0.5 w-12 sm:w-20 rounded-full [background:var(--brand-gradient)]" />
              <p className="text-white/80 text-[11px] sm:text-sm md:text-base leading-relaxed">
                A team of plant lovers &amp; horticulturists passionate about
                bringing greenery to every space — home, office, and beyond.
              </p>
              <Link
                href="/plants"
                className="mt-4 sm:mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 sm:px-7 sm:py-2.5 text-[12px] sm:text-[14px] text-white font-semibold [background:var(--brand-gradient)] hover:opacity-90 hover:scale-105 transition-all duration-300 [box-shadow:0_4px_20px_rgba(131,185,48,0.35)]"
              >
                Explore Our Plants
                <span className="text-base">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-[#f8faf7] border-y border-[#e0ead7] py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full [background:var(--brand-gradient)] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-[22px] sm:text-[28px] font-bold text-[#2d4a2d] leading-none">
                  {value}
                </p>
                <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
                Why GreenZin?
              </span>
              <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[38px] font-bold text-[#2d2d2d] leading-tight">
                We Make Sure Your{" "}
                <span className="text-[#3a7d44]">Space Thrives</span>
              </h2>
              <div className="mt-3 mb-5 h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
              <p className="text-gray-600 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed mb-4 sm:mb-5">
                At GreenZin, we go beyond being just an online plant store. We
                are your green companion — offering expert plant advice,
                thoughtfully curated collections, and a seamless shopping
                experience that feels as refreshing as the plants we sell.
              </p>
              <p className="text-gray-600 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed">
                Whether you&apos;re a first-time plant parent, a gifting enthusiast,
                or a business looking to green up your workspace — GreenZin has
                something special for you. Our catalogue spans air-purifying
                indoor plants, designer pots, curated gift sets, and tailored
                corporate solutions.
              </p>
            </div>

            {/* Green accent card */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 [background:linear-gradient(135deg,#1a5c38_0%,#83B930_60%,#1992D5_100%)] opacity-90" />
              <div className="relative p-6 sm:p-8 md:p-10 text-white flex flex-col gap-5 sm:gap-6">
                <Leaf className="w-9 h-9 sm:w-10 sm:h-10 text-white/60" />
                <blockquote className="font-[Tinos] text-[18px] sm:text-[22px] md:text-[26px] font-bold leading-snug">
                  &ldquo;Our mission is to bring the calming power of nature into every
                  home, office, and heart.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
                    SB
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] sm:text-[15px]">Sangita Burman</p>
                    <p className="text-white/70 text-[12px] sm:text-[13px]">Founder, GreenZin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-[#f8faf7] py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-14">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
              What Drives Us
            </span>
            <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[38px] font-bold text-[#2d2d2d] leading-tight">
              Our Core{" "}
              <span className="text-[#3a7d44]">Values</span>
            </h2>
            <div className="mt-3 mx-auto h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-[#e0ead7] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl [background:var(--brand-gradient)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-bold text-[#2d2d2d] mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-[13px] sm:text-[14px] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-14">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
              The People Behind GreenZin
            </span>
            <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[38px] font-bold text-[#2d2d2d] leading-tight">
              Meet Our{" "}
              <span className="text-[#3a7d44]">Team</span>
            </h2>
            <div className="mt-3 mx-auto h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
            {team.map(({ name, role, initials, bio }) => (
              <div
                key={name}
                className="flex flex-col items-center text-center bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-[#e0ead7] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full [background:var(--brand-gradient)] flex items-center justify-center text-white text-[20px] sm:text-[22px] md:text-[26px] font-bold shadow-md mb-4">
                  {initials}
                </div>
                <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-bold text-[#2d2d2d]">
                  {name}
                </h3>
                <span className="mt-1 text-[12px] sm:text-[13px] font-semibold text-[#2e6b4f]">
                  {role}
                </span>
                <p className="mt-3 text-gray-500 text-[12px] sm:text-[13px] leading-relaxed">
                  {bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden [background:var(--brand-gradient)] py-10 sm:py-14 md:py-16">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[Tinos] text-[24px] sm:text-[32px] md:text-[42px] font-bold text-white leading-tight">
            Ready to Go Green?
          </h2>
          <p className="mt-3 text-white/80 text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed max-w-xl mx-auto">
            Browse our curated collection of beautiful plants, designer pots,
            and thoughtful gift sets — delivered right to your door.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/plants"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#2e6b4f] font-bold rounded-full px-8 py-3 text-[14px] sm:text-[15px] md:text-[16px] hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Leaf className="w-4 h-4" />
              Shop Plants
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold rounded-full px-8 py-3 text-[14px] sm:text-[15px] md:text-[16px] hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}