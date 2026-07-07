"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  type PdpUgcTestimonial,
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

function TestimonialSlide({
  item,
  isActive,
  isLeadSlide,
}: {
  item: PdpUgcTestimonial;
  isActive: boolean;
  isLeadSlide: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const isVideoClip = Boolean(item.videoSrc) && !reducedMotion;

  return (
    <article
      aria-hidden={!isActive}
      className="flex w-full min-w-full shrink-0 snap-center snap-always flex-col items-center px-4"
    >
      <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-black/20">
        {isVideoClip ? (
          <PdpGalleryHeroVideo
            decoderId={item.id}
            src={item.videoSrc}
            poster={item.src}
            ariaLabel={item.alt}
            isActive={isActive}
            preload={isLeadSlide || isActive ? "auto" : "metadata"}
            priorityAutoplay={isLeadSlide && isActive}
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
            sizes="320px"
            priority={isActive}
          />
        )}
      </div>

      <blockquote className="pdp-v5-ugc-testimonial-quote m-0 mt-6 max-w-[22rem] text-center text-white">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      <a
        href={item.socialHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 text-white underline-offset-[3px] transition-opacity hover:underline active:opacity-70",
          pdpType.label,
        )}
        aria-label={`${item.socialHandle} on ${item.socialPlatform} (opens in new tab)`}
      >
        <SocialPlatformIcon platform={item.socialPlatform} className="shrink-0" />
        {item.socialHandle}
      </a>
    </article>
  );
}

/**
 * v5 — INEZ-inspired "What customers are saying" band.
 *
 * One portrait at a time, pull quote, social link, dot + arrow nav.
 */
export function PdpV5UgcTestimonials() {
  const { useConsistentModuleHeadings } = getPdpVersionConfig(usePdpVersion());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTopic, setActiveTopic] = useState<PdpUgcWildTopicId>("weekend");
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = useMemo(
    () => listUgcTestimonialsForTopic(activeTopic),
    [activeTopic],
  );

  const scrollToIndex = useCallback((index: number) => {
    const rail = scrollRef.current;
    if (!rail || testimonials.length === 0) {
      return;
    }

    const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
    const slide = rail.children.item(clamped) as HTMLElement | null;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(clamped);
  }, [testimonials.length]);

  useEffect(() => {
    setActiveIndex(0);
    const rail = scrollRef.current;
    if (!rail) {
      return;
    }

    rail.scrollTo({ left: 0, behavior: "auto" });
    const leadSlide = rail.children.item(0) as HTMLElement | null;
    leadSlide?.scrollIntoView({
      behavior: "auto",
      inline: "center",
      block: "nearest",
    });
  }, [activeTopic, testimonials]);

  useEffect(() => {
    const rail = scrollRef.current;
    if (!rail || testimonials.length === 0) {
      return;
    }

    const slides = Array.from(rail.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!best) {
          return;
        }

        const index = slides.indexOf(best.target as HTMLElement);
        if (index >= 0) {
          setActiveIndex(index);
        }
      },
      { root: rail, threshold: [0.55, 0.75] },
    );

    for (const slide of slides) {
      observer.observe(slide);
    }

    return () => {
      observer.disconnect();
    };
  }, [testimonials]);

  const goPrev = () => scrollToIndex(activeIndex - 1);
  const goNext = () => scrollToIndex(activeIndex + 1);

  return (
    <section
      data-header-surface="dark"
      className="pdp-v5-ugc-testimonials w-full shrink-0 overflow-x-clip py-10"
    >
      <div className="mb-5 flex flex-col items-center gap-4 px-4 text-center">
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
          <PdpUgcTopicToggle value={activeTopic} onChange={setActiveTopic} tone="dark" />
        </PdpTextReveal>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Customer testimonials"
      >
        {testimonials.map((item, index) => (
          <TestimonialSlide
            key={item.id}
            item={item}
            isActive={index === activeIndex}
            isLeadSlide={index === 0}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 px-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex <= 0}
          aria-label="Previous testimonial"
          className="flex size-8 items-center justify-center text-white transition-opacity disabled:opacity-30 active:opacity-70"
        >
          <MaterialIcon name="arrow_back" size={20} />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex >= testimonials.length - 1}
          aria-label="Next testimonial"
          className="flex size-8 items-center justify-center text-white transition-opacity disabled:opacity-30 active:opacity-70"
        >
          <MaterialIcon name="arrow_forward" size={20} />
        </button>
      </div>
    </section>
  );
}
