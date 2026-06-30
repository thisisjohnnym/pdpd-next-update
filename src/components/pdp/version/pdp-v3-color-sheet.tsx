"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_COLOR_NOTIFY_TOAST,
  pdpColorAvailabilityClass,
  pdpColorAvailabilityLabel,
  pdpColorIsSelectable,
} from "../pdp-data";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetBodyClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "../pdp-bottom-sheet";
import { ColorSwatchCircle } from "../pdp-color-swatch";
import { PdpNotifySheet } from "../pdp-notify-sheet";
import { PdpToast } from "../pdp-toast";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpPressableClass, pdpStrokeCtaClass, pdpType } from "../pdp-type";
import { useOverlayDismiss } from "../use-overlay-dismiss";
import {
  getV3ColorSheetSections,
  type V3MaterialEntry,
} from "./pdp-v3-color-sheet-sections";

/** Progressive reveal — rows shown before the "see more" toggle. */
const POPULAR_COLLAPSED = 3;
const MATERIALS_COLLAPSED = 4;

// Paper `EX3-0` — --color-muted (#737373 → neutral-500), --text-label (12px), capitalize.
const SECTION_LABEL_CLASS =
  "font-extended text-xs leading-none capitalize text-neutral-500";

/**
 * Progressive "see more" link — Paper `EXM-0` / `EXN-0`. Centered --color-ink-soft
 * (#404040 → neutral-700) label with a 1px from-font underline and a chevron.
 */
function SectionToggle({
  expanded,
  collapsedLabel,
  expandedLabel,
  onToggle,
}: {
  expanded: boolean;
  collapsedLabel: string;
  expandedLabel: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex justify-center pt-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "font-extended inline-flex items-center gap-1 text-xs leading-4 text-neutral-700",
          pdpPressableClass,
        )}
      >
        <span className="underline decoration-1 [text-underline-position:from-font]">
          {expanded ? expandedLabel : collapsedLabel}
        </span>
        <MaterialIcon
          name={expanded ? "expand_less" : "expand_more"}
          size={18}
          className="shrink-0 text-neutral-700"
          aria-hidden
        />
      </button>
    </div>
  );
}

function ColorRow({
  swatch,
  name,
  availability,
  isSelected,
  onSelect,
}: {
  swatch: string;
  name: string;
  availability: Parameters<typeof pdpColorAvailabilityLabel>[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const selectable = pdpColorIsSelectable(availability);

  return (
    <li role="presentation">
      <button
        type="button"
        role="option"
        aria-selected={isSelected}
        aria-disabled={!selectable}
        disabled={!selectable}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 py-2.5 text-left transition-colors",
          selectable ? pdpPressableClass : "opacity-60",
        )}
      >
        <ColorSwatchCircle src={swatch} sizeClass="size-12" dimmed={!selectable} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={cn("text-black", pdpType.label)}>{name}</span>
          <span className={cn(pdpType.micro, pdpColorAvailabilityClass(availability))}>
            {pdpColorAvailabilityLabel(availability)}
          </span>
        </span>
        {isSelected ? (
          <MaterialIcon name="check" size={18} className="shrink-0 text-black" aria-hidden />
        ) : null}
      </button>
    </li>
  );
}

const MATERIAL_STATUS_LABEL: Record<V3MaterialEntry["status"], string> = {
  current: "In stock",
  "in-stock": "In stock",
  "out-of-stock": "Out of stock",
  "unavailable-in-color": "Not available in selected color",
};

function MaterialRow({
  material,
  onSelect,
  onNotify,
}: {
  material: V3MaterialEntry;
  onSelect: () => void;
  onNotify: () => void;
}) {
  const { status, label, swatch } = material;
  const selectable = status === "current" || status === "in-stock";
  const dimmed = status === "out-of-stock" || status === "unavailable-in-color";

  return (
    <li role="presentation">
      <div
        className={cn(
          "flex w-full items-center gap-3 py-2.5",
          selectable ? null : "opacity-60",
        )}
      >
        <button
          type="button"
          aria-pressed={status === "current"}
          aria-disabled={!selectable}
          disabled={!selectable}
          onClick={onSelect}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 text-left",
            selectable ? pdpPressableClass : "cursor-default",
          )}
        >
          <ColorSwatchCircle src={swatch ?? ""} sizeClass="size-12" dimmed={dimmed} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={cn(dimmed ? "text-neutral-400" : "text-black", pdpType.label)}>
              {label}
            </span>
            <span
              className={cn(
                pdpType.micro,
                status === "out-of-stock" ? "text-red-600" : "text-neutral-400",
              )}
            >
              {MATERIAL_STATUS_LABEL[status]}
            </span>
          </span>
        </button>

        {status === "current" ? (
          <MaterialIcon name="check" size={18} className="shrink-0 text-black" aria-hidden />
        ) : status === "out-of-stock" ? (
          <button
            type="button"
            aria-label={`Notify me when ${label} is back in stock`}
            onClick={onNotify}
            className={cn(
              "font-extended inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.2px]",
              pdpStrokeCtaClass,
            )}
          >
            <MaterialIcon name="mail" size={18} className="shrink-0" aria-hidden />
            Notify me
          </button>
        ) : null}
      </div>
    </li>
  );
}

/**
 * v3 progressive color drawer — Paper r4 `EU5-0` (collapsed) / `EIE-0` (expanded).
 *
 * Full-height bottom sheet opened in context over the dimmed hero. Reads the
 * Tabby variant context directly so both the docked and floating buy bars share
 * one sheet. Tabby-only — callers fall back to `PdpColorSheet` otherwise.
 */
