"use client";

import Image from "next/image";
import { useId } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpFamilyCompareAlternative } from "./pdp-data";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";
import { useOverlayDismiss } from "./use-overlay-dismiss";

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
  const mounted = useOverlayDismiss(open, onClose);

  const handleSelect = (index: number) => {
    onSelect(index);
    onClose();
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close compare picker"
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

        <div
          data-pdp-sheet-scroll
          className={pdpBottomSheetScrollRegionClass(
            "px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]",
          )}
        >
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-4")}>
            Compare with
          </h2>

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
                      <p className={`mt-0.5 font-extended text-black tabular-nums ${pdpType.label}`}>
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
