"use client";

import NextImage from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { TabbySize, TabbySizeOption } from "./pdp-tabby-variants";
import { pdpPressableClass, pdpType } from "./pdp-type";

type PdpTabbySizeOptionProps = {
  option: TabbySizeOption;
  selected: boolean;
  disabled?: boolean;
  unavailableLabel?: string;
  showDimensions?: boolean;
  imageSizes?: string;
  onSelect: (size: TabbySize) => void;
};

/** Visual size card — Coach product shot with equal-height grid alignment */
export function PdpTabbySizeOption({
  option,
  selected,
  disabled = false,
  unavailableLabel = "Not available in this style",
  showDimensions = true,
  imageSizes = "(max-width: 430px) 40vw, 180px",
  onSelect,
}: PdpTabbySizeOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      aria-label={
        disabled
          ? `Size ${option.size}, ${unavailableLabel}`
          : `Size ${option.size}, ${option.dimensions}, ${option.price}`
      }
      onClick={() => !disabled && onSelect(option.size)}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-50"
          : selected
            ? "border-black bg-neutral-50"
            : "border-neutral-200 bg-white active:bg-neutral-50",
        !disabled && pdpPressableClass,
      )}
    >
      <span className="relative aspect-[4/5] w-full shrink-0 bg-neutral-100">
        <NextImage
          src={option.image}
          alt={option.imageAlt}
          fill
          className={cn(
            "object-contain object-bottom p-2",
            disabled && "opacity-60 grayscale",
          )}
          sizes={imageSizes}
        />
        <span
          aria-hidden
          className={cn(
            "absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black text-white transition-[opacity,scale] duration-200 ease-out",
            selected && !disabled ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <MaterialIcon name="check" size={18} aria-hidden />
        </span>
      </span>
      <span
        className={cn(
          "flex flex-1 flex-col gap-0.5",
          showDimensions ? "min-h-[4.5rem] px-2.5 py-2" : "px-2 py-1.5",
        )}
      >
        <span className={cn("text-black", showDimensions ? pdpType.label : pdpType.micro)}>
          {option.size}
        </span>
        {showDimensions ? (
          <span className={cn("text-neutral-500", pdpType.micro)}>{option.dimensions}</span>
        ) : null}
        {disabled ? (
          <span className={cn("text-neutral-400", pdpType.micro)}>{unavailableLabel}</span>
        ) : (
          <span className={cn("text-neutral-900", pdpType.micro)}>{option.price}</span>
        )}
      </span>
    </button>
  );
}
