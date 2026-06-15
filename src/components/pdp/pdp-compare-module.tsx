"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import {
  PDP_COMPARE_SELECTED,
  PDP_FAMILY_COMPARE_ALTERNATIVES,
  type PdpCompareDifferenceRow,
  type PdpCompareItem,
  type PdpFamilyCompareAlternative,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

type CompareProductCardProps = {
  item: PdpCompareItem | PdpFamilyCompareAlternative;
  selected?: boolean;
  onCycle?: () => void;
  cycleLabel?: string;
};

function CompareProductCard({
  item,
  selected = false,
  onCycle,
  cycleLabel,
}: CompareProductCardProps) {
  const interactive = Boolean(onCycle);

  return (
    <button
      type="button"
      onClick={onCycle}
      disabled={!interactive}
      className={cn(
        "flex min-w-0 flex-1 flex-col border bg-white text-left transition-colors",
        selected
          ? "border-black ring-1 ring-inset ring-black"
          : "border-neutral-200",
        interactive && "cursor-pointer hover:border-neutral-400",
        !interactive && "cursor-default",
      )}
      aria-label={
        interactive
          ? `${item.name}. ${cycleLabel ?? "Show next bag in family"}`
          : item.name
      }
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="40vw"
        />
      </div>
      <div className="flex flex-col gap-0.5 px-2.5 py-2">
        <p
          className={cn(
            "font-extended line-clamp-2 text-sm tracking-[0.2px] text-black",
            pdpType.label,
          )}
        >
          {item.name}
        </p>
        <p className={cn("font-extended text-neutral-600", pdpType.micro)}>
          {item.price}
        </p>
        {interactive && cycleLabel ? (
          <p className={`mt-0.5 text-neutral-500 ${pdpType.micro}`}>{cycleLabel}</p>
        ) : null}
      </div>
    </button>
  );
}

function DifferenceRow({ row }: { row: PdpCompareDifferenceRow }) {
  const isSelectedWin = row.advantage === "selected";
  const isAlternativeWin = row.advantage === "alternative";
  const isPrice = row.variant === "price";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-b-0">
      <span className={`text-neutral-500 ${pdpType.micro}`}>{row.label}</span>
      <span
        className={cn(
          "font-extended inline-flex items-center gap-1 text-sm tracking-[0.2px]",
          isSelectedWin && "text-black",
          isAlternativeWin && "text-neutral-700",
          !isSelectedWin && !isAlternativeWin && !isPrice && "text-neutral-700",
          isPrice && "text-neutral-700",
        )}
      >
        {row.display}
        {isSelectedWin ? (
          <MaterialIcon
            name="check"
            size={18}
            className="text-black"
            aria-hidden
          />
        ) : null}
      </span>
    </div>
  );
}

type PdpCompareModuleProps = {
  onAddToBag?: () => void;
};

/** Family compare — one alternative at a time with key differences and AI browsing assist */
export function PdpCompareModule({
  onAddToBag,
}: PdpCompareModuleProps) {
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const selected = PDP_COMPARE_SELECTED;
  const selectedShortName = selected.shortName ?? selected.name;
  const alternativeCount = PDP_FAMILY_COMPARE_ALTERNATIVES.length;
  const alternative =
    PDP_FAMILY_COMPARE_ALTERNATIVES[alternativeIndex] ??
    PDP_FAMILY_COMPARE_ALTERNATIVES[0];

  const cycleAlternative = () => {
    setAlternativeIndex((current) => (current + 1) % alternativeCount);
  };

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag?.();
      return new Set(current).add(id);
    });
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <h2 className={cn(pdpModuleHeadingClass({ lead: false }), "mb-4")}>
            Tabby family
          </h2>

          <div className="flex items-stretch gap-2">
            <CompareProductCard item={selected} selected />
            <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-0.5">
              <MaterialIcon
                name="compare_arrows"
                size={20}
                className="text-neutral-400"
                aria-hidden
              />
            </div>
            <CompareProductCard
              item={alternative}
              onCycle={cycleAlternative}
              cycleLabel={`${alternativeIndex + 1} of ${alternativeCount} · tap for next`}
            />
          </div>

          <div className="mt-5">
            <p
              className={cn(
                "mb-2 font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-500",
              )}
            >
              Key differences
            </p>
            <div className="border border-neutral-200 bg-white px-3 py-1">
              {alternative.differences.map((row) => (
                <DifferenceRow key={row.id} row={row} />
              ))}
            </div>
          </div>

          <div
            className="mt-4 border border-neutral-200 bg-neutral-50 px-3 py-3"
            aria-live="polite"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center bg-black text-white">
                <MaterialIcon
                  name="auto_awesome"
                  size={18}
                  className="text-white"
                  aria-hidden
                />
              </span>
              <div className="min-w-0">
                <p className="font-extended text-sm tracking-[0.2px] text-black">
                  {alternative.aiInsight.title}
                </p>
                <p className={`mt-1 text-neutral-700 ${pdpType.caption}`}>
                  {alternative.aiInsight.body}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => handleAdd(selected.id)}
              disabled={addedIds.has(selected.id)}
              className={cn(
                "inline-flex min-w-0 flex-1 items-center justify-center px-3 py-3 transition-colors",
                pdpType.micro,
                addedIds.has(selected.id)
                  ? "bg-neutral-100 text-neutral-500"
                  : "bg-black text-white",
              )}
            >
              <span className="font-extended truncate">
                {addedIds.has(selected.id)
                  ? "Added"
                  : `Add ${selectedShortName}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleAdd(alternative.id)}
              disabled={addedIds.has(alternative.id)}
              className={cn(
                "inline-flex min-w-0 flex-1 items-center justify-center border px-3 py-3 transition-colors",
                pdpType.micro,
                addedIds.has(alternative.id)
                  ? "border-neutral-200 bg-neutral-100 text-neutral-500"
                  : "border-neutral-300 bg-white text-black hover:border-neutral-400",
              )}
            >
              <span className="font-extended truncate">
                {addedIds.has(alternative.id)
                  ? "Added"
                  : `Add ${alternative.shortName}`}
              </span>
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
