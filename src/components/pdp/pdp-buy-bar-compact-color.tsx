"use client";

import { useState } from "react";

import { useActiveProduct } from "./pdp-active-product-context";
import { PdpColorSheet } from "./pdp-color-sheet";
import { PdpCompactColorDots } from "./pdp-compact-color-dots";
import { pdpColorIsSelectable } from "./pdp-data";
import { getPdpColors } from "./pdp-product-colors";
import { getTabbyColorSheetGroups } from "./pdp-tabby-color-sheet-groups";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3ColorSheet } from "./version/pdp-v3-color-sheet";

type PdpBuyBarCompactColorProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  /**
   * "dot" — +N chips (default). "swatch" — large v6 hero footer swatches.
   * "rail" — full scrollable color rail (docked land CTA).
   * "compact-swatch" — small full-bag tiles + +N (v7 land).
   * "land-dock" — large scroll rail half-cropped by docked CTA (v7 land).
   */
  variant?: "dot" | "swatch" | "rail" | "compact-swatch" | "land-dock";
  className?: string;
};

/** Compact swatch row — tap a color to select; tap +N to open the full tray. */
export function PdpBuyBarCompactColor({
  selectedColorId,
  onColorSelect,
  onColorSheetOpenChange,
  variant = "dot",
  className,
}: PdpBuyBarCompactColorProps) {
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const {
    compactBuyBarColorDotCount,
    heroColorSwatchMoreCountOverride,
    useV3ColorSheet,
  } = getPdpVersionConfig(usePdpVersion());
  const [colorSheetOpen, setColorSheetOpen] = useState(false);

  const colors = isTabbyProduct ? tabby!.colorOptions : getPdpColors(productId);
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;
  const colorGroups = isTabbyProduct
    ? getTabbyColorSheetGroups(tabby!.styleId, tabby!.size)
    : undefined;

  const setSheetOpen = (open: boolean) => {
    setColorSheetOpen(open);
    onColorSheetOpenChange?.(open);
  };

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

  return (
    <>
      {useV3ColorSheet && isTabbyProduct ? (
        <PdpV3ColorSheet open={colorSheetOpen} onClose={() => setSheetOpen(false)} />
      ) : (
        <PdpColorSheet
          colors={colors}
          selectedId={activeColorId}
          open={colorSheetOpen}
          onClose={() => setSheetOpen(false)}
          onSelect={handleColorSelect}
          groups={colorGroups}
          currentSize={isTabbyProduct ? tabby!.size : undefined}
          onSelectAtSize={
            isTabbyProduct
              ? (colorId, size) => tabby!.selectColorAtSize(colorId, size)
              : undefined
          }
        />
      )}

      <PdpCompactColorDots
        colors={colors}
        selectedId={activeColorId}
        previewCount={compactBuyBarColorDotCount}
        moreCountOverride={heroColorSwatchMoreCountOverride}
        onSelect={handleColorSelect}
        onOpenSheet={() => setSheetOpen(true)}
        variant={variant}
        className={className}
      />
    </>
  );
}
