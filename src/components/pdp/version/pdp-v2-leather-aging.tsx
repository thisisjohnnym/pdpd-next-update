"use client";

import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING } from "../pdp-data";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";
import { useRafLerp } from "../use-raf-lerp";
import { useReducedMotion } from "../use-reduced-motion";

import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

/** Map a pointer x-position to a 0–100 progress along the slider track. */
function agingProgressFromClientX(clientX: number, track: HTMLElement): number {
  const rect = track.getBoundingClientRect();
  const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;

  return Math.min(100, Math.max(0, ratio * 100));
}

/** Nearest stage index for a given 0–100 progress. */
function agingStageIndexFromProgress(progress: number, maxIndex: number): number {
  if (maxIndex <= 0) {
    return 0;
  }

  return Math.round((progress / 100) * maxIndex);
}

/** 0–100 progress that centers the thumb on a given stage. */
function agingProgressFromStageIndex(index: number, maxIndex: number): number {
  if (maxIndex <= 0) {
    return 0;
  }

  return (index / maxIndex) * 100;
}

/** Shared crossfade stage image stack — image on top of the card. */
function LeatherAgingStages({ stageIndex }: { stageIndex: number }) {
  const { stages, image } = PDP_LEATHER_AGING;

  return (
    <>
      {stages.map((item, index) => {
        const itemImage = item.image ?? image;
        const active = index === stageIndex;

        return (
          <Image
            key={item.id}
            src={itemImage.src}
            alt={itemImage.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className={cn(
              "object-cover transition-opacity duration-500 ease-out",
              active ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: itemImage.objectPosition ?? "center" }}
          />
        );
      })}
    </>
  );
}

/**
 * v4 leather aging layout — Paper r5 `JFT-0` / `LM2-0`.
 *
 * Image on top (no warm header band above it), then a single warm `#EFEAE7`
 * block holding a centered title + per-stage description, then the stage
 * slider (dot track + labels). Square corners. Same tap interaction and frozen
 * `PDP_LEATHER_AGING` data as the v2 layout.
 */
function PdpLeatherAgingV4() {
  const { stages, title } = PDP_LEATHER_AGING;
  const maxIndex = stages.length - 1;
  const reducedMotion = useReducedMotion();

  // Committed stage drives the photo crossfade (commit-only, like v1).
  const [stageIndex, setStageIndex] = useState(0);
  // Live 0–100 thumb position — tracks the pointer 1:1 while dragging.
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const dragProgressRef = useRef(0);
  const pointerStartXRef = useRef(0);
  const cleanupDragRef = useRef<(() => void) | null>(null);

  const stage = stages[stageIndex]!;
  // aria-only preview of the stage under the thumb while dragging (the visible
  // caption + photo wait for release — see below).
  const previewStageIndex = agingStageIndexFromProgress(dragProgress, maxIndex);
  const displayStageIndex = isDragging ? previewStageIndex : stageIndex;
  const displayStage = stages[displayStageIndex]!;

  // Smooth the thumb's rendered position toward the raw pointer target so the
  // drag reads fluid, not stiff. Snaps instantly when not dragging so the
  // post-release CSS transition still owns the settle glide.
  const renderedProgress = useRafLerp(dragProgress, {
    smoothing: 0.35,
    enabled: isDragging,
  });

  const setDragProgressValue = useCallback((progress: number) => {
    dragProgressRef.current = progress;
    setDragProgress(progress);
  }, []);

  const commitStageIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(maxIndex, Math.max(0, index));
      setStageIndex(clamped);
      setDragProgressValue(agingProgressFromStageIndex(clamped, maxIndex));
    },
    [maxIndex, setDragProgressValue],
  );

  // Drag via document listeners (attached synchronously on press) so movement
  // is tracked even when the pointer leaves the small slider bounds — and never
  // lost to a failed pointer-capture or a same-tick release.
  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // Ignore secondary mouse buttons; let primary press / touch / pen drag.
      if (event.button > 0) {
        return;
      }

      // Block the browser's native drag-to-select gesture at its origin so no
      // surrounding text (title/caption) gets selected mid-drag. We intentionally
      // do not call focus() here — that would trigger a :focus-visible ring on
      // mouse press; keyboard users still Tab to focus and get the ring.
      event.preventDefault();

      cleanupDragRef.current?.();

      movedRef.current = false;
      pointerStartXRef.current = event.clientX;
      setIsDragging(true);
      setHasMoved(false);
      // Grow the thumb in place on press; only follow the pointer once it moves.
      setDragProgressValue(agingProgressFromStageIndex(stageIndex, maxIndex));

      const handleMove = (moveEvent: globalThis.PointerEvent) => {
        const track = trackRef.current;
        if (!track) {
          return;
        }

        if (
          !movedRef.current &&
          Math.abs(moveEvent.clientX - pointerStartXRef.current) > 3
        ) {
          movedRef.current = true;
          setHasMoved(true);
        }

        if (movedRef.current) {
          moveEvent.preventDefault();
          setDragProgressValue(agingProgressFromClientX(moveEvent.clientX, track));
        }
      };

      const handleUp = (upEvent: globalThis.PointerEvent) => {
        cleanup();
        setIsDragging(false);
        setHasMoved(false);

        const track = trackRef.current;
        let targetProgress = dragProgressRef.current;
        // A press without a drag is a tap — glide to the tapped position.
        if (!movedRef.current && track) {
          targetProgress = agingProgressFromClientX(upEvent.clientX, track);
        }
        movedRef.current = false;

        commitStageIndex(agingStageIndexFromProgress(targetProgress, maxIndex));
      };

      const cleanup = () => {
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleUp);
        document.removeEventListener("pointercancel", handleUp);
        cleanupDragRef.current = null;
      };

      cleanupDragRef.current = cleanup;
      document.addEventListener("pointermove", handleMove, { passive: false });
      document.addEventListener("pointerup", handleUp);
      document.addEventListener("pointercancel", handleUp);
    },
    [commitStageIndex, maxIndex, setDragProgressValue, stageIndex],
  );

  // Detach any in-flight drag listeners if the module unmounts mid-drag.
  useEffect(() => () => cleanupDragRef.current?.(), []);

  // Thumb morphs: rest 49×36 → pressed 63×50 → dragging 79×50 (Paper r5).
  const thumbSize = !isDragging
    ? { width: 49, height: 36 }
    : hasMoved
      ? { width: 79, height: 50 }
      : { width: 63, height: 50 };

  // While dragging, `left` tracks the pointer with no transition (1:1); on
  // release it eases to the snapped stage. Reduced motion snaps instantly.
  const thumbMotionClass = isDragging
    ? "transition-[width,height] duration-150 ease-out"
    : reducedMotion
      ? "transition-none"
      : "transition-[left,width,height] duration-300 ease-out";

  return (
    <section data-header-surface="light" className="w-full shrink-0 bg-white px-4">
      <div className="overflow-hidden">
        <PdpRevealItem>
        <div className="relative h-[430px] w-full bg-neutral-200">
          <LeatherAgingStages stageIndex={stageIndex} />
        </div>
        </PdpRevealItem>

        <PdpRevealItem delay={revealStaggerDelay(1)}>
        <div className="flex flex-col items-center gap-8 bg-[#EFEAE7] px-2 py-6">
          <div className="flex w-full flex-col items-center gap-2">
            <PdpTextReveal
              as="h2"
              className="font-extended m-0 self-stretch text-center text-[24px] font-normal leading-[1.2] tracking-[-0.02em] text-balance text-black"
            >
              {title}
            </PdpTextReveal>
            {/* Reserve height for the longest (2-years) caption so the card
                never resizes as the stage changes. Reads the committed stage —
                text + photo only change on release, not mid-drag. */}
            <p className="font-extended m-0 min-h-[52px] self-stretch text-center text-[12px] leading-[1.4] tracking-[-0.01em] text-balance text-black">
              {`${stage.timeline} — ${stage.summary}`}
            </p>
          </div>

          <div className="flex w-[294px] flex-col gap-[18px] select-none">
            {/* dot track — press and drag the salmon thumb between stages */}
            <div
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={maxIndex}
              aria-valuenow={displayStageIndex}
              aria-valuetext={displayStage.label}
              aria-label="Leather aging over time"
              className={cn(
                "relative -my-3 flex h-11 cursor-grab touch-none select-none items-center py-3",
                "[outline:none] focus-visible:[outline:2px_solid_#c3897f] focus-visible:[outline-offset:2px]",
                isDragging && "cursor-grabbing",
              )}
              onPointerDown={handlePointerDown}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  commitStageIndex(stageIndex - 1);
                }

                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  commitStageIndex(stageIndex + 1);
                }
              }}
            >
              {/* decorative track: idle ring markers + connecting lines */}
              <div className="flex w-full items-center">
                {stages.map((item, index) => {
                  const isLast = index === maxIndex;

                  return (
                    <Fragment key={item.id}>
                      <span
                        aria-hidden
                        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                      >
                        <span
                          aria-hidden
                          className="h-[14px] w-[14px] rounded-full border-2 border-solid border-black bg-[#EEE9E7]"
                        />
                      </span>
                      {!isLast ? (
                        <span aria-hidden className="flex flex-1 items-center px-1">
                          <span aria-hidden className="h-[2px] grow bg-black" />
                        </span>
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>

              {/* moving thumb — inset to map 0–100 onto the dot centers */}
              <div
                ref={trackRef}
                className="pointer-events-none absolute inset-y-0 left-[9px] right-[9px]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C3897F]",
                    thumbMotionClass,
                  )}
                  style={{
                    left: `${renderedProgress}%`,
                    width: thumbSize.width,
                    height: thumbSize.height,
                  }}
                />
              </div>
            </div>

            {/* stage labels — centered under each dot/pill using the same
                9px-inset percentage math as the thumb; tap to jump. */}
            <div className="relative h-4">
              <div className="absolute inset-x-[9px] top-0">
                {stages.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => commitStageIndex(index)}
                    aria-current={stageIndex === index ? "step" : undefined}
                    // Inline position/left/transform to beat the global
                    // `.font-extended { position: relative }` rule in globals.css.
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${agingProgressFromStageIndex(index, maxIndex)}%`,
                      transform: "translateX(-50%)",
                    }}
                    className="font-extended whitespace-nowrap text-[12px] leading-[1.1] text-black transition-colors active:text-neutral-600"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </PdpRevealItem>
      </div>
    </section>
  );
}

/**
 * v2-only leather aging module (Paper AP5-0).
 *
 * Single rounded card with three stacked sections:
 *  1. warm header (title)
 *  2. fixed-height stage image (430px)
 *  3. warm controls — dot track + stage labels + caption
 *
 * Tap a stage label/dot to switch. Reuses PDP_LEATHER_AGING.stages (each stage has an image).
 * No drag, no care upsell — those are v1-only.
 *
 * v4 (Paper r5 `JFT-0`) restructures this — see `PdpLeatherAgingV4`.
 */
export function PdpV2LeatherAging() {
  const { useV4LeatherAgingLayout } = getPdpVersionConfig(usePdpVersion());
  const { stages, title, image } = PDP_LEATHER_AGING;
  const maxIndex = stages.length - 1;
  const [stageIndex, setStageIndex] = useState(0);

  const stage = stages[stageIndex]!;

  if (useV4LeatherAgingLayout) {
    return <PdpLeatherAgingV4 />;
  }

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white px-2"
    >
      <div className="overflow-hidden rounded-[8px]">
        {/* 1 — warm header */}
        <div className="flex flex-col items-center bg-[#F2ECEA] px-2 py-6">
          <h2 className={cn(pdpType.headline, "m-0 text-center")}>{title}</h2>
        </div>

        {/* 2 — stage image */}
        <div className="relative h-[430px] w-full bg-neutral-200">
          {stages.map((item, index) => {
            const itemImage = item.image ?? image;
            const active = index === stageIndex;

            return (
              <Image
                key={item.id}
                src={itemImage.src}
                alt={itemImage.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out",
                  active ? "opacity-100" : "opacity-0",
                )}
                style={{ objectPosition: itemImage.objectPosition ?? "center" }}
              />
            );
          })}
        </div>

        {/* 3 — warm controls */}
        <div className="flex flex-col items-center gap-4 bg-[#EFEAE7] px-2 py-6">
          <div className="flex w-[90%] flex-col gap-2.5">
            {/* dot track — dots are tappable, matching the labels below */}
            <div className="flex items-center px-2">
              {stages.map((item, index) => {
                const active = index === stageIndex;
                const isLast = index === maxIndex;

                return (
                  <Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => setStageIndex(index)}
                      aria-label={`Show leather at ${item.label}`}
                      aria-current={active ? "step" : undefined}
                      className="flex size-[22px] shrink-0 items-center justify-center"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "rounded-full transition-[width,height,background-color] duration-300 ease-out",
                          active
                            ? "size-[22px] bg-[#c38980]"
                            : "size-3 border-2 border-solid border-black bg-[#eee9e7]",
                        )}
                      />
                    </button>
                    {!isLast ? (
                      <span aria-hidden className="h-[2px] grow bg-black" />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>

            {/* stage labels */}
            <div className="flex items-center justify-between">
              {stages.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === maxIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStageIndex(index)}
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

          {/* stage caption */}
          <p
            className={cn(
              pdpType.label,
              "text-balance text-center text-black opacity-70",
            )}
          >
            {`${stage.timeline} — ${stage.summary}`}
          </p>
        </div>
      </div>
    </section>
  );
}
