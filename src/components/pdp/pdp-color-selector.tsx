"use client";

import { useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import {
  pdpColorAvailabilityLabel,
  pdpColorIsSelectable,
} from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import {
  pdpCarouselScrollClass,
} from "./pdp-carousel";
import { PdpColorSheet } from "./pdp-color-sheet";
import { ColorSwatchCircle, ColorSwatchImage } from "./pdp-color-swatch";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import { splitCoachColorName } from "./pdp-tabby-colors";
import { getTabbyColorSheetGroups } from "./pdp-tabby-color-sheet-groups";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { PdpV3ColorSheet } from "./version/pdp-v3-color-sheet";
import { PdpIconSwap } from "./pdp-icon-swap";
import {
  pdpPressableIconClass,
  pdpVariantPillBaseClass,
  pdpVariantPillClass,
  pdpVariantPillFrostBaseClass,
  pdpVariantPillFrostClass,
} from "./pdp-type";
import { useDragToScroll } from "./use-infinite-centered-carousel";

type PdpColorSelectorColor = PdpColor | TabbyColorOption;

function isCombinationAvailable(color: PdpColorSelectorColor): boolean {
  return !("combinationAvailable" in color) || color.combinationAvailable;
}

type PdpColorSelectorProps = {
  colors: PdpColorSelectorColor[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Overlay on hero image vs standalone on black */
  variant?: "default" | "overlay";
  /** Compact swatches for gallery HUD — left-aligned, smaller */
  compact?: boolean;
  /** Drop-up picker inside bottom bar pill */
  inline?: boolean;
  /** Fires when the inline color tray opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Fill equal share of a full-width variant row */
  stretch?: boolean;
  /** Frosted pill on docked hero buy bar */
  frost?: boolean;
  /** Override pill height so it matches sibling bottom-bar controls */
  heightClass?: string;
  /** Square the pill corners to match a squared Add to bag button */
  squared?: boolean;
  /** Lift the inline pill with the floating buy-bar shadow (scrolled state) */
  elevated?: boolean;
  /** Hide the grey "Color" caption — show swatch + shade name + chevron only */
  hideLabel?: boolean;
  /** Horizontal swatch row — no dropdown tray (v5 buy bar) */
  exposeAllSwatches?: boolean;
};

/** Floating buy-bar elevation — matches the AR button drop shadow */
const FLOATING_PILL_SHADOW = "shadow-[0_4px_14px_rgba(0,0,0,0.12)]";

function PdpInlineColorSwatchCarousel({
  colors,
  selectedId,
  onSelect,
}: {
  colors: PdpColorSelectorColor[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragToScroll(scrollRef);

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label="Choose color"
      className={cn(
        pdpCarouselScrollClass,
        "pdp-carousel-draggable flex min-w-0 items-center gap-2.5 overflow-y-clip overscroll-y-none touch-pan-x py-0.5 pl-0 scroll-pl-0",
      )}
    >
      {colors.map((color) => {
        const isSelected = color.id === selectedId;
        const isSelectable =
          isCombinationAvailable(color) &&
          pdpColorIsSelectable(color.availability);

        return (
          <button
            key={color.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-disabled={!isSelectable}
            disabled={!isSelectable}
            onClick={() => isSelectable && onSelect(color.id)}
            aria-label={
              isSelectable
                ? `Select ${color.name}`
                : `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
            }
            className={cn(
              "relative shrink-0 rounded-full p-0.5 transition-[box-shadow,opacity] duration-200 ease-out",
              isSelected && "ring-2 ring-black ring-offset-2",
              !isSelectable && "cursor-not-allowed opacity-40",
              isSelectable && pdpPressableIconClass,
            )}
          >
            {"swatch" in color && color.swatch ? (
              <ColorSwatchCircle src={color.swatch} sizeClass="size-9" />
            ) : (
              <ColorSwatchCircle
                fill={color.chromeSample ?? "#d4d4d4"}
                sizeClass="size-9"
              />
            )}
            {!isSelectable && color.availability === "notify" ? (
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30"
              >
                <MaterialIcon name="mail" size={16} className="text-white" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function PdpColorDropup({
  colors,
  selectedId,
  onSelect,
  onOpenChange,
  stretch = false,
  frost = false,
  heightClass,
  squared = false,
  elevated = false,
  hideLabel = false,
}: Pick<
  PdpColorSelectorProps,
  | "colors"
  | "selectedId"
  | "onSelect"
  | "onOpenChange"
  | "stretch"
  | "frost"
  | "heightClass"
  | "squared"
  | "elevated"
  | "hideLabel"
>) {
  const [open, setOpen] = useState(false);
  const { productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const isTabbyProduct = productId === "tabby" && Boolean(tabby);
  const useV3Sheet =
    getPdpVersionConfig(usePdpVersion()).useV3ColorSheet && isTabbyProduct;
  const colorGroups = isTabbyProduct
    ? getTabbyColorSheetGroups(tabby!.styleId, tabby!.size)
    : undefined;
  const selected =
    colors.find((color) => color.id === selectedId) ?? colors[0];

  const setSheetOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const toggleSheet = () => {
    setSheetOpen(!open);
  };

  const handleSelect = (id: string) => {
    const color = colors.find((entry) => entry.id === id);
    if (
      !color ||
      !isCombinationAvailable(color) ||
      !pdpColorIsSelectable(color.availability)
    ) {
      return;
    }

    onSelect(id);
  };

  const coachColor = splitCoachColorName(selected.name);

  const hasShapeOverride = Boolean(heightClass) || squared;
  const pillClass = hasShapeOverride
    ? cn(
        frost ? pdpVariantPillFrostBaseClass : pdpVariantPillBaseClass,
        heightClass ?? "h-12",
        squared ? "rounded-none" : "rounded-full",
      )
    : frost
      ? pdpVariantPillFrostClass
      : pdpVariantPillClass;

  return (
    <div className={cn("relative", stretch ? "min-w-0 w-full flex-1" : "shrink-0")}>
      {useV3Sheet ? (
        <PdpV3ColorSheet open={open} onClose={() => setSheetOpen(false)} />
      ) : (
        <PdpColorSheet
          colors={colors}
          selectedId={selectedId}
          open={open}
          onClose={() => setSheetOpen(false)}
          onSelect={handleSelect}
          groups={colorGroups}
          currentSize={isTabbyProduct ? tabby!.size : undefined}
          onSelectAtSize={
            isTabbyProduct
              ? (colorId, size) => tabby!.selectColorAtSize(colorId, size)
              : undefined
          }
        />
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Color: ${coachColor.full}, ${pdpColorAvailabilityLabel(selected.availability)}. Choose another color.`}
        onClick={(event) => {
          event.stopPropagation();
          toggleSheet();
        }}
        className={cn(
          pillClass,
          "transition-[background-color,box-shadow] duration-300 ease-out",
          !frost && "border border-neutral-200",
          stretch && "w-full max-w-none",
          elevated && FLOATING_PILL_SHADOW,
        )}
      >
        <ColorSwatchCircle
          fill={selected.chromeSample ?? "#d4d4d4"}
          sizeClass="size-7"
        />
        <span
          className={cn(
            "flex min-w-0 flex-1 leading-none",
            hideLabel ? "items-center" : "flex-col items-start gap-0.5",
          )}
        >
          {!hideLabel ? (
            <span
              className={cn(
                "truncate text-[11px] leading-none tracking-[0.2px]",
                frost ? "text-white/55" : "text-neutral-400",
              )}
            >
              Color
            </span>
          ) : null}
          <span
            className="max-w-full truncate text-[14px] leading-none"
            title={coachColor.full}
          >
            {coachColor.shade}
          </span>
        </span>
        <PdpIconSwap
          active={open}
          activeIcon={
            <MaterialIcon
              name="expand_less"
              size={18}
              className={cn("shrink-0", frost ? "text-white/70" : "text-neutral-600")}
            />
          }
          inactiveIcon={
            <MaterialIcon
              name="expand_more"
              size={18}
              className={cn("shrink-0", frost ? "text-white/70" : "text-neutral-600")}
            />
          }
        />
      </button>
    </div>
  );
}

export function PdpColorSelector({
  colors,
  selectedId,
  onSelect,
  variant = "default",
  compact = false,
  inline = false,
  onOpenChange,
  stretch = false,
  frost = false,
  heightClass,
  squared = false,
  elevated = false,
  hideLabel = false,
  exposeAllSwatches = false,
}: PdpColorSelectorProps) {
  const selected = colors.find((color) => color.id === selectedId) ?? colors[0];
  const isOverlay = variant === "overlay";

  if (inline && exposeAllSwatches) {
    return (
      <PdpInlineColorSwatchCarousel
        colors={colors}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    );
  }

  if (inline) {
    return (
      <PdpColorDropup
        colors={colors}
        selectedId={selectedId}
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        stretch={stretch}
        frost={frost}
        heightClass={heightClass}
        squared={squared}
        elevated={elevated}
        hideLabel={hideLabel}
      />
    );
  }

  return (
    <div
      className={`flex flex-col ${
        compact || isOverlay ? "items-start gap-2" : "items-center gap-2.5 py-2.5"
      }`}
    >
      <div
        className={`relative flex items-center ${
          compact || isOverlay ? "gap-2" : "justify-center gap-[30px]"
        }`}
      >
        {!isOverlay && !compact && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-1 left-0 w-12 bg-gradient-to-r from-[#0e0d0c] to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-1 right-0 w-12 bg-gradient-to-l from-[#0e0d0c] to-transparent"
            />
          </>
        )}

        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          const isSelectable =
            isCombinationAvailable(color) &&
            pdpColorIsSelectable(color.availability);

          return (
            <button
              key={color.id}
              type="button"
              aria-label={
                isSelectable
                  ? `Select ${color.name}`
                  : `${color.name}, out of stock`
              }
              aria-pressed={isSelectable ? isSelected : undefined}
              aria-disabled={!isSelectable}
              disabled={!isSelectable}
              onClick={() => isSelectable && onSelect(color.id)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-full bg-white transition-[width,height,opacity,box-shadow] duration-200 ease-out",
                isSelectable && pdpPressableIconClass,
                !isSelectable && "cursor-not-allowed",
                compact
                  ? isSelected
                    ? "size-9 ring-2 ring-white/80 ring-offset-1 ring-offset-transparent opacity-100"
                    : cn("size-7", isSelectable ? "opacity-50" : "opacity-30")
                  : isSelected
                    ? "size-[70px] border border-white/20 opacity-100"
                    : cn("size-14", isSelectable ? "opacity-40" : "opacity-30"),
              )}
            >
              <ColorSwatchImage
                src={color.swatch}
                sizes={compact ? "36px" : "70px"}
              />
              {!isSelectable ? (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-black/35"
                >
                  <MaterialIcon
                    name="mail"
                    size={18}
                    className="text-white"
                  />
                </span>
              ) : null}
            </button>
          );
        })}

        {compact && (
          <p className="font-extended pl-1 text-[10px] tracking-[0.2px] text-white/90">
            {selected.name}
          </p>
        )}
      </div>

      {!compact && (
        <p className="font-extended text-center text-[10px] tracking-[0.2px] text-white">
          {selected.name}
        </p>
      )}
    </div>
  );
}
