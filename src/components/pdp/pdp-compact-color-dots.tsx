"use client";

import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import { pdpColorIsSelectable } from "./pdp-data";
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
  onOpenSheet: () => void;
  className?: string;
};

/** Minimal color availability cue — solid dots plus a +N overflow label. */
export function PdpCompactColorDots({
  colors,
  selectedId,
  previewCount = 3,
  moreCountOverride = 0,
  onOpenSheet,
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
        "inline-flex min-h-[28px] items-center gap-2",
        pdpPressableIconClass,
        className,
      )}
    >
      <span aria-hidden className="flex items-center gap-1.5">
        {previewColors.map((color) => (
          <span
            key={color.id}
            className={cn(
              "size-2 shrink-0 rounded-full ring-1 ring-black/10",
              color.id === selectedId && "ring-2 ring-black ring-offset-1",
            )}
            style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
          />
        ))}
      </span>
      {moreCount > 0 ? (
        <span className={cn("font-extended text-neutral-900", pdpType.micro)}>
          + {moreCount}
        </span>
      ) : null}
    </button>
  );
}
