"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";
import { PdpGalleryEditorialSlide } from "./pdp-gallery-editorial-slide";
import { PdpGalleryProductCollage } from "./pdp-gallery-product-collage";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpGalleryPhotosSheet } from "./pdp-gallery-photos-sheet";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpGalleryStrapCard } from "./pdp-gallery-strap-card";
import { PdpGalleryViewMorePhotos } from "./pdp-gallery-view-more-photos";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { PdpProductHotspots } from "./pdp-product-hotspots";
import { PdpBundleModule } from "./pdp-bundle-module";
import { PdpCompareModule } from "./pdp-compare-module";
import { PdpAiConciergeModule } from "./pdp-product-search-module";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpReviewsModule } from "./pdp-reviews-module";
import { PdpSimilarItemsCarousel } from "./pdp-similar-items-carousel";
import { PdpScrollReveal } from "./pdp-scroll-reveal";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import { PdpLeatherAgingModule } from "./pdp-leather-aging-module";
import { PdpLeatherCleanerModule } from "./pdp-leather-cleaner-module";
import { PdpBagStoriesModule } from "./pdp-bag-stories-module";
import { PdpStrapSimulationModule } from "./pdp-strap-simulation-module";
import { PdpWeightFeelModule } from "./pdp-weight-feel-module";
import { galleryImageUtilityIconClass } from "./pdp-gallery-image-utility";
import { PdpGalleryImageUtilityRail } from "./pdp-gallery-image-utility-rail";
import { PdpMaterialStoryModule } from "./pdp-material-story-module";
import { PdpSignatureSoundsModule } from "./pdp-signature-sounds-module";
import { PdpUgcVideoCarouselModule } from "./pdp-ugc-video-carousel-module";
import { PdpStrapOptionsSheet } from "./pdp-strap-options-sheet";
import {
  PDP_GALLERY_HERO_IMAGE,
  PDP_GALLERY_HERO_IMAGE_FOCUS,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
  PDP_STUDIO_BACKDROP_CLASS,
  PDP_STRAP_OPTIONS,
} from "./pdp-data";
import type { PdpBundleAddPayload, PdpInfluencerCredit, PdpProductHotspot } from "./pdp-data";
import { pdpType } from "./pdp-type";
import {
  BOTTOM_CTA_OFFSET,
  PANEL_MEDIA_COVER_CLASS,
  PANEL_MEDIA_FILL_CLASS,
  PANEL_MEDIA_FRAME_CLASS,
  SCREEN_HEIGHT_STYLE,
} from "./pdp-viewport-chrome";
import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";
import { galleryPanelClassName, getLastGalleryPanelSlideIndex } from "./pdp-gallery-panel";
import { usePanelScrollRelease } from "./use-panel-scroll-release";

export { BOTTOM_CTA_OFFSET } from "./pdp-viewport-chrome";
export { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";

const GALLERY_CLASS = "w-full";

/** Reserve scroll space so modules aren't hidden behind the fixed bottom bar */
const GALLERY_SCROLL_PAD = {
  paddingBottom: BOTTOM_CTA_OFFSET,
} as const;

/** Suit Supply-style 2px hairline between stacked gallery frames (off in panel mode) */
const GALLERY_MEDIA_STACK_CLASS = PDP_PANEL_SCROLL
  ? "flex flex-col bg-white"
  : "flex flex-col gap-[2px] bg-white";

/** Hero only — full-screen immersive using layout viewport (innerHeight) */
function PdpHeroSlide({
  src,
  alt,
  priority = false,
  onOpenReviews,
  isLastPanel = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onOpenReviews?: () => void;
  isLastPanel?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-black",
        galleryPanelClassName(isLastPanel),
      )}
      style={SCREEN_HEIGHT_STYLE}
    >
      <div className="absolute inset-x-0 bottom-0 top-[calc(-1*env(safe-area-inset-top,0px))]">
        <div className={PANEL_MEDIA_FILL_CLASS}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="pdp-hero-photo-reveal pdp-gallery-panel__cover object-cover object-center"
            style={{
              objectPosition: PDP_GALLERY_HERO_IMAGE_FOCUS.objectPosition,
            }}
            sizes="100vw"
          />
        </div>
      </div>

      <PdpGalleryProductHud />
      <PdpHeroActionRail onOpenReviews={onOpenReviews} />
    </section>
  );
}

