"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpStrapOptionsSet } from "./pdp-data";
import { pdpType, pdpPressableClass } from "./pdp-type";

type PdpGalleryStrapCardProps = {
  set: PdpStrapOptionsSet;
  onOpen: () => void;
};

/** Tucked strap tab — peeks from the edge, expands in place, then opens the shop sheet */
export function PdpGalleryStrapCard({ set, onOpen }: PdpGalleryStrapCardProps) {
  const [expanded, setExpanded] = useState(false);
  const previews = set.options.slice(0, 3);
  const lowestPrice = set.options[set.options.length - 1]?.price;

  return (
    <div
      className={cn(
        "absolute bottom-4 z-10 transition-[right,transform] duration-300 ease-out",
        expanded ? "right-4 translate-x-0" : "right-0 translate-x-[38%]",
      )}
    >
      {expanded ? (
        <div className="relative">
          <button
            type="button"
            aria-label="Tuck away strap options"
            onClick={() => setExpanded(false)}
            className="absolute -left-2 -top-2 z-10 flex size-6 items-center justify-center rounded-full border border-white/60 bg-white/90 text-neutral-600 shadow-sm backdrop-blur-md pdp-pressable"
          >
            <MaterialIcon name="close" size={18} />
          </button>

          <button
            type="button"
            onClick={onOpen}
            className={cn(
              "flex max-w-[min(calc(100vw-2rem),13.5rem)] items-center gap-2.5 rounded-2xl border border-white/50 bg-white/55 py-2 pl-2 pr-2 text-left text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-colors active:bg-white/70",
              pdpType.label,
              pdpPressableClass,
            )}
            aria-label={`${set.title}, ${set.options.length} options. Shop and add to bag.`}
            aria-expanded
          >
            <StrapPreviews previews={previews} size="md" />

            <span className="min-w-0 flex-1">
              <span className="font-extended block text-xs leading-tight tracking-[0.2px] text-neutral-900">
                {set.title}
              </span>
              <span className="mt-0.5 block font-extended text-[10px] leading-tight tracking-[0.2px] text-neutral-600">
                {set.options.length} to shop · from {lowestPrice}
              </span>
            </span>

            <MaterialIcon name="chevron_right" size={18} className="shrink-0 text-neutral-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={cn(
            "flex items-center gap-1 rounded-l-2xl border border-r-0 border-white/45 bg-white/50 py-1.5 pl-2 pr-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-150 transition-colors active:bg-white/65",
            pdpType.label,
            pdpPressableClass,
          )}
          aria-label={`${set.title}, ${set.options.length} strap options. Tap to expand.`}
          aria-expanded={false}
        >
          <StrapPreviews previews={previews} size="sm" />
          <MaterialIcon
            name="chevron_left"
            size={18}
            className="shrink-0 text-neutral-500/90"
          />
        </button>
      )}
    </div>
  );
}

function StrapPreviews({
  previews,
  size,
}: {
  previews: PdpStrapOptionsSet["options"];
  size: "sm" | "md";
}) {
  const dimension = size === "sm" ? "size-7" : "size-9";
  const overlap = size === "sm" ? -8 : -10;

  return (
    <span className="flex shrink-0 items-center pl-0.5">
      {previews.map((option, index) => (
        <span
          key={option.id}
          className={cn(
            "relative overflow-hidden rounded-full border-2 border-white bg-neutral-100 shadow-sm",
            dimension,
          )}
          style={{
            zIndex: previews.length - index,
            marginLeft: index === 0 ? 0 : overlap,
          }}
        >
          <Image
            src={option.imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes={size === "sm" ? "28px" : "36px"}
          />
        </span>
      ))}
    </span>
  );
}
