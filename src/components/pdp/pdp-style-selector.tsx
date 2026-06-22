"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpStyleSheet } from "./pdp-style-sheet";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpVariantPillClass, pdpVariantPillFrostClass } from "./pdp-type";

type PdpStyleSelectorProps = {
  onOpenChange?: (open: boolean) => void;
  stretch?: boolean;
  frost?: boolean;
};

/** Inline style trigger — experiment buy bar only */
export function PdpStyleSelector({
  onOpenChange,
  stretch = false,
  frost = false,
}: PdpStyleSelectorProps) {
  const { style, styleId, navigateToStyle } = useTabbyVariant();
  const [open, setOpen] = useState(false);

  const setSheetOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("relative", stretch ? "min-w-0 w-full flex-1" : "shrink-0")}>
      <PdpStyleSheet
        selectedId={styleId}
        open={open}
        onClose={() => setSheetOpen(false)}
        onSelect={navigateToStyle}
      />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Style: ${style.label}. Choose another style.`}
        onClick={() => setSheetOpen(!open)}
        className={cn(
          frost ? pdpVariantPillFrostClass : pdpVariantPillClass,
          stretch && "w-full max-w-none",
        )}
      >
        <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-neutral-100">
          <Image
            src={style.thumbnail}
            alt=""
            fill
            className="object-cover object-center"
            sizes="32px"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="max-w-full truncate translate-y-px">{style.label}</span>
          <span
            className={cn(
              "truncate text-[10px] tracking-[0.2px]",
              frost ? "text-white/55" : "text-neutral-500",
            )}
          >
            Style
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
