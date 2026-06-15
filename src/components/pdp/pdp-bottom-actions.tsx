"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PdpFamilySizeSelector } from "./pdp-family-size-selector";
import { PDP_COLORS, PDP_FAMILY_SIZES } from "./pdp-data";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { useBottomBarDocked } from "./use-bottom-bar-docked";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  selectedFamilySizeId: string;
  onFamilySizeSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — docked flush on hero, floating pills on scroll */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  selectedFamilySizeId,
  onFamilySizeSelect,
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

  const selectors = (
    <>
      <PdpFamilySizeSelector
        options={PDP_FAMILY_SIZES.options}
        selectedId={selectedFamilySizeId}
        onSelect={onFamilySizeSelect}
        inline
        flush={docked}
        compactPill={!docked}
        iconOnly={!docked}
      />

      <PdpColorSelector
        colors={PDP_COLORS}
        selectedId={selectedColorId}
        onSelect={onColorSelect}
        inline
        flush={docked}
        compactPill={!docked}
        iconOnly={!docked}
      />
    </>
  );

  const addToBagButton = (
    <button
      type="button"
      onClick={onAddToBag}
      className={cn(
        "font-extended flex w-full min-w-0 items-center justify-center text-center leading-none tracking-[0.2px] transition-[border-radius] duration-300",
        docked
          ? "h-[54px] rounded-none border-0 bg-white px-4 text-sm text-neutral-950 shadow-none"
          : "pdp-glass-light pdp-glass-light--cta h-12 rounded-full px-4 text-sm",
      )}
    >
      <span className="translate-y-px">Add to Bag</span>
    </button>
  );

  const bar = docked ? (
    <div className="grid w-full grid-cols-3 gap-0 pdp-hero-bottom-enter">
      {selectors}
      {addToBagButton}
    </div>
  ) : (
    <div className="flex w-full flex-col gap-1.5 pdp-hero-bottom-enter">
      {addToBagButton}
      <div className="flex gap-1">{selectors}</div>
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
