"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_MATERIAL_EXPLORATION, PDP_STUDIO_BACKDROP_CLASS } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { useMaterialExplore } from "./use-material-explore";

const LENS_SIZE = 132;
const MAGNIFICATION = 2.75;

/** Touch-to-reveal leather macro exploration */
export function PdpMaterialStoryModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { hint, overview, zones } = PDP_MATERIAL_EXPLORATION;
  const panel = experiencePanelSectionProps(isLastPanel);
  const {
    containerRef,
    position,
    containerSize,
    isExploring,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  } = useMaterialExplore(zones);

  const overviewObjectPosition = overview.objectPosition ?? "center";
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

  return (
    <section
      data-header-surface="light"
      className={cn(panel.className, galleryPanelClassName(isLastPanel))}
      style={panel.style}
    >
      <div
        ref={containerRef}
        className={cn(
          EXPERIENCE_PANEL_MEDIA_CLASS,
          "pdp-material-explore touch-none select-none",
          PDP_STUDIO_BACKDROP_CLASS,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        role="img"
        aria-label="Drag anywhere on the leather to magnify grain, stitching, and edges"
      >
        <Image
          src={overview.src}
          alt={overview.alt}
          fill
          className={cn(
            "object-cover scale-[1.06] transition-[filter] duration-300",
            isExploring
              ? "brightness-[0.88] saturate-[0.82]"
              : "brightness-100 saturate-100",
          )}
          style={{ objectPosition: overviewObjectPosition }}
          sizes="100vw"
          draggable={false}
        />

        {!isExploring ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-10"
          >
            <MaterialIcon name="search" size={18} className="text-white/90" />
            <span className="font-extended text-[11px] tracking-[0.2px] text-white/90">
              {hint}
            </span>
          </div>
        ) : null}

        {position && magnifiedWidth > 0 ? (
          <div
            aria-hidden
            className="pdp-material-lens pointer-events-none absolute z-10"
            style={{
              left: position.x,
              top: position.y,
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
                  src={overview.src}
                  alt=""
                  width={magnifiedWidth}
                  height={magnifiedHeight}
                  className="size-full object-cover"
                  style={{ objectPosition: overviewObjectPosition }}
                  sizes={`${Math.round(magnifiedWidth)}px`}
                  draggable={false}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.22),transparent_48%)]" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
