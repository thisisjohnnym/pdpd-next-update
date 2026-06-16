"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "./pdp-bottom-sheet";
import type { PdpShopTheLookLook } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";

type PdpShopTheLookSheetProps = {
  look: PdpShopTheLookLook | null;
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — outfit pieces from an on-model gallery photo */
export function PdpShopTheLookSheet({ look, open, onClose }: PdpShopTheLookSheetProps) {
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

  if (!look || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close shop the look"
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-4")}>
            {look.title}
          </h2>

          <ul className="flex flex-col">
            {look.items.map((item) => (
              <li key={item.id} className="border-t border-neutral-200 first:border-t-0">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-4"
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
                    <p className="font-extended truncate text-xs tracking-[0.2px] text-black">
                      {item.name}
                    </p>
                    <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
                      {item.price}
                    </p>
                  </div>

                  <MaterialIcon
                    name="arrow_outward"
                    size={20}
                    className="shrink-0 text-black"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
