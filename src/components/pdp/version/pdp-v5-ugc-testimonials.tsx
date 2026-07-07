"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpType } from "../pdp-type";
import { pdpModuleHeadlineDisplayClass } from "../pdp-module-section";
import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import { PdpTextReveal } from "../pdp-text-reveal";
import { PdpUgcTopicToggle } from "../pdp-ugc-topic-toggle";
import { useReducedMotion } from "../use-reduced-motion";

import {
  listUgcTestimonialsForTopic,
  type PdpUgcWildTopicId,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: "instagram" | "tiktok";
  className?: string;
}) {
  if (platform === "instagram") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("overflow-visible", className)}
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <path
        d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1 2.311-4.644 2.933 2.933 0 0 1 .874.135V9.07a6.839 6.839 0 0 0-1.047-.082 6.334 6.334 0 0 0-6.334 6.334 6.334 6.334 0 0 0 10.886 4.507v-6.989a8.168 8.168 0 0 0 4.773 1.526V7.73a4.847 4.847 0 0 1-1.027-.044z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * v5 — "What customers are saying" band (Figma node 409:460).
 *
 * Left-aligned single testimonial per topic: title, topic tabs, one large
 * media card, pull quote, and social attribution. Dark editorial band.
 */
export function PdpV5UgcTestimonials() {
  const { useConsistentModuleHeadings } = getPdpVersionConfig(usePdpVersion());
  const [activeTopic, setActiveTopic] = useState<PdpUgcWildTopicId>("weekend");
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const testimonials = useMemo(
    () => listUgcTestimonialsForTopic(activeTopic),
    [activeTopic],
  );

  const item = testimonials[activeIndex] ?? testimonials[0];
  const isVideoClip = Boolean(item?.videoSrc) && !reducedMotion;

  const handleTopicChange = (topic: PdpUgcWildTopicId) => {
    setActiveTopic(topic);
    setActiveIndex(0);
  };

  const goPrev = () => setActiveIndex((index) => Math.max(0, index - 1));
  const goNext = () =>
    setActiveIndex((index) => Math.min(testimonials.length - 1, index + 1));

  return (
    <section
      data-header-surface="dark"
      className="pdp-v5-ugc-testimonials w-full shrink-0 overflow-x-clip pb-12 pt-10"
    >
      <div className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-6 px-3 text-center">
        <header className="flex flex-col items-center gap-4">
          <PdpTextReveal
            as="h2"
            className={cn(
              pdpModuleHeadlineDisplayClass(useConsistentModuleHeadings),
              "text-white",
            )}
          >
            What customers are saying
          </PdpTextReveal>

          <PdpTextReveal as="div" delay={80}>
            <PdpUgcTopicToggle value={activeTopic} onChange={handleTopicChange} tone="dark" />
          </PdpTextReveal>
        </header>

        {item ? (
          <div className="flex w-full flex-col gap-4">
            <div
              key={item.id}
              className="relative aspect-[416/434] w-full overflow-hidden bg-white/5"
            >
              {isVideoClip ? (
                <PdpGalleryHeroVideo
                  decoderId={item.id}
                  src={item.videoSrc}
                  poster={item.src}
                  ariaLabel={item.alt}
                  isActive
                  preload="auto"
                  priorityAutoplay
                  skeletonTone="dark"
                  allowHorizontalPan
                  tapToTogglePlayback
                  passThroughTouch
                  className="absolute inset-0 size-full object-cover object-center"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 440px) 416px, 100vw"
                  priority
                />
              )}
            </div>

            <div className="flex w-full flex-col items-center gap-3">
              <blockquote
                className={cn(
                  pdpType.caption,
                  "m-0 min-h-[4.15em] text-balance text-center text-white",
                )}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <a
                href={item.socialHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-white underline-offset-[3px] transition-opacity hover:underline active:opacity-70",
                  pdpType.label,
                )}
                aria-label={`${item.socialHandle} on ${item.socialPlatform} (opens in new tab)`}
              >
                <SocialPlatformIcon platform={item.socialPlatform} className="shrink-0" />
                {item.socialHandle}
              </a>
            </div>

            {testimonials.length > 1 ? (
              <div className="mt-1 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={activeIndex <= 0}
                  aria-label="Previous testimonial"
                  className="flex size-8 items-center justify-center text-white transition-opacity active:opacity-70 disabled:opacity-30"
                >
                  <MaterialIcon name="arrow_back" size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={activeIndex >= testimonials.length - 1}
                  aria-label="Next testimonial"
                  className="flex size-8 items-center justify-center text-white transition-opacity active:opacity-70 disabled:opacity-30"
                >
                  <MaterialIcon name="arrow_forward" size={20} />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
