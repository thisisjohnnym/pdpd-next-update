"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING, PDP_STUDIO_BACKDROP_CLASS } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";

/** Leather aging simulator — patina, softening, and wear over time */
export function PdpLeatherAgingModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { image, stages } = PDP_LEATHER_AGING;
  const panel = experiencePanelSectionProps(isLastPanel);
  const maxIndex = stages.length - 1;
  const [stageIndex, setStageIndex] = useState(0);
  const stage = stages[stageIndex]!;
  const sliderProgress =
    maxIndex > 0 ? (stageIndex / maxIndex) * 100 : 0;

  const imageFilter = useMemo(
    () =>
      `brightness(${stage.visual.brightness}) contrast(${stage.visual.contrast}) saturate(${stage.visual.saturate}) sepia(${stage.visual.sepia})`,
    [stage.visual],
  );

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, PDP_STUDIO_BACKDROP_CLASS)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover scale-[1.06] transition-[filter] duration-500 ease-out"
          style={{
            objectPosition: image.objectPosition ?? "center",
            filter: imageFilter,
          }}
          sizes="100vw"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: stage.visual.patinaOpacity,
            background: stage.visual.patinaGradient,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: stage.visual.wearOpacity,
            background: stage.visual.wearGradient,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: stage.visual.softenOpacity,
            backdropFilter: `blur(${stage.visual.softenBlur}px)`,
            WebkitBackdropFilter: `blur(${stage.visual.softenBlur}px)`,
            maskImage: stage.visual.softenMask,
            WebkitMaskImage: stage.visual.softenMask,
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 pt-12"
          style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))` }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
            aria-hidden
          />
          <div className="relative flex flex-col gap-3" aria-live="polite">
            <input
              type="range"
              min={0}
              max={maxIndex}
              step={1}
              value={stageIndex}
              onChange={(event) => setStageIndex(Number(event.target.value))}
              aria-valuemin={0}
              aria-valuemax={maxIndex}
              aria-valuenow={stageIndex}
              aria-valuetext={stage.label}
              aria-label="Leather aging over time"
              className="pdp-aging-slider pdp-aging-slider--on-image py-2"
              style={
                {
                  "--pdp-aging-progress": `${sliderProgress}%`,
                } as CSSProperties
              }
            />

            <div className="flex items-start justify-between gap-4 px-0.5">
              {stages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStageIndex(index)}
                  aria-current={stageIndex === index ? "step" : undefined}
                  className={cn(
                    "font-extended min-w-0 text-center text-[10px] tracking-[0.2px] transition-colors",
                    stageIndex === index
                      ? "text-white"
                      : "text-white/65 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
