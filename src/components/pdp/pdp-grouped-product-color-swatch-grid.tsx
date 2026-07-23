"use client";

import NextImage from "next/image";
import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import {
  pdpColorAvailabilityLabel,
  pdpColorIsSelectable,
} from "./pdp-data";
import { ColorSwatchTile, resolveSquareSwatchFraming } from "./pdp-color-swatch";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { splitCoachColorName } from "./pdp-tabby-colors";
import type { TabbySize } from "./pdp-tabby-variants";
import type { TabbySizeOption } from "./pdp-tabby-variants";
import { pdpPressableClass, pdpPressableIconClass, pdpType } from "./pdp-type";
import { useDragToScroll } from "./use-infinite-centered-carousel";

type PdpProductColorSwatchGridColor = PdpColor | TabbyColorOption;

type TabbyFamilySizeOption = {
  option: TabbySizeOption;
  available: boolean;
};

function isCombinationAvailable(color: PdpProductColorSwatchGridColor): boolean {
  return !("combinationAvailable" in color) || color.combinationAvailable;
}

function swatchColorLabel(name: string): string {
  return name.replace(/ \(demo\)$/i, "");
}

function colorDisplayName(color: PdpProductColorSwatchGridColor): string {
  const cleaned = swatchColorLabel(color.name);
  const { shade, full } = splitCoachColorName(cleaned);
  return shade || full;
}

function isInStockForPreview(color: PdpProductColorSwatchGridColor): boolean {
  return isCombinationAvailable(color) && pdpColorIsSelectable(color.availability);
}

function buildCollapsedColorPreview(
  colors: PdpProductColorSwatchGridColor[],
  previewCount: number,
) {
  const inStockColors = colors.filter(isInStockForPreview);
  const tuckedCount = colors.length - inStockColors.length;

  if (inStockColors.length <= previewCount && tuckedCount === 0) {
    return { previewColors: inStockColors, hiddenCount: 0 };
  }

  const previewColors = inStockColors.slice(0, previewCount);
  const hiddenInStock = Math.max(0, inStockColors.length - previewColors.length);

  return {
    previewColors,
    hiddenCount: hiddenInStock + tuckedCount,
  };
}

function tabbyFamilyLabel(size: TabbySize): string {
  return `Tabby ${size}`;
}

const collapsedSwatchCellClass =
  "relative aspect-square w-full min-w-0 overflow-hidden border-2 p-0 transition-[border-color,opacity] duration-200 ease-out";

// fallow-ignore-next-line complexity
function resolveCollapsedColorRow(
  colors: PdpProductColorSwatchGridColor[],
  collapsedPreviewCount?: number,
  moreCountOverride = 0,
) {
  const fullRow = {
    rowColors: colors,
    stretchRow: false,
    moreCount: 0,
    useCollapsedRow: false,
    collapsedColumnCount: colors.length,
    swatchTileSizes: "44px",
  };

  if (!collapsedPreviewCount || collapsedPreviewCount <= 0) {
    return fullRow;
  }

  const { previewColors, hiddenCount } = buildCollapsedColorPreview(
    colors,
    collapsedPreviewCount,
  );

  if (hiddenCount === 0) {
    return fullRow;
  }

  const moreCount = moreCountOverride > 0 ? moreCountOverride : hiddenCount;

  return {
    rowColors: previewColors,
    stretchRow: true,
    moreCount,
    useCollapsedRow: true,
    collapsedColumnCount: previewColors.length + (moreCount > 0 ? 1 : 0),
    swatchTileSizes: "80px",
  };
}

function swatchOptionAriaLabel(
  color: PdpProductColorSwatchGridColor,
  isSelectable: boolean,
  isNotify: boolean,
): string {
  if (isSelectable) return `Select ${color.name}`;
  if (isNotify) return `Notify me when ${color.name} is back in stock`;
  return `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`;
}

