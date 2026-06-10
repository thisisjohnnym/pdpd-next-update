"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import {
  PDP_BUNDLE_DISCOUNT,
  PDP_BUNDLE_ITEMS,
  type PdpBundleAddPayload,
  type PdpBundleItem,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function defaultSelectedIds(): Set<string> {
  return new Set(
    PDP_BUNDLE_ITEMS.filter((item) => item.defaultSelected || item.locked).map(
      (item) => item.id,
    ),
  );
}

type BundleRowProps = {
  item: PdpBundleItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

function PrimaryBundleCard({ item }: { item: PdpBundleItem }) {
  return (
    <div className="flex items-center gap-3.5 border border-black bg-neutral-50 p-4 ring-1 ring-inset ring-black">
      <span className="relative size-16 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="64px"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className={`font-extended block text-black ${pdpType.body}`}>
          {item.name}
        </span>
      </span>

      <span className={`font-extended shrink-0 text-black ${pdpType.label}`}>
        {formatPrice(item.price)}
      </span>
    </div>
  );
}

function AddonBundleRow({ item, selected, onToggle }: BundleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      disabled={item.locked}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 border border-neutral-200 p-4 text-left transition-colors",
        selected ? "bg-neutral-50" : "bg-white",
        item.locked ? "cursor-default" : "active:bg-neutral-100",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border",
          selected ? "border-black bg-black" : "border-neutral-300 bg-white",
          item.locked && "opacity-70",
        )}
        aria-hidden
      >
        {selected ? (
          <MaterialIcon name="check" size={18} className="text-white" />
        ) : null}
      </span>

      <span className="relative size-16 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="64px"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className={`font-extended block text-black ${pdpType.body}`}>
          {item.name}
        </span>
      </span>

      <span className={`font-extended shrink-0 text-black ${pdpType.label}`}>
        {formatPrice(item.price)}
      </span>
    </button>
  );
}

type PdpBundleModuleProps = {
  onAddBundle: (payload: PdpBundleAddPayload) => void;
};

/** Multi-select bundle builder — pick accessories and add all to bag */
export function PdpBundleModule({ onAddBundle }: PdpBundleModuleProps) {
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds);
  const [justAdded, setJustAdded] = useState(false);

  const selectedItems = useMemo(
    () => PDP_BUNDLE_ITEMS.filter((item) => selectedIds.has(item.id)),
    [selectedIds],
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems],
  );

  const hasDiscount = selectedItems.length >= 2;
  const total = hasDiscount
    ? Math.round(subtotal * (1 - PDP_BUNDLE_DISCOUNT))
    : subtotal;

  const toggleItem = (id: string) => {
    const item = PDP_BUNDLE_ITEMS.find((entry) => entry.id === id);
    if (!item || item.locked) {
      return;
    }

    setJustAdded(false);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const primaryItem = PDP_BUNDLE_ITEMS.find((item) => item.locked);
  const addonItems = PDP_BUNDLE_ITEMS.filter((item) => !item.locked);

  const handleAddBundle = () => {
    if (selectedItems.length === 0) {
      return;
    }

    onAddBundle({
      items: selectedItems,
      subtotal,
      total,
    });
    setJustAdded(true);
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "roomy" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>Build your bundle</h2>

            <div className="flex flex-col gap-3">
              {primaryItem ? <PrimaryBundleCard item={primaryItem} /> : null}

              {addonItems.length ? (
                <div className="flex flex-col gap-2">
                  {addonItems.map((item) => (
                    <AddonBundleRow
                      key={item.id}
                      item={item}
                      selected={selectedIds.has(item.id)}
                      onToggle={toggleItem}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className={`font-extended m-0 text-neutral-500 ${pdpType.label}`}>
                  {justAdded
                    ? `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"} added to bag`
                    : `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"} selected`}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  {hasDiscount ? (
                    <span className="text-sm tracking-[0.2px] text-neutral-400 line-through">
                      {formatPrice(subtotal)}
                    </span>
                  ) : null}
                  <span className="font-extended text-lg tracking-[0.2px] text-black">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBundle}
              disabled={selectedItems.length === 0 || justAdded}
              className={cn(
                "font-extended inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3.5 text-sm tracking-[0.2px] transition-colors",
                justAdded
                  ? "bg-neutral-100 text-neutral-500"
                  : "bg-black text-white",
              )}
            >
              <span>
                {justAdded
                  ? "Added to bag"
                  : `Add bundle to bag (${selectedItems.length})`}
              </span>
              {!justAdded ? (
                <MaterialIcon name="add" size={20} className="text-white" />
              ) : null}
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
