"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { getColorChromeForeground, getColorChromeGlow, isDarkColorChrome } from "./pdp-color-chrome";
import { PDP_COLORS, pdpColorIsSelectable } from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { PdpToast } from "./pdp-toast";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { pdpPressableSolidClass } from "./pdp-type";
import { useBottomBarDocked } from "./use-bottom-bar-docked";
import { useHeroEnterOnce } from "./use-hero-enter-once";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — Style · Size · Color + Add to bag */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const { docked, frostOpacity } = useBottomBarDocked();
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const playHeroEnter = useHeroEnterOnce();

  const colors = isTabbyProduct ? tabby!.colorOptions : PDP_COLORS;
  const activeColorId = isTabbyProduct ? tabby!.selectedColorId : selectedColorId;
  const selectedColor =
    (isTabbyProduct
      ? tabby!.colors.find((entry) => entry.id === activeColorId)
      : colors.find((entry) => entry.id === activeColorId)) ?? colors[0];
  const atbChromeSample = selectedColor?.chromeSample ?? "#0a0a0a";
  const atbForeground = getColorChromeForeground(atbChromeSample);
  const atbGlow = getColorChromeGlow(atbChromeSample);
  const isDarkChrome = isDarkColorChrome(atbChromeSample);
  /** Dark chrome on the docked hero scrim — rounded pill instead of flush bar */
  const atbNeedsContrastOnScrim = docked && isDarkChrome;
  /** Non-Tabby dark chrome — inset float vs flush bar row */
  const atbFloatsWhenDocked = atbNeedsContrastOnScrim && !isTabbyProduct;
  /** Tabby + dark chrome on scrim use rounded pills */
  const atbUsesRoundedPill = !docked || atbNeedsContrastOnScrim || isTabbyProduct;
  const variantSheetOpen = colorSheetOpen;

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

  /** Match PageGrid margins (12px mobile / 20px desktop) — aligns with hero product HUD */
  const dockedContentInset = docked ? "px-3 lg:px-5" : "";

  const variantRow = (
    <div
      className={cn(
        "flex items-center",
        isTabbyProduct ? "min-w-0 flex-[2]" : "shrink-0",
        !atbFloatsWhenDocked && !isTabbyProduct && dockedContentInset,
      )}
    >
      <PdpColorSelector
        colors={colors}
        selectedId={activeColorId}
        onSelect={handleColorSelect}
        inline
        stretch={isTabbyProduct}
        onOpenChange={setColorSheetOpen}
      />
    </div>
  );

  const addToBagButton = (
    <button
      type="button"
      onClick={onAddToBag}
      className={cn(
        "font-extended relative isolate flex min-w-0 w-full items-center justify-center gap-2 overflow-hidden text-center leading-none transition-[border-radius,background-color,color,box-shadow,transform,filter] duration-300",
        pdpPressableSolidClass,
        "active:brightness-90",
        atbUsesRoundedPill
          ? "h-12 rounded-full px-3"
          : "h-[54px] rounded-none px-4",
      )}
      style={{
        backgroundColor: atbChromeSample,
        color: atbForeground,
        boxShadow: atbGlow,
      }}
    >
      <span className="relative z-[1] flex min-w-0 items-center justify-center gap-2">
        <MaterialIcon
          name="shopping_bag"
          size={18}
          className="shrink-0 -translate-y-px"
          style={{ color: atbForeground }}
          aria-hidden
        />
        <span className="translate-y-px text-[12px]">Add to bag</span>
      </span>
    </button>
  );

  const addToBagSlot =
    isTabbyProduct ? (
      <div className="min-w-0 flex-[3]">{addToBagButton}</div>
    ) : atbFloatsWhenDocked ? (
      <div className={dockedContentInset}>{addToBagButton}</div>
    ) : (
      addToBagButton
    );

  const bar = (
    <div
      className={cn(
        "flex w-full items-stretch transition-[gap,padding] duration-300 ease-out",
        isTabbyProduct ? "gap-1.5" : "gap-2",
        (atbFloatsWhenDocked || (isTabbyProduct && docked)) && dockedContentInset,
        playHeroEnter && "pdp-hero-bottom-enter",
      )}
    >
      {variantRow}
      {addToBagSlot}
    </div>
  );

  return createPortal(
    <>
      {isTabbyProduct && tabby?.adjustment ? (
        <PdpToast
          message={tabby.adjustment.message}
          open={Boolean(tabby.adjustment)}
          onClose={tabby.dismissAdjustment}
        />
      ) : null}

      <div
        aria-hidden
        className={cn(
          "pdp-bottom-frost-gradient pointer-events-none fixed inset-x-0 bottom-0 z-[39] transition-[transform,opacity] duration-300 ease-out",
          suppressed ? "translate-y-full opacity-0" : "translate-y-0",
          docked
            ? "pdp-bottom-frost-gradient--docked h-[calc(6.5rem+var(--pdp-fixed-bottom-offset))]"
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
