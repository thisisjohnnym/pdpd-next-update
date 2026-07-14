"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

/**
 * v5 "Get the highlights" — Apple-style highlight rail. A light section with a
 * bold heading + "Watch the film" link above a horizontal rail of tall cards,
 * each carrying a single product truth (image above, left-aligned caption below).
 * Replaces the "Feel the leather" lifestyle beat.
 */
export function PdpV5GetTheHighlights() {
  const { headline, watchLabel } = PDP_GET_THE_HIGHLIGHTS_SECTION;
  const {
    leftAlignModuleHeadings,
    useV4ModuleSpacing,
    useLeatherAgingWaysToWear,
    getTheHighlightsCompactHeader,
  } = getPdpVersionConfig(usePdpVersion());
  const highlightCards = useLeatherAgingWaysToWear
    ? PDP_GET_THE_HIGHLIGHTS_CARDS.map((card) =>
        card.id === "crafted-to-age"
          ? {
              ...card,
              src: "/images/gallery/tabby-leather-full-grain-back.jpg",
              alt: "Back of the Tabby bag in full-grain leather with THE TABBY BAG stamp and gold Coach snap",
            }
          : card,
      )
    : PDP_GET_THE_HIGHLIGHTS_CARDS;
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const activeCard =
    highlightCards.find((card) => card.id === activeCardId) ??
    null;

  return (
    <section
      data-header-surface="light"
      aria-label={headline}
      className={cn(
        "w-full shrink-0 bg-white",
        getTheHighlightsCompactHeader
          ? "pt-6 pb-10"
          : useV4ModuleSpacing
            ? "pt-14 pb-10"
            : "pt-12 pb-8",
      )}
    >
      <div
        className={cn(
          "flex flex-col",
          getTheHighlightsCompactHeader ? "gap-1" : "gap-1.5",
          useV4ModuleSpacing ? "px-4" : "px-3",
        )}
      >
        <PdpModuleHeading
          spacing="none"
          className={cn(
            leftAlignModuleHeadings ? "text-left" : "text-center",
            getTheHighlightsCompactHeader && "leading-none",
          )}
        >
          {headline}
        </PdpModuleHeading>
        <PdpTextReveal as="div" delay={100} className="m-0">
          <a
            href={`#highlight-${WATCH_THE_FILM_CARD_ID}`}
            className={cn(
              "group inline-flex items-center gap-1.5 text-black",
              getTheHighlightsCompactHeader ? "h-5 min-h-5" : "min-h-[40px]",
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
          getTheHighlightsCompactHeader ? "mt-3" : "mt-6",
        )}
      >
        <div
          className={cn(pdpCarouselScrollClass, "flex items-stretch gap-3")}
          aria-label={headline}
        >
          {highlightCards.map((card, index) => (
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
      </div>

      <PdpV5HighlightDetailSheet
        card={activeCard}
        open={activeCardId !== null}
        onClose={() => setActiveCardId(null)}
      />
    </section>
  );
}

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
        "flex h-[70svh] max-h-[620px] min-h-[460px] w-[calc((100vw-1.25rem)/1.15)]",
        "shrink-0 snap-start snap-always scroll-mt-24 flex-col gap-3 overflow-hidden rounded-none bg-white",
        "lg:w-[calc((100vw-2.25rem)/2.4)]",
      )}
    >
      <div ref={mediaRef} className="relative min-h-0 flex-1 bg-neutral-100">
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
