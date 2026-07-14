"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";

import { ColorSwatchTile, resolveSquareSwatchFraming } from "./pdp-color-swatch";
import type { PdpColor } from "./pdp-data";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { pdpPressableIconClass, pdpType } from "./pdp-type";
import { useDragToScroll } from "./use-infinite-centered-carousel";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

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
  /** Tap +N to open the full color tray (dot/swatch only) */
  onOpenSheet: () => void;
  /**
   * "dot" — tiny availability cue with +N chips (default). "swatch" — large
   * tappable swatches with a halo ring on the selected color (v6 docked hero
   * footer). "rail" — full-width scrollable 32px color rail (docked land CTA).
   * "compact-swatch" — small full-bag photo tiles + +N (v7 land).
   * "land-dock" — large scrollable full-bag tiles, half-cropped by docked CTA.
   */
  variant?: "dot" | "swatch" | "rail" | "compact-swatch" | "land-dock";
  className?: string;
};

/**
 * Color preview — compact +N chips, large swatch row, or a scrollable rail.
 */
// fallow-ignore-next-line complexity
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
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);
  const { useFullBagColorSwatches } = getPdpVersionConfig(usePdpVersion());

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
        {/* fallow-ignore-next-line complexity */}
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
                "relative shrink-0 transition-[box-shadow,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                useFullBagColorSwatches ? "size-9 rounded-sm" : "size-8 rounded-full",
                isSelected
                  ? useFullBagColorSwatches
                    ? "border-2 border-black"
                    : "shadow-[0_0_0_2px_#fff,0_0_0_3px_#0a0a0a]"
                  : "ring-1 ring-black/10",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed opacity-40",
              )}
            >
              {useFullBagColorSwatches ? (
                <ColorSwatchTile
                  src={color.swatch || undefined}
                  fill={color.swatch ? undefined : (color.chromeSample ?? "#d4d4d4")}
                  widthClass="size-full"
                  sizes="36px"
                  fillParent
                  {...(color.swatch ? resolveSquareSwatchFraming(color.swatch) : {})}
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
                />
              )}
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
  const selectedColor =
    colors.find((color) => color.id === selectedId) ?? colors[0];

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

  if (variant === "land-dock") {
    return (
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Choose color"
        className={cn(
          "pdp-v7-land-dock-swatches flex min-w-0 w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain",
          "px-0.5 py-0.5",
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
                "relative size-14 shrink-0 overflow-hidden rounded-sm transition-[border-color,opacity] duration-200 ease-out",
                "before:absolute before:inset-[-8px] before:content-['']",
                isSelected ? "border-2 border-black" : "ring-1 ring-black/10",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed opacity-40",
              )}
            >
              {useFullBagColorSwatches && color.swatch ? (
                <ColorSwatchTile
                  src={color.swatch}
                  widthClass="size-full"
                  sizes="56px"
                  fillParent
                  {...resolveSquareSwatchFraming(color.swatch)}
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "compact-swatch") {
    return (
      <div
        role="listbox"
        aria-label="Choose color"
        className={cn("inline-flex min-h-[28px] items-center gap-2", className)}
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
                  "relative size-7 shrink-0 overflow-hidden rounded-sm transition-[border-color,opacity] duration-200 ease-out",
                  "before:absolute before:inset-[-8px] before:content-['']",
                  isSelected ? "border-2 border-black" : "ring-1 ring-black/10",
                  isSelectable && pdpPressableIconClass,
                  !isSelectable && "cursor-not-allowed opacity-40",
                )}
              >
                {useFullBagColorSwatches && color.swatch ? (
                  <ColorSwatchTile
                    src={color.swatch}
                    widthClass="size-full"
                    sizes="28px"
                    fillParent
                    {...resolveSquareSwatchFraming(color.swatch)}
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
                  />
                )}
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

  if (variant === "dot") {
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
}
