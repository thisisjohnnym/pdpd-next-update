"use client";

import { type RefObject, useRef } from "react";

import { cn } from "@/lib/cn";

import { PdpHero360IntroProvider } from "../pdp-hero-360-intro-context";
import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpHeroBelowFoldColorSwatches } from "../pdp-hero-below-fold-color-swatches";
import { PdpHeroShell } from "../pdp-hero-shell";
import { useHeroEnterOnce } from "../use-hero-enter-once";
import { useHero360IntroReveal } from "../use-hero-360-intro-reveal";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { PdpProductPrice } from "../pdp-product-price";
import { usePdpDisplayPrice } from "../use-pdp-display-price";
import { pdpProductTitleClass, pdpProductPriceClass, pdpType } from "../pdp-type";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV6MobileHeroLayout } from "./pdp-v6-mobile-hero-layout";
import { PdpV5ReviewTeaser } from "./pdp-v5-review-teaser";
import { PdpV5StorePickupLink } from "./pdp-v5-store-pickup-link";
import { PdpV7HeroMetaStrip } from "./pdp-v7-hero-meta-strip";
import { useHeroBuyBarVisibility } from "./use-hero-buy-bar-visibility";

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
 *
 * Vertical-gallery + fall-in (v6) uses `PdpV6MobileHeroLayout`. Horizontal
 * fall-in (v5) stays on the default layout with an intro provider wrapper.
 */
export function PdpV3HeroLayout(props: PdpV3HeroLayoutProps) {
  const { hero360IntroEnabled, heroVerticalGallery, desktopSplitLayout } =
    getPdpVersionConfig(usePdpVersion());

  if (hero360IntroEnabled && heroVerticalGallery) {
    return <PdpV6MobileHeroLayout {...props} />;
  }

  if (hero360IntroEnabled) {
    return (
      <PdpHero360IntroProvider enabled mobileOnly={desktopSplitLayout}>
        <PdpV3HeroLayoutDefault {...props} introReveal />
      </PdpHero360IntroProvider>
    );
  }

  return <PdpV3HeroLayoutDefault {...props} />;
}

