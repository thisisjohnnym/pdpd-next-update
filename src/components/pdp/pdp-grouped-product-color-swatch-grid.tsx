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
import { ColorSwatchCircle } from "./pdp-color-swatch";
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

function tabbyFamilyLabel(size: TabbySize): string {
  return `Tabby ${size}`;
}

/** Color + size picker — circular swatches, then family image tiles (Tabby). */
export function PdpGroupedProductColorSwatchGrid({
  colors,
  selectedId,
  onSelect,
  onNotify,
  tabbyCurrentSize,
  tabbySizeOptions,
  onFamilySelect,
  colorCarouselClassName,
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
}) {
  const colorScrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(colorScrollRef);

  const selectedColor = colors.find((color) => color.id === selectedId);
  const showSizeRow =
    Boolean(tabbySizeOptions) &&
    tabbySizeOptions!.length > 1 &&
    Boolean(onFamilySelect);

  return (
    <div className="flex flex-col gap-5 border-0">
      <div className="flex flex-col gap-3">
        <p
          aria-live="polite"
          className={cn("font-extended m-0 text-black", pdpType.label)}
        >
          <span className="tracking-[0.2px]">Color:</span>{" "}
          <span className="font-normal">
            {selectedColor ? colorDisplayName(selectedColor) : "Choose a color"}
          </span>
        </p>

        <div
          ref={colorScrollRef}
          role="listbox"
          aria-label="Choose color"
          className={cn(
            "pdp-carousel-draggable flex min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain py-2.5",
            colorCarouselClassName,
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {colors.map((color) => {
            const isSelected = color.id === selectedId;
            const combinationOk = isCombinationAvailable(color);
            const isSelectable =
              combinationOk && pdpColorIsSelectable(color.availability);
            const isNotify =
              combinationOk && color.availability === "notify" && Boolean(onNotify);

            return (
              <button
                key={color.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={!isSelectable && !isNotify}
                disabled={!isSelectable && !isNotify}
                onClick={() => {
                  if (isSelectable) {
                    onSelect(color.id);
                    return;
                  }

                  if (isNotify) {
                    onNotify!(color.name);
                  }
                }}
                aria-label={
                  isSelectable
                    ? `Select ${color.name}`
                    : isNotify
                      ? `Notify me when ${color.name} is back in stock`
                      : `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
                }
                className={cn(
                  "relative shrink-0 rounded-full p-0.5 transition-[box-shadow,opacity] duration-200 ease-out",
                  isSelected ? "ring-2 ring-black ring-offset-2 ring-offset-white" : "",
                  !isSelectable && !isNotify && "cursor-not-allowed opacity-40",
                  (isSelectable || isNotify) && pdpPressableIconClass,
                )}
              >
                <ColorSwatchCircle
                  src={color.swatch}
                  fill={color.chromeSample}
                  sizeClass="size-9"
                  dimmed={!isSelectable && !isNotify}
                />
                {isNotify ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0.5 flex items-center justify-center rounded-full bg-black/35"
                  >
                    <MaterialIcon name="mail" size={14} className="text-white" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {showSizeRow ? (
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
              {tabbySizeOptions!.map(({ option, available }) => {
                const isSelected = option.size === tabbyCurrentSize;

                return (
                  <button
                    key={option.size}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={!available}
                    disabled={!available}
                    onClick={() => available && onFamilySelect?.(option.size)}
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
      ) : null}
    </div>
  );
}
