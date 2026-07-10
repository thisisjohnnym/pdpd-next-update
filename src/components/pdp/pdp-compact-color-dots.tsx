"use client";

import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { pdpPressableIconClass, pdpType } from "./pdp-type";

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

type PdpCompactColorDotsProps = {
  colors: CompactColorDot[];
  selectedId: string;
  previewCount?: number;
  moreCountOverride?: number;
  /** Tap a preview swatch to select that color */
  onSelect: (id: string) => void;
  /** Tap +N to open the full color tray */
  onOpenSheet: () => void;
  /**
   * "dot" — tiny availability cue (default). "swatch" — large tappable
   * swatches with a halo ring on the selected color (v6 docked hero footer).
   */
  variant?: "dot" | "swatch";
  className?: string;
};

/**
 * Compact color preview — each swatch selects a color; +N opens the full tray.
 */
export function PdpCompactColorDots({
  colors,
  selectedId,
  previewCount = 3,
  moreCountOverride = 0,
  onSelect,
  onOpenSheet,
  variant = "dot",
  className,
}: PdpCompactColorDotsProps) {
  const { previewColors, hiddenCount } = buildCompactColorDotPreview(
    colors,
    selectedId,
    previewCount,
  );
  const moreCount = moreCountOverride > 0 ? moreCountOverride : hiddenCount;
  const selectedColor =
    colors.find((color) => color.id === selectedId) ?? colors[0];

  if (colors.length <= 1) {
    return null;
  }

  if (variant === "swatch") {
    return (
      <button
        type="button"
        onClick={onOpenSheet}
        aria-haspopup="dialog"
        aria-label={
          moreCount > 0
            ? `${selectedColor.name}. ${colors.length} colors available. View all colors.`
            : `${selectedColor.name}. View all colors.`
        }
        className={cn(
          "inline-flex items-center gap-1.5",
          pdpPressableIconClass,
          className,
        )}
      >
        <span aria-hidden className="flex items-center gap-1.5">
          {previewColors.map((color) =>
            color.id === selectedId ? (
              <span
                key={color.id}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200"
              >
                <span
                  className="size-5 rounded-full"
                  style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
                />
              </span>
            ) : (
              <span
                key={color.id}
                className="size-[30px] shrink-0 rounded-full"
                style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
              />
            ),
          )}
        </span>
        {moreCount > 0 ? (
          <span className="font-extended text-sm tracking-[0.2px] text-neutral-900">
            +{moreCount}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Choose color"
      className={cn("inline-flex min-h-[28px] items-center gap-1.5", className)}
    >
      <span className="flex items-center gap-1.5">
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
                "relative size-3.5 shrink-0 rounded-full transition-[box-shadow,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-10px] before:content-['']",
                isSelected
                  ? "ring-1 ring-neutral-400 ring-offset-1 ring-offset-white"
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
