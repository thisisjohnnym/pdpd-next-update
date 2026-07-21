"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useActiveProduct } from "./pdp-active-product-context";
import { PdpColorSheet } from "./pdp-color-sheet";
import { PdpCompactColorDots } from "./pdp-compact-color-dots";
import { PdpHeroColorTray } from "./pdp-hero-color-tray";
import { pdpColorIsSelectable } from "./pdp-data";
import { getPdpColors } from "./pdp-product-colors";
import { getTabbyColorSheetGroups } from "./pdp-tabby-color-sheet-groups";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import type { TabbySize } from "./pdp-tabby-variants";
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
  /**
   * When set, the hero color tray portals into this node (gallery frame).
   * Used with `heroColorTrayOverlay`.
   */
  trayPortalRoot?: HTMLElement | null;
  className?: string;
};

/** Compact swatch row — tap opens the color tray (hero overlay or full sheet). */
// fallow-ignore-next-line complexity
export function PdpBuyBarCompactColor({
  selectedColorId,
  onColorSelect,
  onColorSheetOpenChange,
  variant = "compact",
  trayPortalRoot,
  className,
}: PdpBuyBarCompactColorProps) {
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const {
    compactBuyBarColorDotCount,
    flatColorSheet,
    heroColorSwatchMoreCountOverride,
    heroColorTrayOverlay,
    useV3ColorSheet,
  } = getPdpVersionConfig(usePdpVersion());
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const useHeroTray = heroColorTrayOverlay && variant === "compact";
  /**
   * Pin the rail’s lead material to the land style (and size). Re-sorting on
   * every swatch tap made Soft Leather jump to the front and shift the row.
   */
  const railLeadKeyRef = useRef<{ size: TabbySize; material: string } | null>(
    null,
  );

  const showAllTabbyOptionsInline =
    isTabbyProduct && variant === "rail" && flatColorSheet;
  const allTabbyRailOptions = showAllTabbyOptionsInline
    ? (() => {
        const size = tabby!.size;
        const entries = getV5ColorSwatchGroups(size).flatMap((group) =>
          group.entries.map((entry) => ({
            ...entry.color,
            styleId: entry.styleId,
            selectionId: `${entry.styleId}:${entry.color.id}`,
            selectionLabel: `${entry.color.name} in ${entry.materialLabel}`,
            groupLabel: entry.materialLabel,
          })),
        );
        const pinned = railLeadKeyRef.current;
        if (!pinned || pinned.size !== size) {
          const landMaterial = entries.find(
            (entry) => entry.styleId === tabby!.styleId,
          )?.groupLabel;
          railLeadKeyRef.current = {
            size,
            material: landMaterial ?? "",
          };
        }
        const leadMaterial = railLeadKeyRef.current?.material ?? "";
        if (!leadMaterial) return entries;
        const lead = entries.filter(
          (entry) => entry.groupLabel === leadMaterial,
        );
        const rest = entries.filter(
          (entry) => entry.groupLabel !== leadMaterial,
        );
        return [...lead, ...rest];
      })()
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

  const tray = useHeroTray ? (
    <PdpHeroColorTray
      open={colorSheetOpen}
      onClose={() => setSheetOpen(false)}
      selectedColorId={isTabbyProduct ? tabby!.selectedColorId : selectedColorId}
      onColorSelect={handleColorSelect}
      position={trayPortalRoot ? "absolute" : "fixed"}
    />
  ) : null;

  const portaledTray =
    tray && trayPortalRoot && typeof document !== "undefined"
      ? createPortal(tray, trayPortalRoot)
      : tray;

  return (
    <>
      {useHeroTray ? null : useV3ColorSheet && isTabbyProduct ? (
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

      {portaledTray}

      <PdpCompactColorDots
        colors={colors}
        selectedId={activeColorId}
        previewCount={compactBuyBarColorDotCount}
        moreCountOverride={heroColorSwatchMoreCountOverride}
        variant={variant}
        openOnInteract={useHeroTray}
        onSelect={handleColorSelect}
        onOpenSheet={() => setSheetOpen(true)}
        className={className}
      />
    </>
  );
}
