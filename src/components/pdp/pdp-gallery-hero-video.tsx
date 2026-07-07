"use client";

import { type CSSProperties, type PointerEvent, useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";
import { PdpIconSwap } from "./pdp-icon-swap";
import { pdpPillRadiusClass } from "./pdp-type";
import { resolveVideoSources } from "./pdp-video-sources";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { useHeroVideoPlayback } from "./use-hero-video-playback";
import { useMountTransition } from "./use-mount-transition";

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
  /** Frost pill shell radius — pass `pdpPillRadiusClass()` for square corners */
  controlShellClassName?: string;
  /** Pin controls above hero UI chrome (gallery overlay / progress bar) */
  controlsElevated?: boolean;
  /** Corner placement for the playback control pill */
  controlsPosition?: "bottom-left" | "bottom-right";
};

const CONTROL_BUTTON_CLASS =
  "flex size-8 items-center justify-center text-white transition-opacity active:scale-[0.96] active:opacity-75";

const PILL_CONTROL_SHELL_CLASS =
  "flex items-center gap-3 px-3.5 py-2 pdp-frost-dark ring-1 ring-inset ring-white/20";

const CONTROLS_POSITION_CLASS = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
} as const;

const PILL_CONTROL_BUTTON_CLASS =
  "flex size-7 items-center justify-center text-white transition-opacity active:scale-[0.96] active:opacity-75";

const TAP_MOVE_THRESHOLD_PX = 12;

/** Match poster / skeleton framing to the video element's object-fit classes. */
function resolveMediaFraming(className?: string, style?: CSSProperties) {
  const objectFit = className?.includes("object-contain")
    ? "contain"
    : "cover";
  const objectPosition =
    typeof style?.objectPosition === "string" ? style.objectPosition : "center";
  const fitClass =
    objectFit === "contain" ? "object-contain" : "object-cover";

  return { objectFit, objectPosition, fitClass };
}

function PosterFrame({
  poster,
  fitClass,
  objectPosition,
  visible,
}: {
  poster: string;
  fitClass: string;
  objectPosition: string;
  visible: boolean;
}) {
  return (
    <img
      src={poster}
      alt=""
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] size-full object-center transition-opacity duration-500",
        fitClass,
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{ objectPosition }}
    />
  );
}

