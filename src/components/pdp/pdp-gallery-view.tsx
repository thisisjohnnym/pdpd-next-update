"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { PdpGalleryEditorialSlide } from "./pdp-gallery-editorial-slide";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpGalleryPhotosSheet } from "./pdp-gallery-photos-sheet";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpGalleryViewMorePhotos } from "./pdp-gallery-view-more-photos";
import { PdpHeroActionRail } from "./pdp-hero-action-rail";
import { PdpProductHotspots } from "./pdp-product-hotspots";
import { PdpBagSizeModule } from "./pdp-bag-size-module";
import { PdpBundleModule } from "./pdp-bundle-module";
import { PdpCompareModule } from "./pdp-compare-module";
import { PdpProductSearchModule } from "./pdp-product-search-module";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpReviewsModule } from "./pdp-reviews-module";
import { PdpSimilarItemsCarousel } from "./pdp-similar-items-carousel";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import {
  PDP_GALLERY_HERO_IMAGE,
  PDP_GALLERY_HERO_IMAGE_FOCUS,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
} from "./pdp-data";
import type { PdpBundleAddPayload, PdpProductHotspot } from "./pdp-data";

/** Space for fixed bottom CTAs (54px button + pt-2.5 + pb) */
export const BOTTOM_CTA_OFFSET =
  "calc(54px + 0.625rem + max(30px, env(safe-area-inset-bottom, 0px)))";

const GALLERY_CLASS = "w-full";

/** Hero only — full-viewport immersive with product HUD */
function PdpHeroSlide({
  src,
  alt,
  priority = false,
  onOpenReviews,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onOpenReviews?: () => void;
}) {
  return (
    <section className="relative h-[100dvh] w-full shrink-0 overflow-hidden bg-[#e9e9e9]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        style={{
          objectPosition: PDP_GALLERY_HERO_IMAGE_FOCUS.objectPosition,
          transform: `scale(${PDP_GALLERY_HERO_IMAGE_FOCUS.scale}) translateY(${PDP_GALLERY_HERO_IMAGE_FOCUS.translateY})`,
        }}
        sizes="100vw"
      />

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
  onOpenShopTheLook?: (lookId: string) => void;
  reserveBottomCta?: boolean;
  objectPosition?: string;
  hotspots?: PdpProductHotspot[];
};

/** Immersive 4:5 portrait — full-bleed by default, optional 12px white inset */
function PdpGalleryPortraitSlide({
  src,
  alt,
  priority = false,
  scale = "scale-100",
  insetMargins = false,
  shopTheLookId,
  onOpenShopTheLook,
  reserveBottomCta = false,
  objectPosition = "top",
  hotspots,
}: PdpGalleryPortraitSlideProps) {
  return (
    <section
      className={
        insetMargins
          ? "relative w-full shrink-0 bg-white p-3"
          : "relative w-full shrink-0 overflow-hidden bg-[#e9e9e9]"
      }
      data-header-surface={insetMargins ? "light" : undefined}
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${scale}`}
          style={{ objectPosition }}
          sizes="100vw"
        />

        {hotspots?.length ? <PdpProductHotspots hotspots={hotspots} /> : null}

        {shopTheLookId && onOpenShopTheLook ? (
          <button
            type="button"
            onClick={() => onOpenShopTheLook(shopTheLookId)}
            className="font-extended absolute bottom-4 left-4 flex items-center rounded-full border border-white/50 bg-white/75 py-2.5 pl-3 pr-4 text-xs tracking-[0.2px] text-neutral-900 backdrop-blur-md"
          >
            <span className="flex translate-y-[1.5px] items-center gap-1.5">
              <MaterialIcon name="checkroom" size={18} className="text-neutral-900" />
              Shop the look
            </span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

/** Immersive 4:5 — looping 360° product video */
function PdpGalleryVideoSlide({
  src,
  poster,
  alt,
  label = "360° view",
  reserveBottomCta = false,
}: {
  src: string;
  poster?: string;
  alt: string;
  label?: string;
  reserveBottomCta?: boolean;
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
      className="relative w-full shrink-0 overflow-hidden bg-[#e9e9e9]"
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <PdpGalleryHeroVideo
          src={src}
          poster={poster}
          ariaLabel={alt}
          isActive={isActive}
          showControls
          className="size-full object-cover object-center"
        />

        <div className="font-extended pointer-events-none absolute bottom-4 left-4 flex translate-y-[1.5px] items-center gap-1.5 rounded-full border border-white/50 bg-white/75 py-2.5 pl-3 pr-4 text-xs tracking-[0.2px] text-neutral-900 backdrop-blur-md">
          <MaterialIcon name="360" size={18} className="text-neutral-900" />
          {label}
        </div>
      </div>
    </section>
  );
}

export function PdpGalleryView({
  onOpenReviews,
  onAddSimilarToBag,
  onAddBundle,
  selectedColorId,
}: {
  onOpenReviews?: () => void;
  onAddSimilarToBag?: () => void;
  onAddBundle?: (payload: PdpBundleAddPayload) => void;
  selectedColorId: string;
}) {
  const [shopLookId, setShopLookId] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState(false);
  const activeShopLook = shopLookId ? PDP_SHOP_THE_LOOK[shopLookId] ?? null : null;

  return (
    <>
    <div className={GALLERY_CLASS}>
      <PdpHeroSlide
        src={PDP_GALLERY_HERO_IMAGE}
        alt="Model in a black leather jacket and polka-dot dress carrying Tabby 26 on a city street"
        priority
        onOpenReviews={onOpenReviews}
      />

      {PDP_GALLERY_SLIDES.flatMap((slide, index) => {
        if (slide.type === "editorial") {
          return [
            <PdpGalleryEditorialSlide
              key={`editorial-${slide.src}`}
              src={slide.src}
              alt={slide.alt}
              caption={slide.caption}
              secondarySrc={slide.secondarySrc}
              secondaryAlt={slide.secondaryAlt}
            />,
          ];
        }

        if (slide.type === "video") {
          return [
            <PdpGalleryVideoSlide
              key={`video-${slide.src}`}
              src={slide.src}
              poster={slide.poster}
              alt={slide.alt}
              label={slide.label}
            />,
          ];
        }

        return [
          <PdpGalleryPortraitSlide
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            priority={index === 0}
            scale={
              slide.scale ??
              (slide.src.includes("interior-packed") ||
              slide.src.includes("interior-packed-bleed")
                ? "scale-[1.12]"
                : "scale-[1.08]")
            }
            shopTheLookId={slide.shopTheLookId}
            onOpenShopTheLook={setShopLookId}
            insetMargins={slide.insetMargins}
            objectPosition={slide.objectPosition}
            hotspots={slide.hotspots}
          />,
        ];
      })}

      <PdpGalleryViewMorePhotos onOpen={() => setPhotosOpen(true)} />
      <PdpSimilarItemsCarousel onAddToBag={() => onAddSimilarToBag?.()} />
      <PdpCompareModule selectedColorId={selectedColorId} />
      <PdpBundleModule onAddBundle={(payload) => onAddBundle?.(payload)} />
      <PdpBagSizeModule />
      <PdpReviewsModule
        onReadAll={onOpenReviews}
        onWriteReview={onOpenReviews}
      />
      <PdpRecentlyViewedCarousel />
      <PdpProductSearchModule />
    </div>
    <PdpGalleryPhotosSheet open={photosOpen} onClose={() => setPhotosOpen(false)} />
    <PdpShopTheLookSheet
      look={activeShopLook}
      open={shopLookId !== null}
      onClose={() => setShopLookId(null)}
    />
    </>
  );
}