function PdpV3HeroLayoutDefault({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onColorSheetOpenChange,
  onOpenReviews,
  onOpenArTryOn,
  sentinelRef,
  introReveal = false,
}: PdpV3HeroLayoutProps & { introReveal?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const localSentinelRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = sentinelRef ?? localSentinelRef;
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const {
    useV4ModuleSpacing,
    hideBuyBarColorLabel,
    heroMaterialSubtitleLine,
    hideDockedBuyBarColor,
    inlineBuyBarColorSwatches,
    useCompactBuyBarColorDots,
    playHeroLandIntro,
    showStorePickupLink,
    showSubtleReviewTeaser,
    heroLandColorSwatchVariant,
    heroLandStickyCtaDock,
    heroColorSwatchesExpandOnScroll,
    useHeroMetaStrip,
    showFloatingBuyBar,
    floatingBuyBarWhenHeroHidden,
  } = getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const displayPrice = usePdpDisplayPrice(summary.price);
  const heroEnterOnce = useHeroEnterOnce();
  const playLandIntro = playHeroLandIntro && heroEnterOnce && !introReveal;
  const showBelowFoldColorSwatches =
    inlineBuyBarColorSwatches &&
    (heroColorSwatchesExpandOnScroll || !useCompactBuyBarColorDots);
  const landSwatchVariant = useCompactBuyBarColorDots
    ? heroLandColorSwatchVariant
    : "dot";
  const heroScrolledPast = useHeroBuyBarVisibility(
    heroSentinelRef,
    heroColorSwatchesExpandOnScroll,
  );
  const showExpandedColorSwatches =
    showBelowFoldColorSwatches &&
    (!heroColorSwatchesExpandOnScroll || heroScrolledPast);

  const useFixedBuyBarOnly =
    showFloatingBuyBar && !floatingBuyBarWhenHeroHidden;
  const landSwatchFooter =
    useCompactBuyBarColorDots &&
    (heroLandColorSwatchVariant === "land-dock" || useFixedBuyBarOnly);
  const landDockFooter =
    useCompactBuyBarColorDots && heroLandStickyCtaDock && !useFixedBuyBarOnly;

  useHero360IntroReveal(shellRef);

  return (
    <>
      <div ref={shellRef}>
        <PdpHeroShell>
          <PdpGalleryHero
            onOpenReviews={onOpenReviews}
            onOpenArTryOn={onOpenArTryOn}
            fillFrame
          />

          <footer
            className={cn(
              "pdp-hero-docked-footer flex min-w-0 w-full shrink-0 flex-col bg-white",
              introReveal && "pdp-hero-intro-chrome",
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
              landSwatchFooter ? (
                <div className="pdp-v7-land-footer flex min-w-0 w-full flex-col">
                  <div className="flex min-w-0 w-full flex-col gap-3 px-3 pt-3">
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
                      <p
                        className={cn(
                          pdpProductTitleClass,
                          "min-w-0 text-pretty text-base leading-tight text-black lg:text-lg",
                        )}
                      >
                        {summary.name}
                      </p>
                      <PdpProductPrice
                        price={displayPrice.price}
                        compareAtPrice={displayPrice.compareAtPrice}
                        className="shrink-0 justify-self-end text-base leading-tight lg:text-lg"
                      />
                      <p
                        className={cn(
                          pdpType.label,
                          "col-start-1 min-w-0 leading-none text-neutral-400",
                        )}
                      >
                        in {summary.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="pdp-v7-land-swatch-stage min-w-0 px-3 pb-0">
                    <PdpBuyBarCompactColor
                      selectedColorId={selectedColorId}
                      onColorSelect={onColorSelect}
                      onColorSheetOpenChange={onColorSheetOpenChange}
                      variant={landSwatchVariant}
                      className="min-w-0"
                    />
                  </div>
                </div>
              ) : (
              <div className="flex min-w-0 w-full flex-col gap-3 px-3 pt-3 pb-3 lg:gap-4 lg:px-5 lg:pt-4 lg:pb-4">
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
                  <p
                    className={cn(
                      pdpProductTitleClass,
                      "min-w-0 text-pretty text-base leading-tight text-black lg:text-lg",
                    )}
                  >
                    {summary.name}
                  </p>
                  <PdpProductPrice
                    price={displayPrice.price}
                    compareAtPrice={displayPrice.compareAtPrice}
                    className="shrink-0 justify-self-end text-base leading-tight lg:text-lg"
                  />
                  <p
                    className={cn(
                      pdpType.label,
                      "col-start-1 min-w-0 leading-none text-neutral-400",
                    )}
                  >
                    in {summary.subtitle}
                  </p>
                </div>
                <div className="min-w-0 -mx-3 px-3 lg:-mx-5 lg:px-5">
                  <PdpBuyBarCompactColor
                    selectedColorId={selectedColorId}
                    onColorSelect={onColorSelect}
                    onColorSheetOpenChange={onColorSheetOpenChange}
                    variant={landSwatchVariant}
                    className="min-w-0"
                  />
                </div>
              </div>
              )
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className={cn(
                      pdpProductTitleClass,
                      "min-w-0 flex-1 truncate py-1 -my-1 text-base leading-none",
                    )}
                  >
                    {summary.name}
                  </p>
                  <p
                    className={cn(
                      pdpProductPriceClass,
                      "shrink-0 text-base leading-none text-neutral-900",
                    )}
                  >
                    {summary.price}
                  </p>
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
                    {heroMaterialSubtitleLine
                      ? summary.subtitle
                      : `in ${summary.subtitle}`}
                  </p>
                </div>
              </div>
            )}

            {!landDockFooter && !useFixedBuyBarOnly ? (
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
                    ? cn(
                        "px-3 lg:px-5",
                        heroColorSwatchesExpandOnScroll ? "pb-2" : "pb-3 lg:pb-4",
                      )
                    : useV4ModuleSpacing
                      ? "gap-3"
                      : "gap-2",
                )}
              />
            ) : null}
          </footer>

          <div
            ref={heroSentinelRef}
            aria-hidden
            className="h-0 w-full shrink-0 overflow-hidden"
          />
        </PdpHeroShell>
      </div>

      {useHeroMetaStrip && (showStorePickupLink || showSubtleReviewTeaser) ? (
        <div
          className={cn(
            "pdp-v7-hero-meta-block bg-white px-3 pt-0 pb-2 lg:px-5",
            // Outside shellRef — still tagged so boot CSS + document chrome collect hide/fade with intro.
            introReveal && "pdp-hero-intro-chrome",
          )}
        >
          <PdpV7HeroMetaStrip />
        </div>
      ) : showStorePickupLink || showSubtleReviewTeaser ? (
        <div className="flex flex-col gap-3 bg-white px-3 pb-5 pt-4 lg:px-5">
          {showStorePickupLink ? <PdpV5StorePickupLink /> : null}
          {showSubtleReviewTeaser ? (
            <PdpV5ReviewTeaser
              className={
                showStorePickupLink
                  ? "border-t border-neutral-100 pt-3"
                  : undefined
              }
            />
          ) : null}
        </div>
      ) : null}

      {showExpandedColorSwatches ? (
        <div
          className={cn(
            introReveal && "pdp-hero-intro-chrome",
            heroColorSwatchesExpandOnScroll &&
              "pdp-v7-hero-colors-expand pdp-v7-hero-colors-expand--revealed lg:hidden",
          )}
        >
          <PdpHeroBelowFoldColorSwatches
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
            scrollExpand={heroColorSwatchesExpandOnScroll}
          />
        </div>
      ) : null}
    </>
  );
}
