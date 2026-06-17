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
import { logVideoTelemetry } from "./pdp-video-telemetry";

/** Max wait for the first decoded frame before we surface the poster + tap-to-play fallback */
const FIRST_FRAME_TIMEOUT_MS = 2500;

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
  /** Above-the-fold hero — aggressive preload and decoder priority; autoplay still respects low power */
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
  const previewShownRef = useRef(false);
  const firstFrameLoggedRef = useRef(false);
  const fallbackLoggedRef = useRef(false);

  const { lifecycle, lowPowerMode, network, reducedMotion } = usePdpRuntime();
  const resolvedDecoderId = decoderId ?? src;

  const [autoplayRestricted, setAutoplayRestricted] = useState(false);
  const [userStarted, setUserStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [firstFrameTimedOut, setFirstFrameTimedOut] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [playbackHint, setPlaybackHint] = useState<"play" | "pause" | null>(null);
  const [isMounted, setIsMounted] = useState(true);

  const manualPlaybackRequired =
    !priorityAutoplay &&
    (lowPowerMode ||
      autoplayRestricted ||
      !network.autoplayAllowed ||
      network.saveData);

  const priorityHeroNeedsManualPlay =
    priorityAutoplay &&
    (lowPowerMode ||
      autoplayRestricted ||
      !network.autoplayAllowed ||
      network.saveData);

  const canAutoplayPriorityHero = computePriorityHeroShouldPlay({
    isActive,
    isVisible: lifecycle.isVisible,
    isFrozen: lifecycle.isFrozen,
    lowPowerMode,
    saveData: network.saveData,
    autoplayAllowed: network.autoplayAllowed,
    userPaused,
    autoplayRestricted,
  });

  const shouldPlay = priorityAutoplay
    ? canAutoplayPriorityHero ||
      (userStarted &&
        !userPaused &&
        isActive &&
        lifecycle.isVisible &&
        !lifecycle.isFrozen)
    : computeShouldPlay({
        isActive,
        isVisible: lifecycle.isVisible,
        isFrozen: lifecycle.isFrozen,
        lowPowerMode,
        saveData: network.saveData,
        autoplayAllowed: network.autoplayAllowed,
        userPaused: userPaused,
        autoplayRestricted: manualPlaybackRequired && !userStarted,
      });

  const videoSources = resolveVideoSources(src);

  useEffect(() => {
    mountedRef.current = true;
    setIsClientReady(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setIsReady(false);
    setPreviewVisible(false);
    setFirstFrameTimedOut(false);
    previewShownRef.current = false;
    firstFrameLoggedRef.current = false;
    fallbackLoggedRef.current = false;
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
    if (!lowPowerMode && network.autoplayAllowed) {
      return;
    }

    userStartedRef.current = false;
    userPausedRef.current = false;
    setUserStarted(false);
    videoRef.current?.pause();
  }, [lowPowerMode, network.autoplayAllowed]);

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
    if (!video || !isClientReady) {
      return;
    }

    const syncPlaying = () => {
      setIsPlaying(!video.paused && !video.ended);
    };

    syncPlaying();

    for (const type of ["play", "playing", "pause", "ended"] as const) {
      video.addEventListener(type, syncPlaying);
    }

    return () => {
      for (const type of ["play", "playing", "pause", "ended"] as const) {
        video.removeEventListener(type, syncPlaying);
      }
    };
  }, [isMounted, isClientReady, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const logFirstFrame = () => {
      if (firstFrameLoggedRef.current) {
        return;
      }

      firstFrameLoggedRef.current = true;
      logVideoTelemetry("first_frame_rendered", {
        src,
        readyState: video.readyState,
      });
    };

    const markReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setIsReady(true);
        logFirstFrame();
      }
    };

    const markPreviewFrame = () => {
      if (
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        previewShownRef.current
      ) {
        return;
      }

      previewShownRef.current = true;
      logFirstFrame();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (mountedRef.current) {
            setPreviewVisible(true);
          }
        });
      });
    };

    const onError = () => {
      logVideoTelemetry("video_error", {
        src,
        readyState: video.readyState,
        networkState: video.networkState,
        reason: video.error?.message ?? `code_${video.error?.code ?? "unknown"}`,
      });

      if (mountedRef.current) {
        setFirstFrameTimedOut(true);
        setAutoplayRestricted(true);
      }
    };

    const onStalled = (event: Event) => {
      logVideoTelemetry("video_stalled", {
        src,
        readyState: video.readyState,
        networkState: video.networkState,
        reason: event.type,
      });
    };

    for (const type of ["playing", "loadeddata", "canplay"] as const) {
      video.addEventListener(type, markReady);
    }

    video.addEventListener("loadeddata", markPreviewFrame);
    video.addEventListener("error", onError);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("suspend", onStalled);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady();
      markPreviewFrame();
    }

    return () => {
      for (const type of ["playing", "loadeddata", "canplay"] as const) {
        video.removeEventListener(type, markReady);
      }

      video.removeEventListener("loadeddata", markPreviewFrame);
      video.removeEventListener("error", onError);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("suspend", onStalled);
    };
  }, [src, isMounted, isClientReady]);

  useEffect(() => {
    if (!isMounted || isReady || previewVisible || firstFrameTimedOut) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }

      const video = videoRef.current;
      if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        return;
      }

      setFirstFrameTimedOut(true);
      setAutoplayRestricted(true);
      logVideoTelemetry("first_frame_timeout", {
        src,
        readyState: video?.readyState,
        networkState: video?.networkState,
      });
    }, FIRST_FRAME_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMounted, isReady, previewVisible, firstFrameTimedOut, src]);

  useEffect(() => {
    if (!priorityAutoplay || poster || !previewVisible || isPlaying) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (video.paused) {
        setAutoplayRestricted(true);
      }
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [priorityAutoplay, poster, previewVisible, isPlaying, isClientReady]);

  useEffect(() => {
    if (fallbackLoggedRef.current) {
      return;
    }

    const fallbackActive =
      isActive && !isPlaying && (autoplayRestricted || firstFrameTimedOut);

    if (fallbackActive) {
      fallbackLoggedRef.current = true;
      logVideoTelemetry("fallback_shown", {
        src,
        readyState: videoRef.current?.readyState,
        reason: firstFrameTimedOut ? "first_frame_timeout" : "autoplay_restricted",
      });
    }
  }, [isActive, isPlaying, autoplayRestricted, firstFrameTimedOut, src]);

  const onPlayRejected = (error?: unknown) => {
    if (!mountedRef.current) {
      return;
    }

    logVideoTelemetry("autoplay_blocked", {
      src,
      readyState: videoRef.current?.readyState,
      reason:
        error instanceof DOMException
          ? error.name
          : error instanceof Error
            ? error.message
            : "play_promise_rejected",
    });

    setAutoplayRestricted(true);
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

      logVideoTelemetry("autoplay_attempt", { src, readyState: video.readyState });
      void video.play().catch(onPlayRejected);
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [priorityAutoplay, isMounted, isClientReady, shouldPlay, src]);

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

    logVideoTelemetry("autoplay_attempt", { src, readyState: video.readyState });
    void video.play().catch((error) => {
      onPlayRejected(error);
      video.pause();
    });
  }, [shouldPlay, isActive, isMounted, isClientReady, src, userPaused, priorityAutoplay]);

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
      logVideoTelemetry("user_tap_play", { src, readyState: video.readyState });
      void video
        .play()
        .then(() => {
          if (mountedRef.current) {
            setFirstFrameTimedOut(false);
            setAutoplayRestricted(false);
          }
        })
        .catch((error) => {
          onPlayRejected(error);
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
  const showBlurReveal = priorityAutoplay;
  const isRevealed =
    !showBlurReveal || reducedMotion ? isReady : isPlaying && isReady;

  /** The video element is actually painting a frame on screen */
  const videoFrameVisible = showBlurReveal ? previewVisible : isReady;

  const showFrozenPlayOverlay =
    isActive &&
    !isPlaying &&
    !userStarted &&
    (priorityAutoplay
      ? priorityHeroNeedsManualPlay ||
        autoplayRestricted ||
        firstFrameTimedOut ||
        !canAutoplayPriorityHero
      : manualPlaybackRequired && (isReady || Boolean(poster) || firstFrameTimedOut));

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

  // Last-resort black is only used when there is no poster to fall back to.
  const heroBlackout =
    showBlurReveal && !poster && (!isClientReady || !previewVisible);

  const videoClassName = cn(
    className,
    showBlurReveal
      ? cn(
          "pdp-hero-video-blur-stage__media size-full object-cover object-center",
          previewVisible && "is-visible",
        )
      : cn(
          "transition-opacity duration-300",
          priorityAutoplay || isReady ? "opacity-100" : "opacity-0",
        ),
    canTapVideo && "cursor-pointer",
    passThroughTouch && "pointer-events-none",
    allowHorizontalPan && !passThroughTouch && "[touch-action:pan-x_pan-y]",
  );

  const videoElement = (
    <video
      ref={videoRef}
      key={src}
      loop
      muted
      playsInline
      preload={effectivePreload}
      poster={priorityAutoplay ? undefined : poster}
      aria-label={ariaLabel}
      onClick={canTapVideo ? togglePlayback : undefined}
      onPlay={() => setIsPlaying(true)}
      onPlaying={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      style={style}
      className={videoClassName}
    >
      {videoSources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );

  const playbackOverlayIcon = playbackHint ?? (showFrozenPlayOverlay ? "play" : null);

  if (!isMounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "relative size-full",
          !poster && !priorityAutoplay && "motion-safe:animate-pulse",
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
      {poster ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] bg-cover bg-center transition-opacity duration-500",
            videoFrameVisible ? "opacity-0" : "opacity-100",
          )}
          style={{ backgroundImage: `url(${poster})` }}
        />
      ) : null}

      {!isReady && !poster && !showBlurReveal ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] motion-safe:animate-pulse",
            skeletonTone === "light" ? "bg-neutral-200" : "bg-neutral-900",
          )}
        />
      ) : null}

      {heroBlackout ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-neutral-900" />
      ) : null}

      {showBlurReveal ? (
        <div
          className={cn(
            "pdp-hero-video-blur-stage",
            isRevealed && "is-revealed",
          )}
        >
          {isClientReady ? videoElement : null}
        </div>
      ) : (
        videoElement
      )}

      {playbackOverlayIcon ? (
        <div
          className={cn(
            "absolute inset-0 z-[3] flex items-center justify-center",
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
