"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, Sparkles, Wrench, Layers } from "lucide-react";

// ─── Accordion ────────────────────────────────────────────────────────────────

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b p-4 border-[#e8e8e8]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[#3d5a3e]"
        aria-expanded={open}
      >
        <span className="text-[15px] font-bold text-[#2d2d2d] sm:text-[16px]">{title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#3d5a3e] shrink-0" />
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
    <Icon className="w-6 h-6 text-[#3d5a3e]" />
    <span className="text-[12px] font-bold text-[#2d2d2d]">{label}</span>
    {detail && (
      <span className="text-[11px] text-[#7a7a7a] leading-snug">{detail}</span>
    )}
  </div>
);

// ─── Spec Row ─────────────────────────────────────────────────────────────────

const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-2 border-b border-[#f0f0ee] last:border-0">
      <span className="shrink-0 w-[130px] text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wide sm:text-[13px]">
        {label}
      </span>
      <span className="text-[13px] text-[#2d2d2d] sm:text-[14px]">{value}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Accordions section below the pot hero:
 * - Material & Description
 * - Care Instructions
 * - Pot Specifications
 * Props: pot (full pot object from DB)
 */
const PotDetails = ({ pot }) => {
  const { description, careInstructions, specifications } = pot;

  const hasDescription =
    description?.material || description?.usage || description?.benefits;

  const hasCare =
    careInstructions?.cleaning ||
    careInstructions?.maintenance ||
    careInstructions?.usage;

  const hasSpecs =
    specifications?.height ||
    specifications?.diameter ||
    specifications?.weight ||
    specifications?.material ||
    specifications?.drainageHole ||
    specifications?.colorFinish;

  if (!hasDescription && !hasCare && !hasSpecs) return null;

  return (
    <div className="mt-6 rounded-2xl border border-[#e8e8e8] bg-white overflow-hidden shadow-sm">
      {/* Material & Description */}
      {hasDescription && (
        <Accordion title="Material & Description" defaultOpen={true}>
          <div className="flex flex-col gap-3 text-[13px] text-[#4a4a4a] leading-relaxed sm:text-[14px]">
            {description.material && (
              <p>
                <span className="font-semibold text-[#2d2d2d]">Material: </span>
                {description.material}
              </p>
            )}
            {description.usage && (
              <p>
                <span className="font-semibold text-[#2d2d2d]">Usage: </span>
                {description.usage}
              </p>
            )}
            {description.benefits && (
              <p>
                <span className="font-semibold text-[#2d2d2d]">Benefits: </span>
                {description.benefits}
              </p>
            )}
          </div>
        </Accordion>
      )}

      {/* Care Instructions */}
      {hasCare && (
        <Accordion title="Care Instructions">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {careInstructions.cleaning && (
              <CarePill
                Icon={Sparkles}
                label="Cleaning"
                detail={careInstructions.cleaning}
              />
            )}
            {careInstructions.maintenance && (
              <CarePill
                Icon={Wrench}
                label="Maintenance"
                detail={careInstructions.maintenance}
              />
            )}
            {careInstructions.usage && (
              <CarePill
                Icon={Layers}
                label="Usage Tips"
                detail={careInstructions.usage}
              />
            )}
          </div>
        </Accordion>
      )}

      {/* Pot Specifications */}
      {hasSpecs && (
        <Accordion title="Pot Specifications">
          <div className="flex flex-col">
            <SpecRow label="Height" value={specifications.height} />
            <SpecRow label="Diameter" value={specifications.diameter} />
            <SpecRow label="Weight" value={specifications.weight} />
            <SpecRow label="Material" value={specifications.material} />
            <SpecRow label="Drainage Hole" value={specifications.drainageHole} />
            <SpecRow label="Color / Finish" value={specifications.colorFinish} />
          </div>
        </Accordion>
      )}
    </div>
  );
};

export default PotDetails;
