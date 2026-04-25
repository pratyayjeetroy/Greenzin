"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-300 w-full mt-auto">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-block bg-white p-2.5 rounded-lg w-max shadow-sm">
            <Image 
              src="/greenZinLogo.png" 
              alt="GreenZin Logo" 
              width={160}
              height={40}
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            GreenZin is your ultimate destination for all things green. 
            We bring nature closer to you with our wide variety of premium plants, 
            pots, and specialized gifting solutions.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-2 rounded-full hover:bg-brand-gradient hover:text-white transition-all duration-300" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-2 rounded-full hover:bg-brand-gradient hover:text-white transition-all duration-300" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-2 rounded-full hover:bg-brand-gradient hover:text-white transition-all duration-300" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-neutral-800 p-2 rounded-full hover:bg-brand-gradient hover:text-white transition-all duration-300" aria-label="Youtube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-1 after:bg-brand-gradient after:rounded-full">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-gray-400">
            <li><Link href="/plants" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Plants</Link></li>
            <li><Link href="/pots" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Pots & Accessories</Link></li>
            <li><Link href="/gifting" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Gifting Options</Link></li>
            <li><Link href="/corporate-gifts" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Corporate Gifts</Link></li>
            <li><Link href="/bulk-orders" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Bulk Orders</Link></li>
            <li><Link href="/best-seller" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Best Sellers</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-1 after:bg-brand-gradient after:rounded-full">
            Customer Support
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-gray-400">
            <li><Link href="/about-us" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Returns & Refunds</Link></li>
            <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-1 after:bg-brand-gradient after:rounded-full">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-200 shrink-0 mt-0.5" />
              <span className="leading-relaxed">123 Green Valley Road, Nature Tech Park, PC 56789</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone className="w-5 h-5 text-gray-200 shrink-0 group-hover:text-white transition-colors" />
              <a href="tel:+12345678900" className="hover:text-white transition-colors">
                +1 (234) 567-8900
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <Mail className="w-5 h-5 text-gray-200 shrink-0 group-hover:text-white transition-colors" />
              <a href="mailto:support@greenzin.com" className="hover:text-white transition-colors">
                support@greenzin.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} GreenZin. All rights reserved. Designed with precision.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/cookie" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