export function PdpGalleryHeroVideo({
  className,
  style,
  isActive = true,
  src = PDP_GALLERY_HERO_VIDEO,
  ariaLabel = "360° product view of Tabby Shoulder Bag 26",
  showControls = true,
  showMuteControl = true,
  preload = "none",
  skeletonTone = "dark",
  passThroughTouch = false,
  allowHorizontalPan = false,
  tapToTogglePlayback = false,
  decoderId,
  poster,
  priorityAutoplay = false,
  controlShellClassName,
  controlsElevated = false,
  controlsPosition = "bottom-right",
}: PdpGalleryHeroVideoProps) {
  const { squareButtonCorners } = getPdpVersionConfig(usePdpVersion());
  const resolvedControlShellClassName =
    controlShellClassName ?? pdpPillRadiusClass(squareButtonCorners);
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
    showTapPausedOverlay,
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
  const { fitClass: posterFitClass, objectPosition: posterObjectPosition } =
    resolveMediaFraming(className, style);

  const useTapCaptureLayer = tapToTogglePlayback;
  const videoIgnoresPointer = passThroughTouch || useTapCaptureLayer;
  const canTapVideo =
    !videoIgnoresPointer && (tapToTogglePlayback || showControls);
  const isHeroGalleryChrome =
    passThroughTouch && !showControls && !showMuteControl;
  const showPlaybackButton = showControls && !tapToTogglePlayback;
  const showControlChrome = showMuteControl || showPlaybackButton;
  const usePillControls = showControlChrome && !isHeroGalleryChrome;
  const showPlaybackInPill = usePillControls && (tapToTogglePlayback || showControls);
  const playbackOverlayIcon =
    playbackHint ??
    (showFrozenPlayOverlay || showTapPausedOverlay ? "play" : null);
  const pillPlaybackIcon =
    playbackHint ?? (isPlaying ? "pause" : "play_arrow");
  const overlayInteractive = showFrozenPlayOverlay || showTapPausedOverlay;
  const showCenterPlaybackOverlay =
    Boolean(playbackOverlayIcon) && !usePillControls;
  const controlsPositionClass = CONTROLS_POSITION_CLASS[controlsPosition];
  const controlsLayerClass = controlsElevated ? "z-[40]" : "z-[4]";
  const controlsTransition = useMountTransition(isActive && showControlChrome, 280);

  const tapStartRef = useRef<{ x: number; y: number } | null>(null);
  const tapMovedRef = useRef(false);

  const resetTapCapture = () => {
    tapStartRef.current = null;
    tapMovedRef.current = false;
  };

  const handleTapCapturePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    tapStartRef.current = { x: event.clientX, y: event.clientY };
    tapMovedRef.current = false;
  };

  const handleTapCapturePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = tapStartRef.current;
    if (!start) {
      return;
    }

    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (dx > TAP_MOVE_THRESHOLD_PX || dy > TAP_MOVE_THRESHOLD_PX) {
      tapMovedRef.current = true;
    }
  };

  const handleTapCapturePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = tapStartRef.current;
    resetTapCapture();

    if (!start || tapMovedRef.current) {
      return;
    }

    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (dx <= TAP_MOVE_THRESHOLD_PX && dy <= TAP_MOVE_THRESHOLD_PX) {
      togglePlayback();
    }
  };

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
    videoIgnoresPointer && "pointer-events-none",
    allowHorizontalPan && !canTapVideo && "[touch-action:pan-x_pan-y]",
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
          "relative size-full overflow-hidden",
          !poster && !priorityAutoplay && "motion-safe:animate-pulse",
          !poster &&
            (skeletonTone === "light" ? "bg-neutral-200" : "bg-neutral-900"),
          className,
        )}
        style={style}
      >
        {poster ? (
          <PosterFrame
            poster={poster}
            fitClass={posterFitClass}
            objectPosition={posterObjectPosition}
            visible
          />
        ) : null}
      </div>
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
        <PosterFrame
          poster={poster}
          fitClass={posterFitClass}
          objectPosition={posterObjectPosition}
          visible={
            showBlurReveal
              ? !videoFrameVisible || showFrozenPlayOverlay
              : !isPlaying
          }
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

      {useTapCaptureLayer ? (
        <div
          className="absolute inset-0 z-[2] [touch-action:pan-x_pan-y]"
          onPointerDown={handleTapCapturePointerDown}
          onPointerMove={handleTapCapturePointerMove}
          onPointerUp={handleTapCapturePointerUp}
          onPointerCancel={resetTapCapture}
        />
      ) : null}

      {showCenterPlaybackOverlay ? (
        <div
          className={cn(
            "absolute inset-0 z-[3] flex items-center justify-center",
            overlayInteractive && "pointer-events-auto",
            playbackHint && "pointer-events-none",
          )}
        >
          <button
            type="button"
            aria-label={playbackOverlayIcon === "play" ? "Play video" : "Pause video"}
            onClick={overlayInteractive ? togglePlayback : undefined}
            className={cn(
              "flex size-[4.25rem] items-center justify-center rounded-full bg-black/55 pdp-backdrop-blur-degrade",
              playbackHint && "motion-safe:animate-[pdp-playback-hint_650ms_ease-out_both]",
              overlayInteractive && "transition-transform active:scale-[0.96]",
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

      {controlsTransition.mounted ? (
        usePillControls ? (
          <div
            className={cn(
              "absolute",
              controlsPositionClass,
              controlsLayerClass,
              controlsTransition.state === "open"
                ? "pointer-events-auto"
                : "pointer-events-none",
            )}
          >
            <div
              className={cn(
                PILL_CONTROL_SHELL_CLASS,
                resolvedControlShellClassName,
                "pdp-video-controls-pop pdp-video-controls-stagger",
              )}
              data-state={controlsTransition.state}
            >
              {showPlaybackInPill ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    togglePlayback();
                  }}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className={cn(
                    PILL_CONTROL_BUTTON_CLASS,
                    playbackHint &&
                      "motion-safe:animate-[pdp-playback-hint_650ms_ease-out_both]",
                  )}
                >
                  {playbackHint ? (
                    <MaterialIcon
                      name={pillPlaybackIcon}
                      size={18}
                      className="text-white"
                    />
                  ) : (
                    <PdpIconSwap
                      active={isPlaying}
                      activeIcon={
                        <MaterialIcon
                          name="pause"
                          size={18}
                          className="text-white"
                        />
                      }
                      inactiveIcon={
                        <MaterialIcon
                          name="play_arrow"
                          size={18}
                          className="text-white"
                        />
                      }
                    />
                  )}
                </button>
              ) : null}
              {showMuteControl ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleMute();
                  }}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  aria-pressed={!isMuted}
                  className={PILL_CONTROL_BUTTON_CLASS}
                >
                  <MaterialIcon
                    name={isMuted ? "volume_off" : "volume_up"}
                    size={18}
                    className="text-white"
                  />
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "absolute flex items-center gap-1.5 pdp-video-controls-pop pdp-video-controls-stagger",
              controlsPositionClass,
              controlsLayerClass,
              controlsTransition.state === "open"
                ? "pointer-events-auto"
                : "pointer-events-none",
            )}
            data-state={controlsTransition.state}
          >
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
                <PdpIconSwap
                  active={isPlaying}
                  activeIcon={
                    <MaterialIcon name="pause" size={18} className="text-white" />
                  }
                  inactiveIcon={
                    <MaterialIcon
                      name="play_arrow"
                      size={18}
                      className="text-white"
                    />
                  }
                />
              </button>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  );
}
