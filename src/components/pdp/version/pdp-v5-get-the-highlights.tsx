"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpCarouselScrollClass, pdpCarouselScrollWrapClass } from "../pdp-carousel";
import { PdpGalleryHeroVideo } from "../pdp-gallery-hero-video";
import {
  PDP_HERO_GALLERY_CONTROL_ACTIVATE_CLASS,
  PDP_HERO_GALLERY_CONTROL_ICON_SIZE,
} from "../pdp-hero-gallery-control-shell";
import { PdpModuleHeading } from "../pdp-module-heading";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPressableClass, pdpPressableIconClass, pdpType } from "../pdp-type";
import {
  useCarouselSnapStartActiveIndex,
  useDragToScroll,
} from "../use-infinite-centered-carousel";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_GET_THE_HIGHLIGHTS_CARDS,
  PDP_GET_THE_HIGHLIGHTS_SECTION,
  type PdpGetTheHighlightsCard,
} from "./pdp-data-v2";
import { PDP_HERO_FITS_INSIDE_TARGET_ID } from "./pdp-hero-fits-inside-button";
import { PdpV5HighlightDetailSheet } from "./pdp-v5-highlight-detail-sheet";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

const WATCH_THE_FILM_CARD_ID = "icon-reimagined";
const HIGHLIGHT_DETAIL_SHEET_ID = "pdp-v5-highlight-detail-sheet";
const HIGHLIGHT_CARD_COUNT = PDP_GET_THE_HIGHLIGHTS_CARDS.length;

/**
 * v5 "Get the highlights" — Apple-style highlight rail. A light section with a
 * bold heading + "Watch the film" link above a horizontal rail of tall cards,
 * each carrying a single product truth (image above, left-aligned caption below).
 * Replaces the "Feel the leather" lifestyle beat.
 */
export function PdpV5GetTheHighlights() {
  const { headline, watchLabel } = PDP_GET_THE_HIGHLIGHTS_SECTION;
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const activeCard =
    PDP_GET_THE_HIGHLIGHTS_CARDS.find((card) => card.id === activeCardId) ??
    null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = useCarouselSnapStartActiveIndex(scrollRef);
  useDragToScroll(scrollRef);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const clamped = Math.min(Math.max(index, 0), HIGHLIGHT_CARD_COUNT - 1);
    const child = el.children[clamped] as HTMLElement | undefined;
    if (!child) {
      return;
    }
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({
      left: child.offsetLeft - paddingLeft,
      behavior: "smooth",
    });
  }, []);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex >= HIGHLIGHT_CARD_COUNT - 1;

  return (
    <section
      data-header-surface="light"
      aria-label={headline}
      className={cn(
        "relative z-[1] -mt-px w-full shrink-0 border-0 bg-white shadow-none outline-none",
        useV4ModuleSpacing ? "pt-8 pb-4" : "pt-8 pb-8",
      )}
    >
      <div className="flex flex-col gap-1 px-3 lg:px-5">
        <PdpModuleHeading
          spacing="none"
          className={leftAlignModuleHeadings ? "text-left" : "text-center"}
        >
          {headline}
        </PdpModuleHeading>
        <PdpTextReveal as="div" delay={100} className="m-0">
          <a
            href={`#highlight-${WATCH_THE_FILM_CARD_ID}`}
            className={cn(
              "group inline-flex min-h-8 items-center gap-1.5 text-black",
              "transition-colors active:text-neutral-700",
              pdpPressableClass,
            )}
          >
            <span className="font-extended text-[15px] leading-none">
              {watchLabel}
            </span>
            <MaterialIcon
              name="play_circle"
              size={18}
              className="translate-y-[0.5px]"
            />
          </a>
        </PdpTextReveal>
      </div>

      <div
        className={cn(
          pdpCarouselScrollWrapClass,
          "group/highlights relative mt-4",
        )}
      >
        <div
          ref={scrollRef}
          className={cn(
            pdpCarouselScrollClass,
            "pdp-carousel-draggable flex items-stretch gap-3",
          )}
          aria-label={headline}
        >
          {PDP_GET_THE_HIGHLIGHTS_CARDS.map((card, index) => (
            <PdpV5HighlightCard
              key={card.id}
              card={card}
              index={index}
              open={activeCardId === card.id}
              onOpenChange={(nextOpen) =>
                setActiveCardId(nextOpen ? card.id : null)
              }
            />
          ))}
        </div>

        <HighlightsCarouselArrow
          direction="prev"
          disabled={atStart}
          onClick={() => scrollToIndex(activeIndex - 1)}
        />
        <HighlightsCarouselArrow
          direction="next"
          disabled={atEnd}
          onClick={() => scrollToIndex(activeIndex + 1)}
        />
      </div>

      <PdpV5HighlightDetailSheet
        card={activeCard}
        open={activeCardId !== null}
        onClose={() => setActiveCardId(null)}
      />
    </section>
  );
}

