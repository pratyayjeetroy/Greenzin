"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, Sun, Droplets, Wrench } from "lucide-react";

// ─── Accordion ────────────────────────────────────────────────────────────────

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b p-4 border-[#e8e8e8]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[#5C7058]"
        aria-expanded={open}
      >
        <span className="text-[15px] font-bold text-[#2d2d2d] sm:text-[16px]">{title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#5C7058] shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#7a7a7a] shrink-0" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Care Pill ────────────────────────────────────────────────────────────────

const CarePill = ({ Icon, label, detail }) => (
  <div className="flex flex-col items-center gap-2 rounded-xl border border-[#e8e8e8] bg-[#f9f9f7] p-3 text-center">
    <Icon className="w-6 h-6 text-[#5C7058]" />
    <span className="text-[12px] font-bold text-[#2d2d2d]">{label}</span>
    {detail && (
      <span className="text-[11px] text-[#7a7a7a] leading-snug">{detail}</span>
    )}
  </div>
);

// ─── Spec Row ─────────────────────────────────────────────────────────────────

const SpecRow = ({ label, value }) => (
  <div className="flex items-start gap-2 py-2 border-b border-[#f0f0ee] last:border-0">
    <span className="shrink-0 w-[120px] text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wide sm:text-[13px]">
      {label}
    </span>
    <span className="text-[13px] text-[#2d2d2d] sm:text-[14px]">{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Accordions section below the product hero:
 * - Detailed Description
 * - Care Instructions
 * - Plant Size & Specifications
 * Props: product (full product object)
 */
const ProductDetails = ({ product }) => {
  return (
    <div className="mt-6 rounded-2xl border border-[#e8e8e8] bg-white overflow-hidden shadow-sm">
      {/* Detailed Description */}
      <Accordion title="Detailed Description" defaultOpen={true}>
        <div className="flex flex-col gap-3 text-[13px] text-[#4a4a4a] leading-relaxed sm:text-[14px]">
          <p>{product.description.botanical}</p>
          <p>
            <span className="font-semibold text-[#2d2d2d]">Benefits: </span>
            {product.description.benefits}
          </p>
          <p>
            <span className="font-semibold text-[#2d2d2d]">Origin: </span>
            {product.description.origin}
          </p>
        </div>
      </Accordion>

      {/* Care Instructions */}
      <Accordion title="Care Instructions">
        <div className="grid grid-cols-3 gap-3">
          <CarePill
            Icon={Sun}
            label="Sunlight"
            detail={product.careInstructions.sunlight}
          />
          <CarePill
            Icon={Droplets}
            label="Watering"
            detail={product.careInstructions.watering}
          />
          <CarePill
            Icon={Wrench}
            label="Maintenance"
            detail={product.careInstructions.maintenance}
          />
        </div>
      </Accordion>

      {/* Plant Size & Specifications */}
      <Accordion title="Plant Size &amp; Specifications">
        <div className="flex flex-col">
          <SpecRow label="Height" value={product.specifications.height} />
          <SpecRow label="Pot Size" value={product.specifications.potSize} />
          <SpecRow label="Weight" value={product.specifications.weight} />
          <SpecRow label="Soil Type" value={product.specifications.soilType} />
        </div>
      </Accordion>
    </div>
  );
};

export default ProductDetails;
