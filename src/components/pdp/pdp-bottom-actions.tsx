"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

import { PdpBuyBarRow } from "./pdp-buy-bar-row";
import { CTA_BAR_GAP_PX, CTA_BAR_PADDING_PX } from "./pdp-hero-tokens";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { useCtaBarHeight } from "./use-cta-bar-height";
import { useHeroEnterOnce } from "./use-hero-enter-once";
import { usePdpChromeMode } from "./use-pdp-chrome-mode";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

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

  const { showSectionJumpBar } = getPdpVersionConfig(usePdpVersion());
  const { jumpBarActive } = usePdpChromeMode(mounted);

  useCtaBarHeight(barRef, mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // r4 (v3) keeps the floating buy bar instead of swapping to the jump bar.
  const hiddenByJumpBar = showSectionJumpBar && jumpBarActive;
  const chromeHidden = suppressed || colorSheetOpen || hiddenByJumpBar;

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
        paddingLeft: `calc(${CTA_BAR_PADDING_PX}px + var(--hero-inset, 0px))`,
        paddingRight: `calc(${CTA_BAR_PADDING_PX}px + var(--hero-inset, 0px))`,
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
