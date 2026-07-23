"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

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
  PDP_UGC_TESTIMONIALS_SECTION,
  type PdpUgcWildTopicId,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

gsap.registerPlugin(useGSAP);

const SWIPE_THRESHOLD_PX = 44;
const SWIPE_AXIS_LOCK_PX = 8;
const SWIPE_EDGE_RESISTANCE = 0.35;
const SWIPE_DRAG_OPACITY_RANGE_PX = 280;
const SLIDE_EXIT_DURATION = 0.18;
const SLIDE_ENTER_DURATION = 0.38;
const SLIDE_OFFSET_PX = 48;
const STAGGER_STEP = 0.08;

const TOPIC_ORDER: PdpUgcWildTopicId[] = ["weekend", "commute", "going-out", "style"];

type SlideDirection = "next" | "prev";

function applyEdgeResistance(
  offset: number,
  atStart: boolean,
  atEnd: boolean,
): number {
  if (atStart && offset > 0) {
    return offset * SWIPE_EDGE_RESISTANCE;
  }
  if (atEnd && offset < 0) {
    return offset * SWIPE_EDGE_RESISTANCE;
  }
  return offset;
}

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

function useTestimonialSlideMotion({
  slideRef,
  mediaRef,
  socialRef,
  reducedMotion,
}: {
  slideRef: RefObject<HTMLDivElement | null>;
  mediaRef: RefObject<HTMLDivElement | null>;
  socialRef: RefObject<HTMLAnchorElement | null>;
  reducedMotion: boolean;
}) {
  const isAnimatingRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const activeTweenRef = useRef<gsap.core.Animation | null>(null);

  const killActiveTween = useCallback(() => {
    activeTweenRef.current?.kill();
    activeTweenRef.current = null;
    if (slideRef.current) {
      gsap.killTweensOf(slideRef.current);
    }
    for (const node of [mediaRef.current, socialRef.current]) {
      if (node) {
        gsap.killTweensOf(node);
      }
    }
    isAnimatingRef.current = false;
  }, [mediaRef, slideRef, socialRef]);

  const clearSlideStyles = useCallback(() => {
    if (slideRef.current) {
      gsap.set(slideRef.current, { clearProps: "transform,opacity,filter" });
    }
    for (const node of [mediaRef.current, socialRef.current]) {
      if (node) {
        gsap.set(node, { clearProps: "transform,opacity,filter" });
      }
    }
  }, [mediaRef, slideRef, socialRef]);

  const applyDragOffset = useCallback(
    (offset: number) => {
      const slide = slideRef.current;
      if (!slide) {
        return;
      }

      const opacity = 1 - Math.min(Math.abs(offset) / SWIPE_DRAG_OPACITY_RANGE_PX, 0.18);
      gsap.set(slide, { x: offset, opacity });
    },
    [slideRef],
  );

  const snapBack = useCallback(() => {
    const slide = slideRef.current;
    if (!slide) {
      return;
    }

    if (reducedMotion) {
      clearSlideStyles();
      return;
    }

    activeTweenRef.current = gsap.to(slide, {
      x: 0,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        clearSlideStyles();
        activeTweenRef.current = null;
      },
    });
  }, [clearSlideStyles, reducedMotion, slideRef]);

  const playEnter = useCallback(
    (direction: SlideDirection) => {
      const slide = slideRef.current;
      if (!slide) {
        return;
      }

      if (reducedMotion || !hasInteractedRef.current) {
        clearSlideStyles();
        isAnimatingRef.current = false;
        return;
      }

      const enterFrom = direction === "next" ? SLIDE_OFFSET_PX : -SLIDE_OFFSET_PX;
      const targets = [mediaRef.current, socialRef.current].filter(
        Boolean,
      ) as HTMLElement[];

      gsap.set(slide, {
        x: enterFrom,
        opacity: 0,
        filter: "blur(4px)",
      });
      gsap.set(targets, { y: 12, opacity: 0 });

      const timeline = gsap.timeline({
        onComplete: () => {
          clearSlideStyles();
          activeTweenRef.current = null;
          isAnimatingRef.current = false;
        },
      });

      timeline.to(slide, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: SLIDE_ENTER_DURATION,
        ease: "power2.out",
      });

      targets.forEach((target, index) => {
        timeline.to(
          target,
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          STAGGER_STEP * (index + 1),
        );
      });

      activeTweenRef.current = timeline;
    },
    [clearSlideStyles, mediaRef, reducedMotion, slideRef, socialRef],
  );

  const transitionTo = useCallback(
    (
      direction: SlideDirection,
      onIndexChange: () => void,
    ) => {
      if (isAnimatingRef.current) {
        return false;
      }

      const slide = slideRef.current;
      if (!slide) {
        onIndexChange();
        return true;
      }

      hasInteractedRef.current = true;
      isAnimatingRef.current = true;
      killActiveTween();

      if (reducedMotion) {
        onIndexChange();
        clearSlideStyles();
        isAnimatingRef.current = false;
        return true;
      }

      const exitTo = direction === "next" ? -SLIDE_OFFSET_PX : SLIDE_OFFSET_PX;

      activeTweenRef.current = gsap.to(slide, {
        x: exitTo,
        opacity: 0,
        filter: "blur(4px)",
        duration: SLIDE_EXIT_DURATION,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          onIndexChange();
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              playEnter(direction);
            });
          });
        },
        onInterrupt: () => {
          isAnimatingRef.current = false;
        },
      });

      return true;
    },
    [clearSlideStyles, killActiveTween, playEnter, reducedMotion, slideRef],
  );

  useGSAP(
    () => () => {
      killActiveTween();
    },
    { dependencies: [killActiveTween] },
  );

  return {
    applyDragOffset,
    snapBack,
    transitionTo,
    killActiveTween,
    isAnimatingRef,
    hasInteractedRef,
  };
}

