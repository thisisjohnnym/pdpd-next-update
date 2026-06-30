"use client";

import Image from "next/image";
import { useMemo, useRef, useLayoutEffect } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { PdpHeroGalleryProvider } from "./pdp-hero-gallery-context";
import {
  PDP_HERO_GALLERY_SLIDES,
  type PdpHeroGallerySlide,
} from "./pdp-hero-gallery-data";
import {
  heroSlideBackground,
  resolveHeroFraming,
} from "./pdp-hero-framing";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import {
  HERO_SCRIM_TRANSITION_CLASS,
  useSetHeroChromeSurface,
} from "./pdp-hero-chrome-surface";
import { useReducedMotion } from "./use-reduced-motion";
import {
  HERO_FILTER_GRADIENT,
  HERO_MIDDLE_GRADIENT,
  HERO_MIDDLE_HEIGHT_FRACTION,
} from "./pdp-hero-tokens";
import { HERO_IMMERSIVE_CLASS } from "./pdp-viewport-chrome";
import {
  loopCarouselItems,
  useInfiniteFullBleedCarousel,
} from "./use-infinite-centered-carousel";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

function HeroSlideMedia({
  slide,
  isActive,
  eager,
}: {
  slide: PdpHeroGallerySlide;
  isActive: boolean;
  /** Decode immediately — first image slides for snappy first swipe */
  eager: boolean;
}) {
  const { objectFit, objectPosition } = resolveHeroFraming(slide.shotType);
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
        allowHorizontalPan
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
 * Side-scrolling hero gallery (docs/pdp-hero-chrome.md).
 *
 * A horizontal snap track of full-bleed slides inside the hero frame. Slide 0 is
 * the lifestyle video (white nav); the rest are studio stills / spins (dark nav).
 * The rail is tripled so swiping past the last slide loops back to the first (and
 * vice versa). The active slide drives `data-header-surface` (nav contrast), video
 * playback, the scrim fade, and the slide indicator in the product HUD.
 */
export function PdpHeroGallery({
  slides = PDP_HERO_GALLERY_SLIDES,
  onOpenReviews,
  onOpenArTryOn,
  isLastPanel = false,
  fillFrame = false,
}: {
  slides?: PdpHeroGallerySlide[];
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  isLastPanel?: boolean;
  /** Size to the parent media frame (PdpHeroShell) instead of 100svh */
  fillFrame?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopedSlides = useMemo(() => loopCarouselItems(slides), [slides]);
  const { useStableInfiniteCarousel } = getPdpVersionConfig(usePdpVersion());
  const { activeIndex, activeLoopedIndex } = useInfiniteFullBleedCarousel(
    trackRef,
    slides.length,
    { stableLoop: useStableInfiniteCarousel },
  );
  const setHeroChromeSurface = useSetHeroChromeSurface();
  const reducedMotion = useReducedMotion();

  const surface = slides[activeIndex]?.headerSurface ?? "dark";
  const scrimVisible = surface === "dark";
  const scrimTransitionClass = reducedMotion ? undefined : HERO_SCRIM_TRANSITION_CLASS;

  useLayoutEffect(() => {
    setHeroChromeSurface(surface);
  }, [setHeroChromeSurface, surface]);

  const galleryState = useMemo(
    () => ({ activeIndex, count: slides.length, surface }),
    [activeIndex, slides.length, surface],
  );

  return (
    <PdpHeroGalleryProvider value={galleryState}>
      <section
        data-hero-section
        data-header-surface={surface}
        className={cn(
          HERO_IMMERSIVE_CLASS,
          fillFrame && "pdp-hero-immersive--fill-frame flex-1",
          "shrink-0",
          galleryPanelClassName(isLastPanel),
        )}
      >
        <div
          ref={trackRef}
          data-hero-gallery-track
          className={cn(
            "absolute inset-0 z-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden [touch-action:pan-x_pan-y]",
          )}
        >
          {loopedSlides.map((slide, index) => {
            const logicalIndex = index % slides.length;
            return (
              <div
                key={`${slide.kind}-${slide.src}-${index}`}
                className="relative h-full w-full shrink-0 snap-center snap-always"
                style={{ backgroundColor: heroSlideBackground(slide.shotType) }}
              >
                <HeroSlideMedia
                  slide={slide}
                  isActive={index === activeLoopedIndex}
                  eager={logicalIndex <= 1}
                />
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[10]",
            scrimTransitionClass,
          )}
          style={{ opacity: scrimVisible ? 1 : 0 }}
        >
          <div
            className="pdp-hero-ui-chrome absolute inset-0"
            style={{ backgroundImage: HERO_FILTER_GRADIENT }}
          />
          <div className="pdp-hero-ui-chrome pdp-hero-immersive__top-scrim" />
        </div>

        <div
          aria-hidden
          className={cn(
            "pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 bottom-0 z-[8]",
            scrimTransitionClass,
          )}
          style={{
            height: `${HERO_MIDDLE_HEIGHT_FRACTION * 100}%`,
            backgroundImage: HERO_MIDDLE_GRADIENT,
            opacity: scrimVisible ? 1 : 0,
          }}
        />

        <PdpHeroActionRail
          onOpenReviews={onOpenReviews}
          onOpenArTryOn={onOpenArTryOn}
        />

        <PdpGalleryProductHud />
      </section>
    </PdpHeroGalleryProvider>
  );
}
