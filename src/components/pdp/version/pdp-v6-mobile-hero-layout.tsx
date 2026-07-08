"use client";

import { type RefObject, useRef } from "react";

import { cn } from "@/lib/cn";

import { PdpHero360IntroProvider } from "../pdp-hero-360-intro-context";
import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarCompactColor } from "../pdp-buy-bar-compact-color";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpHeroBelowFoldColorSwatches } from "../pdp-hero-below-fold-color-swatches";
import { PdpHeroShell } from "../pdp-hero-shell";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { useHero360IntroReveal } from "../use-hero-360-intro-reveal";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type PdpV6MobileHeroLayoutProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  onColorSheetOpenChange?: (open: boolean) => void;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  sentinelRef?: RefObject<HTMLDivElement | null>;
};

/**
 * v6 mobile hero — 360° intro layer + vertical gallery + choreographed UI reveal.
 * v3–v5 never mount this component.
 */
export function PdpV6MobileHeroLayout(props: PdpV6MobileHeroLayoutProps) {
  const { hero360IntroEnabled } = getPdpVersionConfig(usePdpVersion());

  return (
    <PdpHero360IntroProvider enabled={hero360IntroEnabled}>
      <PdpV6MobileHeroLayoutInner {...props} />
    </PdpHero360IntroProvider>
  );
}

function PdpV6MobileHeroLayoutInner({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  onColorSheetOpenChange,
  onOpenReviews,
  onOpenArTryOn,
  sentinelRef,
}: PdpV6MobileHeroLayoutProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const {
    useV4ModuleSpacing,
    hideBuyBarColorLabel,
    hideDockedBuyBarColor,
    inlineBuyBarColorSwatches,
  } = getPdpVersionConfig(usePdpVersion());
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;

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
            "pdp-hero-intro-chrome pdp-hero-docked-footer flex shrink-0 flex-col bg-white",
            useV4ModuleSpacing ? "gap-4 px-4 pt-4" : "gap-2 px-2 pt-2",
            useV4ModuleSpacing ? "pb-4" : "pb-2",
            inlineBuyBarColorSwatches && "border-0",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="font-extended flex min-w-0 flex-col gap-1.5 text-neutral-900">
              <p className="min-w-0 text-base leading-[125%] tracking-[0.4px]">
                {summary.name}
              </p>
              <p className="text-base leading-none tabular-nums">
                {summary.price}
              </p>
            </div>
            <PdpBuyBarCompactColor
              selectedColorId={selectedColorId}
              onColorSelect={onColorSelect}
              onColorSheetOpenChange={onColorSheetOpenChange}
              variant="swatch"
              className="shrink-0"
            />
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
      </div>

      {inlineBuyBarColorSwatches ? (
        <div className="pdp-hero-intro-chrome">
          <PdpHeroBelowFoldColorSwatches
            selectedColorId={selectedColorId}
            onColorSelect={onColorSelect}
          />
        </div>
      ) : null}
    </>
  );
}
