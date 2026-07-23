"use client";

import Image from "next/image";
import { useMemo } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import {
  getHeroGallerySlideKey,
  PDP_HERO_GALLERY_SLIDES,
  orderHeroGallerySlides,
} from "../pdp-hero-gallery-data";
import { resolveHeroSlideFraming } from "../pdp-hero-framing";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { getUxrHeroGallerySlides } from "../pdp-uxr-color-media";
import { useIsUxrStudyRoute } from "../use-uxr-study-route";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** v5 desktop rail mirrors the mobile hero carousel ordering. */
function usePdpV5DesktopMediaSlides() {
  const version = usePdpVersion();
  const isUxrStudy = useIsUxrStudyRoute();
  const tabby = useOptionalTabbyVariant();
  const {
    heroGalleryLeadSlideSrc,
    heroGalleryLastSlideSrc,
    heroGalleryExcludedSlideSrcs,
    heroGalleryAdditionalSlides,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
  } = getPdpVersionConfig(version);

  return useMemo(() => {
    if (isUxrStudy) {
      return getUxrHeroGallerySlides(tabby?.selectedColorId);
    }

    return orderHeroGallerySlides(PDP_HERO_GALLERY_SLIDES, {
      heroGalleryLeadSlideSrc,
      heroGalleryLastSlideSrc,
      heroGalleryExcludedSlideSrcs,
      heroGalleryAdditionalSlides,
      heroGalleryPrependLeadSlide,
      heroGalleryUgcSlides,
      heroGalleryUgcInsertAfterIndex,
      heroGalleryLogicalBlockOrder,
    });
  }, [
    isUxrStudy,
    tabby?.selectedColorId,
    heroGalleryLeadSlideSrc,
    heroGalleryLastSlideSrc,
    heroGalleryExcludedSlideSrcs,
    heroGalleryAdditionalSlides,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
  ]);
}

/**
 * v5 desktop media column (lg+ only).
 *
 * A vertical stack of the curated Tabby hero gallery stills so several product
 * frames are visible at once (Miu Miu-style scrolling media rail). It reuses the
 * same `PDP_HERO_GALLERY_SLIDES` set the mobile hero carousel draws from; v5
 * pins the hero to the template (`lockHeroGalleryTemplate`), so this list stays
 * consistent with the mobile experience and does not color-swap.
 *
 * Rendered only at the desktop breakpoint — the mobile hero (`PdpV3HeroLayout`)
 * still owns everything below lg.
 */
export function PdpV5DesktopMediaColumn() {
  const slides = usePdpV5DesktopMediaSlides();

  return (
    <div
      data-pdp-desktop-hero-media
      className="pdp-v5-desktop-media grid w-full grid-cols-2 gap-2 bg-[#f0f0f0]"
    >
      {slides.map((slide, index) => {
        const { objectFit, objectPosition } = resolveHeroSlideFraming(
          slide.shotType,
          slide.framing,
        );
        const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

        return (
          <figure
            key={`${getHeroGallerySlideKey(slide)}-${index}`}
            data-header-surface={slide.headerSurface}
            className={cn(
              "relative m-0 w-full overflow-hidden bg-[#f0f0f0]",
              "aspect-[4/5]",
            )}
          >
            {slide.kind === "video" ? (
              <PdpGalleryHeroVideo
                src={slide.src}
                poster={slide.poster}
                ariaLabel={slide.alt}
                isActive
                showControls
                showMuteControl
                preload="metadata"
                skeletonTone="light"
                className={cn("size-full object-center", fitClass)}
                style={{ objectPosition }}
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={cn("object-center", fitClass)}
                style={{ objectPosition }}
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            )}
          </figure>
        );
      })}
    </div>
  );
}
