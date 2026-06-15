"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import {
  pdpCarouselInfiniteCenteredScrollClass,
  pdpUgcVideoCardCenteredClass,
} from "./pdp-carousel";
import { PDP_UGC_VIDEO_CAROUSEL } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";
import {
  loopCarouselItems,
  useInfiniteCenteredCarousel,
} from "./use-infinite-centered-carousel";

/** Horizontal UGC video rail — centered infinite carousel, no platform chrome */
export function PdpUgcVideoCarouselModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { videos } = PDP_UGC_VIDEO_CAROUSEL;
  const loopVideos = useMemo(() => loopCarouselItems(videos), [videos]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  useInfiniteCenteredCarousel(scrollRef, videos.length);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <section
      data-header-surface="light"
      aria-label="Customer videos"
      className={cn(
        "relative w-full shrink-0 bg-white",
        galleryPanelClassName(isLastPanel),
      )}
    >
      <div
        ref={scrollRef}
        className={cn(pdpCarouselInfiniteCenteredScrollClass, "flex gap-2")}
      >
        {loopVideos.map((video, index) => (
          <PdpUgcVideoCard
            key={`${video.id}-${index}`}
            video={video}
            scrollRoot={scrollRoot}
            className={pdpUgcVideoCardCenteredClass}
          />
        ))}
      </div>
    </section>
  );
}
