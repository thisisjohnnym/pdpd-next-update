"use client";

import { type RefObject } from "react";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpHeroBelowFoldColorSwatches } from "../pdp-hero-below-fold-color-swatches";
import { PdpHeroShell } from "../pdp-hero-shell";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpDisplayTracking, pdpProductPriceClass, pdpProductTitleClass, pdpType } from "../pdp-type";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV3HeroLayoutProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  /** Marks the bottom of the hero block — drives the floating buy bar handoff. */
  sentinelRef?: RefObject<HTMLDivElement | null>;
};

/**
 * v3 hero land — Paper r4 `F39-0` / `CPE-0`.
 *
 * Gallery (reveal-animated, in document flow) with the slide indicator + AR in
 * its overlay, then a white footer carrying the product name/price and the
 * docked Color + Add to bag row (`FGQ-0`). The whole block scrolls with the
 * page; the floating bar (`PdpBottomActions`) returns once the sentinel leaves
 * the viewport.
 */
export function PdpV3HeroLayout({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onColorSheetOpenChange,
  onOpenReviews,
  onOpenArTryOn,
  sentinelRef,
}: PdpV3HeroLayoutProps) {
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const { useV4ModuleSpacing, hideBuyBarColorLabel, heroMaterialSubtitleLine, hideDockedBuyBarColor, inlineBuyBarColorSwatches, useCompactBuyBarColorDots } =
    getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;

  return (
    <>
      <PdpHeroShell>
        <PdpGalleryHero
          onOpenReviews={onOpenReviews}
          onOpenArTryOn={onOpenArTryOn}
          fillFrame
        />

        <footer
          className={cn(
            "pdp-hero-docked-footer flex shrink-0 flex-col bg-white",
            useV4ModuleSpacing ? "gap-4 px-4 pt-4" : "gap-2 px-2 pt-2",
            useV4ModuleSpacing ? "pb-4" : "pb-2",
            inlineBuyBarColorSwatches && "border-0",
          )}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <p className={cn(pdpProductTitleClass, "min-w-0 flex-1 truncate text-base leading-none")}>
                {summary.name}
              </p>
              <p className={cn(pdpProductPriceClass, "shrink-0 text-base leading-none text-neutral-900")}>
                {summary.price}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p
                className={cn(
                  pdpProductTitleClass,
                  "min-w-0 flex-1 truncate leading-none",
                  heroMaterialSubtitleLine
                    ? cn(pdpType.label, "text-neutral-500")
                    : "text-xs text-neutral-900",
                )}
              >
                {heroMaterialSubtitleLine ? summary.subtitle : `in ${summary.subtitle}`}
              </p>
              {useCompactBuyBarColorDots ? (
                <PdpBuyBarCompactColor
                  selectedColorId={selectedColorId}
                  onColorSelect={onColorSelect}
                  onColorSheetOpenChange={onColorSheetOpenChange}
                  className="shrink-0"
                />
              ) : null}
            </div>
          </div>

          <PdpBuyBarRow
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
            onAddToBag={onAddToBag}
            onColorSheetOpenChange={onColorSheetOpenChange}
            hideColor={inlineBuyBarColorSwatches || hideDockedBuyBarColor}
            hideColorLabel={hideBuyBarColorLabel}
            inlineColorSwatches={false}
            className={cn(useV4ModuleSpacing ? "gap-3" : "gap-2")}
          />
        </footer>

        <div ref={sentinelRef} aria-hidden className="h-0 w-full shrink-0 overflow-hidden" />
      </PdpHeroShell>

      {inlineBuyBarColorSwatches && !useCompactBuyBarColorDots ? (
        <PdpHeroBelowFoldColorSwatches
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
        />
      ) : null}
    </>
  );
}
