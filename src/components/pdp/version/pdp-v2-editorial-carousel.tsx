"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PDP_EDITORIAL_V2_CARDS } from "./pdp-data-v2";
import { pdpType } from "../pdp-type";

/**
 * v2-only editorial carousel (Paper AN3-0 / BV4-0).
 *
 * Standalone 4-card horizontal rail — each card is a 335px-wide image (460px tall)
 * with a lead caption beneath. The last card adds a "See what fits inside" text CTA.
 * Card content comes from PDP_EDITORIAL_V2_CARDS, independent of the gallery slides.
 */
export function PdpV2EditorialCarousel() {
  return (
    <section data-header-surface="light" className="w-full shrink-0 bg-white">
      <div className={pdpCarouselScrollWrapClass}>
        <div
          className={cn(pdpCarouselScrollClass, "flex items-start gap-2 px-2 pt-14")}
          aria-label="Tabby Shoulder Bag 26 editorial"
        >
          {PDP_EDITORIAL_V2_CARDS.map((card, index) => {
            const isLast = index === PDP_EDITORIAL_V2_CARDS.length - 1;

            return (
              <article
                key={card.id}
                className="flex w-[335px] shrink-0 snap-start snap-always flex-col gap-2 bg-white pb-6"
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

                <div className="px-1">
                  <p
                    className={cn(
                      "font-extended m-0 text-pretty text-[16px] leading-[110%] text-black",
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
