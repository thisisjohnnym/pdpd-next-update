"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import {
  getHeroGallerySlideKey,
  PDP_HERO_GALLERY_SLIDES,
  orderHeroGallerySlides,
} from "../pdp-hero-gallery-data";
import { heroSlideBackground, resolveHeroSlideFraming } from "../pdp-hero-framing";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** v5 desktop rail mirrors the mobile hero carousel ordering. */
function usePdpV5DesktopMediaSlides() {
  const version = usePdpVersion();
  const {
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
    heroGalleryExcludeSlideSrcs,
    heroGalleryExtraSlides,
    heroProductSlidesFillFrame,
  } = getPdpVersionConfig(version);

  return orderHeroGallerySlides(PDP_HERO_GALLERY_SLIDES, {
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
    heroGalleryExcludeSlideSrcs,
    heroGalleryExtraSlides,
    heroProductSlidesFillFrame,
  });
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
        const { objectFit, objectPosition, scale = 1 } = resolveHeroSlideFraming(
          slide.shotType,
          slide.framing,
        );
        const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";
        const mediaStyle = {
          objectPosition,
          ...(scale !== 1 ? { transform: `scale(${scale})` } : null),
        };

        return (
          <figure
            key={`${getHeroGallerySlideKey(slide)}-${index}`}
            data-header-surface={slide.headerSurface}
            className={cn(
              "relative m-0 w-full overflow-hidden",
              "aspect-[4/5]",
            )}
            style={{
              backgroundColor: heroSlideBackground(
                slide.shotType,
                slide.kind,
                slide.ground,
              ),
            }}
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
                style={mediaStyle}
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={cn("object-center", fitClass)}
                style={mediaStyle}
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            )}
          </figure>
        );
      })}
    </div>
  );
}
