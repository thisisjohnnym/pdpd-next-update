"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_UGC_VIDEO_CAROUSEL, type PdpUgcVideo } from "../pdp-data";
import {
  pdpCarouselScrollWrapClass,
  pdpUgcVideoCardInfiniteClass,
  pdpUgcVideoInfiniteScrollClass,
} from "../pdp-carousel";
import { pdpType } from "../pdp-type";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import {
  loopCarouselItems,
  useCarouselCoverflow,
  useDragToScroll,
  useInfiniteCenteredCarousel,
} from "../use-infinite-centered-carousel";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/**
 * v2-only — "Carried by the community" section (Paper AFC-0, r5 `L5X-0`).
 *
 * Infinite center-snapped coverflow rail — same mechanics as the v1 UGC video
 * carousel (`pdp-ugc-video-carousel-module.tsx`): scroll-snap + peek + loop.
 * Cards reuse the 9:16 posters from `PDP_UGC_VIDEO_CAROUSEL`; the centered
 * card shows caption/handle, side cards recede via the shared coverflow depth
 * effect (`useCarouselCoverflow`, `.pdp-ugc-coverflow` in globals.css).
 */

/**
 * Featured caption (Paper AFC-0 design constant — not a data field). Written
 * for this specific creator's clip; other cards show handle only when active.
 */
const V2_FEATURED_CAPTION = "This front pocket fits more than you'd think";
const V2_FEATURED_VIDEO_ID = "ugc-lolalilylang";

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
    isActive && video.id === V2_FEATURED_VIDEO_ID ? V2_FEATURED_CAPTION : undefined;
  const showOverlay = isActive && (caption || video.handle);

  return (
    <article
      ref={cardRef}
      className={cn("relative flex shrink-0 flex-col", className)}
    >
      <div
        data-coverflow-layer
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

export function PdpV2UgcCommunity() {
  const { useV4UgcHeadingType, useV4ModuleSpacing } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const { title, followCta, videos } = PDP_UGC_VIDEO_CAROUSEL;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const loopedVideos = useMemo(() => loopCarouselItems(videos), [videos]);

  useInfiniteCenteredCarousel(scrollRef, videos.length);
  useCarouselCoverflow(scrollRef);
  useDragToScroll(scrollRef);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 overflow-x-clip bg-white pt-14 pb-0"
    >
      <div
        className={cn(
          "mb-[14px] flex flex-col items-center gap-2 px-2",
          useV4ModuleSpacing && "pb-2",
        )}
      >
        <PdpTextReveal
          as="h2"
          className={cn(
            "font-extended m-0 text-center font-normal text-balance text-black",
            useV4UgcHeadingType
              ? "text-[24px] leading-[1.2] tracking-[-0.02em]"
              : "text-xl leading-snug tracking-tight",
          )}
        >
          {title}
        </PdpTextReveal>

        <PdpTextReveal
          as="a"
          href={followCta.href}
          target="_blank"
          rel="noopener noreferrer"
          delay={revealStaggerDelay(1)}
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
      </div>

      <div className={cn(pdpCarouselScrollWrapClass, "relative")}>
        <div
          ref={scrollRef}
          className={cn(
            "flex pdp-ugc-coverflow pdp-carousel-draggable overflow-y-clip pb-2",
            useV4ModuleSpacing ? "gap-[28px] lg:gap-[34px]" : "gap-2",
            pdpUgcVideoInfiniteScrollClass,
          )}
          aria-label="TikTok videos"
        >
          {loopedVideos.map((video, index) => (
            <PdpRevealItem
              key={`${video.id}-${index}`}
              delay={revealStaggerDelay(index % videos.length)}
            >
              <UgcCard
                video={video}
                scrollRoot={scrollRoot}
                useV4={useV4ModuleSpacing}
                className={pdpUgcVideoCardInfiniteClass}
              />
            </PdpRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