// fallow-ignore-next-line complexity
function ColorSwatchOptionButton({
  color,
  isSelected,
  stretchRow,
  swatchTileSizes,
  onSelect,
  onNotify,
}: {
  color: PdpProductColorSwatchGridColor;
  isSelected: boolean;
  stretchRow: boolean;
  swatchTileSizes: string;
  onSelect: (id: string) => void;
  onNotify?: (colorName: string) => void;
}) {
  const combinationOk = isCombinationAvailable(color);
  const isSelectable =
    combinationOk && pdpColorIsSelectable(color.availability);
  const isNotify =
    combinationOk && color.availability === "notify" && Boolean(onNotify);
  const interactive = isSelectable || isNotify;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      aria-disabled={!interactive}
      disabled={!interactive}
      onClick={() => {
        if (isSelectable) {
          onSelect(color.id);
          return;
        }
        if (isNotify) onNotify!(color.name);
      }}
      aria-label={swatchOptionAriaLabel(color, isSelectable, isNotify)}
      className={cn(
        stretchRow
          ? collapsedSwatchCellClass
          : "relative shrink-0 overflow-hidden border-2 p-0 transition-[border-color,opacity] duration-200 ease-out",
        isSelected ? "border-black" : "border-transparent",
        !interactive && "cursor-not-allowed opacity-40",
        interactive && pdpPressableIconClass,
      )}
    >
      <ColorSwatchTile
        src={color.swatch}
        widthClass={stretchRow ? undefined : "w-11"}
        fillParent={stretchRow}
        sizes={swatchTileSizes}
        {...resolveSquareSwatchFraming(color.swatch)}
        dimmed={!interactive}
      />
      {isNotify ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35"
        >
          <MaterialIcon name="mail" size={14} className="text-white" />
        </span>
      ) : null}
    </button>
  );
}

