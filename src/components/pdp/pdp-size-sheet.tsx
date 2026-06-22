"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { PdpTabbySizeOption } from "./pdp-tabby-size-option";
import type { TabbySizeOptionAvailability } from "./pdp-tabby-variant-context";
import type { TabbySize } from "./pdp-tabby-variants";
import { pdpType } from "./pdp-type";

type PdpSizeSheetProps = {
  selectedSize: TabbySize;
  sizeOptions: TabbySizeOptionAvailability[];
  open: boolean;
  onClose: () => void;
  onSelect: (size: TabbySize) => void;
};

/** Bottom tray — choose a Tabby size (experiment buy bar) */
export function PdpSizeSheet({
  selectedSize,
  sizeOptions,
  open,
  onClose,
  onSelect,
}: PdpSizeSheetProps) {
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

  if (!mounted) {
    return null;
  }

  const handleSelect = (size: TabbySize) => {
    onSelect(size);
    onClose();
  };

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close size picker"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open, maxHeight: "88dvh" })}
      >
        <div className={pdpBottomSheetHeaderClass}>
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={pdpBottomSheetCloseButtonClass}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(20px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            Select a size
          </h2>
          <p className={cn("mb-4 text-neutral-500", pdpType.micro)}>
            Most shoppers choose 26 for everyday carry.
          </p>

          <ul
            role="listbox"
            aria-label="Tabby sizes"
            className="m-0 grid list-none grid-cols-2 items-stretch gap-2"
          >
            {sizeOptions.map(({ option, available }) => (
              <li key={option.size} role="presentation" className="h-full">
                <PdpTabbySizeOption
                  option={option}
                  selected={option.size === selectedSize}
                  disabled={!available}
                  imageSizes="120px"
                  onSelect={handleSelect}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
