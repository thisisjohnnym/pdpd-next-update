"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import type { PdpUgcVideo } from "./pdp-data";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";

type PdpUgcVideoCardProps = {
  video: PdpUgcVideo;
  scrollRoot: HTMLElement | null;
  className?: string;
};

/** 4:5 gallery clip — autoplays when snapped into view */
export function PdpUgcVideoCard({
  video,
  scrollRoot,
  className,
}: PdpUgcVideoCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !scrollRoot) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      { root: scrollRoot, threshold: [0, 0.55, 0.85] },
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, [scrollRoot]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden bg-black",
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
        <PdpGalleryHeroVideo
          src={video.src}
          poster={video.poster}
          ariaLabel={video.alt}
          isActive={isActive}
          showControls
          showMuteControl
          className="size-full object-cover object-center"
        />
      </div>
    </article>
  );
}
