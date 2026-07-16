"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  pdpPressableClass,
  pdpPressableSolidClass,
  pdpType,
} from "../pdp-type";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";
import { useMountTransition } from "../use-mount-transition";
import { useOverlayDismiss } from "../use-overlay-dismiss";

const NEARBY_STORES = [
  {
    id: "stanford",
    name: "Coach Stanford Shopping Center",
    detail: "180 El Camino Real, Palo Alto",
    availabilityLabel: "Available Today",
    pickupDetail: "Ready for pickup in 2 hours",
    distance: "2.1 mi away",
  },
  {
    id: "palo-alto",
    name: "Coach House Manhattan",
    detail: "220 University Ave, Palo Alto",
    availabilityLabel: "Available Today",
    pickupDetail: "Ready for pickup in 3 hours",
    distance: "3.4 mi away",
  },
  {
    id: "valley-fair",
    name: "Coach Valley Fair",
    detail: "2855 Stevens Creek Blvd, Santa Clara",
    availabilityLabel: "Available Tomorrow",
    pickupDetail: "Ready for pickup tomorrow",
    distance: "12.8 mi away",
  },
] as const;

const STORE_PREFERENCE_KEY = "pdp-preferred-pickup-store";

type PdpV5StorePickupLinkProps = {
  className?: string;
};

/** Compact supporting surface below the primary purchase CTA. */
const pickupCardClass =
  "overflow-hidden rounded-none bg-neutral-50 shadow-[0_1px_0_rgba(0,0,0,0.02)]";

function PickupMapPreview() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const stopDragging = (element: HTMLDivElement, pointerId: number) => {
    if (element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
    dragStart.current = null;
    setDragging(false);
  };

  return (
    <div
      className={cn(
        "relative h-80 w-full shrink-0 touch-none overflow-hidden border-t border-black/[0.06] bg-[#ecebe7]",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = {
          pointerX: event.clientX,
          pointerY: event.clientY,
          panX: pan.x,
          panY: pan.y,
        };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        if (!dragStart.current) return;
        const nextX = dragStart.current.panX + event.clientX - dragStart.current.pointerX;
        const nextY = dragStart.current.panY + event.clientY - dragStart.current.pointerY;
        setPan({
          x: Math.max(-72, Math.min(72, nextX)),
          y: Math.max(-44, Math.min(44, nextY)),
        });
      }}
      onPointerUp={(event) => stopDragging(event.currentTarget, event.pointerId)}
      onPointerCancel={(event) => stopDragging(event.currentTarget, event.pointerId)}
    >
      <div
        aria-hidden
        className="absolute -inset-8 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        <svg
          viewBox="0 0 420 224"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <rect width="420" height="224" fill="#ecebe7" />
          <path d="M-30 172 C72 84 168 78 252 134 S365 210 460 104" fill="none" stroke="#fff" strokeWidth="18" />
          <path d="M-30 172 C72 84 168 78 252 134 S365 210 460 104" fill="none" stroke="#d1cfc9" strokeWidth="2" />
          <path d="M40 -28 C94 34 122 94 142 252" fill="none" stroke="#fff" strokeWidth="13" />
          <path d="M40 -28 C94 34 122 94 142 252" fill="none" stroke="#d1cfc9" strokeWidth="2" />
          <path d="M320 -28 C286 52 254 132 224 252" fill="none" stroke="#fff" strokeWidth="13" />
          <path d="M320 -28 C286 52 254 132 224 252" fill="none" stroke="#d1cfc9" strokeWidth="2" />
          <path d="M-20 50 C102 26 238 34 450 68" fill="none" stroke="#fff" strokeWidth="10" />
          <path d="M-20 50 C102 26 238 34 450 68" fill="none" stroke="#d7d5cf" strokeWidth="1.5" />
          <rect x="326" y="28" width="70" height="30" rx="4" fill="#dfddd7" />
          <rect x="154" y="18" width="92" height="25" rx="4" fill="#e2e0da" />
          <rect x="16" y="72" width="62" height="42" rx="4" fill="#dfddd7" />
          <rect x="294" y="154" width="84" height="38" rx="4" fill="#e2e0da" />
        </svg>
        <span className="absolute left-[56%] top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <MaterialIcon name="location_on" size={24} className="text-black" />
        </span>
      </div>

      <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-neutral-700 shadow-sm">
        Drag to explore
      </span>

      <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_6px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          aria-label="Zoom in"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setZoom((value) => Math.min(1.3, value + 0.15))}
          className="grid size-10 place-items-center border-b border-neutral-200 transition-transform active:scale-[0.96]"
        >
          <MaterialIcon name="add" size={18} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setZoom((value) => Math.max(0.85, value - 0.15))}
          className="grid size-10 place-items-center transition-transform active:scale-[0.96]"
        >
          <MaterialIcon name="remove" size={18} />
        </button>
      </div>

      <button
        type="button"
        aria-label="Recenter map"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => {
          setPan({ x: 0, y: 0 });
          setZoom(1);
        }}
        className="absolute bottom-2 right-2 grid size-10 place-items-center rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.18)] transition-transform active:scale-[0.96]"
      >
        <MaterialIcon name="my_location" size={18} />
      </button>
    </div>
  );
}

/**
 * Store-availability card — opens a lightweight nearby-store tray.
 */
