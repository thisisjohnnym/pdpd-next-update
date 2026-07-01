// fallow-ignore-file unused-file
"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_WEIGHT_FEEL } from "./pdp-data";
import { PdpHoldChip } from "./pdp-hold-chip";
import { pdpBodyRhythm } from "./pdp-type";
import { useWeightLift } from "./use-weight-lift";

function triggerLiftHaptic(pattern: readonly number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([...pattern]);
  }
}

export function usePdpWeightLift() {
  const { holdMs, hapticPattern } = PDP_WEIGHT_FEEL;
  return useWeightLift({
    holdMs,
    onLift: () => triggerLiftHaptic(hapticPattern),
  });
}

type LiftVisualProps = {
  progress: number;
  isHolding: boolean;
  className?: string;
};

/** Press-and-hold image stack — bag lifts on hold */
// fallow-ignore-next-line complexity
export function PdpWeightLiftMedia({ progress, isHolding, className }: LiftVisualProps) {
  const { image, liftedImage } = PDP_WEIGHT_FEEL;
  const showLiftedAsset = isHolding && progress > 0;
  const surfaceColor = showLiftedAsset
    ? (liftedImage.backgroundColor ?? "#f5ece7")
    : (image.backgroundColor ?? "#eeeeee");

  return (
    <div
      className={cn(
        "pdp-weight-lift-media relative size-full transition-colors duration-500 ease-out",
        className,
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
    </div>
  );
}

type LiftControlsProps = {
  tone?: "dark" | "light";
  progress: number;
  isHolding: boolean;
  handlePointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  handlePointerEnd: (event: React.PointerEvent<HTMLElement>) => void;
  handleContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
};

/** Hold chip + weight reveal copy */
// fallow-ignore-next-line complexity
export function PdpWeightLiftControls({
  tone = "light",
  progress,
  isHolding,
  handlePointerDown,
  handlePointerMove,
  handlePointerEnd,
  handleContextMenu,
  className,
}: LiftControlsProps) {
  const { hint, reveal } = PDP_WEIGHT_FEEL;
  const showLiftedAsset = isHolding && progress > 0;

  return (
    <div
      className={cn(
        "pdp-weight-lift-control flex w-full flex-col items-center gap-3 text-center select-none",
        className,
      )}
    >
      {showLiftedAsset ? (
        <div aria-live="polite" className="px-2">
          <p
            className={cn(
              "font-extended text-sm",
              pdpBodyRhythm,
              tone === "dark" ? "text-white" : "text-black",
            )}
          >
            {reveal.headline}
          </p>
          <p
            className={cn(
              "font-extended mt-1 text-xs tracking-[0.2px]",
              tone === "dark" ? "text-white/75" : "text-neutral-600",
            )}
          >
            {reveal.subline}
          </p>
        </div>
      ) : null}

      <PdpHoldChip
        as="div"
        role="button"
        tabIndex={0}
        aria-label={hint}
        tone={tone}
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
  );
}

/** Full weight lift — media + inline controls */
// fallow-ignore-next-line complexity
export function PdpWeightLiftInteraction({
  tone = "light",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const lift = usePdpWeightLift();
  const showLiftedAsset = lift.isHolding && lift.progress > 0;
  const surfaceColor = showLiftedAsset
    ? (PDP_WEIGHT_FEEL.liftedImage.backgroundColor ?? "#f5ece7")
    : (PDP_WEIGHT_FEEL.image.backgroundColor ?? "#eeeeee");

  return (
    <div className={cn("relative size-full", className)}>
      <PdpWeightLiftMedia progress={lift.progress} isHolding={lift.isHolding} className="size-full" />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex min-h-[11rem] flex-col justify-end px-4 pt-16 pb-6 touch-pan-y",
        )}
        style={{
          backgroundImage: `linear-gradient(to top, ${surfaceColor} 38%, color-mix(in srgb, ${surfaceColor} 82%, transparent) 62%, transparent 100%)`,
        }}
      >
        <PdpWeightLiftControls
          tone={tone}
          progress={lift.progress}
          isHolding={lift.isHolding}
          handlePointerDown={lift.handlePointerDown}
          handlePointerMove={lift.handlePointerMove}
          handlePointerEnd={lift.handlePointerEnd}
          handleContextMenu={lift.handleContextMenu}
          className="mx-auto max-w-[16rem]"
        />
      </div>
    </div>
  );
}
