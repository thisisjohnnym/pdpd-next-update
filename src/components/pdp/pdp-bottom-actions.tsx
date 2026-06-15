"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { pdpPressableSolidClass } from "./pdp-type";
import { useAtbShimmer } from "./use-atb-shimmer";
import { useBottomBarDocked } from "./use-bottom-bar-docked";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — docked flush on hero, floating pills on scroll */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const { docked, frostOpacity } = useBottomBarDocked();
  const atbRef = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);

  useAtbShimmer(atbRef, shimmerRef, { enabled: !suppressed });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const bar = (
    <div
      className={cn(
        "pdp-hero-bottom-enter transition-[gap,padding] duration-300 ease-out",
        docked
          ? "grid w-full grid-cols-2 gap-0"
          : "grid w-full grid-cols-2 gap-1",
      )}
    >
      <PdpColorSelector
        colors={PDP_COLORS}
        selectedId={selectedColorId}
        onSelect={onColorSelect}
        inline
        flush={docked}
        compactPill={!docked}
      />

      <button
        ref={atbRef}
        type="button"
        onClick={onAddToBag}
        className={cn(
          "font-extended relative isolate flex min-w-0 items-center justify-center gap-2 overflow-hidden bg-black text-center leading-none transition-[border-radius,background-color,transform] duration-300 active:bg-neutral-800",
          pdpPressableSolidClass,
          docked
            ? "h-[54px] w-full rounded-none border-0 px-4 shadow-none"
            : "h-12 w-full rounded-full border-0 px-3 shadow-none",
        )}
      >
        <span
          ref={shimmerRef}
          aria-hidden
          className="pdp-atb-shimmer pointer-events-none absolute inset-y-[-25%] left-0 w-[36%] -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 will-change-transform"
        />
        <MaterialIcon
          name="shopping_bag"
          size={18}
          className="relative z-[1] shrink-0 text-white"
          aria-hidden
        />
        <span className="relative z-[1] translate-y-px text-[12px] text-white">
          Add to bag
        </span>
      </button>
    </div>
  );

  return createPortal(
    <>
      <div
        aria-hidden
        className={cn(
          "pdp-bottom-frost-gradient pointer-events-none fixed inset-x-0 bottom-0 z-[39] transition-[transform,opacity] duration-300 ease-out",
          suppressed ? "translate-y-full opacity-0" : "translate-y-0",
          docked
            ? "pdp-bottom-frost-gradient--docked h-[calc(6.5rem+var(--pdp-fixed-bottom-offset))]"
            : "pdp-bottom-frost-gradient--prominent h-[calc(15rem+var(--pdp-fixed-bottom-offset))]",
        )}
        style={{ opacity: suppressed ? 0 : frostOpacity }}
      />

      <footer
        className={cn(
          "pointer-events-none fixed inset-x-0 z-40 transition-[transform,padding] duration-300 ease-out",
          suppressed ? "translate-y-full" : "translate-y-0",
        )}
        style={{
          bottom: BOTTOM_CHROME_OFFSET,
          paddingBottom: docked ? 0 : "0.625rem",
        }}
      >
        <div
          className={cn(
            "relative z-[1] transition-[padding] duration-300 ease-out",
            docked ? "pt-0" : "pt-2.5",
          )}
        >
          {docked ? (
            <div className="pointer-events-auto w-full">{bar}</div>
          ) : (
            <PageGrid fullWidth className="pointer-events-auto">
              <GridItem mobile={12} desktop={24}>{bar}</GridItem>
            </PageGrid>
          )}
        </div>
      </footer>
    </>,
    document.body,
  );
}
