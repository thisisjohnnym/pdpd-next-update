"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_WEIGHT_FEEL } from "./pdp-data";
import { PdpHoldChip } from "./pdp-hold-chip";
import { pdpBodyRhythm } from "./pdp-type";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { useWeightLift } from "./use-weight-lift";

function triggerLiftHaptic(pattern: readonly number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([...pattern]);
  }
}

const WEIGHT_LIFT_OVERLAY_CLASS =
  "absolute inset-x-0 bottom-0 z-10 flex min-h-[13.5rem] flex-col justify-end px-4 pt-20 pb-[calc(1rem+var(--pdp-safe-area-bottom))]";

/** Weight & feel — press-and-hold lift with haptic, specs as sensation */
export function PdpWeightFeelModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { hint, holdMs, image, liftedImage, reveal, hapticPattern } = PDP_WEIGHT_FEEL;
  const panel = experiencePanelSectionProps(isLastPanel);

  const { progress, isHolding, handlePointerDown, handlePointerMove, handlePointerEnd, handleContextMenu } =
    useWeightLift({
      holdMs,
      onLift: () => triggerLiftHaptic(hapticPattern),
    });

  const showLiftedAsset = isHolding && progress > 0;
  const surfaceColor = showLiftedAsset
    ? (liftedImage.backgroundColor ?? "#f5ece7")
    : (image.backgroundColor ?? "#eeeeee");

  return (
    <section
      data-header-surface="light"
      className={panel.className}
      style={{ ...panel.style, backgroundColor: surfaceColor }}
    >
      <div
        className={cn(
          EXPERIENCE_PANEL_MEDIA_CLASS,
          "pdp-weight-lift-media relative transition-colors duration-500 ease-out",
          !panel.style && "aspect-[9/16]",
        )}
        style={{ backgroundColor: surfaceColor }}
      >
        <div
          className={cn(
            "pdp-weight-lift__stage absolute inset-0 transition-transform duration-300 ease-out",
            isHolding && progress > 0 && "pdp-weight-lift__stage--lifted",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              showLiftedAsset ? "opacity-0" : "opacity-100",
            )}
          >
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              priority
              unoptimized
              className="pointer-events-none object-cover"
              style={{ objectPosition: image.objectPosition ?? "center center" }}
              sizes="100vw"
              draggable={false}
            />
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out",
              showLiftedAsset ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              key={liftedImage.src}
              src={liftedImage.src}
              alt={showLiftedAsset ? liftedImage.alt : ""}
              fill
              loading="lazy"
              unoptimized
              className="pointer-events-none object-cover"
              style={{ objectPosition: liftedImage.objectPosition ?? "center center" }}
              sizes="100vw"
              draggable={false}
            />
          </div>
        </div>

        <div
          className={cn(WEIGHT_LIFT_OVERLAY_CLASS, "touch-pan-y")}
          style={{
            backgroundImage: `linear-gradient(to top, ${surfaceColor} 42%, color-mix(in srgb, ${surfaceColor} 88%, transparent) 68%, transparent 100%)`,
          }}
        >
          <div className="pdp-weight-lift-control mx-auto flex w-full max-w-[16rem] flex-col items-center gap-3 text-center select-none">
            {showLiftedAsset ? (
              <div aria-live="polite" className="px-2">
                <p className={`font-extended text-sm text-black ${pdpBodyRhythm}`}>
                  {reveal.headline}
                </p>
                <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
                  {reveal.subline}
                </p>
              </div>
            ) : null}

            <PdpHoldChip
              as="div"
              role="button"
              tabIndex={0}
              aria-label={hint}
              tone="light"
              icon="back_hand"
              label={isHolding ? "Keep holding…" : hint}
              progress={progress}
              pressed={isHolding}
              className="cursor-pointer touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onContextMenu={handleContextMenu}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
