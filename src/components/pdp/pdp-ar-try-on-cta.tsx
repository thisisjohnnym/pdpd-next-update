// fallow-ignore-file unused-file
"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpPressableClass } from "./pdp-type";

type PdpArTryOnCtaProps = {
  onClick: () => void;
  className?: string;
};

/** Hero overlay pill — opens the UI-only AI try-on preview */
export function PdpArTryOnCta({ onClick, className }: PdpArTryOnCtaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Try on with AI"
      className={cn(
        "font-extended inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 py-1.5 pl-2 pr-3 text-[11px] tracking-[0.2px] text-white/95 backdrop-blur-md transition-transform active:scale-[0.97]",
        pdpPressableClass,
        className,
      )}
    >
      <MaterialIcon name="view_in_ar" size={18} className="shrink-0 text-white" />
      <span>Try On in AI</span>
    </button>
  );
}
