// fallow-ignore-file unused-file
"use client";

import { useEffect, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_FITS_INSIDE } from "./pdp-data";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { PdpTextReveal } from "./pdp-text-reveal";
import { pdpType } from "./pdp-type";

/** Chapter 4 — compact utility: what fits inside */
// fallow-ignore-next-line complexity
export function PdpFitsInsideModule() {
  const { title, subcopy, cta, posterSrc, posterAlt, videoSrc } = PDP_FITS_INSIDE;
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(media);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      data-header-surface="light"
      className="relative w-full shrink-0 overflow-x-clip bg-white py-6"
      style={{ minHeight: "min(65dvh, 560px)" }}
      aria-label={title}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="flex flex-col gap-3">
          <div>
            <PdpModuleHeading spacing="none">{title}</PdpModuleHeading>
            <PdpTextReveal
              as="p"
              delay={80}
              className={cn(pdpType.caption, "mt-2 text-neutral-600")}
            >
              {subcopy}
            </PdpTextReveal>
          </div>

          <div ref={mediaRef} className="w-full">
            <PdpRevealItem className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
              <PdpGalleryHeroVideo
                src={videoSrc}
                poster={posterSrc}
                ariaLabel={posterAlt}
                isActive={isActive}
                preload={isActive ? "auto" : "metadata"}
                skeletonTone="light"
                showControls
                showMuteControl
                className="size-full object-cover object-center"
              />
            </PdpRevealItem>
          </div>

          <PdpTextReveal as="div" delay={120}>
            <PdpTextLinkCta href={cta.href} className={pdpType.label}>
              {cta.label}
            </PdpTextLinkCta>
          </PdpTextReveal>
        </GridItem>
      </PageGrid>
    </section>
  );
}
