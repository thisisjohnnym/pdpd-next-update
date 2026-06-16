"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
  style?: CSSProperties;
  isActive?: boolean;
  src?: string;
  poster?: string;
  ariaLabel?: string;
  showControls?: boolean;
  showMuteControl?: boolean;
  preload?: "auto" | "metadata" | "none";
  /** UGC rails — video layer ignores touch so vertical page scroll works */
  passThroughTouch?: boolean;
  /** Tap video surface to pause/play — hero immersive */
  tapToTogglePlayback?: boolean;
};

export function PdpGalleryHeroVideo({
  className,
  style,
  isActive = true,
  src = PDP_GALLERY_HERO_VIDEO,
  poster,
  ariaLabel = "360° product view of Tabby Shoulder Bag 26",
  showControls = false,
  showMuteControl = true,
  preload = "none",
  passThroughTouch = false,
  tapToTogglePlayback = false,
}: PdpGalleryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const userMutedRef = useRef(true);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackHint, setPlaybackHint] = useState<"play" | "pause" | null>(null);

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

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current !== null) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const flashPlaybackHint = (hint: "play" | "pause") => {
    if (!tapToTogglePlayback) {
      return;
    }

    if (hintTimeoutRef.current !== null) {
      clearTimeout(hintTimeoutRef.current);
    }

    setPlaybackHint(hint);
    hintTimeoutRef.current = setTimeout(() => {
      setPlaybackHint(null);
      hintTimeoutRef.current = null;
    }, 650);
  };

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
      flashPlaybackHint("play");
      return;
    }

    userPausedRef.current = true;
    video.pause();
    flashPlaybackHint("pause");
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
    "flex size-8 items-center justify-center text-white transition-opacity active:opacity-75";

  const canTapVideo =
    !passThroughTouch && (tapToTogglePlayback || showControls);

  return (
    <div className={cn("relative size-full", passThroughTouch && "touch-pan-y")}>
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload={preload}
        poster={poster}
        aria-label={ariaLabel}
        onClick={canTapVideo ? togglePlayback : undefined}
        style={style}
        className={cn(
          className,
          canTapVideo && "cursor-pointer",
          passThroughTouch && "pointer-events-none",
        )}
      >
        <source src={src} type={videoMimeType(src)} />
      </video>

      {playbackHint ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
        >
          <span className="flex size-[4.25rem] items-center justify-center rounded-full bg-black/40 backdrop-blur-sm animate-[pdp-playback-hint_650ms_ease-out_both]">
            <MaterialIcon
              name={playbackHint === "play" ? "play_arrow" : "pause"}
              size={26}
              className="text-white"
            />
          </span>
        </div>
      ) : null}

      {showControls ? (
        <div className="pointer-events-auto absolute bottom-3 right-3 z-[2] flex items-center gap-1.5">
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
                className="text-white"
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
              className="text-white"
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
