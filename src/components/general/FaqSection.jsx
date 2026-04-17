import React, { useState } from "react";

const FaqSection = ({ title = "General FAQs", faqs = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="bg-white border-t border-[#e0ead7] py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        {/* Header */}
<div className="text-center mb-7 sm:mb-10 md:mb-12">
  <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-green-600">
    Quick Answers
  </span>
  <h2 className="mt-2 font-[poppins] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#2d2d2d] leading-tight">
    Frequently Asked{" "}
    <span className="text-[#3a7d44]">Questions</span>
  </h2>
  <div className="mt-3 mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-[#83B930] to-[#1992D5]" />
</div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
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
                <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold font-[inter] text-[#2d2d2d]">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-gradient-to-r from-[#83B930] to-[#1992D5] text-white text-lg font-bold transition-transform duration-300 ${
                    openFaq === idx ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              {openFaq === idx && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className="px-4 sm:px-5 pb-4 sm:pb-5 text-[12px] sm:text-[13px] md:text-[14px] font-[inter] text-gray-500 leading-relaxed border-t border-[#e0ead7] pt-3 sm:pt-4"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;