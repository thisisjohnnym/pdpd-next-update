"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

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
import { PdpCompareModuleGate } from "./pdp-compare-module-gate";
import { useTabbyFamilyCompareExperiment } from "./experiments/tabby-family-compare-flag";
import { useActiveProduct } from "./pdp-active-product-context";
import { PdpTabbyVariantModule } from "./pdp-tabby-variant-module";
import { getTabbyGalleryMorePhotosForColor, getTabbyGallerySlidesForColor } from "./pdp-tabby-color-media";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import {
  PdpCoachAiModule,
  PdpMoreLikeThisModule,
} from "./pdp-shopping-discovery-module";
import { PdpReviewsModule } from "./pdp-reviews-module";
import { PdpProductDetailsModule } from "./pdp-product-details-module";
import { PdpCoachPremiumModule } from "./pdp-coach-premium-module";
import { pdpChapterAnchorId } from "./pdp-section-chapters";
import { PdpSiteFooter } from "./pdp-site-footer";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpScrollReveal } from "./pdp-scroll-reveal";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import { PdpLeatherAgingModule } from "./pdp-leather-aging-module";
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
  PDP_GALLERY_IMMERSIVE_HERO_POSTER,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
  PDP_GALLERY_MORE_PHOTOS,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
  PDP_STUDIO_BACKDROP_CLASS,
  PDP_STRAP_OPTIONS,
} from "./pdp-data";
import type {
  PdpBundleAddPayload,
  PdpInfluencerCredit,
  PdpProductHotspot,
  PdpStrapSetAddPayload,
} from "./pdp-data";
import { pdpType } from "./pdp-type";
import { PdpTextReveal } from "./pdp-text-reveal";
import {
  bottomCtaOffset,
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

const GALLERY_CLASS = "w-full overflow-x-clip bg-white";

/** Stacked gallery frames */
const GALLERY_MEDIA_STACK_CLASS = "flex flex-col bg-white";

/** Bottom-of-page ecommerce modules — free-form scroll, sized to their content */
const ECOMM_MODULE_CLASS = "w-full shrink-0";

type GallerySectionSurface = "dark" | "light" | "muted" | "transparent";

function gallerySection(
  key: string,
  child: ReactNode,
  options: {
    surface?: GallerySectionSurface;
  } = {},
) {
  return (
    <PdpScrollReveal
      key={key}
      surface={options.surface ?? "transparent"}
      lazyMount
    >
      {child}
    </PdpScrollReveal>
  );
}

/** Always-present wayfinding anchor for the section indicator (zero-height marker) */
function ChapterAnchor({ id }: { id: string }) {
  return (
    <div
      id={pdpChapterAnchorId(id)}
      data-chapter={id}
      aria-hidden
      className="h-0 w-full shrink-0 scroll-mt-24"
    />
  );
}

/** Hero only — full-screen immersive video, edge-to-edge under device safe areas */
export function PdpGalleryHero({
  videoSrc,
  poster,
  alt,
  onOpenReviews,
  onOpenArTryOn,
  isLastPanel = false,
}: {
  videoSrc: string;
  poster?: string;
  alt: string;
  onOpenReviews?: () => void;
  onOpenArTryOn?: () => void;
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
            poster={poster}
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
      <PdpHeroActionRail
        onOpenReviews={onOpenReviews}
        onOpenArTryOn={onOpenArTryOn}
      />
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

function portraitBackgroundClass(
  panel: boolean,
  fitContain: boolean,
  insetMargins: boolean,
): string {
  if (panel) {
    return fitContain ? "bg-neutral-200" : "bg-black";
  }
  return insetMargins ? "bg-white p-3" : "bg-white";
}

// fallow-ignore-next-line complexity
function portraitFrameClass(
  panel: boolean,
  aspect: "4/5" | "9/16",
  insetMargins: boolean,
): string {
  if (panel) {
    return PANEL_MEDIA_FRAME_CLASS;
  }
  // Inset (white-framed) slides keep their compact aspect; full-bleed immersive
  // media grows to own the screen.
  if (insetMargins) {
    return cn(
      "relative w-full overflow-hidden bg-white",
      aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
    );
  }
  return cn(
    "relative w-full overflow-hidden",
    aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
    PDP_STUDIO_BACKDROP_CLASS,
  );
}

function portraitSectionStyle(
  panel: boolean,
  reserveBottomCta: boolean,
): CSSProperties | undefined {
  if (panel) {
    return SCREEN_HEIGHT_STYLE;
  }
  return reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined;
}

function portraitImageClass(
  panel: boolean,
  fitContain: boolean,
  scale: string,
): string {
  return cn(
    panel && !fitContain && PANEL_MEDIA_COVER_CLASS,
    fitContain ? "object-contain" : "object-cover",
    scale,
  );
}

function portraitHeaderSurface(
  headerSurface: "light" | "dark" | undefined,
  headerLight: boolean,
): "light" | "dark" | undefined {
  return headerSurface ?? (headerLight ? "light" : undefined);
}

type PortraitMediaProps = {
  src: string;
  alt: string;
  priority: boolean;
  scale: string;
  objectPosition: string;
  panel: boolean;
  fitContain: boolean;
  dragZoom: boolean;
};

function PortraitMedia({
  src,
  alt,
  priority,
  scale,
  objectPosition,
  panel,
  fitContain,
  dragZoom,
}: PortraitMediaProps) {
  return (
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
          className={portraitImageClass(panel, fitContain, scale)}
          style={{ objectPosition }}
          sizes="100vw"
        />
      )}
    </div>
  );
}

function PortraitHotspots({ hotspots }: { hotspots?: PdpProductHotspot[] }) {
  if (!hotspots?.length) {
    return null;
  }
  return <PdpProductHotspots hotspots={hotspots} />;
}

function PortraitInfluencerBadge({
  influencer,
}: {
  influencer?: PdpInfluencerCredit;
}) {
  if (!influencer) {
    return null;
  }
  const network = influencer.platform === "tiktok" ? "TikTok" : "Instagram";
  return (
    <a
      href={influencer.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`pointer-events-auto absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/35 py-2 pl-3 pr-3.5 text-white backdrop-blur-md transition-colors active:bg-black/50 ${pdpType.label}`}
      aria-label={`View ${influencer.handle} on ${network}`}
    >
      <span className="font-extended translate-y-px">{influencer.handle}</span>
      <MaterialIcon name="north_east" size={18} className="text-white/90" />
    </a>
  );
}

function PortraitShopTheLookButton({
  shopTheLookId,
  onOpenShopTheLook,
}: {
  shopTheLookId?: string;
  onOpenShopTheLook?: (lookId: string) => void;
}) {
  if (!shopTheLookId || !onOpenShopTheLook) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={() => onOpenShopTheLook(shopTheLookId)}
      aria-label="Shop the look"
      className={cn(
        "pointer-events-auto flex items-center gap-1 rounded-full border border-white/55 bg-white/80 py-1 pl-1 pr-2.5 text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors active:bg-white/95",
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
  );
}

function PortraitStrapCard({
  strapOptionsId,
  onOpenStrapOptions,
}: {
  strapOptionsId?: string;
  onOpenStrapOptions?: (setId: string) => void;
}) {
  if (!strapOptionsId || !onOpenStrapOptions) {
    return null;
  }
  const set = PDP_STRAP_OPTIONS[strapOptionsId];
  if (!set) {
    return null;
  }
  return (
    <PdpGalleryStrapCard
      set={set}
      onOpen={() => onOpenStrapOptions(strapOptionsId)}
    />
  );
}

type PortraitOverlaysProps = {
  hotspots?: PdpProductHotspot[];
  influencer?: PdpInfluencerCredit;
  shopTheLookId?: string;
  strapOptionsId?: string;
  onOpenShopTheLook?: (lookId: string) => void;
  onOpenStrapOptions?: (setId: string) => void;
};

function PortraitOverlays({
  hotspots,
  influencer,
  shopTheLookId,
  strapOptionsId,
  onOpenShopTheLook,
  onOpenStrapOptions,
}: PortraitOverlaysProps) {
  return (
    <div className="pointer-events-none col-start-1 row-start-1 z-10 grid size-full min-h-0 grid-cols-1 grid-rows-1">
      <div className="pointer-events-auto relative col-start-1 row-start-1 size-full min-h-0">
        <PortraitHotspots hotspots={hotspots} />
        <PortraitInfluencerBadge influencer={influencer} />
        <div className="pointer-events-auto">
          <PortraitStrapCard
            strapOptionsId={strapOptionsId}
            onOpenStrapOptions={onOpenStrapOptions}
          />
        </div>
      </div>
      <div className="pointer-events-none col-start-1 row-start-1 flex size-full min-h-0 flex-col items-start justify-end pb-4 pl-3">
        <PortraitShopTheLookButton
          shopTheLookId={shopTheLookId}
          onOpenShopTheLook={onOpenShopTheLook}
        />
      </div>
    </div>
  );
}

/** Immersive 4:5 portrait — full-bleed by default, optional 12px white inset */
// fallow-ignore-next-line complexity
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
  const headerLight = fitContain || (insetMargins && !panel);
  const resolvedHeaderSurface = portraitHeaderSurface(headerSurface, headerLight);

  return (
    <section
      className={cn(
        "relative w-full shrink-0 overflow-hidden",
        portraitBackgroundClass(panel, fitContain, insetMargins),
        galleryPanelClassName(isLastPanel),
      )}
      data-header-surface={resolvedHeaderSurface}
      style={portraitSectionStyle(panel, reserveBottomCta)}
    >
      <div className={cn(portraitFrameClass(panel, aspect, insetMargins), "grid")}>
        <PdpRevealItem className="relative col-start-1 row-start-1 size-full min-h-0">
          <PortraitMedia
            src={src}
            alt={alt}
            priority={priority}
            scale={scale}
            objectPosition={objectPosition}
            panel={panel}
            fitContain={fitContain}
            dragZoom={dragZoom}
          />
        </PdpRevealItem>

        <PortraitOverlays
          hotspots={hotspots}
          influencer={influencer}
          shopTheLookId={shopTheLookId}
          strapOptionsId={strapOptionsId}
          onOpenShopTheLook={onOpenShopTheLook}
          onOpenStrapOptions={onOpenStrapOptions}
        />
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
  caption,
  reserveBottomCta = false,
  isLastPanel = false,
}: {
  src: string;
  poster?: string;
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
      <PdpRevealItem
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
                delay={100}
                className={`font-extended m-0 text-center text-white ${pdpType.caption}`}
              >
                {caption}
              </PdpTextReveal>
            </div>
          ) : null}
        </div>
      </PdpRevealItem>
    </section>
  );
}

