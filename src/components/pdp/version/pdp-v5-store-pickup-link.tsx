"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "../pdp-bottom-sheet";
import { pdpSheetHeadingClass } from "../pdp-module-section";
import {
  pdpPillRadiusClass,
  pdpPressableSolidClass,
  pdpTextLinkCtaClass,
  pdpTextLinkCtaLabelClass,
  pdpType,
} from "../pdp-type";
import { PDP_SHEET_PRESENCE_MS } from "../pdp-motion";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { useMountTransition } from "../use-mount-transition";
import { useOverlayDismiss } from "../use-overlay-dismiss";

const NEARBY_STORES = [
  {
    id: "fifth-ave",
    name: "Coach Fifth Avenue",
    detail: "595 Fifth Ave, New York",
    availability: "Ready today",
  },
  {
    id: "soho",
    name: "Coach SoHo",
    detail: "121 Prince St, New York",
    availability: "Ready tomorrow",
  },
  {
    id: "world-trade",
    name: "Coach World Trade Center",
    detail: "185 Greenwich St, New York",
    availability: "Ready in 2 hours",
  },
] as const;

type PdpV5StorePickupLinkProps = {
  className?: string;
  /** v7 meta strip — full-width row with trailing chevron */
  metaStripRow?: boolean;
};

/**
 * Quiet fulfillment affordance under Add to bag — opens a lightweight
 * nearby-store tray without competing with the primary CTA.
 */
export function PdpV5StorePickupLink({
  className,
  metaStripRow = false,
}: PdpV5StorePickupLinkProps) {
  const { showStorePickupLink, squareButtonCorners } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const [open, setOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<
    (typeof NEARBY_STORES)[number]["id"]
  >(NEARBY_STORES[0].id);
  const titleId = useId();
  const overlayReady = useOverlayDismiss(open, () => setOpen(false));
  const transition = useMountTransition(open, PDP_SHEET_PRESENCE_MS);
  const sheetOpen = transition.state === "open";

  if (!showStorePickupLink) {
    return null;
  }

  const selectedStore =
    NEARBY_STORES.find((store) => store.id === selectedStoreId) ??
    NEARBY_STORES[0];

  return (
    <>
      <div className={cn("flex justify-start", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            metaStripRow
              ? "flex min-h-[44px] w-full items-center justify-between gap-3 px-3 py-2.5 text-left active:bg-neutral-100/80"
              : pdpTextLinkCtaClass,
            !metaStripRow && "min-h-[40px]",
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <MaterialIcon
              name="storefront"
              size={16}
              className="shrink-0 text-neutral-600"
            />
            <span
              className={cn(
                metaStripRow ? pdpType.body : pdpTextLinkCtaLabelClass,
                metaStripRow ? "text-neutral-900" : pdpType.label,
              )}
            >
              Pick up in store
            </span>
          </span>
          {metaStripRow ? (
            <MaterialIcon
              name="chevron_right"
              size={18}
              className="shrink-0 text-neutral-400"
            />
          ) : null}
        </button>
      </div>

      {overlayReady && transition.mounted ? (
        createPortal(
          <div
            className={pdpBottomSheetOverlayClass({ open: sheetOpen })}
            aria-hidden={!sheetOpen}
          >
            <button
              type="button"
              aria-label="Close store pickup"
              className={pdpBottomSheetBackdropClass({ open: sheetOpen })}
              onClick={() => setOpen(false)}
              tabIndex={sheetOpen ? 0 : -1}
            />

            <div
              id="pdp-v5-store-pickup-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={pdpBottomSheetPanelClass({
                open: sheetOpen,
                maxHeight: "85dvh",
              })}
            >
              <div className={pdpBottomSheetHeaderClass}>
                <div className={pdpBottomSheetGrabHandleClass} />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className={pdpBottomSheetCloseButtonClass}
                >
                  <MaterialIcon
                    name="close"
                    size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE}
                  />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-3 pb-[max(24px,var(--pdp-safe-area-bottom))] pt-0.5">
                <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
                  Pick up in store
                </h2>
                <p className={cn(pdpType.body, "m-0 text-pretty text-neutral-600")}>
                  Reserve this bag and collect it from a Coach store near you —
                  usually same day.
                </p>

                <ul
                  role="listbox"
                  aria-label="Nearby stores"
                  className="mt-5 flex list-none flex-col gap-2 border-t border-neutral-100 p-0 pt-4"
                >
                  {NEARBY_STORES.map((store) => {
                    const selected = store.id === selectedStoreId;

                    return (
                      <li key={store.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => setSelectedStoreId(store.id)}
                          className={cn(
                            "flex w-full items-start gap-3 border px-3 py-3 text-left transition-colors",
                            selected
                              ? "border-black bg-neutral-50"
                              : "border-neutral-200 bg-white active:bg-neutral-50",
                          )}
                        >
                          <MaterialIcon
                            name="storefront"
                            size={20}
                            className="mt-0.5 shrink-0 text-neutral-500"
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className={cn(pdpType.body, "text-black")}>
                              {store.name}
                            </span>
                            <span className={cn(pdpType.label, "text-neutral-500")}>
                              {store.detail}
                            </span>
                            <span className={cn(pdpType.micro, "pt-0.5 text-neutral-900")}>
                              {store.availability}
                            </span>
                          </span>
                          {selected ? (
                            <MaterialIcon
                              name="check_circle"
                              size={18}
                              className="mt-0.5 shrink-0 text-black"
                            />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "font-extended mt-5 flex h-12 w-full items-center justify-center text-sm text-white",
                    pdpPillRadiusClass(squareButtonCorners),
                    pdpPressableSolidClass,
                    "bg-black active:brightness-90",
                  )}
                >
                  <span className="translate-y-0.5">
                    Pick up at {selectedStore.name.replace(/^Coach\s+/, "")}
                  </span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      ) : null}
    </>
  );
}
