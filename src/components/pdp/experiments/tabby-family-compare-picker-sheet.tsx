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
} from "../pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "../pdp-module-section";
import { PdpTabbySizeOption } from "../pdp-tabby-size-option";
import { PdpTabbyStyleOption } from "../pdp-tabby-style-option";
import {
  getAvailableSizesForStyle,
  getSizeAvailabilityForStyle,
} from "../pdp-tabby-catalog";
import {
  getTabbySizeOption,
  getTabbyStyle,
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";
import { pdpType } from "../pdp-type";
import {
  TABBY_COMPARE_STYLE_IDS,
  type TabbyCompareProduct,
} from "./tabby-family-compare-data";

type TabbyFamilyComparePickerSheetProps = {
  open: boolean;
  currentStyleId: TabbyStyleId;
  comparison: TabbyCompareProduct;
  onClose: () => void;
  onSelect: (styleId: TabbyStyleId, size: TabbySize) => void;
};

/** Experiment picker — style + size cards for family comparison targets */
export function TabbyFamilyComparePickerSheet({
  open,
  currentStyleId,
  comparison,
  onClose,
  onSelect,
}: TabbyFamilyComparePickerSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [pendingStyleId, setPendingStyleId] = useState<TabbyStyleId | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setPendingStyleId(null);
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
        if (pendingStyleId) {
          setPendingStyleId(null);
          return;
        }

        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, pendingStyleId]);

  const handleStyleSelect = (styleId: TabbyStyleId) => {
    const sizes = getAvailableSizesForStyle(styleId);

    if (sizes.length === 0) {
      return;
    }

    if (sizes.length === 1) {
      onSelect(styleId, sizes[0]!);
      onClose();
      return;
    }

    setPendingStyleId(styleId);
  };

  const handleSizeSelect = (size: TabbySize) => {
    if (!pendingStyleId) {
      return;
    }

    onSelect(pendingStyleId, size);
    onClose();
  };

  if (!mounted) {
    return null;
  }

  const pendingStyle = pendingStyleId ? getTabbyStyle(pendingStyleId) : null;
  const pendingSizeOptions = pendingStyleId
    ? getSizeAvailabilityForStyle(pendingStyleId).map(({ size, available }) => ({
        option: getTabbySizeOption(size),
        available,
      }))
    : [];

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          {pendingStyle ? (
            <>
              <button
                type="button"
                onClick={() => setPendingStyleId(null)}
                className={cn(
                  "mb-3 inline-flex items-center gap-1 text-neutral-600 transition-colors active:text-black",
                  pdpType.micro,
                )}
              >
                <MaterialIcon name="arrow_back" size={18} aria-hidden />
                All styles
              </button>

              <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
                Choose a size
              </h2>
              <p className={cn("mb-4 text-neutral-500", pdpType.micro)}>
                Compare {pendingStyle.label} at the size that fits your carry.
              </p>

              <ul
                role="listbox"
                aria-label={`${pendingStyle.label} sizes`}
                className="m-0 grid list-none grid-cols-2 items-stretch gap-2"
              >
                {pendingSizeOptions.map(({ option, available }) => (
                  <li key={option.size} role="presentation" className="h-full">
                    <PdpTabbySizeOption
                      option={option}
                      selected={
                        comparison.size === option.size &&
                        comparison.styleId === pendingStyleId
                      }
                      disabled={!available}
                      showDimensions={false}
                      imageSizes="120px"
                      onSelect={handleSizeSelect}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
                Compare another style
              </h2>
              <p className={cn("mb-4 text-neutral-500", pdpType.micro)}>
                Explore silhouettes side by side — your current bag stays selected.
              </p>

              <ul
                role="listbox"
                aria-label="Tabby styles"
                className="m-0 grid list-none grid-cols-2 items-stretch gap-2"
              >
                {TABBY_COMPARE_STYLE_IDS.map((styleId) => {
                  const style = getTabbyStyle(styleId);
                  const availableSizes = getAvailableSizesForStyle(styleId);
                  const selected = comparison.styleId === styleId;

                  return (
                    <li key={styleId} role="presentation" className="h-full">
                      <PdpTabbyStyleOption
                        style={style}
                        selected={selected}
                        availableSizes={availableSizes}
                        showAvailableSizes
                        disabled={availableSizes.length === 0}
                        imageAspect="4/3"
                        imageSizes="160px"
                        onSelect={handleStyleSelect}
                      />
                      {styleId === currentStyleId ? (
                        <p className={cn("mt-1 px-1 text-neutral-500", pdpType.micro)}>
                          Your current style
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
