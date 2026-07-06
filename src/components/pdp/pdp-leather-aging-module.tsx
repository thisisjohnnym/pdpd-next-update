"use client";

import Image from "next/image";
import { Fragment, useCallback, useRef, useState, type PointerEvent } from "react";

import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { PdpLeatherAgingCareUpsell } from "./pdp-leather-aging-care-upsell";
import { pdpType } from "./pdp-type";

function progressFromClientX(clientX: number, track: HTMLElement): number {
  const rect = track.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;

  return Math.min(100, Math.max(0, ratio * 100));
}

function stageIndexFromProgress(progress: number, maxIndex: number): number {
  if (maxIndex <= 0) {
    return 0;
  }

  return Math.round((progress / 100) * maxIndex);
}

function progressFromStageIndex(index: number, maxIndex: number): number {
  if (maxIndex <= 0) {
    return 0;
  }

  return (index / maxIndex) * 100;
}

/** Leather aging simulator — patina, softening, and wear over time */
export function PdpLeatherAgingModule({
  isLastPanel = false,
  onQuickAdd,
  showCareUpsell = true,
}: {
  isLastPanel?: boolean;
  onQuickAdd?: () => void;
  /** Show leather care product upsell rows (hidden in v2 — Paper AP5-0). Defaults true for v1. */
  showCareUpsell?: boolean;
}) {
  const { image, stages, title } = PDP_LEATHER_AGING;
  const panel = experiencePanelSectionProps(isLastPanel);
  const maxIndex = stages.length - 1;
  const [dragProgress, setDragProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragProgressRef = useRef(0);
  const stage = stages[stageIndex]!;

  const imageMotionClass = isDragging ? "transition-none" : "transition-opacity duration-500 ease-out";
  const dotMotionClass = isDragging ? "transition-none" : "transition-[width,height,background-color] duration-300 ease-out";
  const labelMotionClass = isDragging ? "transition-none" : "transition-colors duration-200";

  const setDragProgressValue = useCallback((progress: number) => {
    dragProgressRef.current = progress;
    setDragProgress(progress);
  }, []);

  const commitStageIndex = useCallback(
    (index: number) => {
      setStageIndex(index);
      setDragProgressValue(progressFromStageIndex(index, maxIndex));
    },
    [maxIndex, setDragProgressValue],
  );

  const updateDragFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      setDragProgressValue(progressFromClientX(clientX, track));
    },
    [setDragProgressValue],
  );

  const handleScrubPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      updateDragFromPointer(event.clientX);
    },
    [updateDragFromPointer],
  );

  const handleScrubPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) {
        return;
      }

      updateDragFromPointer(event.clientX);
    },
    [updateDragFromPointer],
  );

  const endScrub = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;
      setIsDragging(false);

      const snappedIndex = stageIndexFromProgress(dragProgressRef.current, maxIndex);
      commitStageIndex(snappedIndex);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [commitStageIndex, maxIndex],
  );

  const showSimulatedWear = !stage.image;
  const previewStageIndex = stageIndexFromProgress(dragProgress, maxIndex);
  const displayStageIndex = isDragging ? previewStageIndex : stageIndex;
  const displayStage = stages[displayStageIndex]!;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-white")}>
        {stages.map((item, index) => {
          if (Math.abs(index - stageIndex) > 1) {
            return null;
          }

          const stageImage = item.image ?? image;
          const active = stageIndex === index;
          const filter =
            item.image
              ? undefined
              : `brightness(${item.visual.brightness}) contrast(${item.visual.contrast}) saturate(${item.visual.saturate}) sepia(${item.visual.sepia})`;

          return (
            <Image
              key={item.id}
              src={stageImage.src}
              alt={stageImage.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className={cn("object-cover", imageMotionClass, active ? "opacity-100" : "opacity-0")}
              style={{
                objectPosition: stageImage.objectPosition ?? "center",
                filter,
              }}
              sizes="100vw"
            />
          );
        })}

        {showSimulatedWear ? (
          <>
            <div
              aria-hidden
              className={cn("pointer-events-none absolute inset-0", imageMotionClass)}
              style={{
                opacity: stage.visual.patinaOpacity,
                background: stage.visual.patinaGradient,
              }}
            />
            <div
              aria-hidden
              className={cn("pointer-events-none absolute inset-0", imageMotionClass)}
              style={{
                opacity: stage.visual.wearOpacity,
                background: stage.visual.wearGradient,
              }}
            />
            <div
              aria-hidden
              className={cn("pointer-events-none absolute inset-0", imageMotionClass)}
              style={{
                opacity: stage.visual.softenOpacity,
                backdropFilter: `blur(${stage.visual.softenBlur}px)`,
                WebkitBackdropFilter: `blur(${stage.visual.softenBlur}px)`,
                maskImage: stage.visual.softenMask,
                WebkitMaskImage: stage.visual.softenMask,
              }}
            />
          </>
        ) : null}
      </div>

      <div
        className="shrink-0 bg-white px-4 pt-3.5"
        style={{ paddingBottom: `calc(0.75rem + var(--pdp-safe-area-bottom))` }}
      >
        <div className="pdp-aging-timeline flex flex-col gap-4">
          <h3 className={cn(pdpType.headline, "m-0 text-center")}>
            {title}
          </h3>

          <div className="mx-auto flex w-[90%] flex-col gap-2.5">
            <div
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={maxIndex}
              aria-valuenow={isDragging ? previewStageIndex : stageIndex}
              aria-valuetext={
                isDragging ? stages[previewStageIndex]!.label : stage.label
              }
              aria-label="Leather aging over time"
              className={cn(
                "relative flex h-11 cursor-grab touch-none select-none items-center px-2 active:cursor-grabbing",
                isDragging && "cursor-grabbing",
              )}
              onPointerDown={handleScrubPointerDown}
              onPointerMove={handleScrubPointerMove}
              onPointerUp={endScrub}
              onPointerCancel={endScrub}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  commitStageIndex(Math.max(0, stageIndex - 1));
                }

                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  commitStageIndex(Math.min(maxIndex, stageIndex + 1));
                }
              }}
            >
              <div
                ref={trackRef}
                className="pdp-aging-timeline__track relative flex w-full items-center"
              >
                {stages.map((item, index) => {
                  const active = displayStageIndex === index;
                  const isLast = index === maxIndex;

                  return (
                    <Fragment key={item.id}>
                      <span
                        aria-hidden
                        className="flex size-[22px] shrink-0 items-center justify-center"
                      >
                        <span
                          className={cn(
                            "rounded-full",
                            dotMotionClass,
                            active
                              ? "size-[22px] bg-[#c38980]"
                              : "size-3 border-2 border-solid border-black bg-white",
                          )}
                        />
                      </span>

                      {!isLast ? (
                        <span aria-hidden className="h-[2px] grow bg-[#e2e2e2]" />
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {stages.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === maxIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => commitStageIndex(index)}
                    aria-current={stageIndex === index ? "step" : undefined}
                    className={cn(
                      pdpType.label,
                      "flex-1 leading-[110%] text-black transition-colors active:text-neutral-600",
                      isFirst && "text-left",
                      isLast && "text-right",
                      !isFirst && !isLast && "text-center",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p
            className={cn(
              pdpType.label,
              "text-balance text-center text-black opacity-70",
              labelMotionClass,
            )}
          >
            {`${displayStage.timeline} — ${displayStage.summary}`}
          </p>

          {showCareUpsell ? (
            <PdpLeatherAgingCareUpsell
              stageIndex={stageIndex}
              isDragging={isDragging}
              onQuickAdd={onQuickAdd}
              className="mt-3"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
