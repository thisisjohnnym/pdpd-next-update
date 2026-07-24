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
  getHeroGallerySlideKey,
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
import {
  loopCarouselItems,
  useInfiniteFullBleedCarousel,
} from "./use-infinite-centered-carousel";
import { HeroGalleryIdleProvider } from "./use-hero-gallery-idle-visible";
import { useHeroGalleryTouchScrollPassthrough } from "./use-hero-gallery-touch-scroll";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { getUxrHeroGallerySlides } from "./pdp-uxr-color-media";
import { useIsUxrStudyRoute } from "./use-uxr-study-route";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3GalleryOverlay } from "./version/pdp-v3-gallery-overlay";

// fallow-ignore-next-line complexity
function HeroSlideMedia({
  slide,
  isActive,
  keepMounted = false,
  eager,
}: {
  slide: PdpHeroGallerySlide;
  isActive: boolean;
  keepMounted?: boolean;
  /** Start loading immediately so nearby slides are ready before a swipe lands */
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
        keepMounted={keepMounted}
        preload={isActive || keepMounted ? "auto" : "metadata"}
        priorityAutoplay={Boolean(slide.priority)}
        // 360 spins should play immediately on slide-in — no land-hero blur flash.
        blurReveal={
          slide.galleryCategory === "360" ? false : undefined
        }
        skeletonTone={slide.shotType === "lifestyle" ? "dark" : "light"}
        showMuteControl
        passThroughTouch
        allowHorizontalPan
        controlsPosition="bottom-right"
        controlsElevated
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
      loading={eager ? "eager" : "lazy"}
      sizes="100vw"
      className={cn("object-center", fitClass)}
      style={{ objectPosition }}
    />
  );
}

function circularSlideDistance(
  fromIndex: number,
  toIndex: number,
  count: number,
): number {
  if (count <= 1) {
    return 0;
  }

  const diff = Math.abs(fromIndex - toIndex);
  return Math.min(diff, count - diff);
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
// fallow-ignore-next-line complexity
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
  const isUxrStudy = useIsUxrStudyRoute();
  const tabby = useOptionalTabbyVariant();
  const {
    useStableInfiniteCarousel,
    heroDockedBuyBar,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryLastSlideSrc,
    heroGalleryExcludedSlideSrcs,
    heroGalleryAdditionalSlides,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
    useHeroGalleryProgressBar,
    showHeroGalleryCategoryRail,
  } = getPdpVersionConfig(usePdpVersion());
  const idleChromeEnabled =
    useHeroGalleryProgressBar || showHeroGalleryCategoryRail;
  const orderedSlides = useMemo(() => {
    // UXR study — ordered black/beige packs; skip v5 reorder flags.
    if (isUxrStudy) {
      return getUxrHeroGallerySlides(tabby?.selectedColorId);
    }

    return orderHeroGallerySlides(slides, {
      leadGalleryWithProductStill,
      heroGalleryStudioDragZoom,
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
    slides,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryLastSlideSrc,
    heroGalleryExcludedSlideSrcs,
    heroGalleryAdditionalSlides,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
  ]);
  const loopedSlides = useMemo(
    () => loopCarouselItems(orderedSlides),
    [orderedSlides],
  );
  const { activeIndex, activeLoopedIndex, scrollToIndex } = useInfiniteFullBleedCarousel(
    trackRef,
    orderedSlides.length,
    { stableLoop: useStableInfiniteCarousel },
  );
  useHeroGalleryTouchScrollPassthrough(trackRef);
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
      slides: orderedSlides,
      scrollToIndex,
    }),
    [activeIndex, orderedSlides, surface, scrollToIndex],
  );

  return (
    <PdpHeroGalleryProvider value={galleryState}>
      <HeroGalleryIdleProvider enabled={idleChromeEnabled}>
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
          {/* fallow-ignore-next-line complexity */}
          {loopedSlides.map((slide, index) => {
            const logicalIndex = index % orderedSlides.length;
            const slideScrimVisible = slide.headerSurface === "dark";
            const isCentered = index === activeLoopedIndex;
            const nearActive =
              circularSlideDistance(logicalIndex, activeIndex, orderedSlides.length) <=
              1;
            const preloadNearby =
              circularSlideDistance(logicalIndex, activeIndex, orderedSlides.length) <=
              2;
            const isCanonicalClone =
              orderedSlides.length <= 1 || index === orderedSlides.length + logicalIndex;
            const warmVideoNeighbor =
              slide.kind === "video" &&
              nearActive &&
              (isCentered || isCanonicalClone);
            return (
              <div
                key={`${getHeroGallerySlideKey(slide)}-${index}`}
                className="relative h-full w-full shrink-0 snap-center snap-always"
                style={{ backgroundColor: heroSlideBackground(slide.shotType) }}
              >
                <HeroSlideMedia
                  slide={slide}
                  isActive={isCentered}
                  keepMounted={warmVideoNeighbor}
                  eager={preloadNearby}
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
      </HeroGalleryIdleProvider>
    </PdpHeroGalleryProvider>
  );
}
