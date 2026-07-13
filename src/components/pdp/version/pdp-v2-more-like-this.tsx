"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpMoreLikeThisLargeCardClass,
} from "../pdp-carousel";
import { PDP_MORE_LIKE_THIS } from "../pdp-data";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import {
  pdpPillRadiusClass,
  pdpType,
} from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import { useDragToScroll } from "../use-infinite-centered-carousel";

import {
  getMoreLikeThisCompareProduct,
  type PdpMoreLikeThisCompareProduct,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpV5MoreLikeThisCompareSheet } from "./pdp-v5-more-like-this-compare-sheet";

/** Paper B6C-0 baseline card — v5 `moreLikeThisLargeCards` uses viewport peek rail. */
const MORE_LIKE_THIS_CARD = {
  default: { width: 158, imageHeight: 198, buttonHeight: 38 },
  large: { buttonHeight: 36 },
} as const;

/**
 * v2-only simplified "More like this" module (Paper B6C-0).
 *
 * Horizontal scroll rail with fixed-width product cards and a pill "Add to bag"
 * button. v5 optionally renders larger cards via `moreLikeThisLargeCards`, and
 * a primary Compare control that opens a side-by-side details tray.
 */
export function PdpV2MoreLikeThis({
  onAddToBag,
}: {
  onAddToBag?: (id: string) => void;
}) {
  const {
    leftAlignModuleHeadings,
    squareProductCardCorners,
    useV4ModuleSpacing,
    moreLikeThisLargeCards,
    squareButtonCorners,
    showMoreLikeThisCompare,
  } = getPdpVersionConfig(usePdpVersion());
  const defaultCard = MORE_LIKE_THIS_CARD.default;
  const largeCard = MORE_LIKE_THIS_CARD.large;
  const card = moreLikeThisLargeCards ? largeCard : defaultCard;
  const { eyebrow, items } = PDP_MORE_LIKE_THIS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [compareProduct, setCompareProduct] =
    useState<PdpMoreLikeThisCompareProduct | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  useDragToScroll(scrollRef);

  const openCompare = (id: string) => {
    const product = getMoreLikeThisCompareProduct(id);
    if (!product) return;
    setCompareProduct(product);
    setCompareOpen(true);
  };

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white pt-[56px]"
    >
      <div
        className={cn(
          "mb-5 flex flex-col gap-1",
          useV4ModuleSpacing ? "px-4" : "px-3",
          leftAlignModuleHeadings ? "items-start" : "items-center",
        )}
      >
        <PdpTextReveal
          as="h2"
          className={cn(
            pdpType.headline,
            "m-0",
            leftAlignModuleHeadings ? "text-left" : "text-center",
          )}
        >
          {eyebrow}
        </PdpTextReveal>
      </div>

      <div className={pdpCarouselScrollWrapClass}>
        <div
          ref={scrollRef}
          className={cn(
            pdpCarouselScrollClass,
            "pdp-carousel-draggable flex items-start pb-1",
            useV4ModuleSpacing ? "gap-3 pr-4" : "gap-2 pr-2",
          )}
          aria-label="More like this products"
        >
          {/* fallow-ignore-next-line complexity */}
          {items.map((item, index) => (
            <PdpRevealItem
              key={item.id}
              delay={revealStaggerDelay(index)}
              className={cn(
                "flex flex-col gap-2",
                moreLikeThisLargeCards
                  ? pdpMoreLikeThisLargeCardClass
                  : "w-[158px] shrink-0 snap-start snap-always",
              )}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  moreLikeThisLargeCards ? "aspect-[4/5]" : "",
                  squareProductCardCorners ? "rounded-none" : "rounded-xl",
                )}
                style={
                  moreLikeThisLargeCards
                    ? undefined
                    : { width: defaultCard.width, height: defaultCard.imageHeight }
                }
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes={
                    moreLikeThisLargeCards
                      ? "(min-width: 1024px) 33vw, 70vw"
                      : `${defaultCard.width}px`
                  }
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <p
                  className={cn(
                    "font-extended m-0 line-clamp-2 leading-snug text-black",
                    leftAlignModuleHeadings ? "text-left" : "text-center",
                    moreLikeThisLargeCards
                      ? cn(pdpType.productName, "text-[13px]")
                      : pdpType.productName,
                  )}
                >
                  {item.name}
                </p>
                <p
                  className={cn(
                    "font-extended m-0 text-neutral-500",
                    leftAlignModuleHeadings ? "text-left" : "text-center",
                    moreLikeThisLargeCards ? "text-[12px]" : pdpType.label,
                  )}
                >
                  {item.price}
                </p>
              </div>

              <div className="flex w-full items-center gap-2">
                {showMoreLikeThisCompare ? (
                  <button
                    type="button"
                    onClick={() => openCompare(item.id)}
                    aria-label={`Compare with ${item.name}`}
                    className={cn(
                      "box-border m-0 flex min-h-0 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden border border-[#D4D4D4] px-2 py-0 text-[11px] leading-none tracking-[0.2px] text-black transition-colors active:bg-neutral-50 lg:text-[10px]",
                      "font-extended",
                      pdpPillRadiusClass(squareButtonCorners),
                    )}
                    style={{ height: card.buttonHeight }}
                  >
                    <MaterialIcon name="compare_arrows" size={16} />
                    <span className="translate-y-0.5">Compare</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onAddToBag?.(item.id)}
                  className={cn(
                    "box-border m-0 flex shrink-0 items-center justify-center overflow-hidden border border-[#D4D4D4] px-2.5 py-0 text-[11px] leading-none tracking-[0.2px] text-black transition-colors active:bg-neutral-50 lg:text-[10px]",
                    "font-extended",
                    pdpPillRadiusClass(squareButtonCorners),
                  )}
                  style={{ height: card.buttonHeight }}
                >
                  <span className="translate-y-0.5">Add to bag</span>
                </button>
              </div>
            </PdpRevealItem>
          ))}
        </div>
      </div>

      {showMoreLikeThisCompare ? (
        <PdpV5MoreLikeThisCompareSheet
          comparison={compareProduct}
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
          onAddToBag={onAddToBag}
        />
      ) : null}
    </section>
  );
}
