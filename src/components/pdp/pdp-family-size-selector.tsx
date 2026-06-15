"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpFamilySizeOption } from "./pdp-data";

type PdpFamilySizeSelectorProps = {
  options: PdpFamilySizeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  inline?: boolean;
  flush?: boolean;
  compactPill?: boolean;
  /** Thumbnail + chevron only — saves space in stacked bottom bar */
  iconOnly?: boolean;
};

function FamilySizeThumb({
  option,
  sizeClass,
}: {
  option: PdpFamilySizeOption;
  sizeClass: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-md bg-white",
        sizeClass,
      )}
    >
      <Image
        src={option.imageSrc}
        alt=""
        fill
        className="object-cover object-center"
        sizes="32px"
      />
    </span>
  );
}

/** Drop-up family size picker — pairs with color in the bottom bar */
export function PdpFamilySizeSelector({
  options,
  selectedId,
  onSelect,
  inline = false,
  flush = false,
  compactPill = false,
  iconOnly = false,
}: PdpFamilySizeSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === selectedId) ?? options[0];
  const compact = compactPill && inline && !flush;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  if (!inline) {
    return null;
  }

  return (
    <div ref={rootRef} className={cn("relative min-w-0", flush ? "w-full" : "flex-1")}>
      {open && (
        <ul
          role="listbox"
          aria-label="Select size"
          className="absolute inset-x-0 bottom-[calc(100%+0.375rem)] max-h-[min(50vh,16rem)] overflow-y-auto overscroll-y-contain rounded-2xl pdp-glass-dark py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option) => {
            const isSelected = option.id === selectedId;

            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "font-extended flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs tracking-[0.2px] text-white transition-colors",
                    isSelected ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <FamilySizeThumb option={option} sizeClass="size-8" />
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected ? (
                    <MaterialIcon
                      name="check"
                      size={18}
                      className="shrink-0 text-white"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Size: ${selected.label}. Choose another size.`}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "font-extended flex w-full items-center overflow-hidden tracking-[0.2px] transition-[border-radius] duration-300",
          compact ? "h-12 text-[11px]" : "h-[54px] text-xs",
          flush
            ? "pdp-glass-dark pdp-glass--flat justify-center gap-2 rounded-none px-3"
            : cn(
                "pdp-glass-dark pdp-glass--flat rounded-full px-3",
                iconOnly ? "justify-center gap-1.5" : "justify-between",
                compact ? "gap-2" : "gap-2.5",
              ),
        )}
      >
        <span className={cn("flex min-w-0 items-center", iconOnly ? "gap-0" : "gap-2")}>
          <FamilySizeThumb
            option={selected}
            sizeClass={compact ? "size-7" : "size-8"}
          />
          {!iconOnly ? (
            <span className="truncate">{selected.label}</span>
          ) : null}
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          size={compact ? 18 : 20}
          className="shrink-0 text-white"
        />
      </button>
    </div>
  );
}
