"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_UGC_VIDEO_CAROUSEL, type PdpUgcVideo } from "../pdp-data";
import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
  pdpUgcVideoCardInfiniteClass,
  pdpUgcVideoCardInfiniteV4Class,
  pdpUgcVideoInfiniteScrollClass,
  pdpUgcVideoInfiniteScrollV4Class,
  pdpUgcWildMomentCardClass,
} from "../pdp-carousel";
import { pdpModuleHeadlineDisplayClass, pdpModuleIntroClass } from "../pdp-module-section";
import { pdpType } from "../pdp-type";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import {
  loopCarouselItems,
  useDragToScroll,
  useInfiniteCenteredCarousel,
} from "../use-infinite-centered-carousel";

import {
  PDP_UGC_COMMUNITY_COMPACT_SECTION,
  PDP_UGC_COMMUNITY_PHOTOS,
  PDP_UGC_COMMUNITY_SECTION,
  listUgcWildItemsForTopic,
  type PdpUgcCommunityPhoto,
  type PdpUgcWildPreviewItem,
  type PdpUgcWildTopicId,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { PdpUgcCommunitySheet } from "../pdp-ugc-community-sheet";
import { PdpV5UgcTestimonials } from "./pdp-v5-ugc-testimonials";
import { PdpUgcMediaToggle, type UgcMediaMode } from "../pdp-ugc-media-toggle";
import { PdpUgcTopicToggle } from "../pdp-ugc-topic-toggle";
import { useReducedMotion } from "../use-reduced-motion";

/**
 * v2-only — "Carried by the community" section (Paper AFC-0, r5 `L5X-0`).
 *
 * Flat infinite center-snapped rail — scroll-snap + peek + loop on all v2+
 * routes (including v4). v4 adds a Videos / Photos toggle.
 */

/**
 * Featured caption (Paper AFC-0 design constant — not a data field). Written
 * for this specific creator's clip; other cards show handle only when active.
 */
const V2_FEATURED_CAPTION = "This front pocket fits more than you'd think";
const V2_FEATURED_VIDEO_ID = "ugc-lolalilylang";

type UgcSectionHeaderProps = {
  title: string;
  followCta: { label: string; href: string };
  useV4UgcHeadingType: boolean;
  useV4ModuleSpacing: boolean;
  leftAlignModuleHeadings: boolean;
  showMediaToggle?: boolean;
  mediaMode?: UgcMediaMode;
  onMediaModeChange?: (mode: UgcMediaMode) => void;
};

function UgcSectionHeader({
  title,
  followCta,
  useV4UgcHeadingType,
  useV4ModuleSpacing,
  leftAlignModuleHeadings,
  showMediaToggle = false,
  mediaMode = "videos",
  onMediaModeChange,
}: UgcSectionHeaderProps) {
  const { subtext } = PDP_UGC_COMMUNITY_SECTION;
  const { useConsistentModuleHeadings } = getPdpVersionConfig(usePdpVersion());
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <div
      className={cn(
        "mb-[14px] flex flex-col",
        useV4ModuleSpacing ? "gap-1.5 px-4 pb-2" : "gap-2 px-3",
        alignClass,
      )}
    >
      <PdpTextReveal
        as="h2"
        className={cn(
          useConsistentModuleHeadings
            ? pdpModuleHeadlineDisplayClass(true)
            : useV4UgcHeadingType
              ? pdpModuleHeadlineDisplayClass(false)
              : cn(pdpType.headline, "m-0 leading-snug"),
          leftAlignModuleHeadings ? "text-left" : "text-center",
        )}
      >
        {title}
      </PdpTextReveal>

      {useV4ModuleSpacing ? (
        <PdpTextReveal
          as="p"
          delay={100}
          className={cn(
            pdpModuleIntroClass(leftAlignModuleHeadings ? "left" : "center"),
          )}
        >
          {subtext}
        </PdpTextReveal>
      ) : null}

      {showMediaToggle && onMediaModeChange ? (
        <PdpTextReveal as="div" delay={revealStaggerDelay(useV4ModuleSpacing ? 2 : 1)}>
          <PdpUgcMediaToggle value={mediaMode} onChange={onMediaModeChange} />
        </PdpTextReveal>
      ) : null}

      {(!showMediaToggle || mediaMode === "videos") ? (
        <PdpTextReveal
          as="a"
          href={followCta.href}
          target="_blank"
          rel="noopener noreferrer"
          delay={revealStaggerDelay(
            useV4ModuleSpacing ? (showMediaToggle ? 3 : 2) : showMediaToggle ? 2 : 1,
          )}
          className={cn(
            "font-extended inline-flex items-center gap-1 text-black underline underline-offset-[3px] transition-opacity active:opacity-60",
            pdpType.label,
          )}
          aria-label={`${followCta.label} (opens in new tab)`}
        >
          {followCta.label}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <path
              d="M7 17 17 7M9 7h8v8"
              fill="none"
              stroke="#171717"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </PdpTextReveal>
      ) : null}
    </div>
  );
}

