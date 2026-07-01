// fallow-ignore-file unused-file
"use client";

import Image from "next/image";
import { memo, useCallback } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_CRAFT_SENSORY, PDP_SIGNATURE_SOUNDS, type PdpSignatureSound } from "./pdp-data";
import { PdpProductHotspots } from "./pdp-product-hotspots";
import {
  CHAPTER_COPY_GUTTER_CLASS,
  CHAPTER_IMMERSIVE_STYLE,
  CHAPTER_SCRIM_BOTTOM_CLASS,
  chapterBottomPadWithCta,
  immersiveMediaBlockStyle,
  IMMERSIVE_MEDIA_CLASS,
} from "./pdp-immersive-chapter";
import { pdpType } from "./pdp-type";
import { useSignatureSound } from "./use-signature-sound";

const SOUND_WAVE_HEIGHTS = [38, 68, 100, 58, 34];

function SoundWaveBars({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-5 w-7 shrink-0 items-end justify-between",
        active ? "text-white" : "text-white/55",
      )}
    >
      {SOUND_WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={cn(
            "pdp-sound-wave-bar w-0.5 rounded-full bg-current",
            active && "animate-pdp-sound-wave",
          )}
          style={{
            height: `${height}%`,
            animationDelay: active ? `${index * 0.11}s` : undefined,
          }}
        />
      ))}
    </span>
  );
}

// fallow-ignore-next-line complexity
const CraftSoundObject = memo(function CraftSoundObject({
  sound,
  active,
  onToggle,
}: {
  sound: PdpSignatureSound;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Stop ${sound.label}` : sound.label}
      className={cn(
        "group relative shrink-0 overflow-hidden bg-black text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        "transition-transform duration-200 active:scale-[0.98]",
        "[-webkit-tap-highlight-color:transparent]",
      )}
      style={{ width: "9.5rem" }}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={sound.imageSrc}
          alt={sound.imageAlt}
          fill
          loading="lazy"
          className="object-cover"
          style={{ objectPosition: sound.objectPosition ?? "center center" }}
          sizes="152px"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10"
        />
        <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-2 px-2.5 py-3">
          <p className="font-extended min-w-0 flex-1 text-[10px] leading-snug tracking-[0.2px] text-white">
            {sound.label}
          </p>
          <span className="flex shrink-0 items-center gap-1">
            <SoundWaveBars active={active} />
            <MaterialIcon
              name={active ? "pause" : "play_arrow"}
              size={18}
              className="shrink-0 text-white"
            />
          </span>
        </div>
      </div>
    </button>
  );
});

/** Chapter 5 — exhibition-scale macro craft + collectible sound objects */
// fallow-ignore-next-line complexity
export function PdpCraftSensoryModule() {
  const { title, intro, heroImage, hotspots } = PDP_CRAFT_SENSORY;
  const { sounds } = PDP_SIGNATURE_SOUNDS;
  const { toggle, isActive } = useSignatureSound();

  const handleToggle = useCallback(
    (id: string, audioSrc: string) => {
      toggle(id, audioSrc);
    },
    [toggle],
  );

  return (
    <section
      data-header-surface="dark"
      className="relative w-full shrink-0 overflow-x-clip bg-black"
      style={{ ...CHAPTER_IMMERSIVE_STYLE, ...chapterBottomPadWithCta() }}
      aria-label={title}
    >
      <div
        className={cn(IMMERSIVE_MEDIA_CLASS, "relative")}
        style={immersiveMediaBlockStyle("0rem")}
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: heroImage.objectPosition ?? "center" }}
          sizes="100vw"
        />
        <PdpProductHotspots hotspots={hotspots} />

        <div className={CHAPTER_SCRIM_BOTTOM_CLASS} style={chapterBottomPadWithCta()}>
          <div className={CHAPTER_COPY_GUTTER_CLASS}>
            <h2
              className={`font-extended m-0 text-lg tracking-[0.2px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] ${pdpType.headline}`}
            >
              {title}
            </h2>
            <p className={cn(pdpType.caption, "mt-2 max-w-[20rem] text-white/75")}>
              {intro}
            </p>

            <div
              className="pointer-events-auto mt-5 flex items-start gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Product sounds"
            >
              {sounds.map((sound) => (
                <CraftSoundObject
                  key={sound.id}
                  sound={sound}
                  active={isActive(sound.id)}
                  onToggle={() => handleToggle(sound.id, sound.audioSrc)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