export function PdpGalleryView({
  onOpenReviews,
  onReadAllReviews,
  onWriteReview,
  onOpenArTryOn,
  onAddSimilarToBag,
  onAddBundle,
  onAddSetToBag,
  onStrapOptionsOpenChange,
  onComparePickerOpenChange,
  selectedColorId,
  omitHero = false,
}: {
  onOpenReviews?: () => void;
  onReadAllReviews?: () => void;
  onWriteReview?: () => void;
  onOpenArTryOn?: () => void;
  onAddSimilarToBag?: () => void;
  onAddBundle?: (payload: PdpBundleAddPayload) => void;
  onAddSetToBag?: (payload: PdpStrapSetAddPayload) => void;
  onStrapOptionsOpenChange?: (open: boolean) => void;
  onComparePickerOpenChange?: (open: boolean) => void;
  selectedColorId: string;
  omitHero?: boolean;
}) {
  const [shopLookId, setShopLookId] = useState<string | null>(null);
  const [strapOptionsId, setStrapOptionsId] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState(false);
  const galleryEndRef = useRef<HTMLDivElement>(null);
  const activeShopLook = shopLookId ? PDP_SHOP_THE_LOOK[shopLookId] ?? null : null;
  const activeStrapOptions = strapOptionsId
    ? PDP_STRAP_OPTIONS[strapOptionsId] ?? null
    : null;
  const { productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const tabbyExperiment = useTabbyFamilyCompareExperiment();
  const showTabbyExperiment = productId === "tabby" && Boolean(tabby) && tabbyExperiment;
  const gallerySlides =
    productId === "tabby"
      ? getTabbyGallerySlidesForColor(selectedColorId)
      : PDP_GALLERY_SLIDES;
  const galleryMorePhotos =
    productId === "tabby"
      ? getTabbyGalleryMorePhotosForColor(selectedColorId)
      : PDP_GALLERY_MORE_PHOTOS;
  const lastPanelSlideIndex = getLastGalleryPanelSlideIndex(gallerySlides);
  const galleryScrollPad = {
    paddingBottom: bottomCtaOffset(showTabbyExperiment),
  } as const;

  useEffect(() => {
    onStrapOptionsOpenChange?.(strapOptionsId !== null);
  }, [onStrapOptionsOpenChange, strapOptionsId]);

  usePanelScrollRelease(galleryEndRef);

  return (
    <>
    {!omitHero ? (
      <PdpGalleryHero
        videoSrc={PDP_GALLERY_IMMERSIVE_HERO_VIDEO}
        poster={PDP_GALLERY_IMMERSIVE_HERO_POSTER}
        alt="Model in camel trench coat carrying Tabby Shoulder Bag 26 on a city street"
        onOpenReviews={onOpenReviews}
        onOpenArTryOn={onOpenArTryOn}
        isLastPanel={lastPanelSlideIndex === -1}
      />
    ) : null}

    <div className={GALLERY_CLASS} style={galleryScrollPad}>
      {showTabbyExperiment ? <PdpTabbyVariantModule /> : null}
      <div className={GALLERY_MEDIA_STACK_CLASS}>
        <ChapterAnchor id="overview" />
        {/* Product Details — first content block after the hero (matches Paper) */}
        <ChapterAnchor id="the-details" />
        <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="light">
          <PdpProductDetailsModule />
        </PdpScrollReveal>
        {gallerySlides.flatMap((slide, index) => {
          const isLastPanel = index === lastPanelSlideIndex;

          if (slide.type === "editorial") {
            return [
              gallerySection(
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
                { surface: "light" },
              ),
            ];
          }

          if (slide.type === "signature-sounds") {
            return [
              gallerySection(
                `signature-sounds-${index}`,
                <PdpSignatureSoundsModule />,
                { surface: "muted" },
              ),
            ];
          }

          if (slide.type === "leather-aging") {
            return [
              <ChapterAnchor key={`anchor-the-feel-${index}`} id="the-feel" />,
              gallerySection(
                `leather-aging-${index}`,
                <PdpLeatherAgingModule
                  isLastPanel={isLastPanel}
                  onQuickAdd={() => onAddSimilarToBag?.()}
                />,
                {}
              ),
            ];
          }

          if (slide.type === "weight-feel") {
            return [
              gallerySection(
                `weight-feel-${index}`,
                <PdpWeightFeelModule isLastPanel={isLastPanel} />,
              ),
            ];
          }

          if (slide.type === "bag-stories") {
            return [
              gallerySection(
                `bag-stories-${index}`,
                <PdpBagStoriesModule isLastPanel={isLastPanel} />,
              ),
            ];
          }

          if (slide.type === "strap-simulation") {
            return [
              <ChapterAnchor
                key={`anchor-make-it-yours-${index}`}
                id="make-it-yours"
              />,
              gallerySection(
                `strap-simulation-${index}`,
                <PdpStrapSimulationModule
                  isLastPanel={isLastPanel}
                  onAddSetToBag={onAddSetToBag}
                />,
              ),
            ];
          }

          if (slide.type === "view-more-photos") {
            return [
              gallerySection(
                `view-more-photos-${index}`,
                <PdpGalleryViewMorePhotos
                  photos={galleryMorePhotos}
                  onOpen={() => setPhotosOpen(true)}
                />,
                { surface: "muted" },
              ),
            ];
          }

          if (slide.type === "product-collage") {
            return [
              gallerySection(
                `product-collage-${index}`,
                <PdpGalleryProductCollage isLastPanel={isLastPanel} />,
              ),
            ];
          }

          if (slide.type === "video") {
            return [
              gallerySection(
                `video-${index}-${slide.src}`,
                <PdpGalleryVideoSlide
                  src={slide.src}
                  poster={slide.poster}
                  alt={slide.alt}
                  showMuteControl={slide.showMuteControl}
                  aspect={slide.aspect}
                  caption={slide.caption}
                  isLastPanel={isLastPanel}
                />,
                { surface: "light" },
              ),
            ];
          }

          if (slide.type === "ugc-videos") {
            return [
              gallerySection(
                `ugc-videos-${index}`,
                <PdpUgcVideoCarouselModule />,
                { surface: "light" },
              ),
            ];
          }

          if (slide.type === "as-seen-on") {
            return [
              gallerySection(
                `as-seen-on-${index}`,
                <PdpAsSeenOnModule isLastPanel={isLastPanel} />,
                { surface: "light" },
              ),
            ];
          }

          if (slide.type !== "immersive") {
            return [];
          }

          return [
            gallerySection(
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
      </div>

      {/* Ecommerce — after desire + function gallery scroll. Free-form scroll;
          modules size to their own content. */}
      <ChapterAnchor id="reviews" />
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="light" lazyMount reserveMinHeight="40dvh">
        <PdpReviewsModule
          onReadAll={onReadAllReviews ?? onOpenReviews}
          onWriteReview={onWriteReview ?? onReadAllReviews ?? onOpenReviews}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="light" lazyMount reserveMinHeight="32dvh">
        <PdpCoachAiModule />
      </PdpScrollReveal>
      <ChapterAnchor id="more" />
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="muted" lazyMount reserveMinHeight="40dvh">
        <PdpBundleModule onAddBundle={(payload) => onAddBundle?.(payload)} />
      </PdpScrollReveal>
      <ChapterAnchor id="the-family" />
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="muted" lazyMount reserveMinHeight="40dvh">
        <PdpCompareModuleGate
          onAddToBag={() => onAddSimilarToBag?.()}
          onPickerOpenChange={onComparePickerOpenChange}
        />
      </PdpScrollReveal>
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="muted" lazyMount reserveMinHeight="40dvh">
        <PdpMoreLikeThisModule onAddToBag={() => onAddSimilarToBag?.()} />
      </PdpScrollReveal>
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="muted" lazyMount reserveMinHeight="24dvh">
        <PdpRecentlyViewedCarousel />
      </PdpScrollReveal>
      <PdpScrollReveal className={ECOMM_MODULE_CLASS} surface="muted" lazyMount reserveMinHeight="28dvh">
        <PdpCoachPremiumModule />
      </PdpScrollReveal>
      <PdpScrollReveal className="w-full shrink-0" surface="light" lazyMount reserveMinHeight="20dvh">
        <PdpSiteFooter />
      </PdpScrollReveal>
    </div>
    <PdpGalleryPhotosSheet
      photos={galleryMorePhotos}
      open={photosOpen}
      onClose={() => setPhotosOpen(false)}
    />
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