type UgcCardProps = {
  video: PdpUgcVideo;
  scrollRoot: HTMLElement | null;
  /** v4 Paper r5 `L5X-0`: square corners. */
  useV4?: boolean;
  className?: string;
};

function UgcCard({ video, scrollRoot, useV4 = false, className }: UgcCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !scrollRoot) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;

        if (!activeRef.current && ratio >= 0.6) {
          activeRef.current = true;
          setIsActive(true);
        } else if (activeRef.current && ratio < 0.45) {
          activeRef.current = false;
          setIsActive(false);
        }
      },
      { root: scrollRoot, threshold: [0, 0.45, 0.6] },
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, [scrollRoot]);

  const caption =
    !useV4 && isActive && video.id === V2_FEATURED_VIDEO_ID
      ? V2_FEATURED_CAPTION
      : undefined;
  const showOverlay = !useV4 && isActive && (caption || video.handle);

  return (
    <article
      ref={cardRef}
      className={cn("relative flex shrink-0 flex-col", className)}
    >
      <div
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden bg-black",
          useV4 ? "rounded-none" : "rounded-lg",
        )}
      >
        <Image
          src={video.poster}
          alt={video.alt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 45vw, 83vw"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "rgba(0,0,0,0.12)" }}
        />

        {showOverlay ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "55%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-[14px]">
              {caption ? (
                <p
                  className={cn(
                    "font-extended m-0 text-white",
                    useV4 ? "text-balance leading-[1.25]" : "leading-snug",
                    pdpType.body,
                  )}
                >
                  {caption}
                </p>
              ) : null}
              {video.handle ? (
                <div className="flex items-center gap-[5px]">
                  <span
                    className={cn(
                      "font-extended text-white",
                      useV4 && "leading-[1.25]",
                      pdpType.body,
                    )}
                  >
                    {video.handle}
                  </span>
                  {video.verified ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      aria-label="Verified creator"
                    >
                      <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
                      <path
                        d="M8 12.5l2.5 2.5 5-5.5"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}

type UgcPhotoCardProps = {
  photo: PdpUgcCommunityPhoto;
  className?: string;
};

function UgcPhotoCard({ photo, className }: UgcPhotoCardProps) {
  return (
    <article className={cn("flex shrink-0 flex-col gap-2", className)}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-none bg-neutral-200">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 45vw, 83vw"
        />
      </div>
      {photo.quote || photo.caption || photo.handle ? (
        <div className="flex flex-col gap-1 px-0.5">
          {photo.caption ? (
            <p className={cn(pdpType.label, "m-0 text-neutral-500")}>{photo.caption}</p>
          ) : null}
          {photo.quote ? (
            <p className={cn(pdpType.caption, "m-0 text-pretty text-neutral-600")}>
              &ldquo;{photo.quote}&rdquo;
            </p>
          ) : null}
          {photo.handle ? (
            <div className="flex items-center gap-1">
              <span className={cn(pdpType.micro, "text-neutral-400")}>{photo.handle}</span>
              {photo.verified ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  aria-label="Verified customer"
                >
                  <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
                  <path
                    d="M8 12.5l2.5 2.5 5-5.5"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

type UgcCommunityRailProps = {
  mediaMode: UgcMediaMode;
  videos: readonly PdpUgcVideo[];
  photos: readonly PdpUgcCommunityPhoto[];
  useV4ModuleSpacing: boolean;
};

function UgcCommunityRail({
  mediaMode,
  videos,
  photos,
  useV4ModuleSpacing,
}: UgcCommunityRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const loopedVideos = useMemo(() => loopCarouselItems(videos), [videos]);
  const loopedPhotos = useMemo(() => loopCarouselItems(photos), [photos]);
  const itemCount = mediaMode === "videos" ? videos.length : photos.length;
  const cardClass = useV4ModuleSpacing
    ? pdpUgcVideoCardInfiniteV4Class
    : pdpUgcVideoCardInfiniteClass;

  useInfiniteCenteredCarousel(scrollRef, itemCount);
  useDragToScroll(scrollRef);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <div className={cn(pdpCarouselScrollWrapClass, "relative")}>
      <div
        ref={scrollRef}
        className={cn(
          "flex pdp-carousel-draggable overflow-y-clip pb-2",
          useV4ModuleSpacing ? "gap-4" : "gap-2",
          useV4ModuleSpacing
            ? pdpUgcVideoInfiniteScrollV4Class
            : pdpUgcVideoInfiniteScrollClass,
        )}
        aria-label={mediaMode === "videos" ? "TikTok videos" : "Customer photos"}
      >
        {mediaMode === "videos"
          ? loopedVideos.map((video, index) => (
              <PdpRevealItem
                key={`${video.id}-${index}`}
                delay={revealStaggerDelay(index % videos.length)}
              >
                <UgcCard
                  video={video}
                  scrollRoot={scrollRoot}
                  useV4={useV4ModuleSpacing}
                  className={cardClass}
                />
              </PdpRevealItem>
            ))
          : loopedPhotos.map((photo, index) => (
              <PdpRevealItem
                key={`${photo.id}-${index}`}
                delay={revealStaggerDelay(index % photos.length)}
              >
                <UgcPhotoCard
                  photo={photo}
                  className={cardClass}
                />
              </PdpRevealItem>
            ))}
      </div>
    </div>
  );
}

type UgcCompactPreviewItem =
  | { kind: "video"; id: string; video: PdpUgcVideo }
  | { kind: "photo"; id: string; src: string; alt: string };

function UgcCompactPreviewTile({
  item,
}: {
  item: UgcCompactPreviewItem | PdpUgcWildPreviewItem;
}) {
  if (item.kind === "video") {
    return <UgcCompactVideoTile video={item.video} />;
  }

  const src = "photo" in item ? item.photo.src : item.src;
  const alt = "photo" in item ? item.photo.alt : item.alt;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="rounded-none object-cover object-center"
      sizes="45vw"
    />
  );
}

/** Inline muted loop clip for the compact wild strip — poster-only when reduced motion. */
function UgcCompactVideoTile({ video }: { video: PdpUgcVideo }) {
  const reducedMotion = useReducedMotion();
  const tileRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile || reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(tile);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <Image
        src={video.poster}
        alt={video.alt}
        fill
        className="rounded-none object-cover object-center"
        sizes="22vw"
      />
    );
  }

  return (
    <div ref={tileRef} className="absolute inset-0">
      <PdpGalleryHeroVideo
        decoderId={video.id}
        src={video.src}
        poster={video.poster}
        ariaLabel={video.alt}
        isActive={isActive}
        preload="metadata"
        skeletonTone="dark"
        showMuteControl={false}
        className="size-full rounded-none object-cover object-center"
      />
    </div>
  );
}

/** v4 — compact portrait strip before The Details ("Out in the wild"). */
function UgcCompactWildStrip() {
  const { videos } = PDP_UGC_VIDEO_CAROUSEL;
  const { headline, socialHandle, previewCount } = PDP_UGC_COMMUNITY_COMPACT_SECTION;
  const { compactUgcMoreCountOverride, useConsistentModuleHeadings, useUgcTopicThemes } =
    getPdpVersionConfig(usePdpVersion());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<UgcMediaMode>("videos");
  const [activeTopic, setActiveTopic] = useState<PdpUgcWildTopicId>("weekend");

  const topicItems = useMemo(
    () => listUgcWildItemsForTopic(activeTopic, videos),
    [activeTopic, videos],
  );

  const previewItems = useMemo((): (UgcCompactPreviewItem | PdpUgcWildPreviewItem)[] => {
    if (useUgcTopicThemes) {
      return topicItems.slice(0, previewCount);
    }

    if (mediaMode === "videos") {
      return videos.slice(0, previewCount).map((video) => ({
        kind: "video",
        id: video.id,
        video,
      }));
    }

    return PDP_UGC_COMMUNITY_PHOTOS.slice(0, previewCount).map((photo) => ({
      kind: "photo",
      id: photo.id,
      src: photo.src,
      alt: photo.alt,
    }));
  }, [useUgcTopicThemes, topicItems, previewCount, mediaMode, videos]);

  const calculatedMoreCount = useUgcTopicThemes
    ? Math.max(0, topicItems.length - previewItems.length)
    : mediaMode === "videos"
      ? Math.max(0, videos.length - previewItems.length)
      : Math.max(0, PDP_UGC_COMMUNITY_PHOTOS.length - previewItems.length);
  const moreCount =
    compactUgcMoreCountOverride > 0
      ? compactUgcMoreCountOverride
      : calculatedMoreCount;

  useDragToScroll(scrollRef);

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 overflow-x-clip pt-8 pb-6"
    >
      <div className="mb-4 flex flex-col gap-3 px-4">
        <div className="flex items-baseline justify-between gap-3">
          <PdpTextReveal
            as="h2"
            className={pdpModuleHeadlineDisplayClass(useConsistentModuleHeadings)}
          >
            {headline}
          </PdpTextReveal>
          <PdpTextReveal as="div" delay={80}>
            <a
              href={socialHandle.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-extended shrink-0 text-black underline underline-offset-[3px] transition-opacity active:opacity-60",
                pdpType.label,
              )}
            >
              {socialHandle.label}
            </a>
          </PdpTextReveal>
        </div>
        <PdpTextReveal as="div" delay={120}>
          {useUgcTopicThemes ? (
            <PdpUgcTopicToggle value={activeTopic} onChange={setActiveTopic} />
          ) : (
            <PdpUgcMediaToggle value={mediaMode} onChange={setMediaMode} />
          )}
        </PdpTextReveal>
      </div>

      <div className={pdpCarouselScrollWrapClass}>
        <div
          ref={scrollRef}
          className={cn(
            pdpCarouselScrollClass,
            "pdp-carousel-draggable flex items-stretch gap-3 pb-1",
          )}
          aria-label="Community photos and videos"
        >
          {previewItems.map((item, index) => (
            <PdpRevealItem
              key={item.id}
              delay={revealStaggerDelay(index)}
              className={pdpUgcWildMomentCardClass}
            >
              <UgcCompactPreviewTile item={item} />
            </PdpRevealItem>
          ))}
          {moreCount > 0 ? (
            <PdpRevealItem
              delay={revealStaggerDelay(previewItems.length)}
              as="button"
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={`View ${moreCount} more community posts`}
              className={cn(
                pdpUgcWildMomentCardClass,
                "flex cursor-pointer items-center justify-center border-0 bg-neutral-800 p-0",
              )}
            >
              <span className={cn("font-extended text-neutral-300", pdpType.label)}>
                +{moreCount} more
              </span>
            </PdpRevealItem>
          ) : null}
        </div>
      </div>

      <PdpUgcCommunitySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialMediaMode={mediaMode}
        initialTopic={activeTopic}
        organizeByTopic={useUgcTopicThemes}
      />
    </section>
  );
}

function UgcCommunityFull() {
  const { useV4UgcHeadingType, useV4ModuleSpacing, leftAlignModuleHeadings } =
    getPdpVersionConfig(usePdpVersion());
  const { title, followCta, videos } = PDP_UGC_VIDEO_CAROUSEL;
  const photos = PDP_UGC_COMMUNITY_PHOTOS;
  const [mediaMode, setMediaMode] = useState<UgcMediaMode>("videos");

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 overflow-x-clip bg-white pt-14 pb-0"
    >
      <UgcSectionHeader
        title={title}
        followCta={followCta}
        useV4UgcHeadingType={useV4UgcHeadingType}
        useV4ModuleSpacing={useV4ModuleSpacing}
        leftAlignModuleHeadings={leftAlignModuleHeadings}
        showMediaToggle={useV4ModuleSpacing}
        mediaMode={mediaMode}
        onMediaModeChange={setMediaMode}
      />

      <UgcCommunityRail
        key={mediaMode}
        mediaMode={mediaMode}
        videos={videos}
        photos={photos}
        useV4ModuleSpacing={useV4ModuleSpacing}
      />
    </section>
  );
}

export function PdpV2UgcCommunity({
  onReadAllReviews,
}: {
  onReadAllReviews?: () => void;
} = {}) {
  const { useV4CompactUgcStrip, useV5UgcTestimonialCarousel } =
    getPdpVersionConfig(usePdpVersion());

  if (useV4CompactUgcStrip && useV5UgcTestimonialCarousel) {
    return <PdpV5UgcTestimonials />;
  }

  if (useV4CompactUgcStrip) {
    return <UgcCompactWildStrip />;
  }

  return <UgcCommunityFull />;
}
