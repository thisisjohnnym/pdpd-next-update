"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";

import type { PdpColor } from "./pdp-data";

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
};

/** Swatch assets are full product shots — anchor on bag hardware, shift up in circle */
function ColorSwatchImage({
  src,
  sizes,
}: {
  src: string;
  sizes: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover object-[50%_100%] origin-[50%_94%] scale-[4.5] -translate-y-[38%]"
      sizes={sizes}
    />
  );
}

function ColorSwatchButton({
  color,
  sizeClass,
}: {
  color: PdpColor;
  sizeClass: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-white ${sizeClass}`}
    >
      <ColorSwatchImage src={color.swatch} sizes="32px" />
    </span>
  );
}

function PdpColorDropup({
  colors,
  selectedId,
  onSelect,
}: Pick<PdpColorSelectorProps, "colors" | "selectedId" | "onSelect">) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    colors.find((color) => color.id === selectedId) ?? colors[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
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

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      {open && (
        <ul
          role="listbox"
          aria-label="Select color"
          className="absolute inset-x-0 bottom-[calc(100%+0.375rem)] max-h-[min(50vh,16rem)] overflow-y-auto overscroll-y-contain rounded-2xl border border-white/10 bg-[#353535] py-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {colors.map((color) => {
            const isSelected = color.id === selectedId;

            return (
              <li key={color.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(color.id)}
                  className={`font-extended flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs tracking-[0.2px] text-white transition-colors ${
                    isSelected ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <ColorSwatchButton
                    color={color}
                    sizeClass="size-8"
                  />
                  <span className="min-w-0 flex-1 truncate">{color.name}</span>
                  {isSelected && (
                    <MaterialIcon
                      name="check"
                      size={18}
                      className="shrink-0 text-white"
                    />
                  )}
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
        aria-label={`Color: ${selected.name}. Choose another color.`}
        onClick={() => setOpen((prev) => !prev)}
        className="font-extended flex h-[54px] w-full items-center gap-2.5 rounded-full border border-white/10 bg-[#353535] px-3 text-xs tracking-[0.2px] text-white"
      >
        <ColorSwatchButton
          color={selected}
          sizeClass="size-8 ring-2 ring-white/70 ring-offset-1 ring-offset-[#353535]"
        />
        <span className="min-w-0 flex-1 truncate text-left">
          {selected.name}
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          size={20}
          className="shrink-0 text-white/80"
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
}: PdpColorSelectorProps) {
  const selected = colors.find((color) => color.id === selectedId) ?? colors[0];
  const isOverlay = variant === "overlay";

  if (inline) {
    return (
      <PdpColorDropup
        colors={colors}
        selectedId={selectedId}
        onSelect={onSelect}
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
              className={`relative shrink-0 overflow-hidden rounded-full bg-white transition-all ${
                compact
                  ? isSelected
                    ? "size-9 ring-2 ring-white/80 ring-offset-1 ring-offset-transparent opacity-100"
                    : "size-7 opacity-50"
                  : isSelected
                    ? "size-[70px] border border-white/20 opacity-100"
                    : "size-14 opacity-40"
              }`}
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
