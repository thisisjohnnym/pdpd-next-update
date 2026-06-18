"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_GALLERY_DRAG_ZOOM_HINT } from "./pdp-data";
import { PdpHoldChip } from "./pdp-hold-chip";
import { PANEL_MEDIA_COVER_CLASS } from "./pdp-viewport-chrome";
import { useDragZoomLens } from "./use-drag-zoom-lens";

const LENS_SIZE = 132;
const MAGNIFICATION = 2.75;
/** Lift lens above the thumb so the magnified area stays visible */
const TOUCH_LENS_OFFSET_Y = 96;

type PdpGalleryDragZoomImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  objectPosition?: string;
  scale?: string;
  fitContain?: boolean;
  panel?: boolean;
  className?: string;
};

/** Press-and-hold magnifier lens for studio product shots */
// fallow-ignore-next-line complexity
export function PdpGalleryDragZoomImage({
  src,
  alt,
  priority = false,
  objectPosition = "center",
  scale = "scale-100",
  fitContain = false,
  panel = false,
  className,
}: PdpGalleryDragZoomImageProps) {
  const {
    containerRef,
    lensPosition,
    containerSize,
    isPending,
    isZooming,
    holdDurationMs,
    pointerType,
    triggerHandlers,
  } = useDragZoomLens();

  const touchLocked = isZooming;
  const magnifiedWidth = containerSize.width * MAGNIFICATION;
  const magnifiedHeight = containerSize.height * MAGNIFICATION;
  const lensImageLeft =
    lensPosition && magnifiedWidth > 0
      ? LENS_SIZE / 2 - lensPosition.x * MAGNIFICATION
      : 0;
  const lensImageTop =
    lensPosition && magnifiedHeight > 0
      ? LENS_SIZE / 2 - lensPosition.y * MAGNIFICATION
      : 0;

  const lensOffsetY = pointerType === "touch" ? TOUCH_LENS_OFFSET_Y : 0;
  const lensLeft = lensPosition?.x ?? 0;
  const lensTop = lensPosition ? lensPosition.y - lensOffsetY : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pdp-material-explore relative size-full select-none",
        touchLocked && "z-[41]",
        touchLocked ? "touch-none" : "touch-pan-y",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={panel ? "eager" : undefined}
        className={cn(
          panel && !fitContain && PANEL_MEDIA_COVER_CLASS,
          fitContain ? "object-contain" : "object-cover",
          scale,
          "pointer-events-none transition-[filter] duration-300",
          isZooming ? "brightness-[0.88] saturate-[0.82]" : "brightness-100 saturate-100",
        )}
        style={{ objectPosition }}
        sizes="100vw"
        draggable={false}
      />

      {/*
        The hold gesture lives on this dedicated control, NOT the image — so the
        photo stays freely scrollable and resting a thumb on it never arms zoom.
        Kept mounted (only faded) while zooming so the captured pointer survives.
      */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[3] flex justify-center px-4 pb-4 pt-10",
          "bg-gradient-to-t from-black/55 via-black/20 to-transparent transition-opacity duration-200",
          isZooming ? "opacity-0" : "opacity-100",
        )}
      >
        <PdpHoldChip
          as="button"
          type="button"
          aria-label={PDP_GALLERY_DRAG_ZOOM_HINT}
          {...triggerHandlers}
          tone="dark"
          icon="pan_tool"
          label={isPending ? "Keep holding…" : PDP_GALLERY_DRAG_ZOOM_HINT}
          active={isPending}
          durationMs={holdDurationMs}
          pressed={isPending}
          className="pointer-events-auto touch-none"
        />
      </div>

      {lensPosition && magnifiedWidth > 0 ? (
        <div
          aria-hidden
          className="pdp-material-lens pointer-events-none absolute z-10"
          style={{
            left: lensLeft,
            top: lensTop,
            width: LENS_SIZE,
            height: LENS_SIZE,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute inset-0 rounded-full border-[2.5px] border-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/15" />
          <div className="absolute inset-[7px] overflow-hidden rounded-full bg-neutral-950">
            <div
              className="absolute max-w-none"
              style={{
                width: magnifiedWidth,
                height: magnifiedHeight,
                left: lensImageLeft,
                top: lensImageTop,
              }}
            >
              <Image
                src={src}
                alt=""
                width={magnifiedWidth}
                height={magnifiedHeight}
                className="pointer-events-none size-full object-cover"
                style={{ objectPosition }}
                sizes={`${Math.round(magnifiedWidth)}px`}
                draggable={false}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.22),transparent_48%)]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
