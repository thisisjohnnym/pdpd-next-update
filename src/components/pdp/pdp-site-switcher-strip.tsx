"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { pdpPressableClass, pdpType } from "./pdp-type";

/** Content height of the slim site switcher (excludes the top safe-area inset). */
const PDP_SITE_SWITCHER_STRIP_HEIGHT = 32;

type SiteBrand = "coach" | "outlet";

/**
 * Minimal Coach / Outlet text tabs — pinned above the overlay header on v5.
 * Visual-only toggle (no navigation), lighter than `PdpBrandBar`.
 */
// fallow-ignore-next-line complexity
export function PdpSiteSwitcherStrip({
  includeSafeArea = true,
  inert = false,
  className,
}: {
  /** When true, owns `paddingTop: var(--pdp-safe-area-top)`. */
  includeSafeArea?: boolean;
  /** When collapsed/tucked, remove from the a11y tree and hit-testing. */
  inert?: boolean;
  className?: string;
}) {
  const [brand, setBrand] = useState<SiteBrand>("coach");

  return (
    <div
      data-header-surface="light"
      data-pdp-site-switcher
      inert={inert || undefined}
      className={cn(
        "w-full border-b border-neutral-100 bg-white/95 backdrop-blur-[8px]",
        className,
      )}
      style={
        includeSafeArea
          ? { paddingTop: "var(--pdp-safe-area-top)" }
          : undefined
      }
    >
      <div
        role="group"
        aria-label="Choose site"
        className="flex items-center justify-center gap-2"
        style={{ height: PDP_SITE_SWITCHER_STRIP_HEIGHT }}
      >
        <button
          type="button"
          aria-pressed={brand === "coach"}
          onClick={() => setBrand("coach")}
          className={cn(
            pdpType.micro,
            "px-1 transition-colors duration-200 ease-out",
            pdpPressableClass,
            brand === "coach" ? "text-black" : "text-neutral-500",
          )}
        >
          Coach
        </button>
        <span aria-hidden className="text-neutral-300">
          ·
        </span>
        <button
          type="button"
          aria-pressed={brand === "outlet"}
          onClick={() => setBrand("outlet")}
          className={cn(
            pdpType.micro,
            "px-1 transition-colors duration-200 ease-out",
            pdpPressableClass,
            brand === "outlet" ? "text-black" : "text-neutral-500",
          )}
        >
          Outlet
        </button>
      </div>
    </div>
  );
}