// fallow-ignore-next-line complexity
export function PdpV5StorePickupLink({ className }: PdpV5StorePickupLinkProps) {
  const { showStorePickupLink, squareButtonCorners } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const [open, setOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<
    (typeof NEARBY_STORES)[number]["id"] | null
  >(NEARBY_STORES[0].id);
  const titleId = useId();
  const overlayReady = useOverlayDismiss(open, () => setOpen(false));
  const transition = useMountTransition(open, 300);

  useEffect(() => {
    const savedStoreId = window.localStorage.getItem(STORE_PREFERENCE_KEY);
    if (NEARBY_STORES.some((store) => store.id === savedStoreId)) {
      setSelectedStoreId(savedStoreId as (typeof NEARBY_STORES)[number]["id"]);
    }
  }, []);

  if (!showStorePickupLink) {
    return null;
  }

  const selectedStore = NEARBY_STORES.find(
    (store) => store.id === selectedStoreId,
  );

  const selectStore = (storeId: (typeof NEARBY_STORES)[number]["id"]) => {
    setSelectedStoreId(storeId);
    window.localStorage.setItem(STORE_PREFERENCE_KEY, storeId);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          selectedStore
            ? `${selectedStore.availabilityLabel}. ${selectedStore.name}. ${selectedStore.pickupDetail}, ${selectedStore.distance}. View pickup details.`
            : "Check store availability near you."
        }
        className={cn(
          pickupCardClass,
          "flex min-h-16 w-full items-center gap-2.5 px-3 py-2.5 text-left",
          "transition-[background-color,transform] active:bg-neutral-100",
          pdpPressableClass,
          className,
        )}
      >
        <MaterialIcon
          name="location_on"
          size={20}
          className="shrink-0 text-black"
        />
        {selectedStore ? (
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={cn(pdpType.micro, "font-normal text-[#386247]")}>
              {selectedStore.availabilityLabel}
            </span>
            <span className={cn(pdpType.body, "truncate text-black")}>
              {selectedStore.name}
            </span>
          </span>
        ) : (
          <span className="flex min-h-10 min-w-0 flex-1 items-center">
            <span className={cn(pdpType.body, "text-black")}>
              Check store availability near you.
            </span>
          </span>
        )}
        <MaterialIcon
          name="chevron_right"
          size={18}
          className="shrink-0 text-neutral-400"
        />
      </button>

      {overlayReady && transition.mounted ? (
        createPortal(
          <div
            className={pdpBottomSheetOverlayClass({ open })}
            aria-hidden={!open}
          >
            <button
              type="button"
              aria-label="Close store pickup"
              className={pdpBottomSheetBackdropClass()}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            />

            <div
              id="pdp-v5-store-pickup-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={cn(
                pdpBottomSheetPanelClass({ open, maxHeight: "85dvh" }),
                squareButtonCorners && "!rounded-none",
              )}
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

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-0.5">
                <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
                  Pick up in store
                </h2>
                <p className={cn(pdpType.body, "m-0 text-pretty text-neutral-600")}>
                  Reserve this bag and collect it from a Coach store near you —
                  usually same day.
                </p>

                {selectedStore ? (
                  <div className={cn(pickupCardClass, "mt-4")}>
                    <div className="flex items-start gap-2.5 px-3 py-2.5">
                      <MaterialIcon
                        name="location_on"
                        size={20}
                        className="mt-0.5 shrink-0 text-black"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className={cn(pdpType.micro, "font-normal text-[#386247]")}>
                          {selectedStore.availabilityLabel}
                        </span>
                        <span
                          className={cn(
                            pdpType.body,
                            "text-pretty text-black",
                          )}
                        >
                          {selectedStore.name}
                        </span>
                        <span className={cn(pdpType.label, "text-pretty text-neutral-500")}>
                          {selectedStore.detail}
                        </span>
                        <span className={cn(pdpType.micro, "text-pretty text-neutral-600")}>
                          {selectedStore.pickupDetail} ·{" "}
                          <span className="tabular-nums">{selectedStore.distance}</span>
                        </span>
                      </div>
                    </div>
                    <PickupMapPreview />
                  </div>
                ) : null}

                <ul
                  role="listbox"
                  aria-label="Nearby stores"
                  className="mt-4 flex list-none flex-col gap-2 border-t border-neutral-100 p-0 pt-4"
                >
                  {NEARBY_STORES.map((store) => {
                    const selected = store.id === selectedStoreId;

                    return (
                      <li key={store.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => selectStore(store.id)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-none border px-3 py-3 text-left transition-colors",
                            selected
                              ? "border-black bg-neutral-50"
                              : "border-neutral-200 bg-white active:bg-neutral-50",
                          )}
                        >
                          <MaterialIcon
                            name="location_on"
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
                              {store.pickupDetail} ·{" "}
                              <span className="tabular-nums">{store.distance}</span>
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

                </div>
                <div className="shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-extended flex h-12 w-full shrink-0 items-center justify-center rounded-none px-4 text-[13px] text-white",
                      pdpPressableSolidClass,
                      "bg-black active:brightness-90",
                    )}
                  >
                    <span>
                      {selectedStore
                        ? `Pick up at ${selectedStore.name.replace(/^Coach\s+/, "")}`
                        : "Choose a pickup store"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      ) : null}
    </>
  );
}
