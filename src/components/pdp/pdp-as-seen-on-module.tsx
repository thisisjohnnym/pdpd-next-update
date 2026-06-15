"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpAsSeenOnCard } from "./pdp-as-seen-on-card";
import {
  pdpAsSeenOnCardCompactClass,
  pdpCarouselScrollClass,
} from "./pdp-carousel";
import { PDP_AS_SEEN_ON } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { pdpModuleSectionClass } from "./pdp-module-section";

/** Horizontal carousel of celebrity sightings — secondary editorial rail */
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
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-3">
            <p
              className="font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-500"
            >
              {title}
            </p>

            <div className={cn(pdpCarouselScrollClass, "flex gap-2")}>
              {celebrities.map((celebrity) => (
                <PdpAsSeenOnCard
                  key={celebrity.id}
                  celebrity={celebrity}
                  variant="compact"
                  className={pdpAsSeenOnCardCompactClass}
                />
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
