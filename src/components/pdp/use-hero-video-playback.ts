"use client";

import { useEffect, useRef, useState } from "react";

import { videoDecoderRegistry } from "./pdp-decoder-registry";
import {
  computePriorityHeroShouldPlay,
  computeShouldPlay,
  getActiveVideoPreload,
  getInactiveVideoPreload,
  getManualPlaybackPreload,
} from "./pdp-media-policy";
import { usePdpRuntime } from "./pdp-runtime-context";
import { logVideoTelemetry } from "./pdp-video-telemetry";

/** Max wait for the first decoded frame before we surface the poster + tap-to-play fallback */
const FIRST_FRAME_TIMEOUT_MS = 2500;

type UseHeroVideoPlaybackInput = {
  src: string;
  resolvedDecoderId: string;
  isActive: boolean;
  priorityAutoplay: boolean;
  poster?: string;
  preload: "auto" | "metadata" | "none";
  tapToTogglePlayback: boolean;
};

type HeroVideoPlayback = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMounted: boolean;
  isClientReady: boolean;
  isReady: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  previewVisible: boolean;
  videoFrameVisible: boolean;
  isRevealed: boolean;
  showBlurReveal: boolean;
  heroBlackout: boolean;
  showFrozenPlayOverlay: boolean;
  effectivePreload: "auto" | "metadata" | "none";
  playbackHint: "play" | "pause" | null;
  showTapPausedOverlay: boolean;
  togglePlayback: () => void;
  toggleMute: () => void;
};

/**
 * Owns the full playback lifecycle for the PDP hero video: decoder budget,
 * autoplay attempts, first-frame detection, the Low-Power-Mode fallback
 * watchdog, and the derived display flags the component renders from.
 */
export function useHeroVideoPlayback({
  src,
  resolvedDecoderId,
  isActive,
  priorityAutoplay,
  poster,
  preload,
  tapToTogglePlayback,
}: UseHeroVideoPlaybackInput): HeroVideoPlayback {
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

  const [autoplayRestricted, setAutoplayRestricted] = useState(false);
  const [userStarted, setUserStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
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

  useEffect(() => {
    mountedRef.current = true;
    setIsClientReady(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setIsReady(false);
    setHasRevealed(false);
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

  const showBlurReveal = priorityAutoplay;

  // Latch the intro blur-reveal: once the hero has un-blurred on first play,
  // a later pause should keep the frame sharp (normal playback feel) instead
  // of re-applying the entrance blur.
  useEffect(() => {
    if (showBlurReveal && isReady && isPlaying) {
      setHasRevealed(true);
    }
  }, [showBlurReveal, isReady, isPlaying]);

  const isRevealed =
    !showBlurReveal || reducedMotion
      ? isReady
      : hasRevealed || (isPlaying && isReady);

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

  const showTapPausedOverlay =
    tapToTogglePlayback &&
    isActive &&
    userPaused &&
    !isPlaying &&
    !showFrozenPlayOverlay;

  const effectivePreload: "auto" | "metadata" | "none" = (() => {
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

  return {
    videoRef,
    isMounted,
    isClientReady,
    isReady,
    isPlaying,
    isMuted,
    previewVisible,
    videoFrameVisible,
    isRevealed,
    showBlurReveal,
    heroBlackout,
    showFrozenPlayOverlay,
    showTapPausedOverlay,
    effectivePreload,
    playbackHint,
    togglePlayback,
    toggleMute,
  };
}
