"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";

import { ColorSwatchTile, resolveSquareSwatchFraming } from "./pdp-color-swatch";
import type { PdpColor } from "./pdp-data";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { pdpPressableIconClass, pdpType } from "./pdp-type";
import { useDragToScroll } from "./use-infinite-centered-carousel";

type CompactColorDot = PdpColor | TabbyColorOption;

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

function CompactColorSwatch({
  color,
  widthClass,
  sizes,
}: {
  color: CompactColorDot;
  widthClass: string;
  sizes: string;
}) {
  return (
    <ColorSwatchTile
      src={color.swatch || undefined}
      fill={color.swatch ? undefined : (color.chromeSample ?? "#d4d4d4")}
      widthClass={widthClass}
      sizes={sizes}
      {...(color.swatch ? resolveSquareSwatchFraming(color.swatch) : {})}
    />
  );
}

type PdpCompactColorDotsProps = {
  colors: CompactColorDot[];
  selectedId: string;
  previewCount?: number;
  moreCountOverride?: number;
  /** Full-width scrollable bag-swatch rail vs compact +N row */
  variant?: "compact" | "rail";
  /** Tap a preview swatch to select that color */
  onSelect: (id: string) => void;
  /** Tap +N to open the full color tray (compact only) */
  onOpenSheet: () => void;
  className?: string;
};

/**
 * Color preview — 1:1 bag image thumbnails as compact +N chips, or a full scrollable rail.
 */
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
          "px-1 py-1.5",
          "pdp-carousel-draggable [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {colors.map((color) => {
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
                "relative shrink-0 overflow-hidden border-2 p-0 transition-[border-color,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                isSelected ? "border-black" : "border-transparent",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed opacity-40",
              )}
            >
              <CompactColorSwatch color={color} widthClass="w-9" sizes="36px" />
            </button>
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
        {previewColors.map((color) => {
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
                "relative shrink-0 overflow-hidden border-2 p-0 transition-[border-color,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                isSelected ? "border-black" : "border-transparent",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed opacity-40",
              )}
            >
              <CompactColorSwatch color={color} widthClass="w-8" sizes="32px" />
            </button>
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
