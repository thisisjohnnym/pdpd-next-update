"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PDP_MORE_LIKE_THIS } from "../pdp-data";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPillRadiusClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import { useDragToScroll } from "../use-infinite-centered-carousel";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** Paper B6C-0 baseline card — v5 `moreLikeThisLargeCards` bumps image; ATB stays compact. */
const MORE_LIKE_THIS_CARD = {
  default: { width: 158, imageHeight: 198, buttonHeight: 38 },
  large: { width: 174, imageHeight: 218, buttonHeight: 32 },
} as const;

/**
 * v2-only simplified "More like this" module (Paper B6C-0).
 *
 * Horizontal scroll rail with fixed-width product cards and a pill "Add to bag"
 * button. v5 optionally renders larger cards via `moreLikeThisLargeCards`.
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
  } = getPdpVersionConfig(usePdpVersion());
  const card = moreLikeThisLargeCards
    ? MORE_LIKE_THIS_CARD.large
    : MORE_LIKE_THIS_CARD.default;
  const { eyebrow, items } = PDP_MORE_LIKE_THIS;
  const scrollRef = useRef<HTMLDivElement>(null);

  useDragToScroll(scrollRef);

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
            "font-extended m-0 font-normal tracking-tight text-black",
            leftAlignModuleHeadings ? "text-left" : "text-center",
            pdpType.headline,
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
          {items.map((item, index) => (
            <PdpRevealItem
              key={item.id}
              delay={revealStaggerDelay(index)}
              className="flex shrink-0 snap-start snap-always flex-col gap-2"
              style={{ width: card.width }}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  squareProductCardCorners ? "rounded-none" : "rounded-xl",
                )}
                style={{ width: card.width, height: card.imageHeight }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes={`${card.width}px`}
                />
              </div>

              <p
                className={cn(
                  "font-extended m-0 leading-snug text-black",
                  leftAlignModuleHeadings ? "text-left" : "text-center",
                  moreLikeThisLargeCards ? "text-[15px]" : pdpType.body,
                )}
              >
                {item.name}
              </p>
              <p
                className={cn(
                  "font-extended -mt-1 m-0 text-neutral-500",
                  leftAlignModuleHeadings ? "text-left" : "text-center",
                  moreLikeThisLargeCards ? "text-sm" : pdpType.label,
                )}
              >
                {item.price}
              </p>

              <button
                type="button"
                onClick={() => onAddToBag?.(item.id)}
                className={cn(
                  "font-extended inline-flex w-full items-center justify-center border border-[#D4D4D4] px-2 text-black transition-colors active:bg-neutral-50",
                  pdpPillRadiusClass(squareButtonCorners),
                  pdpType.micro,
                )}
                style={{ height: card.buttonHeight }}
              >
                <span className="translate-y-0.5">Add to bag</span>
              </button>
            </PdpRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
