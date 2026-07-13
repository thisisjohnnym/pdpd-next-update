"use client";

import Image from "next/image";
import { useMemo, useRef, useLayoutEffect } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { PdpHero360IntroLayer } from "./pdp-hero-360-intro-layer";
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
import { useReducedMotion } from "./use-reduced-motion";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3GalleryOverlay } from "./version/pdp-v3-gallery-overlay";
import { PdpHeroGalleryVertical } from "./pdp-hero-gallery-vertical";

function HeroSlideMedia({
  slide,
  isActive,
  keepMounted = false,
  eager,
}: {
  slide: PdpHeroGallerySlide;
  isActive: boolean;
  keepMounted?: boolean;
  /** Decode immediately — first image slides for snappy first swipe */
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
      priority={eager}
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
export function PdpHeroGallery({
  slides = PDP_HERO_GALLERY_SLIDES,
  onOpenReviews,
  onOpenArTryOn,
  isLastPanel = false,
  fillFrame = false,
}: PdpHeroGalleryProps) {
  const versionConfig = getPdpVersionConfig(usePdpVersion());

  if (versionConfig.heroVerticalGallery) {
    return (
      <PdpHeroGalleryVertical
        slides={slides}
        onOpenArTryOn={onOpenArTryOn}
        isLastPanel={isLastPanel}
        fillFrame={fillFrame}
      />
    );
  }

  return (
    <PdpHeroGalleryHorizontal
      slides={slides}
      onOpenReviews={onOpenReviews}
      onOpenArTryOn={onOpenArTryOn}
      isLastPanel={isLastPanel}
      fillFrame={fillFrame}
      versionConfig={versionConfig}
    />
  );
}

type PdpHeroGalleryProps = {
  slides?: PdpHeroGallerySlide[];
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
  isLastPanel?: boolean;
  /** Size to the parent media frame (PdpHeroShell) instead of 100svh */
  fillFrame?: boolean;
};

/** Horizontal snap carousel — split out so hooks stay unconditional above the v6 vertical branch. */
function PdpHeroGalleryHorizontal({
  slides = PDP_HERO_GALLERY_SLIDES,
  onOpenReviews,
  onOpenArTryOn,
  isLastPanel = false,
  fillFrame = false,
  versionConfig,
}: PdpHeroGalleryProps & {
  versionConfig: ReturnType<typeof getPdpVersionConfig>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const {
    useStableInfiniteCarousel,
    heroDockedBuyBar,
    leadGalleryWithProductStill,
    heroGalleryStudioDragZoom,
    heroGalleryLeadSlideSrc,
    heroGalleryPrependLeadSlide,
    heroGalleryUgcSlides,
    heroGalleryUgcInsertAfterIndex,
    heroGalleryLogicalBlockOrder,
    heroGalleryExcludeSlideSrcs,
    heroGalleryExtraSlides,
    heroProductSlidesFillFrame,
    useHeroGalleryProgressBar,
    showHeroGalleryCategoryRail,
    hero360IntroEnabled,
    hero360IntroVideoSrc,
  } = versionConfig;
  const { enabled: introActive, isGalleryScrollReady } = useHero360Intro();
  const reducedMotion = useReducedMotion();
  /** Slide 0 is the intro clip's end frame — not a separate lead still.
   * Gate on context `enabled` so v5 desktop (mobileOnly skip) does not mount. */
  const useIntroLeadSlide =
    introActive &&
    hero360IntroEnabled &&
    Boolean(hero360IntroVideoSrc) &&
    !reducedMotion;
  const idleChromeEnabled =
    useHeroGalleryProgressBar || showHeroGalleryCategoryRail;
  const orderedSlides = useMemo(
    () =>
      orderHeroGallerySlides(slides, {
        leadGalleryWithProductStill,
        heroGalleryStudioDragZoom,
        heroGalleryLeadSlideSrc,
        heroGalleryPrependLeadSlide,
        heroGalleryUgcSlides,
        heroGalleryUgcInsertAfterIndex,
        heroGalleryLogicalBlockOrder,
        heroGalleryExcludeSlideSrcs,
        heroGalleryExtraSlides,
        heroProductSlidesFillFrame,
      }),
    [
      slides,
      leadGalleryWithProductStill,
      heroGalleryStudioDragZoom,
      heroGalleryLeadSlideSrc,
      heroGalleryPrependLeadSlide,
      heroGalleryUgcSlides,
      heroGalleryUgcInsertAfterIndex,
      heroGalleryLogicalBlockOrder,
      heroGalleryExcludeSlideSrcs,
      heroGalleryExtraSlides,
      heroProductSlidesFillFrame,
    ],
  );
  const loopedSlides = useMemo(
    () => loopCarouselItems(orderedSlides),
    [orderedSlides],
  );
  const { activeIndex, activeLoopedIndex, scrollToIndex } = useInfiniteFullBleedCarousel(
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
            "absolute inset-0 z-0 flex snap-x snap-mandatory overscroll-x-contain",
            isGalleryScrollReady
              ? "overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y]"
              : "overflow-hidden touch-none",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
            const isCanonicalClone =
              orderedSlides.length <= 1 || index === orderedSlides.length + logicalIndex;
            const warmVideoNeighbor =
              slide.kind === "video" &&
              nearActive &&
              (isCentered || isCanonicalClone);
            // Intro is a section overlay — never paint slide-0 stills (any clone).
            // While locked, also blank neighbors so scrollLeft=0 can't flash them.
            const hideSlideMediaForIntro = useIntroLeadSlide && logicalIndex === 0;
            const suppressNeighborMedia =
              useIntroLeadSlide && !isGalleryScrollReady && logicalIndex !== 0;
            return (
              <div
                key={`${getHeroGallerySlideKey(slide)}-${index}`}
                className="relative h-full w-full shrink-0 snap-center snap-always"
                style={{ backgroundColor: heroSlideBackground(slide.shotType) }}
              >
                {hideSlideMediaForIntro || suppressNeighborMedia ? (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[#f0f0f0]"
                  />
                ) : (
                  <HeroSlideMedia
                    slide={slide}
                    isActive={isCentered}
                    keepMounted={warmVideoNeighbor}
                    eager={logicalIndex <= 1}
                  />
                )}
                {slideScrimVisible &&
                !hideSlideMediaForIntro &&
                !suppressNeighborMedia ? (
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

        {useIntroLeadSlide ? (
          // Stable section overlay — covers first-loop clones before center, and
          // stays mounted as slide 0's end frame (hidden when user swipes away).
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-[2]",
              isGalleryScrollReady && activeIndex !== 0 && "invisible",
            )}
          >
            <PdpHero360IntroLayer videoSrc={hero360IntroVideoSrc} />
          </div>
        ) : null}

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