function MoreColorsTile({
  moreCount,
  onOpenColorSheet,
}: {
  moreCount: number;
  onOpenColorSheet?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenColorSheet?.()}
      aria-label={`View ${moreCount} more colors`}
      className={cn(
        collapsedSwatchCellClass,
        "border-transparent",
        pdpPressableIconClass,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-neutral-100"
      >
        <span
          className={cn(
            "font-extended text-center leading-tight text-neutral-700",
            pdpType.micro,
          )}
        >
          +{moreCount} more
        </span>
      </span>
    </button>
  );
}

function TabbyFamilySizePicker({
  tabbySizeOptions,
  tabbyCurrentSize,
  onFamilySelect,
}: {
  tabbySizeOptions: TabbyFamilySizeOption[];
  tabbyCurrentSize?: TabbySize;
  onFamilySelect: (size: TabbySize) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className={cn(
          "font-extended m-0 tracking-[0.2px] text-black",
          pdpType.label,
        )}
      >
        Size:
      </p>

      <div
        role="listbox"
        aria-label="Choose Tabby family size"
        className="flex flex-wrap items-start gap-4"
      >
        {tabbySizeOptions.map(({ option, available }) => {
          const isSelected = option.size === tabbyCurrentSize;

          return (
            <button
              key={option.size}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={!available}
              disabled={!available}
              onClick={() => available && onFamilySelect(option.size)}
              aria-label={
                available
                  ? `Select ${tabbyFamilyLabel(option.size)}`
                  : `${tabbyFamilyLabel(option.size)}, not available in this style`
              }
              className={cn(
                "flex w-[4.75rem] flex-col items-stretch gap-0 overflow-hidden border-2 p-0 transition-[border-color] duration-200 ease-out",
                isSelected && available
                  ? "border-black"
                  : "border-transparent",
                !available && "cursor-not-allowed opacity-40 grayscale",
                available && pdpPressableClass,
              )}
            >
              <span className="relative aspect-square w-full overflow-hidden">
                <NextImage
                  src={option.image}
                  alt=""
                  fill
                  aria-hidden
                  className="object-contain object-bottom p-1.5"
                  sizes="76px"
                />
              </span>
              <span
                className={cn(
                  "font-extended m-0 w-full px-1 pb-2 pt-1 text-center text-black",
                  pdpType.micro,
                )}
              >
                {tabbyFamilyLabel(option.size)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Color + size picker — 1:1 thumbnail swatches, then family image tiles (Tabby). */
// fallow-ignore-next-line complexity
export function PdpGroupedProductColorSwatchGrid({
  colors,
  selectedId,
  onSelect,
  onNotify,
  tabbyCurrentSize,
  tabbySizeOptions,
  onFamilySelect,
  colorCarouselClassName,
  collapsedPreviewCount,
  moreCountOverride = 0,
  onOpenColorSheet,
  hideColorLabel = false,
}: {
  colors: PdpProductColorSwatchGridColor[];
  selectedId: string;
  onSelect: (id: string) => void;
  onNotify?: (colorName: string) => void;
  tabbyCurrentSize?: TabbySize;
  tabbySizeOptions?: TabbyFamilySizeOption[];
  onFamilySelect?: (size: TabbySize) => void;
  /** Bleed + scroll padding for the color row — matches parent section inset. */
  colorCarouselClassName?: string;
  /** When set, show a short preview row plus a +N more tile. */
  collapsedPreviewCount?: number;
  /** Fixed +N more label — 0 uses the hidden swatch count. */
  moreCountOverride?: number;
  /** Opens the full color sheet (notify me, materials, customize). */
  onOpenColorSheet?: () => void;
  /** Hide the "Color: {shade}" caption above the swatch row. */
  hideColorLabel?: boolean;
}) {
  const colorScrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(colorScrollRef);

  const selectedColor = colors.find((color) => color.id === selectedId);
  const showSizeRow =
    Boolean(tabbySizeOptions) &&
    tabbySizeOptions!.length > 1 &&
    Boolean(onFamilySelect);
  const {
    rowColors,
    stretchRow,
    moreCount,
    useCollapsedRow,
    collapsedColumnCount,
    swatchTileSizes,
  } = resolveCollapsedColorRow(colors, collapsedPreviewCount, moreCountOverride);

  return (
    <div className="flex w-full flex-col gap-5 border-0">
      <div className={cn("flex w-full flex-col", hideColorLabel ? "gap-0" : "gap-3")}>
        {!hideColorLabel ? (
          <p
            aria-live="polite"
            className={cn("font-extended m-0 text-black", pdpType.label)}
          >
            <span className="tracking-[0.2px]">Color:</span>{" "}
            <span className="font-normal">
              {selectedColor ? colorDisplayName(selectedColor) : "Choose a color"}
            </span>
          </p>
        ) : null}

        <div
          ref={colorScrollRef}
          role="listbox"
          aria-label="Choose color"
          className={cn(
            "pdp-carousel-draggable min-w-0 gap-2 py-2.5",
            stretchRow
              ? "grid w-full overflow-x-visible"
              : "flex items-center overflow-x-auto overflow-y-clip overscroll-x-contain overscroll-y-none touch-pan-x",
            colorCarouselClassName,
            !stretchRow &&
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          style={
            stretchRow
              ? {
                  gridTemplateColumns: `repeat(${collapsedColumnCount}, minmax(0, 1fr))`,
                }
              : undefined
          }
        >
          {rowColors.map((color) => (
            <ColorSwatchOptionButton
              key={color.id}
              color={color}
              isSelected={color.id === selectedId}
              stretchRow={stretchRow}
              swatchTileSizes={swatchTileSizes}
              onSelect={onSelect}
              onNotify={onNotify}
            />
          ))}
          {useCollapsedRow && moreCount > 0 ? (
            <MoreColorsTile moreCount={moreCount} onOpenColorSheet={onOpenColorSheet} />
          ) : null}
        </div>
      </div>

      {showSizeRow ? (
        <TabbyFamilySizePicker
          tabbySizeOptions={tabbySizeOptions!}
          tabbyCurrentSize={tabbyCurrentSize}
          onFamilySelect={onFamilySelect!}
        />
      ) : null}
    </div>
  );
}
