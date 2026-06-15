"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpFamilyCompareAlternative } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

type PdpComparePickerSheetProps = {
  open: boolean;
  alternatives: PdpFamilyCompareAlternative[];
  selectedIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
};

/** Bottom sheet — pick which Tabby family bag to compare against */
export function PdpComparePickerSheet({
  open,
  alternatives,
  selectedIndex,
  onClose,
  onSelect,
}: PdpComparePickerSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const handleSelect = (index: number) => {
    onSelect(index);
    onClose();
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close compare picker"
        className="absolute inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "font-extended relative flex max-h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-6 h-[3px] w-[50px] rounded-full bg-black/70" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full text-neutral-900"
          >
            <MaterialIcon name="close" size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            Compare with
          </h2>
          <p className={`mb-4 text-neutral-600 ${pdpType.caption}`}>
            Choose another Tabby to see key differences.
          </p>

          <ul className="m-0 flex list-none flex-col gap-2">
            {alternatives.map((item, index) => {
              const selected = selectedIndex === index;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(index)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-center gap-3 border p-3 text-left transition-colors",
                      selected
                        ? "border-black bg-neutral-50"
                        : "border-neutral-200 bg-white active:bg-neutral-50",
                    )}
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden bg-neutral-100">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`font-extended text-black ${pdpType.body}`}>
                        {item.name}
                      </p>
                      <p className={`mt-0.5 font-extended text-black ${pdpType.label}`}>
                        {item.price}
                      </p>
                    </div>

                    {selected ? (
                      <MaterialIcon
                        name="check"
                        size={20}
                        className="shrink-0 text-black"
                        aria-hidden
                      />
                    ) : (
                      <MaterialIcon
                        name="swap_horiz"
                        size={20}
                        className="shrink-0 text-neutral-400"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
