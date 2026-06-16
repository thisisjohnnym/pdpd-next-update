"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_GALLERY_DRAG_ZOOM_HINT } from "./pdp-data";
import { PANEL_MEDIA_COVER_CLASS } from "./pdp-viewport-chrome";
import { useMaterialExplore } from "./use-material-explore";

const LENS_SIZE = 132;
const MAGNIFICATION = 2.75;
/** Lift lens above touch point so the thumb does not cover the magnified area */
const TOUCH_LENS_OFFSET_Y = 96;
const HOLD_RING_SIZE = 56;
const HOLD_RING_RADIUS = 18;
const HOLD_RING_CIRCUMFERENCE = 2 * Math.PI * HOLD_RING_RADIUS;

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

/** Drag-to-zoom lens — studio product shots */
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
    position,
    containerSize,
    isExploring,
    isPendingHold,
    holdProgress,
    holdAnchor,
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  } = useMaterialExplore([]);

  const touchLocked = isExploring || isPendingHold;
  const magnifiedWidth = containerSize.width * MAGNIFICATION;
  const magnifiedHeight = containerSize.height * MAGNIFICATION;
  const lensImageLeft =
    position && magnifiedWidth > 0
      ? LENS_SIZE / 2 - position.x * MAGNIFICATION
      : 0;
  const lensImageTop =
    position && magnifiedHeight > 0
      ? LENS_SIZE / 2 - position.y * MAGNIFICATION
      : 0;

  const lensOffsetY = pointerType === "touch" ? TOUCH_LENS_OFFSET_Y : 0;
  const lensLeft = position?.x ?? 0;
  const lensTop = position ? position.y - lensOffsetY : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pdp-material-explore relative size-full select-none",
        touchLocked && "z-[41]",
        touchLocked ? "touch-none" : "touch-pan-y",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handleLostPointerCapture}
      onContextMenu={handleContextMenu}
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
          isExploring
            ? "brightness-[0.88] saturate-[0.82]"
            : "brightness-100 saturate-100",
        )}
        style={{ objectPosition }}
        sizes="100vw"
        draggable={false}
      />

      {isPendingHold && holdAnchor ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[3]"
          style={{
            left: holdAnchor.x,
            top: holdAnchor.y,
            width: HOLD_RING_SIZE,
            height: HOLD_RING_SIZE,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="absolute inset-0 rounded-full border border-white/45 bg-black/20 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-[2px]" />
          <svg
            viewBox={`0 0 ${HOLD_RING_SIZE} ${HOLD_RING_SIZE}`}
            className="absolute inset-0 size-full -rotate-90"
            aria-hidden
          >
            <circle
              cx={HOLD_RING_SIZE / 2}
              cy={HOLD_RING_SIZE / 2}
              r={HOLD_RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/35"
            />
            <circle
              cx={HOLD_RING_SIZE / 2}
              cy={HOLD_RING_SIZE / 2}
              r={HOLD_RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-white transition-[stroke-dashoffset] duration-75"
              strokeDasharray={HOLD_RING_CIRCUMFERENCE}
              strokeDashoffset={HOLD_RING_CIRCUMFERENCE * (1 - holdProgress)}
            />
          </svg>
          <MaterialIcon
            name="search"
            size={18}
            className="absolute inset-0 m-auto text-white/95"
          />
        </div>
      ) : null}

      {!isExploring ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-10"
        >
          {!isPendingHold ? (
            <MaterialIcon name="search" size={18} className="text-white/90" />
          ) : null}
          <span
            aria-live="polite"
            className={cn(
              "font-extended tracking-[0.2px] text-white/90",
              isPendingHold ? "text-xs" : "text-[11px]",
            )}
          >
            {isPendingHold ? "Keep holding…" : PDP_GALLERY_DRAG_ZOOM_HINT}
          </span>
        </div>
      ) : null}

      {position && magnifiedWidth > 0 ? (
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
