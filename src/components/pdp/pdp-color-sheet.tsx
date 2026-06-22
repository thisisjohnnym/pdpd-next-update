"use client";

import { useId, useState, type ReactNode } from "react";
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
import { useActiveProduct } from "./pdp-active-product-context";
import type { TabbyColorOption } from "./pdp-tabby-colors";
import type { TabbyColorSheetGroup } from "./pdp-tabby-color-sheet-groups";
import type { TabbySize } from "./pdp-tabby-variants";
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
import { PdpNotifySheet } from "./pdp-notify-sheet";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
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
  /** Tabby — group colors by bag size in the current style */
  groups?: TabbyColorSheetGroup[];
  currentSize?: TabbySize;
  onSelectAtSize?: (colorId: string, size: TabbySize) => void;
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

const COLOR_SHEET_ROW_INSET_CLASS = "px-3";

type ColorSheetRowProps = {
  color: PdpColorSheetColor;
  isSelected: boolean;
  onSelect: () => void;
  onNotify: () => void;
  combinationAvailable?: boolean;
  /** Horizontal inset inside bordered group containers */
  inset?: boolean;
};

function ColorSheetRow({
  color,
  isSelected,
  onSelect,
  onNotify,
  combinationAvailable = true,
  inset = false,
}: ColorSheetRowProps) {
  const rowInsetClass = inset ? COLOR_SHEET_ROW_INSET_CLASS : undefined;

  if (!combinationAvailable) {
    return (
      <li role="presentation">
        <div
          className={cn(
            "flex w-full items-center gap-3 py-2.5 opacity-50",
            rowInsetClass,
          )}
        >
          <ColorSwatchCircle src={color.swatch} sizeClass="size-10" dimmed />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={cn("text-black", pdpType.label)}>{color.name}</span>
            <span className={cn("text-neutral-400", pdpType.micro)}>
              Not available in this size
            </span>
          </span>
        </div>
      </li>
    );
  }

  if (!pdpColorIsSelectable(color.availability)) {
    return (
      <li role="presentation">
        <div
          className={cn(
            "flex w-full items-center gap-3 py-2.5",
            rowInsetClass,
          )}
        >
          <ColorSwatchCircle src={color.swatch} sizeClass="size-10" dimmed />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={cn("text-black", pdpType.label)}>{color.name}</span>
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
            onClick={onNotify}
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
    <li role="presentation">
      <button
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 py-2.5 text-left transition-colors",
          rowInsetClass,
          pdpPressableClass,
        )}
      >
        <ColorSwatchCircle src={color.swatch} sizeClass="size-10" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={cn("text-black", pdpType.label)}>{color.name}</span>
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
}

function ColorSheetGroupSection({
  group,
  selectedId,
  currentSize,
  onSelectColor,
  onNotify,
}: {
  group: TabbyColorSheetGroup;
  selectedId: string;
  currentSize?: TabbySize;
  onSelectColor: (colorId: string, size: TabbySize) => void;
  onNotify: (color: PdpColor) => void;
}) {
  return (
    <section aria-labelledby={`color-group-${group.size}`}>
      <div className="mb-2">
        <h3
          id={`color-group-${group.size}`}
          className={cn("m-0 min-w-0 text-black", pdpType.label)}
        >
          {group.heading}
        </h3>
      </div>

      <ul
        role="group"
        aria-label={group.heading}
        className="m-0 flex list-none flex-col divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-100"
      >
        {group.colors.map((color) => (
          <ColorSheetRow
            key={`${group.size}-${color.id}`}
            color={color}
            inset
            isSelected={
              color.id === selectedId &&
              (currentSize === undefined || group.size === currentSize)
            }
            onSelect={() => onSelectColor(color.id, group.size)}
            onNotify={() => onNotify(color)}
          />
        ))}
      </ul>
    </section>
  );
}

/** Bottom tray — choose a product colorway */
export function PdpColorSheet({
  colors,
  selectedId,
  open,
  onClose,
  onSelect,
  groups,
  currentSize,
  onSelectAtSize,
}: PdpColorSheetProps) {
  const titleId = useId();
  const { productId } = useActiveProduct();
  const showCustomize = productId === "tabby";
  const mounted = useOverlayDismiss(open, onClose);
  const [notifyToastOpen, setNotifyToastOpen] = useState(false);
  const [notifyColor, setNotifyColor] = useState<PdpColorSheetColor | null>(null);
  const resolvedSelectedId = resolveSelectedColorId(colors, selectedId);
  const useGroupedLayout = Boolean(groups?.length);

  const handleSelect = (id: string, size?: TabbySize) => {
    const color = colors.find((entry) => entry.id === id);
    if (
      !color ||
      !isCombinationAvailable(color) ||
      !pdpColorIsSelectable(color.availability)
    ) {
      return;
    }

    if (size !== undefined && currentSize !== undefined && size !== currentSize) {
      onSelectAtSize?.(id, size);
      onClose();
      return;
    }

    onSelect(id);
    onClose();
  };

  const handleNotify = (color: PdpColorSheetColor) => {
    setNotifyColor(color);
  };

  const handleNotifySubmit = () => {
    setNotifyColor(null);
    setNotifyToastOpen(true);
  };

  let colorListContent: ReactNode;

  if (useGroupedLayout && groups) {
    colorListContent = (
      <div className="flex flex-col gap-5 pb-1">
        {groups.map((group) => (
          <ColorSheetGroupSection
            key={group.size}
            group={group}
            selectedId={resolvedSelectedId}
            currentSize={currentSize}
            onSelectColor={(colorId, size) => handleSelect(colorId, size)}
            onNotify={handleNotify}
          />
        ))}
      </div>
    );
  } else {
    colorListContent = (
      <ul
        role="listbox"
        aria-label="Select color"
        className="m-0 flex list-none flex-col divide-y divide-neutral-100"
      >
        {colors.map((color) => (
          <ColorSheetRow
            key={color.id}
            color={color}
            isSelected={color.id === resolvedSelectedId}
            combinationAvailable={isCombinationAvailable(color)}
            onSelect={() => handleSelect(color.id)}
            onNotify={() => handleNotify(color)}
          />
        ))}
      </ul>
    );
  }

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

      <PdpNotifySheet
        colorName={notifyColor?.name}
        open={notifyColor !== null}
        onClose={() => setNotifyColor(null)}
        onSubmit={handleNotifySubmit}
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-0.5">
              <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-3")}>
                Select a color
              </h2>

              {colorListContent}
            </div>

            {showCustomize ? (
              <div className="shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-2.5">
                <PdpTextLinkCta
                  type="button"
                  className={cn("w-full justify-between gap-2 py-1", pdpType.label)}
                >
                  Customize
                </PdpTextLinkCta>
              </div>
            ) : (
              <div className="shrink-0 pb-[max(16px,var(--pdp-safe-area-bottom))]" />
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
