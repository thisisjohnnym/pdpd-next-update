"use client";

import { useEffect, useId, useRef, type PointerEvent } from "react";

import { cn } from "@/lib/cn";

import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "../pdp-data";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpPressableIconClass, pdpType } from "../pdp-type";
import { useDragToScroll } from "../use-infinite-centered-carousel";

type PdpV8ColorDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedColorId: string;
  onColorSelect: (id: string) => void;
};

const DRAG_CLOSE_PX = 28;

/**
 * Absolute color drawer tucked on top of product info — grows upward over the
 * gallery without pushing layout (Paper v8). Swatches are solid color fills.
 * Close via swatch tap, handle tap, Escape, or drag-down on the handle.
 */
export function PdpV8ColorDrawer({
  open,
  onOpenChange,
  selectedColorId,
  onColorSelect,
}: PdpV8ColorDrawerProps) {
  const tabby = useOptionalTabbyVariant();
  const titleId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  useDragToScroll(scrollRef);

  const colors = tabby?.colorOptions ?? [];
  const selected =
    colors.find((color) => color.id === selectedColorId) ?? colors[0];

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (colors.length <= 1) {
    return null;
  }

  const onHandlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onHandlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStartY.current === null || !open) {
      return;
    }
    const delta = event.clientY - dragStartY.current;
    if (delta > DRAG_CLOSE_PX) {
      dragStartY.current = null;
      onOpenChange(false);
    }
  };

  const onHandlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStartY.current = null;
  };

  return (
    <div
      className="pdp-v8-color-drawer"
      data-open={open ? "true" : "false"}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={open ? "Close color options" : "Open color options"}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        className={cn(
          "pdp-v8-color-drawer-handle-hit flex w-full flex-col items-center gap-2",
          pdpPressableIconClass,
        )}
      >
        <span className="pdp-v8-color-drawer-handle" aria-hidden />
      </button>

      <div className="pdp-v8-color-drawer-body">
        <p
          id={titleId}
          className={cn(
            pdpType.label,
            "w-full text-left text-[13px] leading-none text-neutral-900",
          )}
        >
          Color: {selected?.name ?? "Select"}
        </p>
        <div
          ref={scrollRef}
          role="listbox"
          aria-label="Choose color"
          className="pdp-v8-color-drawer-swatches pdp-carousel-draggable"
        >
          {colors.map((color) => {
            const isSelected = color.id === selectedColorId;
            const combinationAvailable =
              !("combinationAvailable" in color) || color.combinationAvailable;
            const isSelectable =
              combinationAvailable && pdpColorIsSelectable(color.availability);

            return (
              <button
                key={color.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={!isSelectable}
                disabled={!isSelectable}
                data-selected={isSelected ? "true" : "false"}
                onClick={() => {
                  if (!isSelectable) {
                    return;
                  }
                  if (tabby) {
                    tabby.setSelectedColorId(color.id);
                  } else {
                    onColorSelect(color.id);
                  }
                  onOpenChange(false);
                }}
                aria-label={
                  isSelectable
                    ? `Select ${color.name}`
                    : `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
                }
                className={cn(
                  "pdp-v8-color-swatch",
                  isSelectable && pdpPressableIconClass,
                  !isSelectable && "cursor-not-allowed opacity-40",
                )}
              >
                {isSelected ? (
                  <span aria-hidden className="pdp-v8-color-swatch-ring" />
                ) : null}
                <span
                  aria-hidden
                  className="pdp-v8-color-swatch-fill"
                  style={{
                    backgroundColor: color.chromeSample ?? "#d4d4d4",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
