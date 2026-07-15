"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpType } from "../pdp-type";

export const PDP_NEARBY_STORES = [
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

export type PdpNearbyStoreId = (typeof PDP_NEARBY_STORES)[number]["id"];

/**
 * Compact nearby-store picker for embedding in the Add to bag sheet (v8).
 */
export function PdpStorePickupBlock({ className }: { className?: string }) {
  const [selectedStoreId, setSelectedStoreId] = useState<PdpNearbyStoreId>(
    PDP_NEARBY_STORES[0].id,
  );

  return (
    <section className={cn("flex flex-col gap-3 border-t border-neutral-100 pt-4", className)}>
      <div className="flex items-center gap-2">
        <MaterialIcon
          name="storefront"
          size={18}
          className="shrink-0 text-neutral-600"
        />
        <p className={cn(pdpType.productName, "text-black")}>Pick up in store</p>
      </div>
      <p className={cn(pdpType.label, "m-0 text-pretty text-neutral-600")}>
        Reserve this bag and collect it from a Coach store near you — usually
        same day.
      </p>
      <ul
        role="listbox"
        aria-label="Nearby stores"
        className="flex list-none flex-col gap-2 p-0"
      >
        {PDP_NEARBY_STORES.map((store) => {
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
    </section>
  );
}
