"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
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
    <div className="flex w-[132px] shrink-0 flex-col gap-2">
      <span className="relative h-[160px] w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="132px"
        />
      </span>
      <p className={`font-extended m-0 leading-[1.1] text-black ${pdpType.body}`}>
        {item.name}
      </p>
      <p className={`font-extended m-0 leading-[1.1] text-black ${pdpType.label}`}>
        {formatPrice(item.price)}
      </p>
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
        "flex w-full items-center gap-2.5 rounded-lg border border-neutral-200 p-2 text-left transition-colors",
        item.locked ? "cursor-default" : "active:bg-neutral-50",
      )}
    >
      <span className="relative w-[38px] shrink-0 self-stretch overflow-hidden rounded bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="38px"
        />
      </span>

      <span className="flex min-w-0 grow flex-col gap-[7px]">
        <span className={`font-extended leading-[1.1] text-black ${pdpType.label}`}>
          {item.name}
        </span>
        <span
          className={`font-extended leading-[1.1] text-black opacity-50 ${pdpType.label}`}
        >
          {formatPrice(item.price)}
        </span>
      </span>

      <span
        className={cn(
          "flex size-[22px] shrink-0 items-center justify-center rounded transition-colors duration-200 ease-out",
          selected
            ? "bg-[#171717]"
            : "border-[1.5px] border-[#CCCCCC] bg-transparent",
          item.locked && "opacity-70",
        )}
        aria-hidden
      >
        <MaterialIcon
          name="check"
          size={18}
          style={{ fontSize: 14 }}
          className={cn(
            "text-white transition-[opacity,scale] duration-200 ease-out",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
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
      className={pdpModuleSectionClass()}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <PdpModuleHeading className="text-center">
            Build your bundle
          </PdpModuleHeading>

          <div className="flex flex-col gap-4">
            <PdpRevealItem className="flex gap-3.5">
              {primaryItem ? <PrimaryBundleCard item={primaryItem} /> : null}

              {addonItems.length ? (
                <div className="flex grow flex-col gap-2">
                  {addonItems.map((item, index) => (
                    <PdpRevealItem key={item.id} as="div" delay={index * 70}>
                      <AddonBundleRow
                        item={item}
                        selected={selectedIds.has(item.id)}
                        onToggle={toggleItem}
                      />
                    </PdpRevealItem>
                  ))}
                </div>
              ) : null}
            </PdpRevealItem>

            <PdpRevealItem
              delay={280}
              className="flex items-center justify-between gap-4"
            >
              <p className={`font-extended m-0 leading-[1.1] text-black ${pdpType.body}`}>
                {justAdded
                  ? `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"} added to bag`
                  : `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"} selected`}
              </p>
              <div className="flex items-center gap-2">
                {hasDiscount ? (
                  <span className="font-extended text-sm leading-[1.1] tracking-[0.2px] text-black line-through opacity-50">
                    {formatPrice(subtotal)}
                  </span>
                ) : null}
                <span className="font-extended text-sm leading-[1.1] tracking-[0.2px] text-black">
                  {formatPrice(total)}
                </span>
              </div>
            </PdpRevealItem>

            <PdpRevealItem delay={350}>
              <button
                type="button"
                onClick={handleAddBundle}
                disabled={selectedItems.length === 0 || justAdded}
                className={cn(
                  "font-extended flex h-[52px] w-full items-center justify-center rounded-full text-base leading-none tracking-[0.2px] transition-colors",
                  justAdded
                    ? "bg-neutral-200 text-neutral-500"
                    : "bg-[#171717] text-white active:bg-neutral-800",
                )}
              >
                {justAdded
                  ? "Added to bag"
                  : `Add bundle to bag (${selectedItems.length})`}
              </button>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
