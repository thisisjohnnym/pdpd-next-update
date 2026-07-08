"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselScrollClass, pdpCarouselScrollWrapClass } from "../pdp-carousel";
import { PdpModuleHeading } from "../pdp-module-heading";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_GET_THE_HIGHLIGHTS_CARDS,
  PDP_GET_THE_HIGHLIGHTS_SECTION,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 "Get the highlights" — Apple-style highlight rail. A light section with a
 * bold heading + "Watch the film" link above a horizontal rail of tall cards,
 * each carrying a single product truth (image above, left-aligned caption below).
 * Replaces the "Feel the leather" lifestyle beat.
 */
export function PdpV5GetTheHighlights() {
  const { headline, watchLabel } = PDP_GET_THE_HIGHLIGHTS_SECTION;
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());

  return (
    <section
      data-header-surface="light"
      aria-label={headline}
      className={cn(
        "w-full shrink-0 bg-white",
        useV4ModuleSpacing ? "pt-14 pb-12" : "pt-12 pb-8",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5",
          useV4ModuleSpacing ? "px-4" : "px-3",
        )}
      >
        <PdpModuleHeading
          spacing="none"
          className={leftAlignModuleHeadings ? "text-left" : "text-center"}
        >
          {headline}
        </PdpModuleHeading>
        <PdpTextReveal as="div" delay={100} className="m-0">
          <a
            href="#crafted-to-last-video"
            className={cn(
              "group inline-flex min-h-[40px] items-center gap-1.5 text-black",
              "transition-colors active:text-neutral-700",
              pdpPressableClass,
            )}
          >
            <span className="font-extended text-[15px] leading-none">
              {watchLabel}
            </span>
            <MaterialIcon
              name="play_circle"
              size={18}
              className="translate-y-[0.5px]"
            />
          </a>
        </PdpTextReveal>
      </div>

      <div className={cn(pdpCarouselScrollWrapClass, "mt-6")}>
        <div
          className={cn(pdpCarouselScrollClass, "flex items-stretch gap-3")}
          aria-label={headline}
        >
          {PDP_GET_THE_HIGHLIGHTS_CARDS.map((card, index) => (
            <PdpRevealItem
              key={card.id}
              as="article"
              delay={revealStaggerDelay(index)}
              className={cn(
                "flex h-[70svh] max-h-[620px] min-h-[460px] w-[calc((100vw-1.25rem)/1.15)]",
                "shrink-0 snap-start snap-always flex-col gap-3 overflow-hidden rounded-none bg-white",
                "lg:w-[calc((100vw-2.25rem)/2.4)]",
              )}
            >
              <div className="relative min-h-0 flex-1 bg-neutral-100">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="pointer-events-none select-none object-cover"
                  style={{ objectPosition: card.objectPosition ?? "center" }}
                  sizes="(min-width: 1024px) 42vw, 87vw"
                />
              </div>

              <p className={cn(pdpType.body, "m-0 shrink-0 pb-4 text-pretty text-black")}>
                {card.caption}
              </p>
            </PdpRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
