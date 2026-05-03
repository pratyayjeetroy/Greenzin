"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import emailjs from "@emailjs/browser";

const STEPS = [
  {
    id: 1,
    title: "Site Visit & Evaluation",
    description:
      "We assess lighting, drainage, water pressure, aesthetics, and more to understand your space.",
    image: "/home/decor/step1_site_visit.png",
  },
  {
    id: 2,
    title: "Design & Planning",
    description:
      "Our experts create a customized plan aligned with your interiors or project scope.",
    image: "/home/decor/step2_design_planning.png",
  },
  {
    id: 3,
    title: "Client Approval",
    description:
      "You review and approve the plan — we only move forward once you're happy.",
    image: "/home/decor/step3_client_approval.png",
  },
  {
    id: 4,
    title: "Installation & Ongoing Care",
    description:
      "We bring your garden to life and keep it thriving with our maintenance packages.",
    image: "/home/decor/step4_installation.png",
  },
];

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  agree: false,
};

// ── Reusable error icon ──
function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-[13px] h-[13px] shrink-0"
      aria-hidden="true"
    >
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 3.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Zm-.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
    </svg>
  );
}

export default function DecorServiceModal({ isOpen, onClose, decorType }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const agreeRef = useRef();

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
    // Clear error for this field as user types / toggles
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.agree) {
      newErrors.agree = "You must agree to be contacted";
    }

    setErrors(newErrors);

    // Focus first errored field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.phone) phoneRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.agree)
        agreeRef.current?.scrollIntoView({ behavior: "smooth" });

      return false;
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    
    const templateParams = {
  title: "🌿 Decor Service Inquiry",
  name: form.name,
  phone: form.phone,
  email: form.email,
  message: `New ${decorType} decor request`,
  extra_section: `Service Type: ${
  decorType === "home" ? "Home Decor" : "Office Decor"
}`,
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

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_DECOR_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_DECOR_TEMPLATE_ID,
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

  const typeLabel = decorType === "home" ? "Home Decor" : "Office Decor";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decor-modal-title"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 [background:rgba(10,20,10,0.60)] [backdrop-filter:blur(7px)] [-webkit-backdrop-filter:blur(7px)] ${
        isClosing ? "decor-overlay-out" : "decor-overlay-in"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative w-full max-w-[520px] max-h-[92vh] overflow-y-auto rounded-[22px] bg-white [box-shadow:0_32px_80px_rgba(0,0,0,0.25),0_4px_20px_rgba(0,0,0,0.08)] flex flex-col decor-modal-scrollbar ${
          isClosing ? "decor-card-out" : "decor-card-in"
        }`}
      >
        {/* ── Header ── */}
        <div className="[background:linear-gradient(150deg,#3d5a3e_0%,#2e4530_55%,#1f3022_100%)] px-7 pt-8 pb-7 rounded-t-[22px] text-center relative overflow-hidden">
          <button
            id="decor-modal-close"
            onClick={handleClose}
            aria-label="Close decor service modal"
            className="absolute top-[14px] right-4 w-[34px] h-[34px] border-none [background:rgba(255,255,255,0.13)] text-white rounded-full cursor-pointer flex items-center justify-center transition-[background,transform] duration-[180ms] hover:[background:rgba(255,255,255,0.24)] hover:rotate-90 z-10"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="relative flex items-center justify-center gap-2 mb-2">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-[#a8d580] shrink-0"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 19.62L5.71 21l1-1.23A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s-2 0-5 2.5C6 10 6 17 6 17c0-5 3.5-9 11-9Z" />
            </svg>
            <span className="text-[#a8d580] font-bold text-base tracking-widest font-poppins">
              GreenZin
            </span>
          </div>

          <h2
            id="decor-modal-title"
            className="relative font-poppins text-[18px] font-bold text-white leading-snug tracking-wide m-0 mb-[6px]"
          >
            {typeLabel}{" "}
            <span className="text-[#a8d580]">Greenification</span>
          </h2>
          <p className="relative text-[13px] text-[rgba(255,255,255,0.72)] leading-[1.55] m-0 max-w-[340px] mx-auto">
            Greenifying your space made easy by GreenZin.
          </p>
        </div>

        {/* ── Steps Section ── */}
        <div className="px-6 pt-6 pb-2 bg-[#f8faf6]">
          <div className="flex flex-col gap-0">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="relative flex items-start gap-4 pb-5"
              >
                {index < STEPS.length - 1 && (
                  <div className="absolute left-[38px] top-[76px] w-0.5 h-[calc(100%-56px)] decor-connector" />
                )}

                <div className="shrink-0 w-[76px] h-[76px] rounded-full overflow-hidden border-[2.5px] border-[#3d5a3e] [box-shadow:0_4px_14px_rgba(61,90,62,0.20)] relative">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="76px"
                  />
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-[24px] h-[24px] rounded-full bg-[#3d5a3e] text-white text-[12px] font-bold flex items-center justify-center shrink-0 [box-shadow:0_2px_8px_rgba(61,90,62,0.30)]">
                      {step.id}
                    </span>
                    <h3 className="m-0 font-poppins text-[14.5px] font-bold text-[#2d3b2e] leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="m-0 text-[12.5px] text-[#5a6b5b] leading-[1.6] pl-[32px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Callback Form Section ── */}
        <div className="px-6 pt-4 pb-6 bg-[#f8faf6] rounded-b-[22px]">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c8d8c5] to-transparent mb-5" />

          {submitted ? (
            <DecorSuccessState onClose={handleClose} />
          ) : (
            <>
              <div className="text-center mb-5">
                <h3 className="font-poppins text-[16px] font-bold text-[#2d3b2e] m-0 mb-1">
                  Request a Callback
                </h3>
                <p className="text-[12.5px] text-[#6b7c6d] leading-[1.55] m-0 max-w-[340px] mx-auto">
                  Interested in our greenification service? Request a callback
                  and our team will contact you to discuss your needs in detail.
                </p>
              </div>

              <form
                id="decor-callback-form"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Name + Phone row */}
                <div className="flex gap-3 mb-3">
                  {/* Name */}
                  <div className="flex-1">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa990]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                      <input
                        ref={nameRef}
                        id="decor-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "error-decor-name" : undefined
                        }
                        className={`decor-input w-full bg-white rounded-[10px] pl-9 pr-3 py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                          errors.name
                            ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                            : "border-[#d8e5d4]"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p
                        id="error-decor-name"
                        className="decor-error-msg mt-[5px] text-[11.5px] text-[#c0392b] flex items-center gap-[4px] leading-[1.4]"
                      >
                        <ErrorIcon />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex-1">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa990]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.18 21 3 13.82 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <input
                        ref={phoneRef}
                        id="decor-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? "error-decor-phone" : undefined
                        }
                        className={`decor-input w-full bg-white rounded-[10px] pl-9 pr-3 py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                          errors.phone
                            ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                            : "border-[#d8e5d4]"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p
                        id="error-decor-phone"
                        className="decor-error-msg mt-[5px] text-[11.5px] text-[#c0392b] flex items-center gap-[4px] leading-[1.4]"
                      >
                        <ErrorIcon />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa990]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <input
                      ref={emailRef}
                      id="decor-email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "error-decor-email" : undefined
                      }
                      className={`decor-input w-full bg-white rounded-[10px] pl-9 pr-3 py-[10px] text-sm text-[#2d3b2e] outline-none transition-[border-color,box-shadow] duration-[180ms] font-[inherit] box-border border-[1.5px] ${
                        errors.email
                          ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                          : "border-[#d8e5d4]"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="error-decor-email"
                      className="decor-error-msg mt-[5px] text-[11.5px] text-[#c0392b] flex items-center gap-[4px] leading-[1.4]"
                    >
                      <ErrorIcon />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Agree checkbox */}
                <div className="mb-5" ref={agreeRef}>
                  <label className="flex items-center gap-[9px] cursor-pointer text-[12.5px] text-[#5a6b5b] select-none">
                    <input
                      type="checkbox"
                      name="agree"
                      id="decor-agree"
                      checked={form.agree}
                      onChange={handleChange}
                      aria-invalid={!!errors.agree}
                      aria-describedby={
                        errors.agree ? "error-decor-agree" : undefined
                      }
                      className="decor-checkbox-input absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                    <span
                      className={`decor-checkbox-custom w-[18px] h-[18px] rounded-[5px] border-2 bg-white inline-flex items-center justify-center shrink-0 transition-[background,border-color,box-shadow] duration-[180ms] text-white ${
                        errors.agree
                          ? "border-[#c0392b] [box-shadow:0_0_0_3px_rgba(192,57,43,0.10)]"
                          : "border-[#3d5a3e]"
                      }`}
                      aria-hidden="true"
                    >
                      {form.agree && (
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
                    <span>I agree to be contacted by GreenZin.</span>
                  </label>
                  {errors.agree && (
                    <p
                      id="error-decor-agree"
                      className="decor-error-msg mt-[5px] text-[11.5px] text-[#c0392b] flex items-center gap-[4px] leading-[1.4] pl-[27px]"
                    >
                      <ErrorIcon />
                      {errors.agree}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="decor-submit-btn"
                  disabled={loading}
                  className="w-full bg-[#3d5a3e] border-none rounded-[12px] py-[13px] px-4 text-[15px] font-bold text-white cursor-pointer font-[inherit] tracking-[0.4px] transition-[background,box-shadow,transform,opacity] duration-[200ms] [box-shadow:0_4px_16px_rgba(61,90,62,0.30)] hover:bg-[#2e4530] hover:[box-shadow:0_6px_22px_rgba(61,90,62,0.40)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:[box-shadow:0_4px_16px_rgba(61,90,62,0.30)]"
                >
                  {loading ? "Sending..." : "Request Callback"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* ── Overlay animations ── */
        .decor-overlay-in  { animation: decorOverlayIn  0.28s ease forwards; }
        .decor-overlay-out { animation: decorOverlayOut 0.26s ease forwards; }
        @keyframes decorOverlayIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes decorOverlayOut { from { opacity: 1; } to { opacity: 0; } }

        /* ── Card animations ── */
        .decor-card-in  { animation: decorCardIn  0.32s cubic-bezier(.22,.61,.36,1) forwards; }
        .decor-card-out { animation: decorCardOut 0.24s ease-in forwards; }
        @keyframes decorCardIn  { from { opacity:0; transform: translateY(30px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes decorCardOut { from { opacity:1; transform: translateY(0) scale(1); } to { opacity:0; transform: translateY(18px) scale(0.97); } }

        /* ── Connector line with gradient ── */
        .decor-connector {
          background: linear-gradient(to bottom, rgba(61,90,62,0.35), rgba(61,90,62,0.08));
        }

        /* ── Custom scrollbar ── */
        .decor-modal-scrollbar { scrollbar-width: thin; scrollbar-color: #c8d8c5 transparent; }
        .decor-modal-scrollbar::-webkit-scrollbar { width: 5px; }
        .decor-modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .decor-modal-scrollbar::-webkit-scrollbar-thumb { background: #c8d8c5; border-radius: 10px; }

        /* ── Input styles ── */
        .decor-input::placeholder { color: #a8b8a9; }
        .decor-input:focus {
          border-color: #3d5a3e;
          box-shadow: 0 0 0 3px rgba(61,90,62,0.10);
        }

        /* ── Checkbox :checked + sibling ── */
        .decor-checkbox-input:checked + .decor-checkbox-custom {
          background: #3d5a3e;
          border-color: #3d5a3e;
        }

        /* ── Error message entrance ── */
        .decor-error-msg {
          animation: decorErrorSlide 0.18s ease forwards;
        }
        @keyframes decorErrorSlide {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Success pop animation ── */
        .decor-success-icon { animation: decorSuccessPop 0.4s cubic-bezier(.22,.61,.36,1) forwards; }
        @keyframes decorSuccessPop { from { transform: scale(0.6); opacity:0; } to { transform: scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}

function DecorSuccessState({ onClose }) {
  return (
    <div
      className="text-center py-6 px-4 flex flex-col items-center gap-[14px]"
      role="status"
      aria-live="polite"
    >
      <div
        className="decor-success-icon w-[68px] h-[68px] rounded-full [background:linear-gradient(135deg,#3d5a3e,#5a8a5c)] flex items-center justify-center [box-shadow:0_8px_28px_rgba(61,90,62,0.30)]"
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
        Callback Requested!
      </h3>
      <p className="text-sm text-[#6b7c6d] leading-[1.6] m-0 max-w-[300px]">
        Thank you for your interest. Our greenification team will call you back
        within <strong style={{ color: "#3d5a3e" }}>24 hours</strong> to discuss
        your space needs.
      </p>
      <button
        className="mt-[6px] bg-[#3d5a3e] text-white border-none rounded-[10px] py-3 px-8 text-[14.5px] font-bold cursor-pointer font-[inherit] transition-[background,box-shadow] duration-[180ms] [box-shadow:0_4px_14px_rgba(61,90,62,0.28)] hover:bg-[#2e4530]"
        onClick={onClose}
        id="decor-success-close-btn"
      >
        Close
      </button>
    </div>
  );
}