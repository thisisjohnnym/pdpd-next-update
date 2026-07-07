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
  applyV4HeroGallery,
  prependHeroGalleryLeadSlide,
  promoteHeroGallerySlideToLead,
  type PdpHeroGallerySlide,
} from "./pdp-hero-gallery-data";
import {
  heroSlideBackground,
  resolveHeroFraming,
} from "./pdp-hero-framing";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { useSetHeroChromeSurface } from "./pdp-hero-chrome-surface";
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
import { PdpV3GalleryOverlay } from "./version/pdp-v3-gallery-overlay";

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
        tapToTogglePlayback
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
  const {
    useStableInfiniteCarousel,
    heroDockedBuyBar,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
  } = getPdpVersionConfig(usePdpVersion());
  const orderedSlides = useMemo(() => {
    let result =
      leadGalleryWithProductStill || heroGalleryStudioDragZoom
        ? applyV4HeroGallery(slides, {
            leadGalleryWithProductStill,
            heroGalleryStudioDragZoom,
          })
        : slides;

    if (heroGalleryLeadSlideSrc) {
      result = promoteHeroGallerySlideToLead(result, heroGalleryLeadSlideSrc);
    }

    if (heroGalleryPrependLeadSlide) {
      result = prependHeroGalleryLeadSlide(result, heroGalleryPrependLeadSlide);
    }

    return result;
  }, [
    slides,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
  ]);
  const loopedSlides = useMemo(
    () => loopCarouselItems(orderedSlides),
    [orderedSlides],
  );
  const { activeIndex, activeLoopedIndex } = useInfiniteFullBleedCarousel(
    trackRef,
    orderedSlides.length,
    { stableLoop: useStableInfiniteCarousel },
  );
  const setHeroChromeSurface = useSetHeroChromeSurface();

  const surface = orderedSlides[activeIndex]?.headerSurface ?? "dark";

  useLayoutEffect(() => {
    setHeroChromeSurface(surface);
  }, [setHeroChromeSurface, surface]);

  const galleryState = useMemo(
    () => ({
      activeIndex,
      count: orderedSlides.length,
      surface,
      overlayCta: orderedSlides[activeIndex]?.overlayCta,
    }),
    [activeIndex, orderedSlides, surface],
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
          className={cn(
            "absolute inset-0 z-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden [touch-action:pan-x_pan-y]",
          )}
        >
          {loopedSlides.map((slide, index) => {
            const logicalIndex = index % orderedSlides.length;
            const slideScrimVisible = slide.headerSurface === "dark";
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
        ) : (
          <>
            <PdpHeroActionRail
              onOpenReviews={onOpenReviews}
              onOpenArTryOn={onOpenArTryOn}
            />

            <PdpGalleryProductHud />
          </>
        )}
      </section>
    </PdpHeroGalleryProvider>
  );
}
