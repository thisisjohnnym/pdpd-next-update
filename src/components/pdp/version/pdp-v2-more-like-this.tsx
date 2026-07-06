"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_MORE_LIKE_THIS } from "../pdp-data";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** Paper B6C-0 baseline card — v5 `moreLikeThisLargeCards` bumps ~10%. */
const MORE_LIKE_THIS_CARD = {
  default: { width: 158, imageHeight: 198, buttonHeight: 38 },
  large: { width: 174, imageHeight: 218, buttonHeight: 40 },
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
  } = getPdpVersionConfig(usePdpVersion());
  const card = moreLikeThisLargeCards
    ? MORE_LIKE_THIS_CARD.large
    : MORE_LIKE_THIS_CARD.default;
  const { eyebrow, items } = PDP_MORE_LIKE_THIS;

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

      {/* Static 3-card clip — 3rd card peeks; not scrollable (Paper B6C-0) */}
      <div className="overflow-clip">
        <div
          className={cn(
            "flex pb-1",
            useV4ModuleSpacing ? "px-4" : "gap-2 px-2",
            useV4ModuleSpacing && "gap-3",
          )}
        >
          {items.map((item, index) => (
            <PdpRevealItem
              key={item.id}
              delay={revealStaggerDelay(index)}
              className="flex shrink-0 flex-col gap-2"
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
                  "font-extended inline-flex w-full items-center justify-center rounded-full border border-[#D4D4D4] text-black transition-colors active:bg-neutral-50",
                  moreLikeThisLargeCards ? "text-xs" : pdpType.micro,
                )}
                style={{ height: card.buttonHeight }}
              >
                Add to bag
              </button>
            </PdpRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
