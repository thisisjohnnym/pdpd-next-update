"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING, PDP_LEATHER_CLEANER } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType, pdpStrokeCtaClass, pdpStrokeCtaMutedClass, pdpAddIconLabelClass, pdpPressableClass } from "./pdp-type";
import { useMountTransition } from "./use-mount-transition";
import { useTransientAddedSet } from "./use-transient-added-set";

function formatCarePrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

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

function AgingCareUpsellRow({
  product,
  added,
  onQuickAdd,
}: {
  product: (typeof PDP_LEATHER_CLEANER.products)[number];
  added: boolean;
  onQuickAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
        <div className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-contain object-center p-1"
            sizes="48px"
          />
        </div>

        <p className="font-extended min-w-0 flex-1 truncate text-sm tracking-[0.2px] text-black">
          {product.name}
        </p>

        <p className="font-extended shrink-0 text-sm tracking-[0.2px] text-black tabular-nums">
          {formatCarePrice(product.price)}
        </p>

        <button
          type="button"
          onClick={onQuickAdd}
          disabled={added}
          className={cn(
            "font-extended inline-flex shrink-0 items-center justify-center gap-0.5 px-2.5 py-1.5 text-[11px] leading-none tracking-[0.2px] transition-colors",
            added ? pdpStrokeCtaMutedClass : pdpStrokeCtaClass,
          )}
        >
          <span className={pdpAddIconLabelClass}>{added ? "Added" : "Add"}</span>
          {!added ? (
            <MaterialIcon
              name="add"
              size={18}
              className="shrink-0 text-black"
              aria-hidden
            />
          ) : null}
        </button>
      </div>
  );
}

function AgingCareHelp({
  label,
  lines,
}: {
  label: string;
  lines: readonly { productId: string; text: string }[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltip = useMountTransition(open, 220);

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", close);

    return () => {
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative self-start">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="aging-care-help-tooltip"
        className={cn(
          "inline-flex items-center gap-1.5 text-left text-neutral-500 transition-colors active:text-neutral-700",
          pdpPressableClass,
        )}
      >
        <MaterialIcon name="help_outline" size={18} className="shrink-0 text-neutral-500" />
        <span className={pdpType.micro}>{label}</span>
      </button>

      {tooltip.mounted ? (
        <div
          id="aging-care-help-tooltip"
          role="tooltip"
          data-state={tooltip.state}
          className="pdp-pop-up absolute bottom-full left-0 z-20 mb-2 w-[min(17rem,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col gap-1.5">
            {lines.map((line) => (
              <p key={line.productId} className={`text-neutral-600 ${pdpType.micro}`}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
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
  const { image, stages, careNudge, title } = PDP_LEATHER_AGING;
  const panel = experiencePanelSectionProps(isLastPanel);
  const maxIndex = stages.length - 1;
  const [dragProgress, setDragProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { isAdded: isCareAdded, confirmAdd: confirmCareAdd } =
    useTransientAddedSet();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragProgressRef = useRef(0);
  const stage = stages[stageIndex]!;
  const careProducts = useMemo(
    () =>
      careNudge.productIds
        .map((productId) =>
          PDP_LEATHER_CLEANER.products.find((product) => product.id === productId),
        )
        .filter((product): product is (typeof PDP_LEATHER_CLEANER.products)[number] =>
          Boolean(product),
        ),
    [careNudge.productIds],
  );

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

          {showCareUpsell && careProducts.length ? (
            <div
              className={cn(
                "overflow-hidden",
                isDragging
                  ? "transition-none"
                  : "transition-[max-height,margin,opacity] duration-500 ease-out",
                stageIndex === 0
                  ? "max-h-0 opacity-0"
                  : "mt-3 max-h-56 opacity-100",
              )}
              aria-hidden={stageIndex === 0}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col divide-y divide-neutral-200">
                  {careProducts.map((product) => (
                    <AgingCareUpsellRow
                      key={product.id}
                      product={product}
                      added={isCareAdded(product.id)}
                      onQuickAdd={() => {
                        onQuickAdd?.();
                        confirmCareAdd(product.id);
                      }}
                    />
                  ))}
                </div>

                <AgingCareHelp label={careNudge.help.label} lines={careNudge.help.lines} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
