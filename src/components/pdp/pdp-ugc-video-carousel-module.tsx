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
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";
import {
  loopCarouselItems,
  useCarouselCoverflow,
  useCarouselSwipeAssist,
  useInfiniteCenteredCarousel,
} from "./use-infinite-centered-carousel";

/** TikTok-style UGC rail — center-snapped, infinite loop left and right */
export function PdpUgcVideoCarouselModule() {
  const { title, videos } = PDP_UGC_VIDEO_CAROUSEL;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const loopedVideos = useMemo(() => loopCarouselItems(videos), [videos]);

  useInfiniteCenteredCarousel(scrollRef, videos.length);
  useCarouselSwipeAssist(scrollRef);
  useCarouselCoverflow(scrollRef);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <section
      data-header-surface="light"
      aria-label={title}
      className="relative w-full shrink-0 overflow-x-clip bg-white pt-9 pb-5"
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className={cn(pdpCarouselScrollWrapClass, "relative")}>
            <div
              ref={scrollRef}
              className={cn(
                "flex gap-2 pdp-ugc-coverflow pb-8",
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
