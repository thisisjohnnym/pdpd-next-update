"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpStrapOptionsSet } from "./pdp-data";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "./pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpAddIconLabelClass, pdpType } from "./pdp-type";

type PdpStrapOptionsSheetProps = {
  set: PdpStrapOptionsSet | null;
  open: boolean;
  onClose: () => void;
  onAddToBag: () => void;
};

/** Bottom sheet — purchasable strap options with quick add */
export function PdpStrapOptionsSheet({
  set,
  open,
  onClose,
  onAddToBag,
}: PdpStrapOptionsSheetProps) {
  const titleId = useId();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setAddedIds(new Set());
    }
  }, [open]);

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

  if (!set || !mounted) {
    return null;
  }

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag();
      return new Set(current).add(id);
    });
  };

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close strap options"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open })}
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            {set.title}
          </h2>
          <p className={`mb-4 text-neutral-600 ${pdpType.caption}`}>
            Mix straps for shoulder, crossbody, or extended carry.
          </p>

          <ul className="flex flex-col gap-3">
            {set.options.map((option) => {
              const added = addedIds.has(option.id);

              return (
                <li
                  key={option.id}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={option.imageSrc}
                      alt={option.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`font-extended text-black ${pdpType.body}`}>
                      {option.name}
                    </p>
                    <p className={`mt-0.5 text-neutral-600 ${pdpType.label}`}>
                      {option.subtitle}
                    </p>
                    <p className={`mt-1 font-extended text-black ${pdpType.label}`}>
                      {option.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(option.id)}
                    disabled={added}
                    className={cn(
                      "font-extended inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-3.5 py-2.5 leading-none tracking-[0.2px] transition-colors",
                      pdpType.label,
                      added
                        ? "bg-neutral-200 text-neutral-500"
                        : "bg-black text-white",
                    )}
                  >
                    <span className={pdpAddIconLabelClass}>{added ? "Added" : "Add"}</span>
                    <MaterialIcon
                      name="add"
                      size={18}
                      className={cn("shrink-0", added ? "invisible" : "text-white")}
                      aria-hidden={added}
                    />
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
