"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { videoDecoderRegistry } from "./pdp-decoder-registry";
import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";
import {
  computePriorityHeroShouldPlay,
  computeShouldPlay,
  getActiveVideoPreload,
  getInactiveVideoPreload,
  getManualPlaybackPreload,
} from "./pdp-media-policy";
import { usePdpRuntime } from "./pdp-runtime-context";
import { resolveVideoSources } from "./pdp-video-sources";

type PdpGalleryHeroVideoProps = {
  className?: string;
  style?: CSSProperties;
  isActive?: boolean;
  src?: string;
  ariaLabel?: string;
  showControls?: boolean;
  showMuteControl?: boolean;
  preload?: "auto" | "metadata" | "none";
  /** Pulse skeleton while the first frame buffers — no poster image */
  skeletonTone?: "dark" | "light";
  /** UGC rails — video layer ignores touch so page/carousel scroll works */
  passThroughTouch?: boolean;
  /** With passThroughTouch — allow horizontal carousel swipes (default vertical only) */
  allowHorizontalPan?: boolean;
  /** Tap video surface to pause/play — hero immersive */
  tapToTogglePlayback?: boolean;
  /** Stable id for decoder budget — defaults to src */
  decoderId?: string;
  /** Poster frame while the first video frame buffers */
  poster?: string;
  /** Above-the-fold hero — attempt muted autoplay even when low-power heuristics apply */
  priorityAutoplay?: boolean;
};

