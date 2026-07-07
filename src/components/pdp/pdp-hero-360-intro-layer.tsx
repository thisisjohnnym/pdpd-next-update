"use client";

import { cn } from "@/lib/cn";

import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { resolveHeroFraming } from "./pdp-hero-framing";
import { useHero360Intro } from "./pdp-hero-360-intro-context";

const INTRO_PLAYBACK_RATE = 2;

/** Match slide 0 (a0 product still) — contain on the studio ground. */
const INTRO_FRAMING = resolveHeroFraming("product");

/**
 * v6 — one-shot 360° intro on slide 0. The clip's last frame stays as slide 0
 * (no swap to the separate a0 still).
 */
export function PdpHero360IntroLayer({
  videoSrc,
}: {
  videoSrc: string;
}) {
  const { enabled, onVideoEnded } = useHero360Intro();
  const { objectFit, objectPosition } = INTRO_FRAMING;
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

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
        ariaLabel="360-degree view of Tabby Shoulder Bag 26 rotating from back to front"
        isActive
        loop={false}
        onEnded={onVideoEnded}
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
        className={cn("object-center", fitClass)}
        style={{ objectPosition }}
      />
    </div>
  );
}
