"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpUgcVideo } from "./pdp-data";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { pdpType } from "./pdp-type";

type PdpUgcVideoCardProps = {
  video: PdpUgcVideo;
  scrollRoot: HTMLElement | null;
  className?: string;
};

/** TikTok-style 9:16 UGC clip — autoplays when snapped into view */
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
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-900">
        <PdpGalleryHeroVideo
          src={video.src}
          poster={video.poster}
          ariaLabel={video.alt}
          isActive={isActive}
          showControls
          showMuteControl
          className="size-full object-cover object-center"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-12 pt-10"
        >
          <p className="font-extended text-sm tracking-[0.2px] text-white">
            {video.handle}
            {video.verified ? (
              <MaterialIcon
                name="verified"
                size={18}
                className="ml-1 inline-block align-middle text-white/90"
              />
            ) : null}
          </p>
          <p className={`mt-0.5 text-white/85 ${pdpType.micro}`}>{video.context}</p>
        </div>
      </div>
    </article>
  );
}
