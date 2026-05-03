"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Nursery",
    lines: ["123 Green Valley Road,", "Nature Tech Park, PC 56789"],
    href: "https://maps.google.com",
    linkLabel: "Get Directions →",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+1 (234) 567-8900", "Mon–Sat, 9 AM – 7 PM"],
    href: "tel:+12345678900",
    linkLabel: "Call Now →",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@greenzin.com", "We reply within 24 hours"],
    href: "mailto:support@greenzin.com",
    linkLabel: "Send Email →",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 9 AM – 7 PM", "Sunday: 10 AM – 5 PM"],
    href: null,
    linkLabel: null,
  },
];

const faqs = [
  {
    q: "Do you deliver across India?",
    a: "Yes! We deliver to 12+ major cities and are expanding rapidly. Enter your pincode at checkout to check availability.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you'll receive an email and SMS with a tracking link. You can also view your order status in your account.",
  },
  {
    q: "What if my plant arrives damaged?",
    a: "We offer a 100% satisfaction guarantee. If your plant arrives damaged or unhealthy, just share a photo within 48 hours and we'll replace it for free.",
  },
  {
    q: "Can I place a bulk or corporate order?",
    a: "Absolutely! We specialise in bulk and corporate orders. Use the contact form above or email us at bulk@greenzin.com for a custom quote.",
  },
];

// ── Reusable inline error message ──
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="contact-error-msg mt-[5px] text-[12px] text-[#c0392b] flex items-center gap-[5px] leading-[1.4]"
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-[13px] h-[13px] shrink-0"
        aria-hidden="true"
      >
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
      </svg>
      {message}
    </p>
  );
}

