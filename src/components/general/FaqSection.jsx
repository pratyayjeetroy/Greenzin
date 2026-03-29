import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FaqSection = ({ title = "General FAQs", faqs = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
<div className="w-full px-4 sm:px-6 md:px-[40px] py-8 md:py-12 bg-[#f8faf7]">
      <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-[600] font-[poppins] text-slate-800 text-center mb-6 md:mb-8">
        {title}
      </h2>

      <div className="flex flex-col gap-[8px]">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={index}
              className={`bg-white overflow-hidden transition-all duration-200 rounded-[12px] ${
                isOpen
                  ? "border border-[#83B930]"
                  : "border border-[#e2e5ea] hover:border-[#b0b8c4]"
              }`}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="w-full px-4 sm:px-5 md:px-6 py-[13px] md:py-[14px] flex items-center justify-between text-left gap-3"
              >
                <p className="text-[15px] sm:text-[16px] md:text-[17px] font-[500] font-[inter] text-slate-950 leading-snug">
                  {faq.question}
                </p>
                <span className={`flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-[#83B930]" : "text-slate-400"}`}>
                  {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 md:px-6 pb-[14px] md:pb-[16px]">
                  <div className="border-t border-[#eef0f3] pt-[12px]">
                    <p className="text-[14px] sm:text-[15px] md:text-[16px] font-[inter] font-[500] text-slate-700 leading-[1.7]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;