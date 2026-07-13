"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetBodyClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
} from "../pdp-bottom-sheet";
import { PDP_SHEET_PRESENCE_MS } from "../pdp-motion";
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
  onAddToBag?: (id: string) => void;
};

/** Product thumb + name + price + Add to bag — one column in the compare tray (Paper N1T-0). */
function CompareColumnProduct({
  product,
  onAddToBag,
}: {
  product: PdpMoreLikeThisCompareProduct;
  onAddToBag?: (id: string) => void;
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
      <p className={cn(pdpType.body, "m-0 line-clamp-2 text-black")}>
        {product.name}
      </p>
      <p className={cn(pdpType.label, "m-0 tabular-nums text-black")}>
        {product.price}
      </p>
      <button
        type="button"
        onClick={() => onAddToBag?.(product.id)}
        aria-label={`Add ${product.name} to bag`}
        className={cn(
          "box-border flex w-full items-center justify-center gap-1 overflow-hidden border border-[#D4D4D4] bg-white py-3.5 text-black transition-colors active:bg-neutral-50",
          "font-extended text-[11px] leading-none tracking-[0.2px] lg:text-[10px]",
        )}
      >
        <MaterialIcon name="shopping_bag" size={15} />
        <span className="translate-y-0.5">Add to bag</span>
      </button>
    </div>
  );
}

/**
 * Bottom tray — side-by-side compare of the current PDP bag vs a More like this
 * recommendation. Paper N1T-0 column pattern: This bag / Compared to labels,
 * product columns with Add to bag, then paired Details-pattern fact rows.
 */
// fallow-ignore-next-line complexity
export function PdpV5MoreLikeThisCompareSheet({
  comparison,
  open,
  onClose,
  onAddToBag,
}: PdpV5MoreLikeThisCompareSheetProps) {
  const titleId = useId();
  const overlayReady = useOverlayDismiss(open, onClose);
  const transition = useMountTransition(open, PDP_SHEET_PRESENCE_MS);
  const sheetOpen = transition.state === "open";
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
      className={pdpBottomSheetOverlayClass({ open: sheetOpen })}
      aria-hidden={!sheetOpen}
    >
      <button
        type="button"
        aria-label="Close compare"
        className={pdpBottomSheetBackdropClass({ open: sheetOpen })}
        onClick={onClose}
        tabIndex={sheetOpen ? 0 : -1}
      />

      <div
        id="pdp-v5-more-like-this-compare-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open: sheetOpen, maxHeight: "88dvh" })}
      >
        {/* Paper N1T-0 header — narrow grab, then title + inline close on one row */}
        <div className="shrink-0 px-4 pt-3">
          <div className="mx-auto mb-3.5 h-1 w-9 rounded-[2px] bg-neutral-300" />
          <div className="mb-4 flex items-center justify-between">
            <h2
              id={titleId}
              className="font-extended m-0 text-[15px] font-normal leading-5 tracking-tight text-black"
            >
              Compare
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-7 items-center justify-center text-black pdp-pressable"
            >
              <MaterialIcon name="close" size={18} />
            </button>
          </div>
        </div>

        <div className={pdpBottomSheetBodyClass}>
          <div
            data-pdp-sheet-scroll
            className={pdpBottomSheetScrollRegionClass(
              "px-4 pb-[max(28px,var(--pdp-safe-area-bottom))]",
            )}
          >
            {/* Column eyebrows */}
            <div className="grid grid-cols-2 gap-x-4 pb-1">
              <span className={cn(pdpType.micro, "text-black")}>This bag</span>
              <span className={cn(pdpType.micro, "text-black")}>
                Compared to
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-x-4">
              <CompareColumnProduct product={current} onAddToBag={onAddToBag} />
              <CompareColumnProduct
                product={displayComparison}
                onAddToBag={onAddToBag}
              />
            </div>

            {/* Details-pattern fact rows — gray label over medium value; hairlines per column so the gutter stays open */}
            <div className="flex flex-col">
              {rows.map((row, rowIndex) => {
                const isLast = rowIndex === rows.length - 1;
                const cellRule = !isLast && "border-b border-neutral-200";
                return (
                  <div key={row.id} className="grid grid-cols-2 gap-x-4">
                    {[row.currentValue, row.comparisonValue].map(
                      (value, columnIndex) => (
                        <div
                          key={columnIndex}
                          className={cn(
                            "flex min-w-0 flex-col gap-1 pb-5",
                            rowIndex > 0 && "pt-3",
                            cellRule,
                          )}
                        >
                          <span
                            className={cn(pdpType.label, "m-0 text-[#a1a1a1]")}
                          >
                            {row.label}
                          </span>
                          <span
                            className={cn(
                              pdpType.label,
                              "m-0 font-medium text-pretty text-[#171717]",
                              row.tabular && "tabular-nums",
                            )}
                          >
                            {value}
                          </span>
                        </div>
                      ),
                    )}
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
