"use client";

import { useEffect, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpUgcVideoCardClass,
} from "./pdp-carousel";
import { PDP_UGC_VIDEO_CAROUSEL } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { pdpModuleHeadingClass, pdpModuleSectionClass } from "./pdp-module-section";
import { PdpUgcVideoCard } from "./pdp-ugc-video-card";

/** Horizontal TikTok-style UGC video carousel in the gallery scroll */
export function PdpUgcVideoCarouselModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, videos } = PDP_UGC_VIDEO_CAROUSEL;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <section
      data-header-surface="light"
      className={cn(
        pdpModuleSectionClass({ variant: "white", rhythm: "default" }),
        galleryPanelClassName(isLastPanel),
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-4">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>{title}</h2>

            <div
              ref={scrollRef}
              className={cn(pdpCarouselScrollClass, "flex gap-2")}
            >
              {videos.map((video) => (
                <PdpUgcVideoCard
                  key={video.id}
                  video={video}
                  scrollRoot={scrollRoot}
                  className={pdpUgcVideoCardClass}
                />
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
