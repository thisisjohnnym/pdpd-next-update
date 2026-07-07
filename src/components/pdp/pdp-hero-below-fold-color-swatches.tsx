"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { PDP_COLOR_NOTIFY_TOAST, pdpColorIsSelectable } from "./pdp-data";
import { PdpGroupedProductColorSwatchGrid } from "./pdp-grouped-product-color-swatch-grid";
import { PdpNotifySheet } from "./pdp-notify-sheet";
import { getPdpColors } from "./pdp-product-colors";
import { PdpTabbyAlsoAvailableAs } from "./pdp-tabby-also-available-as";
import { PdpToast } from "./pdp-toast";
import { getTabbyColorSwatchGroups } from "./pdp-tabby-color-swatch-groups";
import {
  isDemoColorSwatchId,
  withDemoHeroColorSwatchPlaceholders,
} from "./pdp-tabby-color-swatch-demo-placeholders";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import type { TabbySize } from "./pdp-tabby-variants";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

type PdpHeroBelowFoldColorSwatchesProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  /** Render inside the docked hero footer — no outer section padding or seam. */
  embedded?: boolean;
  /** Tuck the silhouette nav behind its heading (v5 desktop sticky panel). */
  collapsibleSilhouettes?: boolean;
};

/** Full-width color rail — sits below the hero shell so it is not above the fold. */
export function PdpHeroBelowFoldColorSwatches({
  selectedColorId,
  onColorSelect,
  embedded = false,
  collapsibleSilhouettes = false,
}: PdpHeroBelowFoldColorSwatchesProps) {
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const { useV4ModuleSpacing, demoHeroColorSwatchRow, showTabbyAlsoAvailableAs } =
    getPdpVersionConfig(usePdpVersion());
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const [notifyLabel, setNotifyLabel] = useState<string | null>(null);
  const [notifyToastOpen, setNotifyToastOpen] = useState(false);

  const colors = isTabbyProduct ? tabby!.colorOptions : getPdpColors(productId);
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;

  const tabbyGroups = useMemo(() => {
    if (!isTabbyProduct) {
      return undefined;
    }

    const groups = getTabbyColorSwatchGroups(tabby!.styleId, tabby!.size);

    return demoHeroColorSwatchRow
      ? withDemoHeroColorSwatchPlaceholders(groups, tabby!.styleId)
      : groups;
  }, [demoHeroColorSwatchRow, isTabbyProduct, tabby?.styleId, tabby?.size]);

  const displayColors = useMemo(() => {
    if (!isTabbyProduct || !tabbyGroups) {
      return colors;
    }

    const activeGroup = tabbyGroups.find((group) => group.size === tabby!.size);
    return activeGroup?.colors ?? colors;
  }, [colors, isTabbyProduct, tabby?.size, tabbyGroups]);

  const handleFamilySelect = (size: TabbySize) => {
    if (!isTabbyProduct || showTabbyAlsoAvailableAs) {
      return;
    }

    tabby!.navigateToSize(size);
  };

  const handleColorSelect = (id: string) => {
    if (isTabbyProduct) {
      const color = tabbyGroups
        ?.find((group) => group.size === tabby!.size)
        ?.colors.find((entry) => entry.id === id);

      if (!color || !color.combinationAvailable) {
        return;
      }

      if (isDemoColorSwatchId(id)) {
        if (color.availability === "notify") {
          setNotifyLabel(color.name);
        }
        return;
      }

      if (!pdpColorIsSelectable(color.availability)) {
        return;
      }

      tabby!.setSelectedColorId(id);
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

    onColorSelect(id);
  };

  return (
    <>
      <PdpToast
        message={PDP_COLOR_NOTIFY_TOAST}
        open={notifyToastOpen}
        onClose={() => setNotifyToastOpen(false)}
      />

      <PdpNotifySheet
        colorName={notifyLabel ?? undefined}
        open={notifyLabel !== null}
        onClose={() => setNotifyLabel(null)}
        onSubmit={() => {
          setNotifyLabel(null);
          setNotifyToastOpen(true);
        }}
      />

      <section
        aria-label={showTabbyAlsoAvailableAs ? "Color" : "Color and size"}
        className={cn(
          "pdp-hero-below-fold-colors w-full shrink-0 border-0 bg-white",
          embedded
            ? "px-0 pb-0 pt-3"
            : useV4ModuleSpacing
              ? "px-4 pb-4 pt-4"
              : "px-3 pb-3 pt-3",
        )}
      >
        <div
          className={cn(
            "flex flex-col",
            isTabbyProduct && showTabbyAlsoAvailableAs ? "gap-7" : "gap-8",
          )}
        >
          <PdpGroupedProductColorSwatchGrid
            colors={displayColors}
            selectedId={activeColorId}
            onSelect={handleColorSelect}
            onNotify={setNotifyLabel}
            tabbyCurrentSize={isTabbyProduct ? tabby!.size : undefined}
            tabbySizeOptions={
              isTabbyProduct && !showTabbyAlsoAvailableAs
                ? tabby!.sizeOptions
                : undefined
            }
            onFamilySelect={
              isTabbyProduct && !showTabbyAlsoAvailableAs
                ? handleFamilySelect
                : undefined
            }
            colorCarouselClassName={
              embedded
                ? "px-2 scroll-px-2"
                : useV4ModuleSpacing
                  ? "-mx-4 px-4 scroll-px-4"
                  : "-mx-3 px-3 scroll-px-3"
            }
          />

          {isTabbyProduct && showTabbyAlsoAvailableAs ? (
            <PdpTabbyAlsoAvailableAs collapsible={collapsibleSilhouettes} />
          ) : null}
        </div>
      </section>
    </>
  );
}
