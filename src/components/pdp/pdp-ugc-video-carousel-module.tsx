"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselInfiniteCenteredScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcVideoCardCenteredClass,
} from "./pdp-carousel";
import { PDP_UGC_VIDEO_CAROUSEL } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { PdpTextReveal } from "./pdp-text-reveal";
import {
  loopCarouselItems,
  useInfiniteCenteredCarousel,
} from "./use-infinite-centered-carousel";

/** TikTok-style UGC rail — header, follow CTA, full-bleed infinite carousel */
export function PdpUgcVideoCarouselModule() {
  const { title, followCta, videos } = PDP_UGC_VIDEO_CAROUSEL;
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
      aria-label={title}
      className="relative w-full shrink-0 overflow-x-clip bg-white pt-9"
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex items-end justify-between gap-3">
            <PdpModuleHeading spacing="none">{title}</PdpModuleHeading>
            <PdpTextReveal as="div" delay={100} className="shrink-0">
              <PdpTextLinkCta
                as="a"
                href={followCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={pdpType.label}
              >
                {followCta.label}
              </PdpTextLinkCta>
            </PdpTextReveal>
          </div>
        </GridItem>
      </PageGrid>

      <div className={cn(pdpCarouselScrollWrapClass, "relative mt-3 w-full")}>
        <div
          ref={scrollRef}
          className={cn(pdpCarouselInfiniteCenteredScrollClass, "flex pb-0")}
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
      </div>
    </section>
  );
}
