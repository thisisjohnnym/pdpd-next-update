"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PDP_EDITORIAL_V2_CARDS, PDP_EDITORIAL_V2_SECTION } from "./pdp-data-v2";
import { PDP_HERO_FITS_INSIDE_TARGET_ID } from "./pdp-hero-fits-inside-button";
import { pdpType } from "../pdp-type";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v2-only editorial carousel (Paper AN3-0 / BV4-0).
 *
 * Standalone 4-card horizontal rail — each card is a 335px-wide image (460px tall)
 * with a lead caption beneath. The last card adds a "See what fits inside" text CTA.
 * Card content comes from PDP_EDITORIAL_V2_CARDS, independent of the gallery slides.
 */
export function PdpV2EditorialCarousel() {
  const { useV4ModuleSpacing, leftAlignModuleHeadings } =
    getPdpVersionConfig(usePdpVersion());
  const { headline, subtext } = PDP_EDITORIAL_V2_SECTION;

  return (
    <section
      data-header-surface="light"
      className={cn("w-full shrink-0 bg-white", useV4ModuleSpacing && "pt-[56px]")}
    >
      {useV4ModuleSpacing ? (
        <div
          className={cn(
            "mb-5 flex flex-col gap-1.5",
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
            {headline}
          </PdpTextReveal>
          <PdpTextReveal
            as="p"
            delay={100}
            className={cn(
              pdpType.caption,
              "m-0 text-neutral-600",
              leftAlignModuleHeadings ? "text-left" : "text-center",
            )}
          >
            {subtext}
          </PdpTextReveal>
        </div>
      ) : null}

      <div className={pdpCarouselScrollWrapClass}>
        <div
          className={cn(
            pdpCarouselScrollClass,
            "flex items-start",
            useV4ModuleSpacing ? "gap-4 pl-4 pt-0" : "gap-2 px-2 pt-14",
          )}
          aria-label="Tabby Shoulder Bag 26 editorial"
        >
          {PDP_EDITORIAL_V2_CARDS.map((card, index) => {
            const isLast = index === PDP_EDITORIAL_V2_CARDS.length - 1;

            return (
              <PdpRevealItem
                key={card.id}
                as="article"
                id={card.id === "capacity" ? PDP_HERO_FITS_INSIDE_TARGET_ID : undefined}
                delay={revealStaggerDelay(index)}
                className={cn(
                  "flex w-[335px] shrink-0 snap-start snap-always flex-col bg-white pb-6",
                  useV4ModuleSpacing ? "gap-2.5" : "gap-2",
                )}
              >
                <div
                  className={cn(
                    "relative h-[460px] w-full shrink-0 overflow-hidden bg-neutral-200",
                    !isLast && "rounded-[2px]",
                  )}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    className="object-cover object-center"
                    sizes="335px"
                  />
                </div>

                <div className={cn(useV4ModuleSpacing ? "px-0" : "px-1")}>
                  <p
                    className={cn(
                      "m-0 text-pretty",
                      useV4ModuleSpacing
                        ? cn(pdpType.caption, "text-neutral-600")
                        : "font-extended text-[16px] leading-[110%] text-black",
                    )}
                  >
                    {card.caption}
                  </p>
                </div>

                {card.cta ? (
                  <a
                    href={card.cta.href}
                    className={cn(
                      "font-extended inline-flex items-center gap-[6px] px-1 text-black transition-opacity active:opacity-60",
                      pdpType.label,
                    )}
                  >
                    <span className="underline underline-offset-[3px]">
                      {card.cta.label}
                    </span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      aria-hidden
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="#171717"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : null}
              </PdpRevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
