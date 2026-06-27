"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

import { PdpBuyBarRow } from "./pdp-buy-bar-row";
import { CTA_BAR_GAP_PX, CTA_BAR_PADDING_PX } from "./pdp-hero-tokens";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { useCtaBarHeight } from "./use-cta-bar-height";
import { useHeroEnterOnce } from "./use-hero-enter-once";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed floating CTA bar — Color + Add to bag (docs/pdp-hero-chrome.md). */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const playHeroEnter = useHeroEnterOnce();

  useCtaBarHeight(barRef, mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const chromeHidden = suppressed || colorSheetOpen;

  return createPortal(
    <footer
      ref={barRef}
      data-floating-cta-bar
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 transition-transform duration-300 ease-out",
        chromeHidden ? "translate-y-full" : "translate-y-0",
      )}
      style={{
        bottom: BOTTOM_CHROME_OFFSET,
        padding: CTA_BAR_PADDING_PX,
        paddingLeft: `calc(${CTA_BAR_PADDING_PX}px + var(--hero-inset, calc(var(--hero-reveal, 0) * 8px)))`,
        paddingRight: `calc(${CTA_BAR_PADDING_PX}px + var(--hero-inset, calc(var(--hero-reveal, 0) * 8px)))`,
      }}
    >
      <div
        className={cn(
          "pointer-events-auto w-full",
          playHeroEnter && "pdp-hero-bottom-enter",
        )}
        style={{ gap: CTA_BAR_GAP_PX }}
      >
        <PdpBuyBarRow
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
          onAddToBag={onAddToBag}
          onColorSheetOpenChange={setColorSheetOpen}
          className="gap-2.5"
        />
      </div>
    </footer>,
    document.body,
  );
}
