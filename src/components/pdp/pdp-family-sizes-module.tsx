// fallow-ignore-file unused-file
"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  PDP_FAMILY_SIZES,
  type PdpFamilySizeOption,
} from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpType, pdpPressableClass } from "./pdp-type";

// fallow-ignore-next-line complexity
function FamilySizeTile({
  option,
  selected,
}: {
  option: PdpFamilySizeOption;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      disabled={selected}
      aria-current={selected ? "true" : undefined}
      aria-label={
        selected
          ? `${option.label}, current size`
          : `View Tabby ${option.label}`
      }
      className={cn(
        "flex min-w-0 flex-col items-center gap-1.5 text-center",
        !selected && pdpPressableClass,
        selected && "cursor-default",
      )}
    >
      <span
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden bg-neutral-100",
          selected
            ? "ring-2 ring-black ring-offset-2"
            : "opacity-70 transition-opacity active:opacity-100",
        )}
      >
        <Image
          src={option.imageSrc}
          alt=""
          aria-hidden
          fill
          className="object-cover object-center"
          sizes="22vw"
        />
      </span>
      <span
        className={cn(
          pdpType.micro,
          selected ? "font-medium text-black" : "text-neutral-600",
        )}
      >
        {option.label}
      </span>
    </button>
  );
}

/** Compact Tabby family size row — orients shoppers before compare */
export function PdpFamilySizesBlock() {
  const { title, viewingLabel, selectedId, options } = PDP_FAMILY_SIZES;

  return (
    <PdpRevealItem className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <PdpModuleHeading spacing="none">{title}</PdpModuleHeading>
        <p className={cn("m-0 text-neutral-600", pdpType.label)}>
          {viewingLabel}
        </p>
      </div>

      <div
        className="grid grid-cols-4 gap-2"
        role="list"
        aria-label="Tabby family sizes"
      >
        {options.map((option) => (
          <div key={option.id} role="listitem" className="min-w-0">
            <FamilySizeTile
              option={option}
              selected={option.id === selectedId}
            />
          </div>
        ))}
      </div>
    </PdpRevealItem>
  );
}
