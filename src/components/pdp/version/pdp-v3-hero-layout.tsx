"use client";

import { useCallback, useState, type RefObject } from "react";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpHeroBelowFoldColorSwatches } from "../pdp-hero-below-fold-color-swatches";
import { PdpHeroShell } from "../pdp-hero-shell";
import { useHeroEnterOnce } from "../use-hero-enter-once";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { PdpProductPrice } from "../pdp-product-price";
import { pdpProductTitleClass, pdpType } from "../pdp-type";
import { usePdpDisplayPrice } from "../use-pdp-display-price";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV5ReviewTeaser } from "./pdp-v5-review-teaser";
import { PdpV5StorePickupLink } from "./pdp-v5-store-pickup-link";

type PdpV3HeroLayoutProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  onOpenReviews?: () => void;
  onViewReviews?: () => void;
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
// fallow-ignore-next-line complexity
export function PdpV3HeroLayout({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onColorSheetOpenChange,
  onOpenReviews,
  onViewReviews,
  onOpenArTryOn,
  sentinelRef,
}: PdpV3HeroLayoutProps) {
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const {
    useV4ModuleSpacing,
    hideBuyBarColorLabel,
    heroMaterialSubtitleLine,
    hideDockedBuyBarColor,
    inlineBuyBarColorSwatches,
    useCompactBuyBarColorDots,
    heroColorTrayOverlay,
    playHeroLandIntro,
    showStorePickupLink,
    showSubtleReviewTeaser,
    showFloatingBuyBar,
    floatingBuyBarWhenHeroHidden,
  } = getPdpVersionConfig(usePdpVersion());
  const usesPersistentAtb =
    showFloatingBuyBar && !floatingBuyBarWhenHeroHidden;
  const placeAtbAfterPickup = showStorePickupLink && !showFloatingBuyBar;
  const [swatchesExpanded, setSwatchesExpanded] = useState(false);
  // Expand reveals more chips via horizontal scroll — buy-bar height stays put.
  const heroAllowGrow = false;
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const displayPrice = usePdpDisplayPrice(summary.price);
  const heroEnterOnce = useHeroEnterOnce();
  const playLandIntro = playHeroLandIntro && heroEnterOnce;
  const [trayPortalRoot, setTrayPortalRoot] = useState<HTMLElement | null>(
    null,
  );
  const trayRootRef = useCallback((node: HTMLDivElement | null) => {
    setTrayPortalRoot(node);
  }, []);

  return (
    <>
      <PdpHeroShell allowGrow={heroAllowGrow}>
        {/* Full-land overlay host — covers gallery + docked footer, not just the image. */}
        <div
          ref={trayRootRef}
          className="pointer-events-none absolute inset-0 z-[42] col-span-full row-span-full"
          aria-hidden
        />

        <div className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <PdpGalleryHero
            onOpenReviews={onOpenReviews}
            onOpenArTryOn={onOpenArTryOn}
            fillFrame
          />
        </div>

        <footer
          className={cn(
            "pdp-hero-docked-footer flex min-w-0 w-full shrink-0 flex-col bg-white",
            useCompactBuyBarColorDots
              ? "gap-0 px-0 pb-0 pt-0"
              : useV4ModuleSpacing
                ? "gap-4 px-4 pt-4 pb-4"
                : "gap-2 px-2 pt-2 pb-2",
            inlineBuyBarColorSwatches && "border-0",
            playLandIntro && "pdp-v5-hero-footer-enter",
          )}
        >
          {useCompactBuyBarColorDots ? (
            <div className="flex min-w-0 w-full flex-col gap-3 px-3 pt-4 pb-4 lg:gap-4 lg:px-5 lg:pt-5 lg:pb-5">
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex min-w-0 items-baseline justify-between gap-x-3">
                  <p
                    className={cn(
                      pdpProductTitleClass,
                      "min-w-0 text-pretty text-lg leading-tight text-black",
                    )}
                  >
                    {summary.name}
                  </p>
                  <PdpProductPrice
                    price={displayPrice.price}
                    compareAtPrice={displayPrice.compareAtPrice}
                    className="shrink-0 text-lg leading-tight"
                  />
                </div>
                <div className="flex min-w-0 items-center justify-between gap-x-3">
                  <p
                    className={cn(
                      pdpType.body,
                      "min-w-0 leading-none text-neutral-600",
                    )}
                  >
                    in {summary.subtitle}
                  </p>
                  {heroColorTrayOverlay ? (
                    <PdpBuyBarCompactColor
                      selectedColorId={selectedColorId}
                      onColorSelect={onColorSelect}
                      onColorSheetOpenChange={onColorSheetOpenChange}
                      variant="compact"
                      trayPortalRoot={trayPortalRoot}
                    />
                  ) : null}
                </div>
              </div>
              {!heroColorTrayOverlay ? (
                <div className="-mx-3 min-w-0 w-[calc(100%+1.5rem)] px-3 lg:-mx-5 lg:w-[calc(100%+2.5rem)] lg:px-5">
                  <PdpBuyBarCompactColor
                    selectedColorId={selectedColorId}
                    onColorSelect={onColorSelect}
                    onColorSheetOpenChange={onColorSheetOpenChange}
                    variant="rail"
                    swatchesExpanded={swatchesExpanded}
                    onSwatchesExpandedChange={setSwatchesExpanded}
                    className="min-w-0"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <p className={cn(pdpProductTitleClass, "min-w-0 flex-1 truncate py-1 -my-1 text-base leading-none")}>
                  {summary.name}
                </p>
                <PdpProductPrice
                  price={displayPrice.price}
                  compareAtPrice={displayPrice.compareAtPrice}
                  className="shrink-0 text-base leading-none text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p
                  className={cn(
                    pdpProductTitleClass,
                    "min-w-0 flex-1 truncate py-1 -my-1 leading-none",
                    heroMaterialSubtitleLine
                      ? cn(pdpType.label, "text-neutral-500")
                      : "text-xs text-neutral-900",
                  )}
                >
                  {heroMaterialSubtitleLine ? summary.subtitle : `in ${summary.subtitle}`}
                </p>
              </div>
            </div>
          )}

          {!usesPersistentAtb && !placeAtbAfterPickup ? (
            <>
              <PdpBuyBarRow
                selectedColorId={selectedColorId}
                onColorSelect={onColorSelect}
                onAddToBag={onAddToBag}
                onColorSheetOpenChange={onColorSheetOpenChange}
                hideColor={inlineBuyBarColorSwatches || hideDockedBuyBarColor}
                hideColorLabel={hideBuyBarColorLabel}
                inlineColorSwatches={false}
                landCta={useCompactBuyBarColorDots}
                className={cn(
                  useCompactBuyBarColorDots
                    ? "px-3 pb-3 lg:px-5 lg:pb-4"
                    : useV4ModuleSpacing
                      ? "gap-3"
                      : "gap-2",
                )}
              />
              {showSubtleReviewTeaser && onViewReviews ? (
                <div
                  className={cn(
                    useCompactBuyBarColorDots ? "px-3 pb-3 lg:px-5 lg:pb-4" : null,
                  )}
                >
                  <PdpV5ReviewTeaser onViewReviews={onViewReviews} />
                </div>
              ) : null}
            </>
          ) : null}
        </footer>

        <div ref={sentinelRef} aria-hidden className="h-0 w-full shrink-0 overflow-hidden" />
      </PdpHeroShell>

      {showStorePickupLink ||
      (showSubtleReviewTeaser &&
        onViewReviews &&
        (placeAtbAfterPickup || usesPersistentAtb)) ? (
        <div className="relative z-[1] -mt-px flex flex-col gap-2.5 border-0 bg-white px-3 pb-3 pt-3 shadow-none outline-none lg:px-5">
          {placeAtbAfterPickup ? (
            <PdpBuyBarRow
              selectedColorId={selectedColorId}
              onColorSelect={onColorSelect}
              onAddToBag={onAddToBag}
              onColorSheetOpenChange={onColorSheetOpenChange}
              hideColor
              inlineColorSwatches={false}
              landCta
            />
          ) : null}
          {showSubtleReviewTeaser &&
          onViewReviews &&
          (placeAtbAfterPickup || usesPersistentAtb) ? (
            <PdpV5ReviewTeaser onViewReviews={onViewReviews} />
          ) : null}
          {showStorePickupLink ? <PdpV5StorePickupLink /> : null}
        </div>
      ) : null}

      {inlineBuyBarColorSwatches && !useCompactBuyBarColorDots ? (
        <PdpHeroBelowFoldColorSwatches
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
        />
      ) : null}
    </>
  );
}
