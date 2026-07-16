"use client";

import { useState } from "react";

import { useActiveProduct } from "./pdp-active-product-context";
import { PdpColorSheet } from "./pdp-color-sheet";
import { PdpCompactColorDots } from "./pdp-compact-color-dots";
import { pdpColorIsSelectable } from "./pdp-data";
import { getPdpColors } from "./pdp-product-colors";
import { getTabbyColorSheetGroups } from "./pdp-tabby-color-sheet-groups";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { getV5ColorSwatchGroups } from "./version/pdp-v3-color-sheet-sections";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3ColorSheet } from "./version/pdp-v3-color-sheet";

type PdpBuyBarCompactColorProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  /** Full scrollable bag-swatch rail vs compact +N chips */
  variant?: "compact" | "rail";
  className?: string;
};

/** Compact swatch row — tap a color to select; tap +N to open the full tray. */
// fallow-ignore-next-line complexity
export function PdpBuyBarCompactColor({
  selectedColorId,
  onColorSelect,
  onColorSheetOpenChange,
  variant = "compact",
  className,
}: PdpBuyBarCompactColorProps) {
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const {
    compactBuyBarColorDotCount,
    flatColorSheet,
    heroColorSwatchMoreCountOverride,
    useV3ColorSheet,
  } = getPdpVersionConfig(usePdpVersion());
  const [colorSheetOpen, setColorSheetOpen] = useState(false);

  const showAllTabbyOptionsInline =
    isTabbyProduct && variant === "rail" && flatColorSheet;
  const allTabbyRailOptions = showAllTabbyOptionsInline
    ? getV5ColorSwatchGroups(tabby!.size).flatMap((group) =>
        group.entries.map((entry) => ({
          ...entry.color,
          styleId: entry.styleId,
          selectionId: `${entry.styleId}:${entry.color.id}`,
          selectionLabel: `${entry.color.name} in ${entry.materialLabel}`,
          groupLabel: entry.materialLabel,
        })),
      )
    : [];
  const colors = showAllTabbyOptionsInline
    ? allTabbyRailOptions
    : isTabbyProduct
      ? tabby!.colorOptions
      : getPdpColors(productId);
  const activeColorId = showAllTabbyOptionsInline
    ? `${tabby!.styleId}:${tabby!.selectedColorId}`
    : isTabbyProduct
      ? tabby!.selectedColorId
      : selectedColorId;
  const colorGroups = isTabbyProduct
    ? getTabbyColorSheetGroups(tabby!.styleId, tabby!.size)
    : undefined;

  const setSheetOpen = (open: boolean) => {
    setColorSheetOpen(open);
    onColorSheetOpenChange?.(open);
  };

  // fallow-ignore-next-line complexity
  const handleColorSelect = (id: string) => {
    if (showAllTabbyOptionsInline) {
      const option = allTabbyRailOptions.find(
        (entry) => entry.selectionId === id,
      );

      if (
        !option ||
        !option.combinationAvailable ||
        !pdpColorIsSelectable(option.availability)
      ) {
        return;
      }

      tabby!.selectColorInStyle(option.styleId, option.id);
      return;
    }

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
        variant={variant}
        onSelect={handleColorSelect}
        onOpenSheet={() => setSheetOpen(true)}
        className={className}
      />
    </>
  );
}
