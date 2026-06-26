"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollWrapClass,
  pdpUgcVideoCardInfiniteClass,
  pdpUgcVideoInfiniteScrollClass,
} from "./pdp-carousel";
import { PDP_UGC_VIDEO_CAROUSEL } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { PdpTextReveal } from "./pdp-text-reveal";
import { pdpType } from "./pdp-type";
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";
import {
  loopCarouselItems,
  useCarouselCoverflow,
  useInfiniteCenteredCarousel,
} from "./use-infinite-centered-carousel";

/** TikTok-style UGC rail — center-snapped, infinite loop left and right */
// fallow-ignore-next-line complexity
export function PdpUgcVideoCarouselModule() {
  const { title, followCta, videos } = PDP_UGC_VIDEO_CAROUSEL;
  // Paper 433-0 wraps the title so the last word drops to a second line
  const lastSpace = title.lastIndexOf(" ");
  const titleLead = lastSpace > -1 ? title.slice(0, lastSpace) : title;
  const titleTail = lastSpace > -1 ? title.slice(lastSpace + 1) : "";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const loopedVideos = useMemo(() => loopCarouselItems(videos), [videos]);

  useInfiniteCenteredCarousel(scrollRef, videos.length);
  useCarouselCoverflow(scrollRef);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <section
      data-header-surface="light"
      aria-label={title}
      className="relative w-full shrink-0 overflow-x-clip bg-white pt-9 pb-2"
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <PdpModuleHeading spacing="none">
              {titleLead}
              {titleTail ? (
                <>
                  <br />
                  {titleTail}
                </>
              ) : null}
            </PdpModuleHeading>
            <PdpTextReveal as="div" delay={100} className="shrink-0">
              <PdpTextLinkCta
                as="a"
                href={followCta.href}
                target="_blank"
                rel="noopener noreferrer"
                icon="arrow_outward"
                className={pdpType.label}
              >
                {followCta.label}
              </PdpTextLinkCta>
            </PdpTextReveal>
          </div>

          <div className={cn(pdpCarouselScrollWrapClass, "relative mt-3")}>
            <div
              ref={scrollRef}
              className={cn(
                "flex gap-2 pdp-ugc-coverflow overflow-y-clip pt-3 pb-12",
                pdpUgcVideoInfiniteScrollClass,
              )}
              aria-label="TikTok videos"
            >
              {loopedVideos.map((video, index) => (
                <PdpUgcVideoCard
                  key={`${video.id}-${index}`}
                  video={video}
                  scrollRoot={scrollRoot}
                  className={pdpUgcVideoCardInfiniteClass}
                />
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
