"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { HERO_360_INTRO_POSTER_SRC } from "./pdp-video-sources";

/** Soft UI land while the bag is still falling — ad-vibe, not end-of-clip. */
const UI_CUE_AT_S = 1.2;
/**
 * Fail-open if the clip never starts / never ends (Safari WebKit can leave
 * `currentSrc` empty and hang `play()`). Must outlast a healthy 4s clip + cue.
 */
const INTRO_FAIL_OPEN_MS = 5500;

/**
 * v6 — one-shot fall-in intro on slide 0.
 *
 * Framing: `object-contain` (not cover). The mobile hero is wider than 9:16, so
 * `object-cover` + `object-center` cropped the top of the source — exactly where
 * the bag enters — and any positive Y "fix" then slid the clip upward against
 * the fall. Contain shows the full 9:16 on the studio ground: bag enters at the
 * top of the viewport and settles centered, with no camera transform.
 *
 * Soft UI cue at ~1.2s via `timeupdate` only — no rAF loop fighting the decoder.
 * End frame stays as slide 0.
 */
export function PdpHero360IntroLayer({
  videoSrc,
}: {
  videoSrc: string;
}) {
  const { enabled, onUiCue, onVideoEnded } = useHero360Intro();
  const cuedRef = useRef(false);
  const endedRef = useRef(false);
  const sparseCueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Soft cue only after the clip has actually started. A blind 1.2s timer
    // (old Safari Low Power fallback) moved us to `revealing` while WebKit
    // still had NETWORK_NO_SOURCE — empty gray + progress bar, forever locked.
    // Fail-open below covers the no-playback case.
    const failOpenTimer = window.setTimeout(() => {
      if (!cuedRef.current) {
        cuedRef.current = true;
        onUiCue();
      }
      if (!endedRef.current) {
        endedRef.current = true;
        onVideoEnded();
      }
    }, INTRO_FAIL_OPEN_MS);

    return () => {
      window.clearTimeout(failOpenTimer);
      if (sparseCueTimerRef.current !== null) {
        window.clearTimeout(sparseCueTimerRef.current);
      }
    };
  }, [enabled, onUiCue, onVideoEnded]);

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!cuedRef.current && currentTime >= UI_CUE_AT_S) {
        cuedRef.current = true;
        onUiCue();
        return;
      }

      // Arm a one-shot soft cue once playback is real — covers sparse
      // `timeupdate` on Safari Low Power without flashing chrome on a dead load.
      if (
        sparseCueTimerRef.current === null &&
        !cuedRef.current &&
        currentTime > 0.05
      ) {
        const remainingMs = Math.max(
          0,
          Math.ceil(UI_CUE_AT_S * 1000 - currentTime * 1000) + 80,
        );
        sparseCueTimerRef.current = window.setTimeout(() => {
          if (!cuedRef.current) {
            cuedRef.current = true;
            onUiCue();
          }
        }, remainingMs);
      }
    },
    [onUiCue],
  );

  const handleEnded = useCallback(() => {
    if (!cuedRef.current) {
      cuedRef.current = true;
      onUiCue();
    }
    if (!endedRef.current) {
      endedRef.current = true;
      onVideoEnded();
    }
  }, [onUiCue, onVideoEnded]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pdp-hero-360-intro-layer pointer-events-none absolute inset-0 z-[2] overflow-hidden bg-[#f0f0f0]"
    >
      <PdpGalleryHeroVideo
        src={videoSrc}
        poster={HERO_360_INTRO_POSTER_SRC}
        ariaLabel="Tabby Shoulder Bag 26 falling into place"
        isActive
        loop={false}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        priorityAutoplay
        blurReveal={false}
        instantReveal
        fill
        studioGround
        playbackRate={1}
        preload="auto"
        skeletonTone="light"
        showControls={false}
        showMuteControl={false}
        passThroughTouch
        className={cn("object-contain object-center")}
      />
    </div>
  );
}
