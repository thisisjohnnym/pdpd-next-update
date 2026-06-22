"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpUgcVideo } from "./pdp-data";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";

type PdpUgcVideoCardProps = {
  video: PdpUgcVideo;
  scrollRoot: HTMLElement | null;
  className?: string;
};

/** 9:16 TikTok clip — autoplays when snapped into view */
export function PdpUgcVideoCard({
  video,
  scrollRoot,
  className,
}: PdpUgcVideoCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !scrollRoot) {
      return;
    }

    const observer = new IntersectionObserver(
      // fallow-ignore-next-line complexity
      ([entry]) => {
        const ratio = entry.intersectionRatio;

        // Mount the real <video> only as a card nears center and unmount it
        // once it scrolls well away. Keeping every seen card mounted overruns
        // the platform's hardware decoder budget; the browser then reclaims an
        // off-screen decoder and that clip snaps back to its poster for a frame
        // — the "flash" behind the handle. Hysteresis (mount ≥0.4, drop <0.15)
        // keeps the centered card stable so it never thrashes mid-fling.
        if (!mountedRef.current && ratio >= 0.4) {
          mountedRef.current = true;
          setMounted(true);
        } else if (mountedRef.current && ratio < 0.15) {
          mountedRef.current = false;
          setMounted(false);
        }

        // Only the centered clip plays; neighbours rest on their poster.
        if (!activeRef.current && ratio >= 0.6) {
          activeRef.current = true;
          setIsActive(true);
        } else if (activeRef.current && ratio < 0.45) {
          activeRef.current = false;
          setIsActive(false);
        }
      },
      { root: scrollRoot, threshold: [0, 0.15, 0.4, 0.45, 0.6, 0.85] },
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
        "pdp-ugc-video-card relative flex shrink-0 flex-col",
        className,
      )}
    >
      <div
        data-coverflow-layer
        className="pdp-ugc-coverflow-layer relative aspect-[9/16] w-full overflow-hidden bg-black"
      >
        {mounted ? (
          <PdpGalleryHeroVideo
            decoderId={video.id}
            src={video.src}
            poster={video.poster}
            ariaLabel={video.alt}
            isActive={isActive}
            preload={isActive ? "auto" : "metadata"}
            skeletonTone="dark"
            allowHorizontalPan
            tapToTogglePlayback
            showMuteControl
            className="size-full object-cover object-center"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-neutral-900"
            style={
              video.poster
                ? {
                    backgroundImage: `url(${video.poster})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 z-[1] max-w-[calc(100%-3rem)]">
          <p className="font-extended text-sm tracking-[0.2px] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]">
            {video.handle}
            {video.verified ? (
              <MaterialIcon
                name="verified"
                size={18}
                filled
                className="ml-1 inline-block align-middle text-[#0095F6]"
              />
            ) : null}
          </p>
        </div>
      </div>
    </article>
  );
}