export function PdpGalleryHeroVideo({
  className,
  style,
  isActive = true,
  src = PDP_GALLERY_HERO_VIDEO,
  ariaLabel = "360° product view of Tabby Shoulder Bag 26",
  showControls = false,
  showMuteControl = true,
  preload = "none",
  skeletonTone = "dark",
  passThroughTouch = false,
  allowHorizontalPan = false,
  tapToTogglePlayback = false,
  decoderId,
  poster,
  priorityAutoplay = false,
}: PdpGalleryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const userStartedRef = useRef(false);
  const userMutedRef = useRef(true);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const { lifecycle, lowPowerMode, network } = usePdpRuntime();
  const resolvedDecoderId = decoderId ?? src;

  const [autoplayRestricted, setAutoplayRestricted] = useState(false);
  const [userStarted, setUserStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [playbackHint, setPlaybackHint] = useState<"play" | "pause" | null>(null);
  const [isMounted, setIsMounted] = useState(true);

  const lowPowerBlocksAutoplay = lowPowerMode && !priorityAutoplay;

  const manualPlaybackRequired =
    !priorityAutoplay &&
    (lowPowerBlocksAutoplay ||
      autoplayRestricted ||
      !network.autoplayAllowed ||
      network.saveData);

  const shouldPlay = priorityAutoplay
    ? computePriorityHeroShouldPlay({
        isActive,
        isVisible: lifecycle.isVisible,
        isFrozen: lifecycle.isFrozen,
        userPaused,
      })
    : computeShouldPlay({
        isActive,
        isVisible: lifecycle.isVisible,
        isFrozen: lifecycle.isFrozen,
        lowPowerMode: lowPowerBlocksAutoplay,
        saveData: network.saveData,
        autoplayAllowed: network.autoplayAllowed,
        userPaused: userPaused,
        autoplayRestricted: manualPlaybackRequired && !userStarted,
      });

  const videoSources = resolveVideoSources(src);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setIsReady(false);
    setAutoplayRestricted(false);
    userStartedRef.current = false;
    userPausedRef.current = false;
    setUserStarted(false);
    setUserPaused(false);
  }, [src]);

  useEffect(() => {
    if (isActive) {
      if (priorityAutoplay) {
        videoDecoderRegistry.register(resolvedDecoderId);
        setIsMounted(true);
        videoDecoderRegistry.setState(resolvedDecoderId, "ACTIVE");
        return;
      }

      if (videoDecoderRegistry.register(resolvedDecoderId)) {
        setIsMounted(true);
        videoDecoderRegistry.setState(resolvedDecoderId, "ACTIVE");
      } else {
        setIsMounted(false);
      }
      return;
    }

    videoDecoderRegistry.setState(resolvedDecoderId, "PAUSED");

    const unloadTimer = window.setTimeout(() => {
      videoDecoderRegistry.setState(resolvedDecoderId, "UNLOADED");
      videoDecoderRegistry.release(resolvedDecoderId);
      setIsMounted(false);
    }, 500);

    return () => {
      window.clearTimeout(unloadTimer);
    };
  }, [isActive, resolvedDecoderId, priorityAutoplay]);

  useEffect(() => {
    if (isMounted || !isActive) {
      return;
    }

    if (videoDecoderRegistry.register(resolvedDecoderId)) {
      setIsMounted(true);
    }
  }, [isMounted, resolvedDecoderId, isActive]);

  useEffect(() => {
    return () => {
      videoDecoderRegistry.release(resolvedDecoderId);
    };
  }, [resolvedDecoderId]);

  useEffect(() => {
    if ((!lowPowerMode || priorityAutoplay) && network.autoplayAllowed) {
      return;
    }

    userStartedRef.current = false;
    userPausedRef.current = false;
    setUserStarted(false);
    videoRef.current?.pause();
  }, [lowPowerMode, network.autoplayAllowed, priorityAutoplay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted || userStarted || priorityAutoplay) {
      return;
    }

    if (manualPlaybackRequired) {
      video.load();
    }
  }, [isMounted, manualPlaybackRequired, userStarted, priorityAutoplay, src]);

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
  }, [isMounted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const markReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setIsReady(true);
      }
    };

    for (const type of ["playing", "loadeddata", "canplay"] as const) {
      video.addEventListener(type, markReady);
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady();
    }

    return () => {
      for (const type of ["playing", "loadeddata", "canplay"] as const) {
        video.removeEventListener(type, markReady);
      }
    };
  }, [src, isMounted]);

  const onPlayRejected = () => {
    if (!mountedRef.current) {
      return;
    }

    if (!priorityAutoplay) {
      setAutoplayRestricted(true);
    }
  };

  useEffect(() => {
    if (!priorityAutoplay || !isMounted || !shouldPlay) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    const tryPlay = () => {
      if (!mountedRef.current || userPausedRef.current) {
        return;
      }

      void video.play().catch(onPlayRejected);
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [priorityAutoplay, isMounted, shouldPlay, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted) {
      return;
    }

    if (!shouldPlay) {
      video.pause();

      if (!isActive) {
        userStartedRef.current = false;
        setUserStarted(false);
      }

      return;
    }

    void video.play().catch(() => {
      onPlayRejected();
      video.pause();
    });
  }, [shouldPlay, isActive, isMounted, src, userPaused, priorityAutoplay]);

  useEffect(() => {
    if (!lifecycle.isVisible || !shouldPlay) {
      return;
    }

    const video = videoRef.current;
    if (!video || video.paused === false) {
      return;
    }

    void video.play().catch(onPlayRejected);
  }, [lifecycle.isVisible, shouldPlay, priorityAutoplay]);

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
      setUserPaused(false);
      userStartedRef.current = true;
      setUserStarted(true);
      void video.play().catch(() => {
        setAutoplayRestricted(true);
      });
      flashPlaybackHint("play");
      return;
    }

    userPausedRef.current = true;
    setUserPaused(true);
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

  const showPlaybackButton = showControls && !tapToTogglePlayback;
  const showControlChrome = showMuteControl || showPlaybackButton;
  const showLandingPoster = Boolean(poster) && !isReady && !priorityAutoplay;
  const showFrozenPlayOverlay =
    isActive &&
    !isPlaying &&
    manualPlaybackRequired &&
    !priorityAutoplay &&
    (isReady || Boolean(poster));
  const effectivePreload = (() => {
    if (priorityAutoplay && isActive) {
      return "auto";
    }

    if (manualPlaybackRequired && !userStarted) {
      if (poster) {
        return getActiveVideoPreload(network);
      }

      return getManualPlaybackPreload(network);
    }

    if (isActive) {
      if (preload === "auto") {
        return getActiveVideoPreload(network);
      }

      return preload;
    }

    if (preload === "none") {
      return getInactiveVideoPreload(network);
    }

    return preload;
  })();

  const playbackOverlayIcon = playbackHint ?? (showFrozenPlayOverlay ? "play" : null);

  if (!isMounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "relative size-full",
          !poster && "motion-safe:animate-pulse",
          skeletonTone === "light" ? "bg-neutral-200" : "bg-neutral-900",
          className,
        )}
        style={{
          ...style,
          ...(poster
            ? {
                backgroundImage: `url(${poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined),
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative size-full",
        passThroughTouch &&
          (allowHorizontalPan ? "[touch-action:pan-x_pan-y]" : "touch-pan-y"),
      )}
    >
      {showLandingPoster ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      ) : null}

      {!isReady && !poster ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] motion-safe:animate-pulse",
            skeletonTone === "light" ? "bg-neutral-200" : "bg-neutral-900",
          )}
        />
      ) : null}

      <video
        ref={videoRef}
        key={src}
        loop
        muted
        playsInline
        preload={effectivePreload}
        poster={poster}
        aria-label={ariaLabel}
        onClick={canTapVideo ? togglePlayback : undefined}
        style={style}
        className={cn(
          className,
          "transition-opacity duration-300",
          priorityAutoplay || isReady ? "opacity-100" : "opacity-0",
          canTapVideo && "cursor-pointer",
          passThroughTouch && "pointer-events-none",
          allowHorizontalPan && !passThroughTouch && "[touch-action:pan-x_pan-y]",
        )}
      >
        {videoSources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      {playbackOverlayIcon ? (
        <div
          className={cn(
            "absolute inset-0 z-[1] flex items-center justify-center",
            showFrozenPlayOverlay && "pointer-events-auto",
            playbackHint && "pointer-events-none",
          )}
        >
          <button
            type="button"
            aria-label={playbackOverlayIcon === "play" ? "Play video" : "Pause video"}
            onClick={showFrozenPlayOverlay ? togglePlayback : undefined}
            className={cn(
              "flex size-[4.25rem] items-center justify-center rounded-full bg-black/55 pdp-backdrop-blur-degrade",
              playbackHint && "motion-safe:animate-[pdp-playback-hint_650ms_ease-out_both]",
              showFrozenPlayOverlay && "transition-transform active:scale-95",
            )}
          >
            <MaterialIcon
              name={playbackOverlayIcon === "play" ? "play_arrow" : "pause"}
              size={26}
              className="text-white"
            />
          </button>
        </div>
      ) : null}

      {showControlChrome ? (
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
          {showPlaybackButton ? (
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
