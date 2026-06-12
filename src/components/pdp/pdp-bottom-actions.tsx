"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
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
  const docked = useBottomBarDocked();

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
        docked ? "grid w-full grid-cols-2 gap-0" : "flex gap-1",
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
        type="button"
        onClick={onAddToBag}
        className={cn(
          "font-extended flex w-full min-w-0 items-center justify-center text-center leading-none tracking-[0.2px] transition-[border-radius] duration-300",
          docked
            ? "h-[54px] rounded-none border-0 bg-white px-4 text-sm text-neutral-950 shadow-none"
            : "pdp-glass-light h-12 flex-1 rounded-full border-0 px-3.5 text-xs shadow-none",
        )}
      >
        <span className="translate-y-px">Add to Bag</span>
      </button>
    </div>
  );

  return createPortal(
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
          "relative transition-[padding] duration-300 ease-out",
          docked ? "pt-0" : "bg-transparent pt-2.5",
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
    </footer>,
    document.body,
  );
}
