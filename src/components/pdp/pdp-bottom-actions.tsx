"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpBuyBarRow } from "./pdp-buy-bar-row";
import { PdpColorSelector } from "./pdp-color-selector";
import { getAtbChromeFromColorSample } from "./pdp-color-chrome";
import { useTabbyFamilyCompareExperiment } from "./experiments/tabby-family-compare-flag";
import { pdpColorIsSelectable } from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpColors } from "./pdp-product-colors";
import { PdpSizeSelector } from "./pdp-size-selector";
import { PdpStyleSelector } from "./pdp-style-selector";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { useBottomBarDocked } from "./use-bottom-bar-docked";
import { useHeroEnterOnce } from "./use-hero-enter-once";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — control: Color + ATB · experiment: Style · Size · Color + ATB */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [styleSheetOpen, setStyleSheetOpen] = useState(false);
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const { docked, frostOpacity } = useBottomBarDocked();
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const tabbyExperiment = useTabbyFamilyCompareExperiment();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const showTabbyConfigurator = isTabbyProduct && tabbyExperiment;
  const playHeroEnter = useHeroEnterOnce();

  const colors = isTabbyProduct ? tabby!.colorOptions : getPdpColors(productId);
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;
  const selectedColor =
    (isTabbyProduct
      ? tabby!.colors.find((entry) => entry.id === activeColorId)
      : colors.find((entry) => entry.id === activeColorId)) ?? colors[0];
  const atbChrome = getAtbChromeFromColorSample(selectedColor?.chromeSample ?? "#0a0a0a");
  const isDarkChrome = atbChrome.isDarkBackdrop;
  const atbUsesRoundedPill =
    !docked || showTabbyConfigurator || isDarkChrome || isTabbyProduct;
  const variantSheetOpen = styleSheetOpen || sizeSheetOpen || colorSheetOpen;
  const dockedContentInset = docked ? "px-3 lg:px-5" : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleColorSelect = (id: string) => {
    const color = colors.find((entry) => entry.id === id);
    const combinationAvailable =
      !color ||
      !("combinationAvailable" in color) ||
      color.combinationAvailable;

    if (
      !color ||
      !combinationAvailable ||
      !pdpColorIsSelectable(color.availability)
    ) {
      return;
    }

    if (isTabbyProduct) {
      tabby!.setSelectedColorId(id);
      return;
    }

    onColorSelect(id);
  };

  const simpleBuyBar = (
    <PdpBuyBarRow
      selectedColorId={selectedColorId}
      onColorSelect={onColorSelect}
      onAddToBag={onAddToBag}
      onColorSheetOpenChange={setColorSheetOpen}
      squared={!atbUsesRoundedPill}
      elevated={!docked}
    />
  );

  const variantRow = showTabbyConfigurator ? (
    <div className={cn("flex w-full items-stretch gap-2", dockedContentInset)}>
      <PdpStyleSelector onOpenChange={setStyleSheetOpen} stretch />
      <PdpSizeSelector onOpenChange={setSizeSheetOpen} stretch />
      <PdpColorSelector
        colors={colors}
        selectedId={activeColorId}
        onSelect={handleColorSelect}
        inline
        stretch
        onOpenChange={setColorSheetOpen}
        elevated={!docked}
      />
    </div>
  ) : null;

  const bar = showTabbyConfigurator ? (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-stretch gap-2 transition-[gap,padding] duration-300 ease-out",
        playHeroEnter && "pdp-hero-bottom-enter",
      )}
    >
      {variantRow}
      <div className={cn("flex w-full min-w-0 items-stretch gap-2", dockedContentInset)}>
        <PdpBuyBarRow
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
          onAddToBag={onAddToBag}
          hideColor
          elevated={!docked}
        />
      </div>
    </div>
  ) : (
    <div
      className={cn(
        "flex w-full items-stretch gap-2 transition-[gap,padding] duration-300 ease-out",
        isTabbyProduct ? "gap-1.5" : "gap-2",
        isTabbyProduct && docked && dockedContentInset,
        playHeroEnter && "pdp-hero-bottom-enter",
      )}
    >
      {simpleBuyBar}
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
            ? showTabbyConfigurator
              ? "pdp-bottom-frost-gradient--docked h-[calc(9.5rem+var(--pdp-fixed-bottom-offset))]"
              : "pdp-bottom-frost-gradient--docked h-[calc(6.5rem+var(--pdp-fixed-bottom-offset))]"
            : "pdp-bottom-frost-gradient--prominent h-[calc(15rem+var(--pdp-fixed-bottom-offset))]",
        )}
        style={{ opacity: suppressed || variantSheetOpen || docked ? 0 : frostOpacity }}
      />

      <footer
        className={cn(
          "pointer-events-none fixed inset-x-0 z-40 transition-[transform,padding] duration-300 ease-out",
          suppressed || variantSheetOpen ? "translate-y-full" : "translate-y-0",
        )}
        style={{
          bottom: BOTTOM_CHROME_OFFSET,
          paddingBottom: atbUsesRoundedPill ? "0.625rem" : 0,
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
