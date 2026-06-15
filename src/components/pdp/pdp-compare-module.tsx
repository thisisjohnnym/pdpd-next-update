"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpComparePickerSheet } from "./pdp-compare-picker-sheet";
import {
  pdpModuleSectionClass,
  pdpModuleHeadingClass,
  pdpModuleHeadingLeadClass,
} from "./pdp-module-section";
import {
  PDP_COLORS,
  PDP_COMPARE_SELECTED,
  PDP_FAMILY_COMPARE_ALTERNATIVES,
  type PdpCompareDifferenceRow,
  type PdpCompareItem,
  type PdpFamilyCompareAlternative,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

function CompareProductCard({
  item,
  colorLabel,
  showChangeAffordance = false,
}: {
  item: PdpCompareItem | PdpFamilyCompareAlternative;
  colorLabel?: string;
  showChangeAffordance?: boolean;
}) {
  return (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="45vw"
        />
        {showChangeAffordance ? (
          <span
            className={`font-extended absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 leading-none tracking-[0.2px] text-black shadow-sm ${pdpType.micro}`}
          >
            <MaterialIcon
              name="swap_horiz"
              size={18}
              className="shrink-0 text-black"
              aria-hidden
            />
            Change
          </span>
        ) : null}
      </div>
      <div className="px-0.5 pt-1.5">
        <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
          {item.name}
        </p>
        <p className={`font-extended text-black ${pdpType.micro}`}>{item.price}</p>
        {colorLabel ? (
          <p className={`text-neutral-500 ${pdpType.micro}`}>{colorLabel}</p>
        ) : null}
      </div>
    </>
  );
}

function DifferenceRow({ row }: { row: PdpCompareDifferenceRow }) {
  const isSelectedWin = row.advantage === "selected";
  const isAlternativeWin = row.advantage === "alternative";
  const isPrice = row.variant === "price";

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
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
  selectedColorId?: string;
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/** Tabby family — side-by-side compare + picker tray for swapping the right bag */
export function PdpCompareModule({
  selectedColorId,
  onAddToBag,
  onPickerOpenChange,
}: PdpCompareModuleProps) {
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [insightDismissed, setInsightDismissed] = useState(false);

  useEffect(() => {
    onPickerOpenChange?.(pickerOpen);
  }, [onPickerOpenChange, pickerOpen]);

  useEffect(() => {
    setInsightDismissed(false);
  }, [alternativeIndex]);

  const selected = PDP_COMPARE_SELECTED;
  const selectedShortName = selected.shortName ?? selected.name;
  const selectedColor =
    PDP_COLORS.find((color) => color.id === selectedColorId) ?? PDP_COLORS[0];
  const alternative =
    PDP_FAMILY_COMPARE_ALTERNATIVES[alternativeIndex] ??
    PDP_FAMILY_COMPARE_ALTERNATIVES[0];

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
      className={pdpModuleSectionClass({ variant: "muted", first: true })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <h2
            className={cn(
              pdpModuleHeadingClass({ lead: false }),
              pdpModuleHeadingLeadClass(),
            )}
          >
            Compare the family
          </h2>

          <div className="flex flex-col gap-5">
            <div
              className="grid grid-cols-2 gap-2"
              aria-label="Compare Tabby family bags"
            >
              <article className="min-w-0 bg-white">
                <CompareProductCard
                  item={selected}
                  colorLabel={selectedColor.name}
                />
              </article>

              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="group min-w-0 bg-white text-left transition-colors active:bg-neutral-50"
                aria-label={`Compare with ${alternative.shortName}. Tap to choose a different bag.`}
              >
                <CompareProductCard item={alternative} showChangeAffordance />
              </button>
            </div>

            <div>
              <p
                className={cn(
                  "mb-2 font-extended text-[10px] uppercase tracking-[0.6px] text-neutral-500",
                )}
              >
                Key differences vs {alternative.shortName}
              </p>
              <div className="border border-neutral-200 bg-white px-3 py-1">
                <div className="flex flex-col divide-y divide-neutral-200">
                  {alternative.differences.map((row) => (
                    <DifferenceRow key={row.id} row={row} />
                  ))}
                </div>
              </div>
            </div>

            {!insightDismissed ? (
              <div
                className="relative rounded-xl bg-neutral-50 px-2.5 py-2 pr-8"
                aria-live="polite"
              >
                <button
                  type="button"
                  onClick={() => setInsightDismissed(true)}
                  aria-label="Dismiss recommendation"
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full text-neutral-500 transition-colors active:bg-neutral-200/80"
                >
                  <MaterialIcon name="close" size={16} />
                </button>
                <div className="flex items-start gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <MaterialIcon
                      name="auto_awesome"
                      size={14}
                      className="text-white"
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0">
                    <p className={`font-extended text-black ${pdpType.micro}`}>
                      {alternative.aiInsight.title}
                    </p>
                    <p className={`mt-0.5 text-neutral-600 ${pdpType.micro}`}>
                      {alternative.aiInsight.body}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAdd(selected.id)}
                disabled={addedIds.has(selected.id)}
                className={cn(
                  "inline-flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3 transition-colors",
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
                  "inline-flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3 transition-colors",
                  pdpType.micro,
                  addedIds.has(alternative.id)
                    ? "bg-neutral-100 text-neutral-500"
                    : "bg-neutral-100 text-black hover:bg-neutral-200/80",
                )}
              >
                <span className="font-extended truncate">
                  {addedIds.has(alternative.id)
                    ? "Added"
                    : `Add ${alternative.shortName}`}
                </span>
              </button>
            </div>
          </div>
        </GridItem>
      </PageGrid>

      <PdpComparePickerSheet
        open={pickerOpen}
        alternatives={PDP_FAMILY_COMPARE_ALTERNATIVES}
        selectedIndex={alternativeIndex}
        onClose={() => setPickerOpen(false)}
        onSelect={setAlternativeIndex}
      />
    </section>
  );
}
