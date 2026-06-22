"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import {
  PDP_COLOR_NOTIFY_TOAST,
  pdpColorAvailabilityClass,
  pdpColorAvailabilityLabel,
  pdpColorIsSelectable,
} from "./pdp-data";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { ColorSwatchCircle } from "./pdp-color-swatch";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { PdpToast } from "./pdp-toast";
import { pdpPressableClass, pdpStrokeCtaClass, pdpType } from "./pdp-type";
import { useOverlayDismiss } from "./use-overlay-dismiss";

type PdpColorSheetColor = PdpColor | TabbyColorOption;

type PdpColorSheetProps = {
  colors: PdpColorSheetColor[];
  selectedId: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

function isCombinationAvailable(color: PdpColorSheetColor): boolean {
  return !("combinationAvailable" in color) || color.combinationAvailable;
}

function resolveSelectedColorId(
  colors: PdpColorSheetColor[],
  selectedId: string,
): string {
  if (colors.some((color) => color.id === selectedId)) {
    return selectedId;
  }

  return (
    colors.find(
      (color) =>
        isCombinationAvailable(color) &&
        pdpColorIsSelectable(color.availability),
    )?.id ??
    colors[0]?.id ??
    selectedId
  );
}

/** Bottom tray — choose a product colorway */
export function PdpColorSheet({
  colors,
  selectedId,
  open,
  onClose,
  onSelect,
}: PdpColorSheetProps) {
  const titleId = useId();
  const mounted = useOverlayDismiss(open, onClose);
  const [notifyToastOpen, setNotifyToastOpen] = useState(false);
  const resolvedSelectedId = resolveSelectedColorId(colors, selectedId);

  const handleSelect = (id: string) => {
    const color = colors.find((entry) => entry.id === id);
    if (
      !color ||
      !isCombinationAvailable(color) ||
      !pdpColorIsSelectable(color.availability)
    ) {
      return;
    }

    onSelect(id);
    onClose();
  };

  const handleNotify = () => {
    setNotifyToastOpen(true);
    onClose();
  };

  if (!mounted || typeof document === "undefined" || !document.body) {
    return null;
  }

  return createPortal(
    <>
      <PdpToast
        message={PDP_COLOR_NOTIFY_TOAST}
        open={notifyToastOpen}
        onClose={() => setNotifyToastOpen(false)}
      />

      <div
        className={pdpBottomSheetOverlayClass({ open })}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close color picker"
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

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5 pt-0.5">
              <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-3")}>
                Select a color
              </h2>

              <ul
                role="listbox"
                aria-label="Select color"
                className="m-0 flex list-none flex-col divide-y divide-neutral-100"
              >
                {colors.map((color) => {
                  const isSelected = color.id === resolvedSelectedId;
                  const combinationAvailable = isCombinationAvailable(color);
                  const isSelectable =
                    combinationAvailable &&
                    pdpColorIsSelectable(color.availability);

                  if (!combinationAvailable) {
                    return (
                      <li key={color.id} role="presentation">
                        <div className="flex w-full items-center gap-3 py-2.5 opacity-50">
                          <ColorSwatchCircle
                            src={color.swatch}
                            sizeClass="size-10"
                            dimmed
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className={cn("text-black", pdpType.label)}>
                              {color.name}
                            </span>
                            <span className={cn("text-neutral-400", pdpType.micro)}>
                              Not available in this size
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  }

                  if (!isSelectable) {
                    return (
                      <li key={color.id} role="presentation">
                        <div className="flex w-full items-center gap-3 py-2.5">
                          <ColorSwatchCircle
                            src={color.swatch}
                            sizeClass="size-10"
                            dimmed
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className={cn("text-black", pdpType.label)}>
                              {color.name}
                            </span>
                            <span
                              className={cn(
                                pdpType.micro,
                                pdpColorAvailabilityClass(color.availability),
                              )}
                            >
                              {pdpColorAvailabilityLabel(color.availability)}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Notify me when ${color.name} is back in stock`}
                            onClick={handleNotify}
                            className={cn(
                              "font-extended inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.2px]",
                              pdpStrokeCtaClass,
                            )}
                          >
                            <MaterialIcon
                              name="mail"
                              size={18}
                              className="shrink-0"
                              aria-hidden
                            />
                            Notify me
                          </button>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={color.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(color.id)}
                        className={cn(
                          "flex w-full items-center gap-3 py-2.5 text-left transition-colors",
                          pdpPressableClass,
                        )}
                      >
                        <ColorSwatchCircle
                          src={color.swatch}
                          sizeClass="size-10"
                        />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className={cn("text-black", pdpType.label)}>
                            {color.name}
                          </span>
                          <span
                            className={cn(
                              pdpType.micro,
                              pdpColorAvailabilityClass(color.availability),
                            )}
                          >
                            {pdpColorAvailabilityLabel(color.availability)}
                          </span>
                        </span>
                        {isSelected ? (
                          <MaterialIcon
                            name="check"
                            size={18}
                            className="shrink-0 text-black"
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
        </div>
      </div>
    </>,
    document.body,
  );
}
