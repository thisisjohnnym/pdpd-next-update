"use client";

import { useId } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
  pdpBottomSheetCloseButtonClass,
} from "./pdp-bottom-sheet";
import { useActiveProduct } from "./pdp-active-product-context";
import { pdpColorAvailabilityLabel, pdpColorIsSelectable } from "./pdp-data";
import { getPdpColors } from "./pdp-product-colors";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { pdpPressableIconClass, pdpType } from "./pdp-type";
import { useMountTransition } from "./use-mount-transition";
import { useOverlayDismiss } from "./use-overlay-dismiss";

const TRAY_TRANSITION_MS = 280;

type PdpHeroColorTrayProps = {
  open: boolean;
  onClose: () => void;
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  /** Absolute inside a gallery frame, or fixed to the viewport (desktop fallback). */
  position?: "absolute" | "fixed";
};

/**
 * Slim frosted color tray anchored to the bottom of the hero land —
 * grab handle, "Color: …" label, and a horizontal chrome-dot row.
 */
export function PdpHeroColorTray({
  open,
  onClose,
  selectedColorId,
  onColorSelect,
  position = "absolute",
}: PdpHeroColorTrayProps) {
  const titleId = useId();
  const tabby = useOptionalTabbyVariant();
  const { productId } = useActiveProduct();
  const mounted = useOverlayDismiss(open, onClose);
  const transition = useMountTransition(open, TRAY_TRANSITION_MS);

  if (!mounted || !transition.mounted) {
    return null;
  }

  const colors =
    productId === "tabby" && tabby ? tabby.colorOptions : getPdpColors(productId);
  const selected =
    colors.find((color) => color.id === selectedColorId) ?? colors[0];
  const labelName = selected?.name ?? "Color";
  const showCustomize = productId === "tabby";

  return (
    <div
      className={cn(
        "z-[42] flex flex-col justify-end",
        position === "fixed" ? "fixed inset-0" : "absolute inset-0",
        transition.state === "open" ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close color picker"
        className={cn(
          "absolute inset-0 bg-transparent transition-opacity duration-300 ease-out",
          transition.state === "open" ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      {/* Slide on the outer shell — frost must stay untransformed or backdrop-filter dies. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-state={transition.state}
        className="pdp-hero-color-tray relative w-full"
      >
        <div className="pdp-hero-color-tray__surface relative">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={pdpBottomSheetCloseButtonClass}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>

          <div className="flex flex-col px-4 pb-6 pt-2.5">
            <div
              aria-hidden
              className="mx-auto mb-5 h-[3px] w-10 shrink-0 rounded-full bg-neutral-300"
            />

            <h2 id={titleId} className={cn("m-0 mb-4 pr-10 text-black", pdpType.body)}>
              Color: {labelName}
            </h2>

            <div className="flex items-center gap-3">
              <div
                role="listbox"
                aria-label="Choose color"
                className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto overscroll-x-contain py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {colors.map((color) => {
                  const isSelected = color.id === selectedColorId;
                  const combinationAvailable =
                    !("combinationAvailable" in color) || color.combinationAvailable;
                  const isSelectable =
                    combinationAvailable && pdpColorIsSelectable(color.availability);

                  return (
                    <button
                      key={color.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={!isSelectable}
                      disabled={!isSelectable}
                      onClick={() => {
                        if (!isSelectable) {
                          return;
                        }
                        onColorSelect(color.id);
                        onClose();
                      }}
                      aria-label={
                        isSelectable
                          ? `Select ${color.name}`
                          : `${color.name}, ${pdpColorAvailabilityLabel(color.availability)}`
                      }
                      className={cn(
                        "relative size-8 shrink-0 rounded-full transition-[box-shadow,opacity,transform] duration-200 ease-out",
                        "before:absolute before:inset-[-10px] before:content-['']",
                        isSelected
                          ? "shadow-[0_0_0_2px_#fff,0_0_0_3px_#0a0a0a]"
                          : "ring-1 ring-black/10",
                        isSelectable ? pdpPressableIconClass : "cursor-not-allowed opacity-40",
                      )}
                      style={{ backgroundColor: color.chromeSample ?? "#d4d4d4" }}
                    />
                  );
                })}
              </div>
              {showCustomize ? (
                <PdpTextLinkCta
                  type="button"
                  hideIcon
                  className={cn("shrink-0", pdpType.micro)}
                >
                  Customize
                </PdpTextLinkCta>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
