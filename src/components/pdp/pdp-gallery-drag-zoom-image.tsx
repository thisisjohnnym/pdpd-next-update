"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_DRAG_ZOOM_HINT } from "./pdp-data";
import { PANEL_MEDIA_COVER_CLASS } from "./pdp-viewport-chrome";
import { useDragZoomLens } from "./use-drag-zoom-lens";

const LENS_SIZE = 132;
const MAGNIFICATION = 2.75;
/** Lift lens above the thumb so the magnified area stays visible */
const TOUCH_LENS_OFFSET_Y = 96;

const HOLD_RING_SIZE = 34;
const HOLD_RING_STROKE = 2.5;
const HOLD_RING_RADIUS = (HOLD_RING_SIZE - HOLD_RING_STROKE) / 2;
const HOLD_RING_CIRCUMFERENCE = 2 * Math.PI * HOLD_RING_RADIUS;

/**
 * Circular "hold to zoom" indicator that sits inside the trigger control. While
 * `active` (the press is pending) it fills its progress arc over `durationMs`,
 * giving a clear, deliberate loading cue before the magnifier engages. When the
 * press ends, the arc snaps back to empty.
 */
function HoldToZoomRing({ active, durationMs }: { active: boolean; durationMs: number }) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (!active) {
      setFilled(false);
      return;
    }
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, [active]);

  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: HOLD_RING_SIZE, height: HOLD_RING_SIZE }}
    >
      <svg
        width={HOLD_RING_SIZE}
        height={HOLD_RING_SIZE}
        viewBox={`0 0 ${HOLD_RING_SIZE} ${HOLD_RING_SIZE}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={HOLD_RING_SIZE / 2}
          cy={HOLD_RING_SIZE / 2}
          r={HOLD_RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={HOLD_RING_STROKE}
        />
        <circle
          cx={HOLD_RING_SIZE / 2}
          cy={HOLD_RING_SIZE / 2}
          r={HOLD_RING_RADIUS}
          fill="none"
          stroke="#ffffff"
          strokeWidth={HOLD_RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={HOLD_RING_CIRCUMFERENCE}
          strokeDashoffset={filled ? 0 : HOLD_RING_CIRCUMFERENCE}
          style={{
            transition: filled ? `stroke-dashoffset ${durationMs}ms linear` : "none",
          }}
        />
      </svg>
      <MaterialIcon
        name="pan_tool"
        size={18}
        filled={active}
        className="text-white transition-transform duration-150"
        style={{ transform: active ? "scale(0.92)" : "scale(1)" }}
      />
    </span>
  );
}

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
        <button
          type="button"
          aria-label={PDP_GALLERY_DRAG_ZOOM_HINT}
          {...triggerHandlers}
          className={cn(
            "pointer-events-auto flex touch-none select-none items-center gap-2 rounded-full",
            "border border-white/15 bg-black/45 py-1.5 pl-1.5 pr-3.5 backdrop-blur-md",
            "transition-transform duration-150 active:scale-[0.97]",
            isPending && "scale-[1.04]",
          )}
        >
          <HoldToZoomRing active={isPending} durationMs={holdDurationMs} />
          <span className="font-extended text-[11px] tracking-[0.2px] text-white/95">
            {isPending ? "Keep holding…" : PDP_GALLERY_DRAG_ZOOM_HINT}
          </span>
        </button>
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
