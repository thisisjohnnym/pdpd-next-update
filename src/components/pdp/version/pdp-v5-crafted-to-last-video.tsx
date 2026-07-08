"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpTextReveal } from "../pdp-text-reveal";
import { PANEL_MEDIA_COVER_CLASS } from "../pdp-viewport-chrome";

import {
  PDP_CRAFTED_TO_LAST_SECTION,
  PDP_CRAFTED_TO_LAST_VIDEO,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v5 "Crafted to last" — headline + full-bleed hardware video between leather
 * aging and reviews.
 */
export function PdpV5CraftedToLastVideo() {
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const videoRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const { headline, body } = PDP_CRAFTED_TO_LAST_SECTION;
  const { src, poster, alt } = PDP_CRAFTED_TO_LAST_VIDEO;
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="crafted-to-last-video"
      data-header-surface="light"
      aria-label={headline}
      className="w-full shrink-0 scroll-mt-24 bg-white"
    >
      <div
        className={cn(
          "flex flex-col",
          useV4ModuleSpacing ? "gap-8 px-4 pt-14" : "gap-6 px-3 pt-12",
        )}
      >
        <div className={cn("flex flex-col gap-3", alignClass)}>
          <PdpModuleHeading
            spacing="none"
            className={leftAlignModuleHeadings ? "text-left" : "text-center"}
          >
            {headline}
          </PdpModuleHeading>
          <PdpTextReveal
            as="p"
            delay={100}
            className={pdpModuleIntroClass(
              leftAlignModuleHeadings ? "left" : "center",
            )}
          >
            {body}
          </PdpTextReveal>
        </div>
      </div>

      <div
        ref={videoRef}
        aria-label={alt}
        data-header-surface="dark"
        className="relative mt-6 w-full overflow-hidden bg-black"
      >
        <div className="relative aspect-video w-full">
          <PdpGalleryHeroVideo
            src={src}
            poster={poster}
            ariaLabel={alt}
            isActive={isActive}
            preload={isActive ? "auto" : "metadata"}
            skeletonTone="dark"
            showMuteControl={false}
            className={cn(
              "size-full object-cover object-center",
              PANEL_MEDIA_COVER_CLASS,
            )}
          />
        </div>
      </div>
    </section>
  );
}
