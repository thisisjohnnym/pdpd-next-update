"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpAsSeenOnCard } from "./pdp-as-seen-on-card";
import {
  pdpAsSeenOnAvatarItemClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";
import { PDP_AS_SEEN_ON } from "./pdp-data";
import { PdpTextReveal } from "./pdp-text-reveal";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { pdpModuleSectionClass } from "./pdp-module-section";

/** Celebrity sightings — low-emphasis profile avatar rail */
export function PdpAsSeenOnModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, celebrities } = PDP_AS_SEEN_ON;

  return (
    <section
      data-header-surface="light"
      className={cn(
        pdpModuleSectionClass({ variant: "white", rhythm: "compact" }),
        galleryPanelClassName(isLastPanel),
        "pb-2",
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex flex-col gap-2">
            <PdpTextReveal
              as="p"
              className="font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-400"
            >
              {title}
            </PdpTextReveal>

            <div className={pdpCarouselScrollWrapClass}>
              <div className={cn(pdpCarouselScrollClass, "flex gap-3")}>
                {celebrities.map((celebrity) => (
                  <PdpAsSeenOnCard
                    key={celebrity.id}
                    celebrity={celebrity}
                    variant="avatar"
                    className={pdpAsSeenOnAvatarItemClass}
                  />
                ))}
              </div>
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
