"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";

function videoMimeType(src: string) {
  if (src.endsWith(".webm")) {
    return "video/webm";
  }

  return "video/mp4";
}

type PdpGalleryHeroVideoProps = {
  className?: string;
  isActive?: boolean;
  src?: string;
  poster?: string;
  ariaLabel?: string;
  showControls?: boolean;
  showMuteControl?: boolean;
};

export function PdpGalleryHeroVideo({
  className,
  isActive = true,
  src = PDP_GALLERY_HERO_VIDEO,
  poster,
  ariaLabel = "360° product view of Tabby Shoulder Bag 26",
  showControls = false,
  showMuteControl = true,
}: PdpGalleryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const userMutedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    userMutedRef.current = !userMutedRef.current;
    video.muted = userMutedRef.current;
    setIsMuted(userMutedRef.current);
  };

  const controlButtonClass =
    "flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/75 text-neutral-900 backdrop-blur-md";

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
        <source src={src} type={videoMimeType(src)} />
      </video>

      {showControls ? (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {showMuteControl ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleMute();
              }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              aria-pressed={!isMuted}
              className={controlButtonClass}
            >
              <MaterialIcon
                name={isMuted ? "volume_off" : "volume_up"}
                size={18}
                className="text-neutral-900"
              />
            </button>
          ) : null}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              togglePlayback();
            }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className={controlButtonClass}
          >
            <MaterialIcon
              name={isPlaying ? "pause" : "play_arrow"}
              size={18}
              className="text-neutral-900"
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
