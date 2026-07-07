"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { pdpType } from "../pdp-type";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import { useDragToScroll } from "../use-infinite-centered-carousel";

import {
  PDP_CRAFTSMANSHIP_V4_CARDS,
  PDP_CRAFTSMANSHIP_V4_SECTION,
  type PdpCraftsmanshipV4Card,
} from "./pdp-data-v2";
import { PDP_HERO_FITS_INSIDE_TARGET_ID } from "./pdp-hero-fits-inside-button";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** One craftsmanship slide — 4:5 image with caption beneath. */
function CraftsmanshipCard({
  card,
  index,
  className,
  anchorId,
}: {
  card: PdpCraftsmanshipV4Card;
  index: number;
  className?: string;
  anchorId?: string;
}) {
  return (
    <PdpRevealItem
      as="article"
      id={anchorId}
      delay={revealStaggerDelay(index)}
      className={cn(
        "pdp-craftsmanship-card flex w-[335px] shrink-0 snap-start snap-always flex-col gap-3",
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          className="object-cover object-center"
          sizes="335px"
        />
      </div>
      <p className={cn(pdpType.body, "m-0 text-pretty text-neutral-900")}>{card.body}</p>
    </PdpRevealItem>
  );
}

/**
 * v4 craftsmanship module — horizontal editorial carousel of materials,
 * hardware, interior, and carry stories.
 */
export function PdpV4Craftsmanship() {
  const { leftAlignModuleHeadings } = getPdpVersionConfig(usePdpVersion());
  const { headline, intro } = PDP_CRAFTSMANSHIP_V4_SECTION;
  const scrollRef = useRef<HTMLDivElement>(null);

  useDragToScroll(scrollRef);

  return (
    <section
      data-header-surface="light"
      className="pdp-craftsmanship w-full shrink-0 overflow-x-clip bg-white pt-6 pb-6"
    >
      <div
        className={cn(
          "pdp-craftsmanship-header mb-5 flex flex-col gap-3 px-4",
          leftAlignModuleHeadings ? "items-start" : "items-center text-center",
        )}
      >
        <PdpModuleHeading
          spacing="none"
          className={leftAlignModuleHeadings ? "text-left" : "text-center"}
        >
          {headline}
        </PdpModuleHeading>
        <PdpTextReveal
          as="p"
          delay={100}
          className={cn(
            pdpModuleIntroClass(leftAlignModuleHeadings ? "left" : "center"),
          )}
        >
          {intro}
        </PdpTextReveal>
      </div>

      <div className={cn("pdp-craftsmanship-rail", pdpCarouselScrollWrapClass)}>
        <div
          ref={scrollRef}
          className={cn(
            "pdp-craftsmanship-track",
            pdpCarouselScrollClass,
            "pdp-carousel-draggable flex items-start gap-4 pl-4 pb-2",
          )}
          aria-label="Up close and personal material highlights"
        >
          {PDP_CRAFTSMANSHIP_V4_CARDS.map((card, index) => (
            <CraftsmanshipCard
              key={card.id}
              card={card}
              index={index}
              anchorId={
                card.id === "interior" ? PDP_HERO_FITS_INSIDE_TARGET_ID : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
