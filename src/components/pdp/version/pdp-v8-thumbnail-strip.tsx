"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { usePdpHeroGallery } from "../pdp-hero-gallery-context";
import { getHeroGallerySlideKey } from "../pdp-hero-gallery-data";
import { pdpPressableIconClass } from "../pdp-type";
import { useDragToScroll } from "../use-infinite-centered-carousel";

/**
 * Swipable gallery thumbnail strip (Paper v8) — slide imagery, active =
 * black border. Tap jumps the gallery.
 */
export function PdpV8ThumbnailStrip({ className }: { className?: string }) {
  const { activeIndex, slides, scrollToIndex } = usePdpHeroGallery();
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) {
      return;
    }
    const active = root.querySelector<HTMLElement>(
      `[data-thumb-index="${activeIndex}"]`,
    );
    if (!active) {
      return;
    }
    const target =
      active.offsetLeft - (root.clientWidth - active.offsetWidth) / 2;
    root.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [activeIndex]);

  if (slides.length <= 1) {
    return null;
  }

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label="Gallery thumbnails"
      className={cn(
        "pdp-v8-thumbnail-strip pdp-carousel-draggable",
        className,
      )}
    >
      {slides.map((slide, index) => {
        const src =
          slide.kind === "video" ? (slide.poster ?? slide.src) : slide.src;
        const isActive = index === activeIndex;

        return (
          <button
            key={getHeroGallerySlideKey(slide)}
            type="button"
            role="option"
            data-thumb-index={index}
            data-active={isActive ? "true" : "false"}
            aria-selected={isActive}
            aria-label={`View gallery image ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={cn("pdp-v8-thumb", pdpPressableIconClass)}
          >
            {src ? (
              <Image
                src={src}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
