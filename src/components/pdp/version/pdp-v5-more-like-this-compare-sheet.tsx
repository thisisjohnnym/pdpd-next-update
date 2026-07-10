"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
  pdpBottomSheetBackdropClass,
  pdpBottomSheetBodyClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
} from "../pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "../pdp-module-section";
import { pdpType } from "../pdp-type";
import { useMountTransition } from "../use-mount-transition";
import { useOverlayDismiss } from "../use-overlay-dismiss";

import {
  buildMoreLikeThisCompareRows,
  PDP_MORE_LIKE_THIS_COMPARE_CURRENT,
  type PdpMoreLikeThisCompareProduct,
} from "./pdp-data-v2";

type PdpV5MoreLikeThisCompareSheetProps = {
  comparison: PdpMoreLikeThisCompareProduct | null;
  open: boolean;
  onClose: () => void;
};

/** Product thumb + name + price — one column header in the compare tray. */
function CompareColumnHeader({
  product,
}: {
  product: PdpMoreLikeThisCompareProduct;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-2 text-left">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-cover object-center"
          sizes="45vw"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className={cn(pdpType.productNameCompact, "m-0 line-clamp-2 text-black")}>
          {product.name}
        </p>
        <p className={cn(pdpType.label, "m-0 tabular-nums text-neutral-500")}>
          {product.price}
        </p>
      </div>
    </div>
  );
}

/**
 * Bottom tray — side-by-side compare of the current PDP bag vs a More like this
 * recommendation. Fact rows reuse the Details sheet label/value pattern.
 */
export function PdpV5MoreLikeThisCompareSheet({
  comparison,
  open,
  onClose,
}: PdpV5MoreLikeThisCompareSheetProps) {
  const titleId = useId();
  const overlayReady = useOverlayDismiss(open, onClose);
  const transition = useMountTransition(open, 300);
  const lastComparisonRef = useRef(comparison);
  if (comparison) {
    lastComparisonRef.current = comparison;
  }
  const displayComparison = comparison ?? lastComparisonRef.current;

  if (!overlayReady || !transition.mounted || !displayComparison) {
    return null;
  }

  const current = PDP_MORE_LIKE_THIS_COMPARE_CURRENT;
  const rows = buildMoreLikeThisCompareRows(current, displayComparison);

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close compare"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        id="pdp-v5-more-like-this-compare-sheet"
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

        <div className={pdpBottomSheetBodyClass}>
          <div
            data-pdp-sheet-scroll
            className={pdpBottomSheetScrollRegionClass(
              "px-4 pb-[max(24px,var(--pdp-safe-area-bottom))] pt-0.5",
            )}
          >
            <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-5")}>
              Compare
            </h2>

            <div className="mb-6 grid grid-cols-2 gap-x-5">
              <CompareColumnHeader product={current} />
              <CompareColumnHeader product={displayComparison} />
            </div>

            {/* Details-pattern fact rows — gray label over value; hairlines per column so the gutter stays open */}
            <div className="flex flex-col">
              {rows.map((row, rowIndex) => {
                const isLast = rowIndex === rows.length - 1;
                const cellRule = !isLast && "border-b border-neutral-200";
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-2 gap-x-5"
                  >
                    <div
                      className={cn(
                        "flex min-w-0 flex-col gap-2 py-5",
                        cellRule,
                      )}
                    >
                      <span className={cn(pdpType.label, "m-0 text-[#a1a1a1]")}>
                        {row.label}
                      </span>
                      <span
                        className={cn(
                          pdpType.body,
                          "m-0 text-pretty text-black",
                          row.tabular && "tabular-nums",
                        )}
                      >
                        {row.currentValue}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex min-w-0 flex-col gap-2 py-5",
                        cellRule,
                      )}
                    >
                      <span className={cn(pdpType.label, "m-0 text-[#a1a1a1]")}>
                        {row.label}
                      </span>
                      <span
                        className={cn(
                          pdpType.body,
                          "m-0 text-pretty text-black",
                          row.tabular && "tabular-nums",
                        )}
                      >
                        {row.comparisonValue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
