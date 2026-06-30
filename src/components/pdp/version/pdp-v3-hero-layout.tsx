"use client";

import { type RefObject } from "react";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import { PdpBuyBarRow } from "../pdp-buy-bar-row";
import { PdpGalleryHero } from "../pdp-gallery-view";
import { PdpHeroShell } from "../pdp-hero-shell";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";

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
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;

  return (
    <PdpHeroShell>
      <PdpGalleryHero
        onOpenReviews={onOpenReviews}
        onOpenArTryOn={onOpenArTryOn}
        fillFrame
      />

      <footer className="flex shrink-0 flex-col gap-2 bg-white p-2">
        <div className="flex items-start justify-between gap-4">
          <div className="font-extended flex min-w-0 flex-col text-neutral-900">
            <p className="min-w-0 truncate text-base leading-[115%] tracking-[0.4px]">
              {summary.name}
            </p>
            <p className="min-w-0 truncate text-xs leading-[115%] tracking-[0.4px] text-neutral-900">
              in {summary.subtitle}
            </p>
          </div>
          <p className="font-extended shrink-0 text-base leading-none tabular-nums text-neutral-900">
            {summary.price}
          </p>
        </div>

        <PdpBuyBarRow
          selectedColorId={selectedColorId}
          onColorSelect={onColorSelect}
          onAddToBag={onAddToBag}
          onColorSheetOpenChange={onColorSheetOpenChange}
          className={cn("gap-1")}
        />
      </footer>

      <div ref={sentinelRef} aria-hidden className="h-px w-full shrink-0" />
    </PdpHeroShell>
  );
}
