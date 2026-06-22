"use client";

import NextImage from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { TabbyStyle, TabbyStyleId, TabbySize } from "./pdp-tabby-variants";
import { formatTabbyCompareAvailableSizes } from "./experiments/tabby-family-compare-data";
import { pdpPressableClass, pdpType } from "./pdp-type";

type PdpTabbyStyleOptionProps = {
  style: TabbyStyle;
  selected: boolean;
  imageAspect?: "4/5" | "4/3";
  imageSizes?: string;
  showMaterial?: boolean;
  availableSizes?: TabbySize[];
  showAvailableSizes?: boolean;
  disabled?: boolean;
  onSelect: (id: TabbyStyleId) => void;
};

/** Visual style card — used in the style sheet and on-page variant module */
export function PdpTabbyStyleOption({
  style,
  selected,
  imageAspect = "4/5",
  imageSizes = "(max-width: 430px) 45vw, 200px",
  showMaterial = true,
  availableSizes,
  showAvailableSizes = false,
  disabled = false,
  onSelect,
}: PdpTabbyStyleOptionProps) {
  const sizesLabel =
    showAvailableSizes && availableSizes
      ? formatTabbyCompareAvailableSizes(availableSizes)
      : null;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={() => onSelect(style.id)}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition-colors",
        selected
          ? "border-black bg-neutral-50"
          : "border-neutral-200 bg-white active:bg-neutral-50",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && pdpPressableClass,
      )}
    >
      <span
        className={cn(
          "relative w-full shrink-0 bg-neutral-100",
          imageAspect === "4/5" ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
      >
        <NextImage
          src={style.thumbnail}
          alt=""
          fill
          className="object-cover object-center"
          sizes={imageSizes}
        />
        {selected ? (
          <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black text-white">
            <MaterialIcon name="check" size={18} aria-hidden />
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "flex flex-1 flex-col gap-0.5",
          showMaterial ? "min-h-[3.5rem] px-2.5 py-2" : "px-2 py-1.5",
        )}
      >
        <span className={cn("text-black", showMaterial ? pdpType.label : pdpType.micro)}>
          {style.label}
        </span>
        {showMaterial ? (
          <span className={cn("text-neutral-500", pdpType.micro)}>
            {style.description}
          </span>
        ) : null}
        {sizesLabel ? (
          <span className={cn("text-neutral-500", pdpType.micro)}>{sizesLabel}</span>
        ) : null}
      </span>
    </button>
  );
}
