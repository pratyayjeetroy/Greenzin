import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FaqSection = ({ title = "General FAQs", faqs = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
<div className="w-full px-[40px] pb-[40px] bg-[#f8faf7]">
        <h2 className="text-[32px] font-[600] font-[poppins] text-slate-800 text-center mb-[24px]">
          General FAQs
        </h2>

        <div className="flex flex-col gap-[14px]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#d7d9de] rounded-[14px] shadow-l overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-[22px] py-[18px] flex items-center justify-between text-left"
              >
                <p className="text-[20px] font-[500] font-[inter] text-slate-800">
                  {faq.question}
                </p>
                <span className="text-[30px] text-slate-800 leading-none cursor-pointer">
                  {openFaq === index ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-[22px] pb-[18px]">
                  <p className="text-[17px] font-[inter] text-slate-800 leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default FaqSection;