export function PdpV3ColorSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const tabby = useOptionalTabbyVariant();
  const mounted = useOverlayDismiss(open, onClose);
  const [popularExpanded, setPopularExpanded] = useState(false);
  const [materialsExpanded, setMaterialsExpanded] = useState(false);
  const [notifyLabel, setNotifyLabel] = useState<string | null>(null);
  const [notifyToastOpen, setNotifyToastOpen] = useState(false);

  if (!mounted || !tabby || typeof document === "undefined" || !document.body) {
    return null;
  }

  const { popularColors, materials, sizes } = getV3ColorSheetSections(tabby);

  const visiblePopular = popularExpanded
    ? popularColors
    : popularColors.slice(0, POPULAR_COLLAPSED);
  const hiddenPopular = popularColors.length - POPULAR_COLLAPSED;

  const visibleMaterials = materialsExpanded
    ? materials
    : materials.slice(0, MATERIALS_COLLAPSED);
  const hiddenMaterials = materials.length - MATERIALS_COLLAPSED;

  const handleColorSelect = (id: string) => {
    tabby.setSelectedColorId(id);
    onClose();
  };

  const handleMaterialSelect = (material: V3MaterialEntry) => {
    if (material.status === "current") {
      onClose();
      return;
    }
    if (material.status === "in-stock") {
      tabby.navigateToStyle(material.styleId);
      onClose();
    }
  };

  const handleSizeSelect = (size: (typeof sizes)[number]) => {
    if (!size.available) {
      return;
    }
    tabby.navigateToSize(size.option.size);
    onClose();
  };

  return createPortal(
    <>
      <PdpToast
        message={PDP_COLOR_NOTIFY_TOAST}
        open={notifyToastOpen}
        onClose={() => setNotifyToastOpen(false)}
      />

      <PdpNotifySheet
        colorName={notifyLabel ?? undefined}
        open={notifyLabel !== null}
        onClose={() => setNotifyLabel(null)}
        onSubmit={() => {
          setNotifyLabel(null);
          setNotifyToastOpen(true);
        }}
      />

      <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
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

          <div className={pdpBottomSheetBodyClass}>
            <div data-pdp-sheet-scroll className={pdpBottomSheetScrollRegionClass("px-3 pt-0.5")}>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 id={titleId} className={cn("m-0", pdpType.headline)}>
                  Choose color
                </h2>
                <span className={cn("shrink-0 text-neutral-500", pdpType.label)}>
                  Size {tabby.size} · {tabby.summary.price}
                </span>
              </div>

              <section aria-label="Popular colors" className="border-t border-neutral-100 pt-4">
                <p className={cn("mb-1", SECTION_LABEL_CLASS)}>Popular Colors</p>
                <ul role="listbox" aria-label="Popular colors" className="m-0 flex list-none flex-col">
                  {visiblePopular.map((color) => (
                    <ColorRow
                      key={color.id}
                      swatch={color.swatch}
                      name={color.name}
                      availability={color.availability}
                      isSelected={
                        color.id === tabby.selectedColorId &&
                        color.combinationAvailable
                      }
                      onSelect={() => handleColorSelect(color.id)}
                    />
                  ))}
                </ul>
                {hiddenPopular > 0 ? (
                  <SectionToggle
                    expanded={popularExpanded}
                    collapsedLabel={`See ${hiddenPopular}+ colors`}
                    expandedLabel="See fewer colors"
                    onToggle={() => setPopularExpanded((value) => !value)}
                  />
                ) : null}
              </section>

              <section
                aria-label="Explore materials"
                className="mt-4 border-t border-neutral-100 pt-4"
              >
                <p className={cn("mb-1", SECTION_LABEL_CLASS)}>Explore Materials</p>
                <ul className="m-0 flex list-none flex-col">
                  {visibleMaterials.map((material) => (
                    <MaterialRow
                      key={material.styleId}
                      material={material}
                      onSelect={() => handleMaterialSelect(material)}
                      onNotify={() => setNotifyLabel(material.label)}
                    />
                  ))}
                </ul>
                {hiddenMaterials > 0 ? (
                  <SectionToggle
                    expanded={materialsExpanded}
                    collapsedLabel={`View ${hiddenMaterials}+ materials`}
                    expandedLabel="View fewer materials"
                    onToggle={() => setMaterialsExpanded((value) => !value)}
                  />
                ) : null}
              </section>

              <section
                aria-label="Bag size"
                className="mt-4 border-t border-neutral-100 pb-2 pt-4"
              >
                <p className={cn("mb-3", SECTION_LABEL_CLASS)}>Bag Size</p>
                <ul className="-mx-3 flex list-none gap-2 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {sizes.map((size) => {
                    const isCurrent = size.option.size === tabby.size;
                    return (
                      <li key={size.option.size} className="shrink-0">
                        <button
                          type="button"
                          aria-pressed={isCurrent}
                          aria-disabled={!size.available}
                          disabled={!size.available}
                          onClick={() => handleSizeSelect(size)}
                          className={cn(
                            "flex w-[150px] flex-col overflow-hidden rounded-xl border bg-white text-left transition-colors",
                            isCurrent ? "border-black" : "border-neutral-200",
                            size.available ? pdpPressableClass : "opacity-40",
                          )}
                        >
                          <span className="relative block aspect-square w-full bg-neutral-100">
                            <Image
                              src={size.option.image}
                              alt={size.option.imageAlt}
                              fill
                              sizes="150px"
                              className="object-cover"
                            />
                          </span>
                          <span className="flex flex-col gap-0.5 p-2.5">
                            <span className={cn("text-black", pdpType.label)}>
                              Tabby {size.option.size}
                            </span>
                            <span className={cn("text-neutral-500", pdpType.micro)}>
                              {size.option.price}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            <div className="shrink-0 pb-[max(16px,var(--pdp-safe-area-bottom))]" />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
