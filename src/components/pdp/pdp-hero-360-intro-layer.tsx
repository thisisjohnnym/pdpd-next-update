"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { useHero360Intro } from "./pdp-hero-360-intro-context";
import { HERO_360_INTRO_POSTER_SRC } from "./pdp-video-sources";

/** Slightly faster than 1× so the fall lands quicker without feeling rushed. */
const INTRO_PLAYBACK_RATE = 1.5;
/**
 * Soft UI land while the bag is still falling — media time (not wall clock).
 * At 1.5× this is ~0.8s wall time; same visual beat in the clip.
 */
const UI_CUE_AT_S = 1.2;
/** Source duration of `tabby26-falling-intro.mp4` (~4.04s). */
const INTRO_CLIP_DURATION_S = 4.04;
/**
 * Fail-open if the clip never starts / never ends (Safari WebKit can leave
 * `currentSrc` empty and hang `play()`). Must outlast a healthy sped-up clip.
 */
const INTRO_FAIL_OPEN_MS = Math.ceil(
  (INTRO_CLIP_DURATION_S / INTRO_PLAYBACK_RATE) * 1000,
) + 1500;

/**
 * v6 — one-shot fall-in intro on slide 0.
 *
 * Framing: `object-contain` (not cover). The mobile hero is wider than 9:16, so
 * `object-cover` + `object-center` cropped the top of the source — exactly where
 * the bag enters — and any positive Y "fix" then slid the clip upward against
 * the fall. Contain shows the full 9:16 on the studio ground: bag enters at the
 * top of the viewport and settles centered, with no camera transform.
 * v7 punches the bag up via an enlarged media *stage* in `pdp-v7.css`
 * (still contain — not cover; never transform the <video> — iOS WebKit blanks).
 *
 * Soft UI cue at media ~1.2s via `timeupdate` only — no rAF loop fighting the
 * decoder. End frame stays as slide 0.
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
  const layerRef = useRef<HTMLDivElement>(null);
  const onUiCueRef = useRef(onUiCue);
  const onVideoEndedRef = useRef(onVideoEnded);
  onUiCueRef.current = onUiCue;
  onVideoEndedRef.current = onVideoEnded;

  // Stable deps — callback identity churn was resetting the fail-open timer.
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const failOpenTimer = window.setTimeout(() => {
      if (!cuedRef.current) {
        cuedRef.current = true;
        onUiCueRef.current();
      }
      if (!endedRef.current) {
        endedRef.current = true;
        onVideoEndedRef.current();
      }
    }, INTRO_FAIL_OPEN_MS);

    return () => {
      window.clearTimeout(failOpenTimer);
      if (sparseCueTimerRef.current !== null) {
        window.clearTimeout(sparseCueTimerRef.current);
      }
    };
  }, [enabled]);

  /**
   * WebKit belt-and-suspenders: if the shared playback hook misses attach
   * (ready events before subscribe / media-memory at end), force muted play
   * from 0 on the intro <video> in this layer.
   */
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const layer = layerRef.current;
    if (!layer) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const kick = () => {
      if (cancelled) {
        return;
      }
      const video = layer.querySelector("video");
      if (!video) {
        if (attempts++ < 20) {
          window.setTimeout(kick, 50);
        }
        return;
      }

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      try {
        video.playbackRate = INTRO_PLAYBACK_RATE;
      } catch {
        // WebKit may reject rate until metadata.
      }

      const play = () => {
        if (cancelled) {
          return;
        }
        void video.play().catch(() => {
          // Shared hook owns restriction UI; fail-open covers total miss.
        });
      };

      if (video.ended || video.currentTime > 0.05) {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          play();
        };
        video.addEventListener("seeked", onSeeked);
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          video.removeEventListener("seeked", onSeeked);
          play();
        }
        return;
      }

      play();
    };

    kick();
    return () => {
      cancelled = true;
    };
  }, [enabled, videoSrc]);

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!cuedRef.current && currentTime >= UI_CUE_AT_S) {
        cuedRef.current = true;
        onUiCue();
        return;
      }

      // Arm a one-shot soft cue once playback is real — covers sparse
      // `timeupdate` on Safari Low Power without flashing chrome on a dead load.
      // Divide by playbackRate so wall-clock delay matches media cue time.
      if (
        sparseCueTimerRef.current === null &&
        !cuedRef.current &&
        currentTime > 0.05
      ) {
        const remainingMs = Math.max(
          0,
          Math.ceil(
            ((UI_CUE_AT_S - currentTime) / INTRO_PLAYBACK_RATE) * 1000,
          ) + 80,
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
      ref={layerRef}
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
        playbackRate={INTRO_PLAYBACK_RATE}
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
