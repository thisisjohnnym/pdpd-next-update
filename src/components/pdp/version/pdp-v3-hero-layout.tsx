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
import { pdpProductPriceClass, pdpProductTitleClass, pdpType } from "../pdp-type";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV6MobileHeroLayout } from "./pdp-v6-mobile-hero-layout";

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
  } = getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const heroEnterOnce = useHeroEnterOnce();
  const playLandIntro = playHeroLandIntro && heroEnterOnce && !introReveal;

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
              "pdp-hero-docked-footer flex shrink-0 flex-col bg-white",
              introReveal && "pdp-hero-intro-chrome",
              useV4ModuleSpacing ? "gap-4 px-4 pt-4" : "gap-2 px-2 pt-2",
              useV4ModuleSpacing ? "pb-4" : "pb-2",
              inlineBuyBarColorSwatches && "border-0",
              playLandIntro && "pdp-v5-hero-footer-enter",
            )}
          >
            {useCompactBuyBarColorDots ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
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
                <div className="flex items-center justify-between gap-3">
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
                  <PdpBuyBarCompactColor
                    selectedColorId={selectedColorId}
                    onColorSelect={onColorSelect}
                    onColorSheetOpenChange={onColorSheetOpenChange}
                    className="shrink-0"
                  />
                </div>
              </div>
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

          <div
            ref={sentinelRef}
            aria-hidden
            className="h-0 w-full shrink-0 overflow-hidden"
          />
        </PdpHeroShell>
      </div>

      {inlineBuyBarColorSwatches && !useCompactBuyBarColorDots ? (
        <div className={cn(introReveal && "pdp-hero-intro-chrome")}>
          <PdpHeroBelowFoldColorSwatches
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
          />
        </div>
      ) : null}
    </>
  );
}