/**
 * v5 — "Out in the wild" band.
 *
 * Left-aligned single testimonial per topic: title, topic tabs, one large
 * media card and social attribution. Warm beige band.
 */
export function PdpV5UgcTestimonials() {
  const { useConsistentModuleHeadings } = getPdpVersionConfig(usePdpVersion());
  const [activeTopic, setActiveTopic] = useState<PdpUgcWildTopicId>("weekend");
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const slideRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLAnchorElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);

  const { applyDragOffset, snapBack, transitionTo, killActiveTween, isAnimatingRef } =
    useTestimonialSlideMotion({
      slideRef,
      mediaRef,
      socialRef,
      reducedMotion,
    });

  const testimonials = useMemo(
    () => listUgcTestimonialsForTopic(activeTopic),
    [activeTopic],
  );

  const item = testimonials[activeIndex] ?? testimonials[0];
  const isVideoClip = Boolean(item?.videoSrc) && !reducedMotion;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < testimonials.length - 1;

  const goPrev = useCallback(() => {
    if (!canGoPrev) {
      return;
    }
    transitionTo("prev", () => {
      setActiveIndex((index) => Math.max(0, index - 1));
    });
  }, [canGoPrev, transitionTo]);

  const goNext = useCallback(() => {
    if (!canGoNext) {
      return;
    }
    transitionTo("next", () => {
      setActiveIndex((index) => Math.min(testimonials.length - 1, index + 1));
    });
  }, [canGoNext, testimonials.length, transitionTo]);

  const handleTopicChange = useCallback(
    (topic: PdpUgcWildTopicId) => {
      if (topic === activeTopic || isAnimatingRef.current) {
        return;
      }

      const currentTopicIndex = TOPIC_ORDER.indexOf(activeTopic);
      const nextTopicIndex = TOPIC_ORDER.indexOf(topic);
      const direction: SlideDirection =
        nextTopicIndex > currentTopicIndex ? "next" : "prev";

      void transitionTo(direction, () => {
        setActiveTopic(topic);
        setActiveIndex(0);
      });
    },
    [activeTopic, isAnimatingRef, transitionTo],
  );

  const resetSwipeStart = useCallback(
    (snap = false) => {
      const wasDragging = isDraggingRef.current;
      swipeStartRef.current = null;
      isDraggingRef.current = false;
      dragOffsetRef.current = 0;

      if (snap && wasDragging) {
        snapBack();
      }
    },
    [snapBack],
  );

  const handleSwipePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current || testimonials.length <= 1) {
      return;
    }

    killActiveTween();
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSwipePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || isAnimatingRef.current) {
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (!isDraggingRef.current) {
      if (
        Math.abs(dx) < SWIPE_AXIS_LOCK_PX ||
        Math.abs(dx) <= Math.abs(dy)
      ) {
        return;
      }
      isDraggingRef.current = true;
    }

    const resisted = applyEdgeResistance(dx, !canGoPrev, !canGoNext);
    dragOffsetRef.current = resisted;
    applyDragOffset(resisted);
  };

  const handleSwipePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const start = swipeStartRef.current;
    const wasDragging = isDraggingRef.current;
    const dragOffset = dragOffsetRef.current;
    resetSwipeStart();

    if (!start || !wasDragging || testimonials.length <= 1) {
      return;
    }

    if (Math.abs(dragOffset) < SWIPE_THRESHOLD_PX) {
      snapBack();
      return;
    }

    if (dragOffset < 0 && canGoNext) {
      transitionTo("next", () => {
        setActiveIndex((index) => Math.min(testimonials.length - 1, index + 1));
      });
      return;
    }

    if (dragOffset > 0 && canGoPrev) {
      transitionTo("prev", () => {
        setActiveIndex((index) => Math.max(0, index - 1));
      });
      return;
    }

    snapBack();
  };

  return (
    <section
      data-header-surface="light"
      className="pdp-v5-ugc-testimonials w-full shrink-0 overflow-x-clip pb-12 pt-10"
    >
      <div className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-6 px-3 text-center">
        <header className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <PdpTextReveal
              as="h2"
              className={pdpModuleHeadlineDisplayClass(useConsistentModuleHeadings)}
            >
              {PDP_UGC_TESTIMONIALS_SECTION.headline}
            </PdpTextReveal>
            <PdpTextReveal
              as="p"
              delay={100}
              className={cn(
                pdpType.caption,
                "m-0 max-w-[28rem] text-balance text-center text-black",
              )}
            >
              {PDP_UGC_TESTIMONIALS_SECTION.subtext}
            </PdpTextReveal>
          </div>

          <PdpTextReveal as="div" delay={120}>
            <PdpUgcTopicToggle
              value={activeTopic}
              onChange={handleTopicChange}
              tone="light"
              solidInactive
            />
          </PdpTextReveal>
        </header>

        {item ? (
          <div
            ref={slideRef}
            className="pdp-v5-ugc-testimonial-slide flex w-full touch-pan-y flex-col gap-4 will-change-transform"
            onPointerDown={handleSwipePointerDown}
            onPointerMove={handleSwipePointerMove}
            onPointerUp={handleSwipePointerUp}
            onPointerCancel={() => resetSwipeStart(true)}
            onLostPointerCapture={() => resetSwipeStart(true)}
          >
            <div
              ref={mediaRef}
              key={`${item.id}-media`}
              className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200/60"
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
                  skeletonTone="light"
                  allowHorizontalPan
                  showMuteControl
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
              <a
                ref={socialRef}
                key={`${item.id}-social`}
                href={item.socialHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-black underline-offset-[3px] transition-opacity hover:underline active:opacity-70",
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
                  disabled={!canGoPrev}
                  aria-label="Previous testimonial"
                  className="flex size-10 items-center justify-center text-black transition-opacity active:scale-[0.96] active:opacity-70 disabled:opacity-30"
                >
                  <MaterialIcon name="arrow_back" size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoNext}
                  aria-label="Next testimonial"
                  className="flex size-10 items-center justify-center text-black transition-opacity active:scale-[0.96] active:opacity-70 disabled:opacity-30"
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
