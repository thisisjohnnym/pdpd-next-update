"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
import { PdpShoppingDiscoveryModule } from "./pdp-shopping-discovery-module";
import { PdpReviewsModule } from "./pdp-reviews-module";
import { PdpCoachPremiumModule } from "./pdp-coach-premium-module";
import { PdpSiteFooter } from "./pdp-site-footer";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpScrollReveal } from "./pdp-scroll-reveal";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import { PdpLeatherAgingModule } from "./pdp-leather-aging-module";
import { PdpFaqModule } from "./pdp-faq-module";
import { PdpBagStoriesModule } from "./pdp-bag-stories-module";
import { PdpStrapSimulationModule } from "./pdp-strap-simulation-module";
import { PdpWeightFeelModule } from "./pdp-weight-feel-module";
import { PdpGalleryDragZoomImage } from "./pdp-gallery-drag-zoom-image";
import { PdpSignatureSoundsModule } from "./pdp-signature-sounds-module";
import { PdpUgcVideoCarouselModule } from "./pdp-ugc-video-carousel-module";
import { PdpAsSeenOnModule } from "./pdp-as-seen-on-module";
import { PdpStrapOptionsSheet } from "./pdp-strap-options-sheet";
import {
  PDP_GALLERY_HERO_IMAGE_FOCUS,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
  PDP_STUDIO_BACKDROP_CLASS,
  PDP_STRAP_OPTIONS,
} from "./pdp-data";
import type { PdpBundleAddPayload, PdpInfluencerCredit, PdpProductHotspot } from "./pdp-data";
import { pdpType } from "./pdp-type";
import { PdpTextReveal } from "./pdp-text-reveal";
import {
  BOTTOM_CTA_OFFSET,
  HERO_IMMERSIVE_CLASS,
  HERO_IMMERSIVE_MEDIA_CLASS,
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

const GALLERY_CLASS = "w-full overflow-x-clip bg-white";

/** Reserve scroll space so modules aren't hidden behind the fixed bottom bar */
const GALLERY_SCROLL_PAD = {
  paddingBottom: BOTTOM_CTA_OFFSET,
} as const;

/** Stacked gallery frames — gap removed so scroll-reveal shells do not expose page chrome */
const GALLERY_MEDIA_STACK_CLASS = PDP_PANEL_SCROLL
  ? "flex flex-col bg-white"
  : "flex flex-col bg-white";

type GalleryRevealSurface = "dark" | "light" | "muted" | "transparent";

function galleryScrollReveal(
  key: string,
  child: ReactNode,
  options: {
    variant?: "rise" | "subtle";
    surface?: GalleryRevealSurface;
  } = {},
) {
  return (
    <PdpScrollReveal
      key={key}
      variant={options.variant ?? "subtle"}
      surface={options.surface ?? "transparent"}
      lazyMount
    >
      {child}
    </PdpScrollReveal>
  );
}

/** Hero only — full-screen immersive video, edge-to-edge under device safe areas */
export function PdpGalleryHero({
  videoSrc,
  alt,
  onOpenReviews,
  isLastPanel = false,
}: {
  videoSrc: string;
  alt: string;
  onOpenReviews?: () => void;
  isLastPanel?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.25);
      },
      { threshold: [0, 0.25, 0.5] },
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
        HERO_IMMERSIVE_CLASS,
        "shrink-0",
        galleryPanelClassName(isLastPanel),
      )}
    >
      <div className={HERO_IMMERSIVE_MEDIA_CLASS}>
        <div className={PANEL_MEDIA_FILL_CLASS}>
          <PdpGalleryHeroVideo
            src={videoSrc}
            ariaLabel={alt}
            isActive={isActive}
            preload={isActive ? "auto" : "metadata"}
            priorityAutoplay
            skeletonTone="dark"
            showControls={false}
            showMuteControl={false}
            tapToTogglePlayback
            className={cn(
              "pdp-gallery-panel__cover size-full object-cover object-center",
            )}
            style={{
              objectPosition: PDP_GALLERY_HERO_IMAGE_FOCUS.objectPosition,
            }}
          />
        </div>
      </div>

      <div aria-hidden className="pdp-hero-immersive__top-scrim" />

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
  dragZoom?: boolean;
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
  dragZoom = false,
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
          {dragZoom ? (
            <PdpGalleryDragZoomImage
              src={src}
              alt={alt}
              priority={priority}
              objectPosition={objectPosition}
              scale={scale}
              fitContain={fitContain}
              panel={panel}
            />
          ) : (
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
          )}
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
          <button
            type="button"
            onClick={() => onOpenShopTheLook(shopTheLookId)}
            aria-label="Shop the look"
            className={cn(
              "absolute bottom-4 left-3 z-10 flex items-center gap-1 rounded-full border border-white/55 bg-white/80 py-1 pl-1 pr-2.5 text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors active:bg-white/95 lg:left-5",
              pdpType.micro,
            )}
          >
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/90"
            >
              <MaterialIcon name="checkroom" size={18} className="text-neutral-900" />
            </span>
            <span className="font-extended">Shop the look</span>
          </button>
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
  alt,
  showMuteControl = true,
  aspect = "4/5",
  caption,
  reserveBottomCta = false,
  isLastPanel = false,
}: {
  src: string;
  alt: string;
  showMuteControl?: boolean;
  aspect?: "4/5" | "9/16";
  caption?: string;
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
            ariaLabel={alt}
            isActive={isActive}
            preload={isActive ? "auto" : "metadata"}
            skeletonTone={PDP_PANEL_SCROLL ? "dark" : "light"}
            showControls
            showMuteControl={showMuteControl}
            className={cn(
              "size-full object-cover object-center",
              PDP_PANEL_SCROLL && PANEL_MEDIA_COVER_CLASS,
            )}
          />
          {caption ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/55 via-black/20 to-transparent px-4 pb-8 pt-[calc(var(--pdp-safe-area-top)+3.25rem)]"
            >
              <PdpTextReveal
                as="p"
                className={`font-extended m-0 text-center text-white ${pdpType.caption}`}
              >
                {caption}
              </PdpTextReveal>
            </div>
          ) : null}
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
  onComparePickerOpenChange,
  selectedColorId,
  omitHero = false,
}: {
  onOpenReviews?: () => void;
  onAddSimilarToBag?: () => void;
  onAddBundle?: (payload: PdpBundleAddPayload) => void;
  onQuickAddStrap?: (optionId: string) => void;
  onStrapOptionsOpenChange?: (open: boolean) => void;
  onComparePickerOpenChange?: (open: boolean) => void;
  selectedColorId: string;
  omitHero?: boolean;
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
    {!omitHero ? (
      <PdpGalleryHero
        videoSrc={PDP_GALLERY_IMMERSIVE_HERO_VIDEO}
        alt="Model in camel trench coat carrying Tabby Shoulder Bag 26 on a city street"
        onOpenReviews={onOpenReviews}
        isLastPanel={lastPanelSlideIndex === -1}
      />
    ) : null}

    <div className={GALLERY_CLASS} style={GALLERY_SCROLL_PAD}>
      <div className={GALLERY_MEDIA_STACK_CLASS}>
        {PDP_GALLERY_SLIDES.flatMap((slide, index) => {
          const isLastPanel = index === lastPanelSlideIndex;

          if (slide.type === "editorial") {
            return [
              galleryScrollReveal(
                `editorial-${index}-${slide.videoSrc ?? slide.src}`,
                <PdpGalleryEditorialSlide
                  src={slide.src}
                  alt={slide.alt}
                  caption={slide.caption}
                  objectPosition={slide.objectPosition}
                  videoSrc={slide.videoSrc}
                  showMuteControl={slide.showMuteControl}
                  dragZoom={slide.dragZoom}
                  scale={slide.scale}
                  secondarySrc={slide.secondarySrc}
                  secondaryAlt={slide.secondaryAlt}
                  learnMore={slide.learnMore}
                  cta={slide.cta}
                  panelScroll={PDP_PANEL_SCROLL}
                  isLastPanel={isLastPanel}
                />,
                { surface: "light", variant: "rise" },
              ),
            ];
          }

          if (slide.type === "signature-sounds") {
            return [
              galleryScrollReveal(
                `signature-sounds-${index}`,
                <PdpSignatureSoundsModule />,
                { surface: "muted", variant: "rise" },
              ),
            ];
          }

          if (slide.type === "leather-aging") {
            return [
              galleryScrollReveal(
                `leather-aging-${index}`,
                <PdpLeatherAgingModule
                  isLastPanel={isLastPanel}
                  onQuickAdd={() => onAddSimilarToBag?.()}
                />,
                { variant: "rise" },
              ),
            ];
          }

          if (slide.type === "weight-feel") {
            return [
              galleryScrollReveal(
                `weight-feel-${index}`,
                <PdpWeightFeelModule isLastPanel={isLastPanel} />,
                { variant: "subtle" },
              ),
            ];
          }

          if (slide.type === "bag-stories") {
            return [
              galleryScrollReveal(
                `bag-stories-${index}`,
                <PdpBagStoriesModule isLastPanel={isLastPanel} />,
              ),
            ];
          }

          if (slide.type === "strap-simulation") {
            return [
              galleryScrollReveal(
                `strap-simulation-${index}`,
                <PdpStrapSimulationModule
                  isLastPanel={isLastPanel}
                  onQuickAddStrap={onQuickAddStrap}
                />,
              ),
            ];
          }

          if (slide.type === "product-collage") {
            return [
              galleryScrollReveal(
                `product-collage-${index}`,
                <PdpGalleryProductCollage isLastPanel={isLastPanel} />,
              ),
            ];
          }

          if (slide.type === "video") {
            return [
              galleryScrollReveal(
                `video-${index}-${slide.src}`,
                <PdpGalleryVideoSlide
                  src={slide.src}
                  alt={slide.alt}
                  showMuteControl={slide.showMuteControl}
                  aspect={slide.aspect}
                  caption={slide.caption}
                  isLastPanel={isLastPanel}
                />,
                { surface: "light", variant: "rise" },
              ),
            ];
          }

          if (slide.type === "ugc-videos") {
            return [
              galleryScrollReveal(
                `ugc-videos-${index}`,
                <PdpUgcVideoCarouselModule />,
                { surface: "light", variant: "rise" },
              ),
            ];
          }

          if (slide.type === "as-seen-on") {
            return [
              galleryScrollReveal(
                `as-seen-on-${index}`,
                <PdpAsSeenOnModule isLastPanel={isLastPanel} />,
                { surface: "light", variant: "rise" },
              ),
            ];
          }

          if (slide.type !== "immersive") {
            return [];
          }

          return [
            galleryScrollReveal(
              `immersive-${index}-${slide.src}`,
              <PdpGalleryPortraitSlide
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
                dragZoom={slide.dragZoom}
              />,
              { surface: "light" },
            ),
          ];
        })}
        <div ref={galleryEndRef} aria-hidden className="h-px w-full shrink-0" />
        {galleryScrollReveal(
          "view-more-photos",
          <PdpGalleryViewMorePhotos onOpen={() => setPhotosOpen(true)} />,
          { surface: "muted", variant: "rise" },
        )}
      </div>

      {/* Ecommerce — after desire + function gallery scroll */}
      <PdpScrollReveal className="w-full shrink-0" surface="muted" lazyMount reserveMinHeight="40dvh">
        <PdpCompareModule
          onAddToBag={() => onAddSimilarToBag?.()}
          onPickerOpenChange={onComparePickerOpenChange}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light" lazyMount reserveMinHeight="40dvh">
        <PdpBundleModule onAddBundle={(payload) => onAddBundle?.(payload)} />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="muted" lazyMount reserveMinHeight="40dvh">
        <PdpShoppingDiscoveryModule onAddToBag={() => onAddSimilarToBag?.()} />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="muted" lazyMount reserveMinHeight="32dvh">
        <PdpFaqModule />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light" lazyMount reserveMinHeight="40dvh">
        <PdpReviewsModule
          onReadAll={onOpenReviews}
          onWriteReview={onOpenReviews}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="muted" lazyMount reserveMinHeight="24dvh">
        <PdpRecentlyViewedCarousel />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light" lazyMount reserveMinHeight="28dvh">
        <PdpCoachPremiumModule />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="muted" lazyMount reserveMinHeight="20dvh">
        <PdpSiteFooter />
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