type PdpGalleryPortraitSlideProps = {
  src: string;
  alt: string;
  priority?: boolean;
  scale?: string;
  insetMargins?: boolean;
  shopTheLookId?: string;
  strapOptionsId?: string;
  influencer?: PdpInfluencerCredit;
  onOpenShopTheLook?: (lookId: string) => void;
  onOpenStrapOptions?: (setId: string) => void;
  reserveBottomCta?: boolean;
  objectPosition?: string;
  hotspots?: PdpProductHotspot[];
  isLastPanel?: boolean;
  panelContain?: boolean;
  headerSurface?: "light" | "dark";
  aspect?: "4/5" | "9/16";
};

/** Immersive 4:5 portrait — full-bleed by default, optional 12px white inset */
function PdpGalleryPortraitSlide({
  src,
  alt,
  priority = false,
  scale = "scale-100",
  insetMargins = false,
  shopTheLookId,
  strapOptionsId,
  influencer,
  onOpenShopTheLook,
  onOpenStrapOptions,
  reserveBottomCta = false,
  objectPosition = "top",
  hotspots,
  isLastPanel = false,
  panelContain = false,
  headerSurface,
  aspect = "4/5",
}: PdpGalleryPortraitSlideProps) {
  const panel = PDP_PANEL_SCROLL;
  const fitContain = panel && panelContain;

  return (
    <section
      className={cn(
        "relative w-full shrink-0 overflow-hidden",
        panel
          ? fitContain
            ? "bg-neutral-200"
            : "bg-black"
          : insetMargins
            ? "bg-white p-3"
            : "bg-white",
        galleryPanelClassName(isLastPanel),
      )}
      data-header-surface={
        headerSurface ?? (insetMargins && !panel ? "light" : fitContain ? "light" : undefined)
      }
      style={
        panel
          ? SCREEN_HEIGHT_STYLE
          : reserveBottomCta
            ? { paddingBottom: BOTTOM_CTA_OFFSET }
            : undefined
      }
    >
      <div
        className={cn(
          panel
            ? PANEL_MEDIA_FRAME_CLASS
            : cn(
                "relative w-full overflow-hidden",
                aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
                insetMargins ? "bg-white" : PDP_STUDIO_BACKDROP_CLASS,
              ),
        )}
      >
        <div className={panel ? PANEL_MEDIA_FILL_CLASS : "relative size-full"}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={panel ? "eager" : undefined}
            className={cn(
              panel && !fitContain && PANEL_MEDIA_COVER_CLASS,
              fitContain ? "object-contain" : "object-cover",
              scale,
            )}
            style={{ objectPosition }}
            sizes="100vw"
          />
        </div>

        {hotspots?.length ? <PdpProductHotspots hotspots={hotspots} /> : null}

        {influencer ? (
          <a
            href={influencer.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/35 py-2 pl-3 pr-3.5 text-white backdrop-blur-md transition-colors active:bg-black/50 ${pdpType.label}`}
            aria-label={`View ${influencer.handle} on ${influencer.platform === "tiktok" ? "TikTok" : "Instagram"}`}
          >
            <span className="font-extended translate-y-px">{influencer.handle}</span>
            <MaterialIcon name="north_east" size={18} className="text-white/90" />
          </a>
        ) : null}

        {shopTheLookId && onOpenShopTheLook ? (
          <PdpGalleryImageUtilityRail>
            <button
              type="button"
              onClick={() => onOpenShopTheLook(shopTheLookId)}
              aria-label="Shop the look"
              className={galleryImageUtilityIconClass()}
            >
              <MaterialIcon name="checkroom" size={20} className="text-neutral-900" />
            </button>
          </PdpGalleryImageUtilityRail>
        ) : null}

        {strapOptionsId &&
        onOpenStrapOptions &&
        PDP_STRAP_OPTIONS[strapOptionsId] ? (
          <PdpGalleryStrapCard
            set={PDP_STRAP_OPTIONS[strapOptionsId]}
            onOpen={() => onOpenStrapOptions(strapOptionsId)}
          />
        ) : null}
      </div>
    </section>
  );
}

/** Immersive gallery video — 4:5 product spin or 9:16 TikTok-style clip */
function PdpGalleryVideoSlide({
  src,
  poster,
  alt,
  showMuteControl = true,
  aspect = "4/5",
  reserveBottomCta = false,
  isLastPanel = false,
}: {
  src: string;
  poster?: string;
  alt: string;
  showMuteControl?: boolean;
  aspect?: "4/5" | "9/16";
  reserveBottomCta?: boolean;
  isLastPanel?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full shrink-0 overflow-hidden",
        PDP_PANEL_SCROLL ? "bg-black" : "bg-white",
        galleryPanelClassName(isLastPanel),
      )}
      style={
        PDP_PANEL_SCROLL
          ? SCREEN_HEIGHT_STYLE
          : reserveBottomCta
            ? { paddingBottom: BOTTOM_CTA_OFFSET }
            : undefined
      }
    >
      <div
        className={cn(
          PDP_PANEL_SCROLL
            ? cn("bg-black", PANEL_MEDIA_FRAME_CLASS)
            : cn(
                "relative w-full overflow-hidden bg-white",
                aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
              ),
        )}
      >
        <div className={PDP_PANEL_SCROLL ? PANEL_MEDIA_FILL_CLASS : "size-full"}>
          <PdpGalleryHeroVideo
            src={src}
            poster={poster}
            ariaLabel={alt}
            isActive={isActive}
            showControls
            showMuteControl={showMuteControl}
            className={cn(
              "size-full object-cover object-center",
              PDP_PANEL_SCROLL && PANEL_MEDIA_COVER_CLASS,
            )}
          />
        </div>
      </div>
    </section>
  );
}

export function PdpGalleryView({
  onOpenReviews,
  onAddSimilarToBag,
  onAddBundle,
  onQuickAddStrap,
  onStrapOptionsOpenChange,
  selectedColorId,
}: {
  onOpenReviews?: () => void;
  onAddSimilarToBag?: () => void;
  onAddBundle?: (payload: PdpBundleAddPayload) => void;
  onQuickAddStrap?: (optionId: string) => void;
  onStrapOptionsOpenChange?: (open: boolean) => void;
  selectedColorId: string;
}) {
  const [shopLookId, setShopLookId] = useState<string | null>(null);
  const [strapOptionsId, setStrapOptionsId] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState(false);
  const galleryEndRef = useRef<HTMLDivElement>(null);
  const lastPanelSlideIndex = getLastGalleryPanelSlideIndex(PDP_GALLERY_SLIDES);
  const activeShopLook = shopLookId ? PDP_SHOP_THE_LOOK[shopLookId] ?? null : null;
  const activeStrapOptions = strapOptionsId
    ? PDP_STRAP_OPTIONS[strapOptionsId] ?? null
    : null;

  useEffect(() => {
    onStrapOptionsOpenChange?.(strapOptionsId !== null);
  }, [onStrapOptionsOpenChange, strapOptionsId]);

  usePanelScrollRelease(galleryEndRef);

  return (
    <>
    <div className={GALLERY_CLASS} style={GALLERY_SCROLL_PAD}>
      <div className={GALLERY_MEDIA_STACK_CLASS}>
        <PdpHeroSlide
          src={PDP_GALLERY_HERO_IMAGE}
          alt="Model in a navy bomber jacket with shearling collar carrying Tabby Shoulder Bag 26"
          priority
          onOpenReviews={onOpenReviews}
          isLastPanel={lastPanelSlideIndex === -1}
        />

        {PDP_GALLERY_SLIDES.flatMap((slide, index) => {
          const isLastPanel = index === lastPanelSlideIndex;

          if (slide.type === "editorial") {
            return [
              <PdpGalleryEditorialSlide
                key={`editorial-${index}-${slide.src}`}
                src={slide.src}
                alt={slide.alt}
                caption={slide.caption}
                objectPosition={slide.objectPosition}
                secondarySrc={slide.secondarySrc}
                secondaryAlt={slide.secondaryAlt}
                learnMore={slide.learnMore}
                panelScroll={PDP_PANEL_SCROLL}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "signature-sounds") {
            return [
              <PdpSignatureSoundsModule key={`signature-sounds-${index}`} />,
            ];
          }

          if (slide.type === "material-exploration") {
            return [
              <PdpMaterialStoryModule
                key={`material-exploration-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "leather-aging") {
            return [
              <PdpLeatherAgingModule
                key={`leather-aging-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "weight-feel") {
            return [
              <PdpWeightFeelModule
                key={`weight-feel-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "bag-stories") {
            return [
              <PdpBagStoriesModule
                key={`bag-stories-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "strap-simulation") {
            return [
              <PdpStrapSimulationModule
                key={`strap-simulation-${index}`}
                isLastPanel={isLastPanel}
                onQuickAddStrap={onQuickAddStrap}
              />,
            ];
          }

          if (slide.type === "product-collage") {
            return [
              <PdpGalleryProductCollage
                key={`product-collage-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "video") {
            return [
              <PdpGalleryVideoSlide
                key={`video-${index}-${slide.src}`}
                src={slide.src}
                poster={slide.poster}
                alt={slide.alt}
                showMuteControl={slide.showMuteControl}
                aspect={slide.aspect}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type === "ugc-videos") {
            return [
              <PdpUgcVideoCarouselModule
                key={`ugc-videos-${index}`}
                isLastPanel={isLastPanel}
              />,
            ];
          }

          if (slide.type !== "immersive") {
            return [];
          }

          return [
            <PdpGalleryPortraitSlide
              key={`immersive-${index}-${slide.src}`}
              src={slide.src}
              alt={slide.alt}
              priority={index === 0}
              scale={
                slide.scale ??
                (PDP_PANEL_SCROLL
                  ? "scale-100"
                  : slide.src.includes("interior-packed") ||
                      slide.src.includes("interior-packed-bleed")
                    ? "scale-[1.12]"
                    : "scale-[1.08]")
              }
              shopTheLookId={slide.shopTheLookId}
              strapOptionsId={slide.strapOptionsId}
              influencer={slide.influencer}
              onOpenShopTheLook={setShopLookId}
              onOpenStrapOptions={setStrapOptionsId}
              insetMargins={slide.insetMargins}
              objectPosition={slide.objectPosition}
              hotspots={slide.hotspots}
              isLastPanel={isLastPanel}
              panelContain={slide.panelContain}
              headerSurface={slide.headerSurface}
              aspect={slide.aspect}
            />,
          ];
        })}
        <div ref={galleryEndRef} aria-hidden className="h-px w-full shrink-0" />
        <PdpGalleryViewMorePhotos onOpen={() => setPhotosOpen(true)} />
      </div>

      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpSimilarItemsCarousel onAddToBag={() => onAddSimilarToBag?.()} />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpCompareModule
          selectedColorId={selectedColorId}
          onAddToBag={() => onAddSimilarToBag?.()}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpBundleModule onAddBundle={(payload) => onAddBundle?.(payload)} />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpLeatherCleanerModule onQuickAdd={() => onAddSimilarToBag?.()} />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpReviewsModule
          onReadAll={onOpenReviews}
          onWriteReview={onOpenReviews}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpRecentlyViewedCarousel />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light">
        <PdpAiConciergeModule />
      </PdpScrollReveal>
    </div>
    <PdpGalleryPhotosSheet open={photosOpen} onClose={() => setPhotosOpen(false)} />
    <PdpShopTheLookSheet
      look={activeShopLook}
      open={shopLookId !== null}
      onClose={() => setShopLookId(null)}
    />
    <PdpStrapOptionsSheet
      set={activeStrapOptions}
      open={strapOptionsId !== null}
      onClose={() => setStrapOptionsId(null)}
      onAddToBag={() => onAddSimilarToBag?.()}
    />
    </>
  );
}
