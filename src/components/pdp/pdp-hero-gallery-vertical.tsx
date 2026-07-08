"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpHeroGalleryProvider } from "./pdp-hero-gallery-context";
import {
  PDP_HERO_GALLERY_SLIDES,
  orderHeroGallerySlides,
  type PdpHeroGallerySlide,
} from "./pdp-hero-gallery-data";
import {
  heroSlideBackground,
  resolveHeroSlideFraming,
} from "./pdp-hero-framing";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { useSetHeroChromeSurface } from "./pdp-hero-chrome-surface";
import {
  HERO_FILTER_GRADIENT,
  HERO_MIDDLE_GRADIENT,
  HERO_MIDDLE_HEIGHT_FRACTION,
} from "./pdp-hero-tokens";
import { HERO_IMMERSIVE_CLASS } from "./pdp-viewport-chrome";
import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { PdpHero360IntroLayer } from "./pdp-hero-360-intro-layer";
import { useVerticalHeroGallery } from "./use-vertical-hero-gallery";
import { useReducedMotion } from "./use-reduced-motion";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3GalleryOverlay } from "./version/pdp-v3-gallery-overlay";

function VerticalHeroSlideMedia({
  slide,
  isActive,
  eager,
}: {
  slide: PdpHeroGallerySlide;
  isActive: boolean;
  eager: boolean;
}) {
  const { objectFit, objectPosition } = resolveHeroSlideFraming(
    slide.shotType,
    slide.framing,
  );
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  if (slide.kind === "video") {
    return (
      <PdpGalleryHeroVideo
        src={slide.src}
        poster={slide.poster}
        ariaLabel={slide.alt}
        isActive={isActive}
        preload={isActive ? "auto" : "metadata"}
        priorityAutoplay={Boolean(slide.priority)}
        skeletonTone={slide.shotType === "lifestyle" ? "dark" : "light"}
        showControls={false}
        showMuteControl={false}
        passThroughTouch
        className={cn("size-full object-center", fitClass)}
        style={{ objectPosition }}
      />
    );
  }

  return (
    <Image
      src={slide.src}
      alt={slide.alt}
      fill
      priority={eager}
      sizes="100vw"
      className={cn("object-center", fitClass)}
      style={{ objectPosition }}
    />
  );
}

/**
 * v6 mobile — vertical snap hero gallery (UXR study variant).
 * Linear scroll through studio slides; tick indicator via `PdpV3GalleryOverlay`.
 */
export function PdpHeroGalleryVertical({
  slides = PDP_HERO_GALLERY_SLIDES,
  onOpenArTryOn,
  isLastPanel = false,
  fillFrame = false,
}: {
  slides?: PdpHeroGallerySlide[];
  onOpenArTryOn?: () => void;
  isLastPanel?: boolean;
  fillFrame?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const {
    heroDockedBuyBar,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
    hero360IntroEnabled,
    hero360IntroVideoSrc,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryExcludeSlideSrcs,
  } = getPdpVersionConfig(usePdpVersion());
  const { isGalleryScrollReady } = useHero360Intro();
  const reducedMotion = useReducedMotion();
  /** Slide 0 is the intro clip's end frame — not the separate a0 still. */
  const useIntroLeadSlide =
    hero360IntroEnabled && Boolean(hero360IntroVideoSrc) && !reducedMotion;

  const orderedSlides = useMemo(
    () =>
      orderHeroGallerySlides(slides, {
        leadGalleryWithProductStill,
        heroGalleryStudioDragZoom,
        heroGalleryLeadSlideSrc,
        heroGalleryPrependLeadSlide,
        heroGalleryUgcSlides,
        heroGalleryUgcInsertAfterIndex,
        heroGalleryExcludeSlideSrcs,
      }),
    [
      slides,
      leadGalleryWithProductStill,
      heroGalleryStudioDragZoom,
      heroGalleryLeadSlideSrc,
      heroGalleryPrependLeadSlide,
      heroGalleryUgcSlides,
      heroGalleryUgcInsertAfterIndex,
      heroGalleryExcludeSlideSrcs,
    ],
  );

  const { activeIndex } = useVerticalHeroGallery(trackRef, orderedSlides.length);
  const setHeroChromeSurface = useSetHeroChromeSurface();
  const surface = orderedSlides[activeIndex]?.headerSurface ?? "dark";

  useLayoutEffect(() => {
    setHeroChromeSurface(surface);
  }, [setHeroChromeSurface, surface]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(
      `[data-hero-vertical-slide-index="${index}"]`,
    );
    if (track && slide) {
      track.scrollTo({ top: slide.offsetTop, behavior: "smooth" });
    }
  }, []);

  const galleryState = useMemo(
    () => ({
      activeIndex,
      count: orderedSlides.length,
      surface,
      overlayCta: orderedSlides[activeIndex]?.overlayCta,
      slides: orderedSlides,
      scrollToIndex,
    }),
    [activeIndex, orderedSlides, surface, scrollToIndex],
  );

  return (
    <PdpHeroGalleryProvider value={galleryState}>
      <section
        data-hero-section
        data-header-surface={surface}
        className={cn(
          HERO_IMMERSIVE_CLASS,
          fillFrame
            ? "pdp-hero-immersive--fill-frame min-h-0 flex-1"
            : "shrink-0",
          galleryPanelClassName(isLastPanel),
        )}
      >
        <div
          ref={trackRef}
          data-hero-gallery-track
          data-hero-gallery-vertical
          className={cn(
            "absolute inset-0 z-0 flex flex-col snap-y snap-mandatory overscroll-y-contain",
            isGalleryScrollReady
              ? "overflow-y-auto [touch-action:pan-y]"
              : "overflow-hidden touch-none",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {orderedSlides.map((slide, index) => {
            const slideScrimVisible = slide.headerSurface === "dark";
            const isActive = index === activeIndex;
            return (
              <div
                key={`${slide.kind}-${slide.src}-${index}`}
                data-hero-vertical-slide
                data-hero-vertical-slide-index={index}
                className="relative h-full min-h-full w-full shrink-0 snap-start snap-always"
                style={{ backgroundColor: heroSlideBackground(slide.shotType) }}
              >
                {!(index === 0 && useIntroLeadSlide) ? (
                  <VerticalHeroSlideMedia
                    slide={slide}
                    isActive={isActive}
                    eager={index <= 1}
                  />
                ) : null}
                {index === 0 && useIntroLeadSlide ? (
                  <PdpHero360IntroLayer videoSrc={hero360IntroVideoSrc} />
                ) : null}
                {slideScrimVisible ? (
                  <>
                    <div
                      aria-hidden
                      className="pdp-hero-ui-chrome pointer-events-none absolute inset-0 z-[1]"
                      style={{ backgroundImage: HERO_FILTER_GRADIENT }}
                    />
                    <div
                      aria-hidden
                      className="pdp-hero-ui-chrome pdp-hero-immersive__top-scrim"
                    />
                    <div
                      aria-hidden
                      className="pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
                      style={{
                        height: `${HERO_MIDDLE_HEIGHT_FRACTION * 100}%`,
                        backgroundImage: HERO_MIDDLE_GRADIENT,
                      }}
                    />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>

        {heroDockedBuyBar ? (
          <PdpV3GalleryOverlay onOpenArTryOn={onOpenArTryOn} />
        ) : null}
      </section>
    </PdpHeroGalleryProvider>
  );
}
