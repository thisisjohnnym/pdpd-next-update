"use client";

import { type CSSProperties } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";
import { resolveVideoSources } from "./pdp-video-sources";
import { useHeroVideoPlayback } from "./use-hero-video-playback";

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

const CONTROL_BUTTON_CLASS =
  "flex size-8 items-center justify-center text-white transition-opacity active:opacity-75";

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
  const {
    videoRef,
    isMounted,
    isClientReady,
    isReady,
    isPlaying,
    isMuted,
    videoFrameVisible,
    isRevealed,
    showBlurReveal,
    heroBlackout,
    showFrozenPlayOverlay,
    effectivePreload,
    playbackHint,
    togglePlayback,
    toggleMute,
  } = useHeroVideoPlayback({
    src,
    resolvedDecoderId: decoderId ?? src,
    isActive,
    priorityAutoplay,
    poster,
    preload,
    tapToTogglePlayback,
  });

  const videoSources = resolveVideoSources(src);

  const canTapVideo = !passThroughTouch && (tapToTogglePlayback || showControls);
  const showPlaybackButton = showControls && !tapToTogglePlayback;
  const showControlChrome = showMuteControl || showPlaybackButton;
  const playbackOverlayIcon = playbackHint ?? (showFrozenPlayOverlay ? "play" : null);

  const videoClassName = cn(
    className,
    showBlurReveal
      ? cn(
          "pdp-hero-video-blur-stage__media size-full object-cover object-center",
          videoFrameVisible && "is-visible",
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
      style={style}
      className={videoClassName}
    >
      {videoSources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );

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
              showFrozenPlayOverlay && "transition-transform active:scale-[0.96]",
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
              className={CONTROL_BUTTON_CLASS}
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
              className={CONTROL_BUTTON_CLASS}
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