// fallow-ignore-next-line complexity
function HighlightsCarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous highlight" : "Next highlight"}
      className={cn(
        "absolute top-[40%] z-10 hidden size-9 -translate-y-1/2 items-center justify-center",
        "bg-white/90 text-black backdrop-blur-sm",
        "outline outline-1 -outline-offset-1 outline-black/10",
        "transition-[opacity,transform] duration-200 ease-out",
        "lg:inline-flex",
        isPrev ? "left-3" : "right-3",
        disabled
          ? "pointer-events-none opacity-0"
          : cn(
              "opacity-0",
              "group-hover/highlights:opacity-100 group-focus-within/highlights:opacity-100",
              pdpPressableIconClass,
            ),
      )}
    >
      <MaterialIcon
        name={isPrev ? "chevron_left" : "chevron_right"}
        size={20}
        className="leading-none"
      />
    </button>
  );
}

// fallow-ignore-next-line complexity
function PdpV5HighlightCard({
  card,
  index,
  open,
  onOpenChange,
}: {
  card: PdpGetTheHighlightsCard;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const objectPosition = card.objectPosition ?? "center";

  useEffect(() => {
    if (!card.videoSrc) {
      return;
    }

    const media = mediaRef.current;
    if (!media) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoActive(
          entry.isIntersecting && entry.intersectionRatio >= 0.35,
        );
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(media);

    return () => {
      observer.disconnect();
    };
  }, [card.videoSrc]);

  return (
    <PdpRevealItem
      as="article"
      id={
        card.id === "whats-inside"
          ? PDP_HERO_FITS_INSIDE_TARGET_ID
          : `highlight-${card.id}`
      }
      delay={revealStaggerDelay(index)}
      className={cn(
        // Width-driven 4:5 media at all breakpoints — caption wrap must not
        // shrink/grow the image (the old 70svh + flex-1 frame did that).
        "flex w-[calc((100vw-1.25rem)/1.15)]",
        "shrink-0 snap-start snap-always scroll-mt-24 flex-col gap-3 overflow-hidden rounded-none bg-white",
        "lg:w-[calc((100vw-2.25rem)/2.6)]",
      )}
    >
      <div
        ref={mediaRef}
        className="relative aspect-[4/5] shrink-0 bg-neutral-100"
      >
        {card.videoSrc ? (
          <PdpGalleryHeroVideo
            src={card.videoSrc}
            poster={card.videoPoster}
            ariaLabel={card.alt}
            isActive={isVideoActive}
            preload={isVideoActive ? "auto" : "metadata"}
            skeletonTone="light"
            showMuteControl={false}
            controlsPosition="bottom-left"
            allowHorizontalPan
            className="size-full object-cover object-center"
            style={{ objectPosition }}
          />
        ) : (
          <Image
            src={card.src}
            alt={card.alt}
            fill
            className="pointer-events-none select-none object-cover"
            style={{ objectPosition }}
            sizes="(min-width: 1024px) 42vw, 87vw"
          />
        )}

        <button
          type="button"
          aria-expanded={open}
          aria-controls={HIGHLIGHT_DETAIL_SHEET_ID}
          aria-label={
            open ? `Close ${card.title}` : `More about ${card.title}`
          }
          onClick={() => onOpenChange(!open)}
          className={cn(
            "absolute right-3 bottom-3 z-30",
            PDP_HERO_GALLERY_CONTROL_ACTIVATE_CLASS,
            pdpPressableIconClass,
          )}
        >
          <MaterialIcon
            name="add"
            size={PDP_HERO_GALLERY_CONTROL_ICON_SIZE}
            className="text-white"
          />
        </button>
      </div>

      <p className={cn(pdpType.body, "m-0 shrink-0 pb-4 text-pretty text-black")}>
        {card.caption}
      </p>
    </PdpRevealItem>
  );
}