const INITIAL_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const nameRef = useRef();
  const emailRef = useRef();
  const subjectRef = useRef();
  const messageRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.subject) {
      newErrors.subject = "Please select a topic";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.subject) subjectRef.current?.focus();
      else if (newErrors.message) messageRef.current?.focus();
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const templateParams = {
  title: "📩 Contact Enquiry",
  name: form.name,
  email: form.email,
  phone: form.phone || "Not provided",
  message: form.message,
  extra_section: `Subject: ${form.subject}`,
};

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_DECOR_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_DECOR_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      alert("Email service is not configured properly.");
      setLoading(false);
      return;
    }

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_DECOR_SERVICE_ID ,
        process.env.NEXT_PUBLIC_EMAILJS_DECOR_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: input class based on error state
  const inputClass = (fieldName) =>
    `w-full rounded-xl bg-[#f8faf7] px-4 py-2.5 text-[13px] text-gray-700 outline-none transition-all placeholder:text-gray-400 border ${
      errors[fieldName]
        ? "border-[#c0392b] ring-2 ring-[rgba(192,57,43,0.10)] focus:border-[#c0392b] focus:ring-[rgba(192,57,43,0.15)]"
        : "border-[#d1e0cc] focus:border-green-500 focus:ring-2 focus:ring-green-100"
    }`;

  return (
    <div className="w-full bg-white overflow-x-hidden">

      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden" aria-label="Contact GreenZin">
        <div className="relative w-full aspect-[12/5] max-h-[420px] min-h-[180px]">
          <Image
            src="/contactUsBanner.png"
            alt="Contact GreenZin — we'd love to hear from you"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(20,60,30,0.88)_0%,rgba(20,60,30,0.60)_55%,rgba(20,60,30,0.15)_100%)]" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-[7%]">
            <div className="max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[55%]">
              <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-green-300 mb-1.5 sm:mb-2">
                Get In Touch
              </span>
              <h1 className="font-[Tinos] text-xl sm:text-3xl md:text-[44px] lg:text-[54px] font-bold leading-tight text-white">
                We&apos;d Love to{" "}
                <span className="text-[#3a7d44]">Hear From You</span>
              </h1>
              <div className="mt-2 mb-3 h-0.5 w-12 sm:w-20 rounded-full [background:var(--brand-gradient)]" />
              <p className="text-white/80 text-[11px] sm:text-sm md:text-base leading-relaxed">
                Questions, bulk orders, plant advice, or just want to say hello? Our
                team is here to help — reach out and we&apos;ll get back to you shortly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="bg-[#f8faf7] border-b border-[#e0ead7] py-8 sm:py-12 md:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {contactInfo.map(({ icon: Icon, title, lines, href, linkLabel }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-[#e0ead7] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl [background:var(--brand-gradient)] flex items-center justify-center shadow-sm shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold text-[#2d2d2d]">{title}</h3>
                <div className="flex flex-col gap-0.5">
                  {lines.map((line) => (
                    <p key={line} className="text-[12px] sm:text-[13px] text-gray-500 leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
                {href && linkLabel && (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-auto text-[12px] sm:text-[13px] font-semibold text-[#2e6b4f] hover:opacity-80 transition-opacity"
                  >
                    {linkLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form + Map ── */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">

            {/* ── Form ── */}
            <div>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
                Drop Us a Message
              </span>
              <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
                Send Your{" "}
                <span className="text-[#3a7d44]">Enquiry</span>
              </h2>
              <div className="mt-3 mb-6 sm:mb-7 h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 sm:py-14 rounded-2xl bg-[#f8faf7] border border-[#e0ead7] text-center px-5 sm:px-8">
                  <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-500" />
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-[#2d2d2d]">Message Sent!</h3>
                  <p className="text-gray-500 text-[13px] sm:text-[14px] leading-relaxed max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours. 🌿
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setErrors({}); }}
                    className="mt-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white [background:var(--brand-gradient)] hover:opacity-90 hover:scale-105 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form" noValidate className="flex flex-col gap-4">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="text-[13px] font-semibold text-gray-700">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        ref={nameRef}
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Riya Kapoor"
                        value={form.name}
                        onChange={handleChange}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "error-contact-name" : undefined}
                        className={inputClass("name")}
                      />
                      <FieldError id="error-contact-name" message={errors.name} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="text-[13px] font-semibold text-gray-700">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        ref={emailRef}
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="riya@email.com"
                        value={form.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "error-contact-email" : undefined}
                        className={inputClass("email")}
                      />
                      <FieldError id="error-contact-email" message={errors.email} />
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-phone" className="text-[13px] font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass("phone")}
                      />
                      {/* phone is optional — no error shown */}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-subject" className="text-[13px] font-semibold text-gray-700">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        ref={subjectRef}
                        id="contact-subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "error-contact-subject" : undefined}
                        className={inputClass("subject")}
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="general">General Enquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="bulk">Bulk / Corporate Order</option>
                        <option value="gifting">Gifting &amp; Custom Orders</option>
                        <option value="plant-care">Plant Care Advice</option>
                        <option value="returns">Returns &amp; Refunds</option>
                        <option value="other">Other</option>
                      </select>
                      <FieldError id="error-contact-subject" message={errors.subject} />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="text-[13px] font-semibold text-gray-700">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help you…"
                      value={form.message}
                      onChange={handleChange}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "error-contact-message" : undefined}
                      className={`${inputClass("message")} resize-none`}
                    />
                    <FieldError id="error-contact-message" message={errors.message} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full sm:w-auto sm:self-start flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[14px] font-semibold text-white [background:var(--brand-gradient)] hover:opacity-90 hover:scale-[1.02] transition-all duration-300 [box-shadow:0_4px_20px_rgba(131,185,48,0.30)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Map + WhatsApp ── */}
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden border border-[#e0ead7] shadow-sm w-full aspect-[4/3]">
                <iframe
                  title="GreenZin Nursery Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.178!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1609459200000!5m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              </div>

              {/* WhatsApp card */}
              <div className="relative overflow-hidden rounded-2xl [background:var(--brand-gradient)] p-5 sm:p-6 text-white flex items-center gap-4 sm:gap-5">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[15px] sm:text-[17px] md:text-[18px] font-bold">Chat on WhatsApp</h3>
                  <p className="text-white/75 text-[12px] sm:text-[13px] leading-snug">
                    Quick answers, order updates, and plant care advice — instantly.
                  </p>
                  <a
                    href="https://wa.me/918282888600"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-fit items-center gap-1.5 bg-white text-[#2e6b4f] text-[12px] sm:text-[13px] font-bold rounded-full px-4 sm:px-5 py-2 hover:shadow-md hover:scale-105 transition-all duration-300"
                  >
                    Start Chat →
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-[#f8faf7] border-t border-[#e0ead7] py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7 sm:mb-10 md:mb-12">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
              Quick Answers
            </span>
            <h2 className="mt-2 font-[Tinos] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
              Frequently Asked{" "}
              <span className="text-[#3a7d44]">Questions</span>
            </h2>
            <div className="mt-3 mx-auto h-0.5 w-16 rounded-full [background:var(--brand-gradient)]" />
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e0ead7] shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  id={`faq-btn-${idx}`}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left gap-3 sm:gap-4 cursor-pointer bg-transparent border-none"
                >
                  <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#2d2d2d]">{q}</span>
                  <span
                    className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center [background:var(--brand-gradient)] text-white text-lg font-bold transition-transform duration-300 ${openFaq === idx ? "rotate-45" : "rotate-0"}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="px-4 sm:px-5 pb-4 sm:pb-5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-500 leading-relaxed border-t border-[#e0ead7] pt-3 sm:pt-4"
                  >
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── Error message entrance animation ── */
        .contact-error-msg {
          animation: contactErrorSlide 0.18s ease forwards;
        }
        @keyframes contactErrorSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}