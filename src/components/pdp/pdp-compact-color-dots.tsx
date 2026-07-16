"use client";

import { Fragment, useRef } from "react";

import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { pdpPressableIconClass, pdpType } from "./pdp-type";
import { useDragToScroll } from "./use-infinite-centered-carousel";

type CompactColorDot = (PdpColor | TabbyColorOption) & {
  /** Unique id when the rail includes the same color across multiple materials. */
  selectionId?: string;
  /** Accessible label with any material context needed to distinguish the option. */
  selectionLabel?: string;
  /** Visible label used to separate material groups in a full rail. */
  groupLabel?: string;
};

function getSelectionId(color: CompactColorDot): string {
  return color.selectionId ?? color.id;
}

function isCombinationAvailable(color: CompactColorDot): boolean {
  return !("combinationAvailable" in color) || color.combinationAvailable;
}

function isInStockForPreview(color: CompactColorDot): boolean {
  return isCombinationAvailable(color) && pdpColorIsSelectable(color.availability);
}

function buildCompactColorDotPreview(
  colors: CompactColorDot[],
  selectedId: string,
  previewCount: number,
) {
  const inStockColors = colors.filter(isInStockForPreview);
  const selected =
    inStockColors.find((color) => color.id === selectedId) ??
    colors.find((color) => color.id === selectedId);

  let previewColors = inStockColors.slice(0, previewCount);

  if (selected && !previewColors.some((color) => color.id === selectedId)) {
    previewColors = [
      selected,
      ...previewColors.filter((color) => color.id !== selectedId),
    ].slice(0, previewCount);
  }

  const hiddenCount = Math.max(0, colors.length - previewColors.length);

  return { previewColors, hiddenCount };
}

type PdpCompactColorDotsProps = {
  colors: CompactColorDot[];
  selectedId: string;
  previewCount?: number;
  moreCountOverride?: number;
  /** Full-width scrollable color rail vs compact +N row */
  variant?: "compact" | "rail";
  /** Tap a preview swatch to select that color */
  onSelect: (id: string) => void;
  /** Tap +N to open the full color tray (compact only) */
  onOpenSheet: () => void;
  className?: string;
};

/**
 * Color preview — compact +N chips, or a full scrollable rail.
 */
// fallow-ignore-next-line complexity
export function PdpCompactColorDots({
  colors,
  selectedId,
  previewCount = 3,
  moreCountOverride = 0,
  variant = "compact",
  onSelect,
  onOpenSheet,
  className,
}: PdpCompactColorDotsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  if (colors.length <= 1) {
    return null;
  }

  if (variant === "rail") {
    return (
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Choose color"
        className={cn(
          "flex min-w-0 w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain",
          "pl-1 pr-4 py-1.5",
          "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {colors.map(
          // fallow-ignore-next-line complexity
          (color, index) => {
          const selectionId = getSelectionId(color);
          const isSelected = selectionId === selectedId;
          const isSelectable = isInStockForPreview(color);
          const startsGroup =
            Boolean(color.groupLabel) &&
            (index === 0 || colors[index - 1]?.groupLabel !== color.groupLabel);

          return (
            <Fragment key={selectionId}>
              {startsGroup && index > 0 ? (
                <span
                  role="presentation"
                  className="font-extended ml-2 shrink-0 border-l border-neutral-300 pl-3 text-[10px] leading-none text-neutral-500"
                >
                  {color.groupLabel}
                </span>
              ) : null}
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={!isSelectable}
                disabled={!isSelectable}
                onClick={() => {
                  if (isSelectable) {
                    onSelect(selectionId);
                  }
                }}
                aria-label={
                  isSelectable
                    ? `Select ${color.selectionLabel ?? color.name}`
                    : `${color.selectionLabel ?? color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
                }
                className={cn(
                  "relative size-7 shrink-0 rounded-full transition-[box-shadow,opacity] duration-200 ease-out",
                  "before:absolute before:inset-[-8px] before:content-['']",
                  isSelected
                    ? "shadow-[0_0_0_2px_#fff,0_0_0_3px_#0a0a0a]"
                    : "ring-1 ring-black/10",
                  isSelectable && pdpPressableIconClass,
                  !isSelectable && "cursor-not-allowed opacity-40",
                )}
                style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
              />
            </Fragment>
          );
        })}
      </div>
    );
  }

  const { previewColors, hiddenCount } = buildCompactColorDotPreview(
    colors,
    selectedId,
    previewCount,
  );
  const moreCount = moreCountOverride > 0 ? moreCountOverride : hiddenCount;

  return (
    <div
      role="listbox"
      aria-label="Choose color"
      className={cn("inline-flex min-h-[28px] items-center gap-2", className)}
    >
      <span className="flex items-center gap-2">
        {previewColors.map(
          // fallow-ignore-next-line complexity
          (color) => {
          const isSelected = color.id === selectedId;
          const isSelectable = isInStockForPreview(color);

          return (
            <button
              key={color.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={!isSelectable}
              disabled={!isSelectable}
              onClick={() => {
                if (isSelectable) {
                  onSelect(color.id);
                }
              }}
              aria-label={
                isSelectable
                  ? `Select ${color.name}`
                  : `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
              }
              className={cn(
                "relative size-6 shrink-0 rounded-full transition-[box-shadow,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                isSelected
                  ? "ring-1 ring-neutral-900 ring-offset-2 ring-offset-white"
                  : "ring-1 ring-black/10",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed opacity-40",
              )}
              style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
            />
          );
        })}
      </span>
      {moreCount > 0 ? (
        <button
          type="button"
          onClick={onOpenSheet}
          aria-haspopup="dialog"
          aria-label={`View ${moreCount} more colors`}
          className={cn(
            "shrink-0 text-neutral-900",
            pdpType.micro,
            pdpPressableIconClass,
          )}
        >
          +{moreCount}
        </button>
      ) : null}
    </div>
  );
}
