"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import emailjs from "@emailjs/browser";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  organization_name: "",
  bulkSize: "<50",
  customizedPlant: false,
  customizedPot: false,
  notes: "",
};

export default function BulkOrderModal({ isOpen, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const bulkRef = useRef();

  /* ── Lock body scroll when open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSubmitted(false);
      setIsClosing(false);
      setForm(INITIAL_FORM);
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Escape key ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") handleClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 260);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.bulkSize) {
      newErrors.bulkSize = "Please select a bulk size";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.phone) phoneRef.current?.focus();
      else if (newErrors.bulkSize)
        bulkRef.current?.scrollIntoView({ behavior: "smooth" });

      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const templateParams = {
      name: form.name,
      organization_name: form.organization_name,
      email: form.email,
      phone: form.phone,
      bulkSize: form.bulkSize,
      customizedPlant: form.customizedPlant ? "Yes" : "No",
      customizedPot: form.customizedPot ? "Yes" : "No",
      notes: form.notes,
    };

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      alert("Email service is not configured properly.");
      setLoading(false);
      return;
    }

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          setSubmitted(true);
          setForm(INITIAL_FORM);
          setLoading(false);
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Something went wrong. Please try again.");
          setLoading(false);
        }
      );
  }

  if (!isOpen && !isClosing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-modal-title"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 [background:rgba(10,20,10,0.55)] [backdrop-filter:blur(6px)] [-webkit-backdrop-filter:blur(6px)] ${
        isClosing ? "bulk-overlay-out" : "bulk-overlay-in"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-[480px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-white [box-shadow:0_32px_80px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.08)] flex flex-col bulk-modal-scrollbar ${
          isClosing ? "bulk-card-out" : "bulk-card-in"
        }`}
      >
        {/* ── Header ── */}
        <div
          className="[background:linear-gradient(145deg,#3d5a3e_0%,#2e4530_100%)] px-7 pt-8 pb-[26px] rounded-t-[20px] text-center relative"
          style={{ padding: "32px 28px 26px" }}
        >
          <button
            id="bulk-modal-close"
            onClick={handleClose}
            aria-label="Close bulk order form"
            className="absolute top-[14px] right-4 w-[34px] h-[34px] border-none [background:rgba(255,255,255,0.12)] text-white rounded-full cursor-pointer flex items-center justify-center transition-[background,transform] duration-[180ms] hover:[background:rgba(255,255,255,0.22)] hover:rotate-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-[#a8d580] shrink-0"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 19.62L5.71 21l1-1.23A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s-2 0-5 2.5C6 10 6 17 6 17c0-5 3.5-9 11-9Z" />
            </svg>
            <h2
              id="bulk-modal-title"
              className="font-poppins text-lg font-bold text-white leading-snug tracking-wide m-0"
            >
              Inquire for <span className="text-[#a8d580]">Bulk Order</span>
            </h2>
          </div>

          <p className="text-[13px] text-[rgba(255,255,255,0.78)] leading-[1.55] m-0 max-w-[340px] mx-auto text-center">
            Fill out the form below and our team will get in touch to&nbsp;
            assist you with your bulk order needs.
          </p>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-6 pb-5 bg-[#f7f9f6] rounded-b-[20px]">
          {submitted ? (
            <SuccessState onClose={handleClose} />
          ) : (
            <form id="bulk-order-form" onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="bulk-name"
                  className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]"
                >
                  Name <span className="text-[#c0392b] ml-[2px]">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="bulk-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "error-name" : undefined}
                  className={`bulk-input w-full bg-white rounded-[10px] px-[14px] py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                    errors.name
                      ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                      : "border-[#d8e5d4]"
                  }`}
                  autoComplete="name"
                />
                {errors.name && (
                  <p id="error-name" className="bulk-error-msg mt-[5px] text-[12px] text-[#c0392b] flex items-center gap-[5px] leading-[1.4]">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-[13px] h-[13px] shrink-0" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"/>
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Organization Name */}
              <div className="mb-4">
                <label
                  htmlFor="bulk-org-name"
                  className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]"
                >
                  Organization Name
                </label>
                <input
                  id="bulk-org-name"
                  name="organization_name"
                  type="text"
                  placeholder="Your organization name"
                  value={form.organization_name}
                  onChange={handleChange}
                  className="bulk-input w-full bg-white border-[1.5px] border-[#d8e5d4] rounded-[10px] px-[14px] py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border"
                  autoComplete="organization"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="bulk-email"
                  className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]"
                >
                  Email <span className="text-[#c0392b] ml-[2px]">*</span>
                </label>
                <input
                  ref={emailRef}
                  id="bulk-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "error-email" : undefined}
                  className={`bulk-input w-full bg-white rounded-[10px] px-[14px] py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                    errors.email
                      ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                      : "border-[#d8e5d4]"
                  }`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p id="error-email" className="bulk-error-msg mt-[5px] text-[12px] text-[#c0392b] flex items-center gap-[5px] leading-[1.4]">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-[13px] h-[13px] shrink-0" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"/>
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="bulk-phone"
                  className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]"
                >
                  Phone Number <span className="text-[#c0392b] ml-[2px]">*</span>
                </label>
                <input
                  ref={phoneRef}
                  id="bulk-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "error-phone" : undefined}
                  className={`bulk-input w-full bg-white rounded-[10px] px-[14px] py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                    errors.phone
                      ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                      : "border-[#d8e5d4]"
                  }`}
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p id="error-phone" className="bulk-error-msg mt-[5px] text-[12px] text-[#c0392b] flex items-center gap-[5px] leading-[1.4]">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-[13px] h-[13px] shrink-0" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"/>
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Bulk Size */}
              <div className="mb-4" ref={bulkRef}>
                <p className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]">
                  Bulk Size (Qty) <span className="text-[#c0392b] ml-[2px]">*</span>
                </p>
                <div
                  className={`flex flex-wrap gap-y-[10px] gap-x-[18px] mt-1 rounded-[10px] transition-all duration-[180ms] ${
                    errors.bulkSize ? "bulk-radio-error-wrap" : ""
                  }`}
                  role="radiogroup"
                  aria-label="Bulk quantity"
                  aria-describedby={errors.bulkSize ? "error-bulkSize" : undefined}
                >
                  {["<50", "50-100", ">100"].map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-[7px] cursor-pointer text-sm text-[#2d3b2e] select-none"
                    >
                      <input
                        type="radio"
                        name="bulkSize"
                        value={size}
                        checked={form.bulkSize === size}
                        onChange={handleChange}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none bulk-radio-input"
                      />
                      <span
                        className="bulk-radio-custom w-[18px] h-[18px] rounded-full border-2 border-[#3d5a3e] inline-flex items-center justify-center shrink-0 transition-[border-color,background] duration-[180ms] bg-white relative"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[#2d3b2e]">{size}</span>
                    </label>
                  ))}
                </div>
                {errors.bulkSize && (
                  <p id="error-bulkSize" className="bulk-error-msg mt-[5px] text-[12px] text-[#c0392b] flex items-center gap-[5px] leading-[1.4]">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-[13px] h-[13px] shrink-0" aria-hidden="true">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"/>
                    </svg>
                    {errors.bulkSize}
                  </p>
                )}
              </div>

              {/* Customization */}
              <div className="mb-4">
                <p className="block text-[13.5px] font-semibold text-[#2d3b2e] mb-[6px] tracking-[0.15px]">
                  <strong>Bulk Customization Options</strong>{" "}
                  <span className="font-normal text-[#6b7c6d] text-[12.5px]">
                    (Hint: You can request specific plants and pots)
                  </span>
                </p>
                <label className="flex items-center gap-[9px] cursor-pointer text-sm text-[#2d3b2e] mb-2 select-none">
                  <input
                    type="checkbox"
                    id="bulk-custom-plant"
                    name="customizedPlant"
                    checked={form.customizedPlant}
                    onChange={handleChange}
                    className="bulk-checkbox-input absolute opacity-0 w-0 h-0 pointer-events-none"
                  />
                  <span
                    className="bulk-checkbox-custom w-[18px] h-[18px] rounded-[5px] border-2 border-[#3d5a3e] bg-white inline-flex items-center justify-center shrink-0 transition-[background,border-color] duration-[180ms] text-white"
                    aria-hidden="true"
                  >
                    {form.customizedPlant && (
                      <svg
                        viewBox="0 0 12 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[11px] h-[9px]"
                      >
                        <polyline points="1,5 4,8 11,1" />
                      </svg>
                    )}
                  </span>
                  <span>Customized Plant Selection</span>
                </label>
                <label className="flex items-center gap-[9px] cursor-pointer text-sm text-[#2d3b2e] mb-2 select-none">
                  <input
                    type="checkbox"
                    id="bulk-custom-pot"
                    name="customizedPot"
                    checked={form.customizedPot}
                    onChange={handleChange}
                    className="bulk-checkbox-input absolute opacity-0 w-0 h-0 pointer-events-none"
                  />
                  <span
                    className="bulk-checkbox-custom w-[18px] h-[18px] rounded-[5px] border-2 border-[#3d5a3e] bg-white inline-flex items-center justify-center shrink-0 transition-[background,border-color] duration-[180ms] text-white"
                    aria-hidden="true"
                  >
                    {form.customizedPot && (
                      <svg
                        viewBox="0 0 12 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[11px] h-[9px]"
                      >
                        <polyline points="1,5 4,8 11,1" />
                      </svg>
                    )}
                  </span>
                  <span>Customized Pot Selection</span>
                </label>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <textarea
                  id="bulk-notes"
                  name="notes"
                  rows={3}
                  placeholder="Other Details / Notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="bulk-input w-full bg-white border-[1.5px] border-[#d8e5d4] rounded-[10px] px-[14px] py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border resize-y min-h-[80px]"
                />
              </div>

              <p className="text-[12.5px] text-[#6b7c6d] text-center mt-3 mb-0 leading-[1.5]">
                Note: Our team will call you back within{" "}
                <strong>24 hours</strong>.
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-[18px] bulk-actions-responsive">
                <button
                  type="button"
                  id="bulk-cancel-btn"
                  onClick={handleClose}
                  className="flex-1 bg-transparent border-[1.5px] border-[#c5d4c2] rounded-[10px] py-3 px-[10px] text-[14.5px] font-semibold text-[#4a5e4b] cursor-pointer font-[inherit] transition-[border-color,background,color] duration-[180ms] hover:border-[#3d5a3e] hover:bg-[rgba(61,90,62,0.05)] hover:text-[#3d5a3e]"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  id="bulk-submit-btn"
                  className="flex-[2] bg-[#3d5a3e] border-none rounded-[10px] py-3 px-[10px] text-[14.5px] font-bold text-white cursor-pointer font-[inherit] tracking-[0.3px] transition-[background,box-shadow,transform] duration-[180ms] [box-shadow:0_4px_14px_rgba(61,90,62,0.28)] hover:bg-[#2e4530] hover:[box-shadow:0_6px_20px_rgba(61,90,62,0.38)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Receive Callback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        /* ── Overlay animations ── */
        .bulk-overlay-in  { animation: overlayIn  0.28s ease forwards; }
        .bulk-overlay-out { animation: overlayOut 0.26s ease forwards; }
        @keyframes overlayIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayOut { from { opacity: 1; } to { opacity: 0; } }

        /* ── Card animations ── */
        .bulk-card-in  { animation: cardIn  0.30s cubic-bezier(.22,.61,.36,1) forwards; }
        .bulk-card-out { animation: cardOut 0.24s ease-in forwards; }
        @keyframes cardIn  { from { opacity:0; transform: translateY(28px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes cardOut { from { opacity:1; transform: translateY(0) scale(1); } to { opacity:0; transform: translateY(18px) scale(0.97); } }

        /* ── Custom scrollbar ── */
        .bulk-modal-scrollbar { scrollbar-width: thin; scrollbar-color: #c8d8c5 transparent; }
        .bulk-modal-scrollbar::-webkit-scrollbar { width: 5px; }
        .bulk-modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .bulk-modal-scrollbar::-webkit-scrollbar-thumb { background: #c8d8c5; border-radius: 10px; }

        /* ── Input placeholder colour ── */
        .bulk-input::placeholder { color: #a8b8a9; }
        .bulk-input:focus {
          border-color: #3d5a3e;
          box-shadow: 0 0 0 3px rgba(61,90,62,0.10);
        }

        /* ── Radio :checked + sibling ── */
        .bulk-radio-input:checked + .bulk-radio-custom {
          border-color: #3d5a3e;
          background: #3d5a3e;
          box-shadow: 0 0 0 3px rgba(61,90,62,0.12);
        }
        .bulk-radio-input:checked + .bulk-radio-custom::after {
          content: '';
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
        }

        /* ── Checkbox :checked + sibling ── */
        .bulk-checkbox-input:checked + .bulk-checkbox-custom {
          background: #3d5a3e;
          border-color: #3d5a3e;
        }

        /* ── Error message entrance ── */
        .bulk-error-msg {
          animation: errorSlide 0.18s ease forwards;
        }
        @keyframes errorSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Radio group error highlight ── */
        .bulk-radio-error-wrap {
          padding: 8px 10px;
          border: 1.5px solid #c0392b;
          border-radius: 10px;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.08);
        }

        /* ── Success pop animation ── */
        .bulk-success-icon { animation: successPop 0.4s cubic-bezier(.22,.61,.36,1) forwards; }
        @keyframes successPop { from { transform: scale(0.6); opacity:0; } to { transform: scale(1); opacity:1; } }

        /* ── Mobile tweaks (480px) ── */
        @media (max-width: 480px) {
          .bulk-actions-responsive { flex-direction: column; }
          .bulk-actions-responsive > button { flex: unset; width: 100%; }
        }
      `}</style>
    </div>
  );
}

function SuccessState({ onClose }) {
  return (
    <div
      className="text-center py-8 px-4 pb-6 flex flex-col items-center gap-[14px]"
      role="status"
      aria-live="polite"
    >
      <div
        className="bulk-success-icon w-[68px] h-[68px] rounded-full [background:linear-gradient(135deg,#3d5a3e,#5a8a5c)] flex items-center justify-center [box-shadow:0_8px_28px_rgba(61,90,62,0.30)]"
        aria-hidden="true"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="font-poppins text-[20px] font-bold text-[#2d3b2e] m-0">
        Request Received!
      </h3>
      <p className="text-sm text-[#6b7c6d] leading-[1.6] m-0 max-w-[300px]">
        Thank you for your inquiry. Our team will call you back within{" "}
        <strong style={{ color: "#3d5a3e" }}>24 hours</strong> to assist you
        with your bulk order needs.
      </p>
      <button
        className="mt-[6px] bg-[#3d5a3e] text-white border-none rounded-[10px] py-3 px-8 text-[14.5px] font-bold cursor-pointer font-[inherit] transition-[background,box-shadow] duration-[180ms] [box-shadow:0_4px_14px_rgba(61,90,62,0.28)] hover:bg-[#2e4530]"
        onClick={onClose}
        id="bulk-success-close-btn"
      >
        Close
      </button>
    </div>
  );
}