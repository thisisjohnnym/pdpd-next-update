"use client";

import type { ReactNode } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PdpTextReveal } from "../pdp-text-reveal";

/**
 * Near-full-width slot with a peek of the next frame.
 * Paper AN3-0 measures 335px on a 375px viewport:
 *   375 - 8px(left-pad) - 8px(gap) - 24px(right-peek) = 335px → calc(100vw-40px)
 */
const GROUPED_MEDIA_CARD_CLASS =
  "w-[calc(100vw-2.5rem)] shrink-0 snap-start snap-always lg:w-[calc((100vw-2.75rem)/2)]";

/**
 * v2-only — collapses related gallery frames (e.g. hardware detail + 360 spin) into one
 * horizontal swipe rail so the page reads shorter. Children are the existing slide
 * renderers; this component only arranges them, it does not restyle the frames.
 */
export function PdpGroupedMediaCarousel({
  title,
  items,
}: {
  title?: string;
  items: ReactNode[];
}) {
  return (
    <section data-header-surface="light" className="w-full shrink-0 bg-white py-3">
      {title ? (
        <PageGrid fullWidth className="mb-2">
          <GridItem mobile={12} desktop={24} className="min-w-0">
            <PdpTextReveal
              as="p"
              className="font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-400"
            >
              {title}
            </PdpTextReveal>
          </GridItem>
        </PageGrid>
      ) : null}

      <div className={pdpCarouselScrollWrapClass}>
        <div className={cn(pdpCarouselScrollClass, "flex gap-2")} aria-label={title}>
          {items.map((node, index) => (
            <div key={index} className={GROUPED_MEDIA_CARD_CLASS}>
              {node}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
