"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { CoachOutletWordmark, CoachWordmark } from "./pdp-brand-logos";

/** Content height of the brand bar (excludes the top safe-area inset) */
export const PDP_BRAND_BAR_HEIGHT = 52;

type Brand = "coach" | "outlet";

const SEGMENT_BASE =
  "flex h-[30px] items-center justify-center rounded-full px-4 transition-[background-color,box-shadow,color] duration-200 ease-out pdp-pressable";
const SEGMENT_ACTIVE = "bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.12)]";
const SEGMENT_INACTIVE = "text-neutral-500";

/**
 * Brand selector — a white strip above the hero that scrolls away with the
 * page. Visual-only toggle between the two house brand wordmarks (SVG logos,
 * never text), matching the Paper "On land" frame.
 */
export function PdpBrandBar({ onSelect }: { onSelect?: () => void }) {
  const [brand, setBrand] = useState<Brand>("coach");

  const handleSelect = (next: Brand) => {
    setBrand(next);
    onSelect?.();
  };

  return (
    <div
      data-header-surface="light"
      className="w-full border-b border-neutral-100 bg-white"
      style={{ paddingTop: "var(--pdp-safe-area-top)" }}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: PDP_BRAND_BAR_HEIGHT }}
      >
        <div
          role="group"
          aria-label="Choose brand"
          className="flex rounded-full bg-[#ECECEC] p-[3px]"
        >
          <button
            type="button"
            aria-pressed={brand === "coach"}
            onClick={() => handleSelect("coach")}
            className={cn(
              SEGMENT_BASE,
              brand === "coach" ? SEGMENT_ACTIVE : SEGMENT_INACTIVE,
            )}
          >
            <CoachWordmark className="h-2.5 w-auto" />
            <span className="sr-only">Coach</span>
          </button>
          <button
            type="button"
            aria-pressed={brand === "outlet"}
            onClick={() => handleSelect("outlet")}
            className={cn(
              SEGMENT_BASE,
              brand === "outlet" ? SEGMENT_ACTIVE : SEGMENT_INACTIVE,
            )}
          >
            <CoachOutletWordmark className="h-[11px] w-auto" />
            <span className="sr-only">Coach Outlet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
