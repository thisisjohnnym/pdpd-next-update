"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import { PdpColorSheet } from "./pdp-color-sheet";
import { getColorChromeForeground } from "./pdp-color-chrome";
import { ColorSwatchCircle, ColorSwatchImage } from "./pdp-color-swatch";
import { pdpPressableIconClass, pdpVariantPillClass } from "./pdp-type";

type PdpColorSelectorProps = {
  colors: PdpColor[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Overlay on hero image vs standalone on black */
  variant?: "default" | "overlay";
  /** Compact swatches for gallery HUD — left-aligned, smaller */
  compact?: boolean;
  /** Drop-up picker inside bottom bar pill */
  inline?: boolean;
  /** Flush docked bar — square join with ATB at hero rest */
  flush?: boolean;
  /** Slightly smaller floating bottom-bar pill */
  compactPill?: boolean;
  /** Thumbnail + chevron only — saves space in stacked bottom bar */
  iconOnly?: boolean;
  /** Fires when the inline color tray opens or closes */
  onOpenChange?: (open: boolean) => void;
};

function PdpColorDropup({
  colors,
  selectedId,
  onSelect,
  flush = false,
  compact = false,
  iconOnly = false,
  onOpenChange,
}: Pick<
  PdpColorSelectorProps,
  | "colors"
  | "selectedId"
  | "onSelect"
  | "flush"
  | "compact"
  | "iconOnly"
  | "onOpenChange"
>) {
  const [open, setOpen] = useState(false);
  const selected =
    colors.find((color) => color.id === selectedId) ?? colors[0];

  const setSheetOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const chromeForeground = getColorChromeForeground(selected.chromeSample);
  const useWhitePill = compact && !flush;

  return (
    <div className="relative min-w-0 w-full">
      <PdpColorSheet
        colors={colors}
        selectedId={selectedId}
        open={open}
        onClose={() => setSheetOpen(false)}
        onSelect={onSelect}
      />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Color: ${selected.name}. Choose another color.`}
        onClick={() => setSheetOpen(!open)}
        className={cn(
          useWhitePill
            ? pdpVariantPillClass
            : cn(
                "font-extended flex w-full items-center overflow-hidden tracking-[0.2px] transition-[border-radius,background-color,color] duration-300 pdp-pressable",
                compact ? "h-12 text-[12px]" : "h-[54px] text-xs",
                flush
                  ? "justify-center gap-2 rounded-none px-3"
                  : cn(
                      "rounded-full px-2.5",
                      iconOnly
                        ? "justify-center gap-1.5"
                        : compact
                          ? "justify-center gap-1.5"
                          : "justify-between gap-2.5",
                      compact ? "gap-2" : "gap-2.5",
                    ),
              ),
        )}
        style={
          useWhitePill
            ? undefined
            : {
                backgroundColor: selected.chromeSample,
                color: chromeForeground,
              }
        }
      >
        {useWhitePill ? (
          <>
            <ColorSwatchCircle src={selected.swatch} sizeClass="size-7" sizes="32px" />
            <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
              <span className="max-w-full truncate translate-y-px" title={selected.name}>
                {selected.name}
              </span>
              <span className="truncate text-[10px] tracking-[0.2px] text-neutral-500">
                Color
              </span>
            </span>
            <MaterialIcon
              name={open ? "expand_less" : "expand_more"}
              size={18}
              className="shrink-0 text-neutral-600"
            />
          </>
        ) : (
          <>
            <span className={cn("flex min-w-0 items-center", iconOnly ? "gap-0" : "gap-2")}>
              <ColorSwatchCircle src={selected.swatch} sizeClass={compact ? "size-7" : "size-8"} sizes="32px" />
              {!iconOnly ? (
                <span className="truncate translate-y-px">{selected.name}</span>
              ) : null}
            </span>
            <MaterialIcon
              name={open ? "expand_less" : "expand_more"}
              size={compact ? 18 : 20}
              className="shrink-0"
              style={{ color: chromeForeground }}
            />
          </>
        )}
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
  flush = false,
  compactPill = false,
  iconOnly = false,
  onOpenChange,
}: PdpColorSelectorProps) {
  const selected = colors.find((color) => color.id === selectedId) ?? colors[0];
  const isOverlay = variant === "overlay";
  const dropupCompact = compactPill && inline && !flush;

  if (inline) {
    return (
      <PdpColorDropup
        colors={colors}
        selectedId={selectedId}
        onSelect={onSelect}
        flush={flush}
        compact={dropupCompact}
        iconOnly={iconOnly}
        onOpenChange={onOpenChange}
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

          return (
            <button
              key={color.id}
              type="button"
              aria-label={`Select ${color.name}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(color.id)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-full bg-white transition-all",
                pdpPressableIconClass,
                compact
                  ? isSelected
                    ? "size-9 ring-2 ring-white/80 ring-offset-1 ring-offset-transparent opacity-100"
                    : "size-7 opacity-50"
                  : isSelected
                    ? "size-[70px] border border-white/20 opacity-100"
                    : "size-14 opacity-40",
              )}
            >
              <ColorSwatchImage
                src={color.swatch}
                sizes={compact ? "36px" : "70px"}
              />
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
