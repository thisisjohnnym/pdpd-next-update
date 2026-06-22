"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpSizeSheet } from "./pdp-size-sheet";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpVariantPillClass, pdpVariantPillFrostClass } from "./pdp-type";

type PdpSizeSelectorProps = {
  onOpenChange?: (open: boolean) => void;
  stretch?: boolean;
  frost?: boolean;
};

/** Inline size trigger — experiment buy bar only */
export function PdpSizeSelector({
  onOpenChange,
  stretch = false,
  frost = false,
}: PdpSizeSelectorProps) {
  const { size, sizeOptions, navigateToSize } = useTabbyVariant();
  const [open, setOpen] = useState(false);

  const setSheetOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("relative", stretch ? "min-w-0 w-full flex-1" : "shrink-0")}>
      <PdpSizeSheet
        selectedSize={size}
        sizeOptions={sizeOptions}
        open={open}
        onClose={() => setSheetOpen(false)}
        onSelect={navigateToSize}
      />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Size ${size}. Choose another size.`}
        onClick={() => setSheetOpen(!open)}
        className={cn(
          frost ? pdpVariantPillFrostClass : pdpVariantPillClass,
          stretch && "w-full max-w-none",
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-black">
          {size}
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="max-w-full truncate translate-y-px">{size}</span>
          <span
            className={cn(
              "truncate text-[10px] tracking-[0.2px]",
              frost ? "text-white/55" : "text-neutral-500",
            )}
          >
            Size
          </span>
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          size={18}
          className={cn("shrink-0", frost ? "text-white/70" : "text-neutral-600")}
        />
      </button>
    </div>
  );
}
