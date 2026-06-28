"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpStrapOptionsSet } from "./pdp-data";
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
import { pdpAddIconLabelClass, pdpType } from "./pdp-type";
import { useMountTransition } from "./use-mount-transition";
import { useOverlayDismiss } from "./use-overlay-dismiss";
import { useTransientAddedSet } from "./use-transient-added-set";

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
  const { isAdded, confirmAdd } = useTransientAddedSet();
  const overlayReady = useOverlayDismiss(open, onClose);
  const transition = useMountTransition(open, 300);
  const lastSetRef = useRef(set);
  if (set) {
    lastSetRef.current = set;
  }
  const displaySet = set ?? lastSetRef.current;

  if (!overlayReady || !transition.mounted || !displaySet) {
    return null;
  }

  const handleAdd = (id: string) => {
    onAddToBag();
    confirmAdd(id);
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            {displaySet.title}
          </h2>
          <p className={`mb-4 text-neutral-600 ${pdpType.caption}`}>
            Mix straps for shoulder, crossbody, or extended carry.
          </p>

          <ul className="flex flex-col gap-3">
            {displaySet.options.map((option) => {
              const added = isAdded(option.id);

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
                    <p className={`mt-1 font-extended text-black tabular-nums ${pdpType.label}`}>
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
                    {!added ? (
                      <MaterialIcon
                        name="add"
                        size={18}
                        className="shrink-0 text-white"
                        aria-hidden
                      />
                    ) : null}
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
