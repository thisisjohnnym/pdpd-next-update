"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";

type PdpGalleryHeroVideoProps = {
  className?: string;
  isActive?: boolean;
  src?: string;
  poster?: string;
  ariaLabel?: string;
  showControls?: boolean;
};

export function PdpGalleryHeroVideo({
  className,
  isActive = true,
  src = PDP_GALLERY_HERO_VIDEO,
  poster,
  ariaLabel = "360° product view of Tabby 26 shoulder bag",
  showControls = false,
}: PdpGalleryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const syncPlaying = () => {
      setIsPlaying(!video.paused);
    };

    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);

    return () => {
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (!isActive) {
      video.pause();
      return;
    }

    if (!userPausedRef.current) {
      void video.play().catch(() => {
        /* ignored — user gesture may be required in strict browsers */
      });
    }
  }, [isActive]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => {
        /* ignored */
      });
      return;
    }

    userPausedRef.current = true;
    video.pause();
  };

  return (
    <div className="relative size-full">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        aria-label={ariaLabel}
        onClick={showControls ? togglePlayback : undefined}
        className={cn(className, showControls && "cursor-pointer")}
      >
        <source src={src} type="video/webm" />
      </video>

      {showControls ? (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause 360 video" : "Play 360 video"}
          className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/75 text-neutral-900 backdrop-blur-md"
        >
          <MaterialIcon
            name={isPlaying ? "pause" : "play_arrow"}
            size={24}
            className="text-neutral-900"
          />
        </button>
      ) : null}
    </div>
  );
}
