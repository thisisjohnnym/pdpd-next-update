"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpComparePickerSheet } from "./pdp-compare-picker-sheet";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import {
  PDP_COMPARE_SELECTED,
  PDP_FAMILY_COMPARE_ALTERNATIVES,
  type PdpCompareDifferenceRow,
  type PdpCompareItem,
  type PdpFamilyCompareAlternative,
} from "./pdp-data";
import { pdpType, pdpStrokeCtaClass, pdpStrokeCtaMutedClass } from "./pdp-type";

function CompareProductCard({
  item,
  showChangeAffordance = false,
}: {
  item: PdpCompareItem | PdpFamilyCompareAlternative;
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
            className="absolute left-2.5 top-2.5 z-10 flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-black shadow-sm"
            aria-hidden
          >
            <MaterialIcon name="swap_horiz" size={18} />
          </span>
        ) : null}
      </div>
      <div className="px-0.5 pt-1.5">
        <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
          {item.name}
        </p>
        <p className={`font-extended text-black ${pdpType.micro}`}>{item.price}</p>
      </div>
    </>
  );
}

function getKeyDifferences(rows: PdpCompareDifferenceRow[]) {
  const wins = rows.filter((row) => row.advantage === "selected");
  const price = rows.find((row) => row.variant === "price");
  const picked = wins.slice(0, 3);

  if (price && !picked.includes(price)) {
    picked.push(price);
  }

  return picked.slice(0, 4);
}

function DifferenceRow({ row }: { row: PdpCompareDifferenceRow }) {
  const isSelectedWin = row.advantage === "selected";

  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className={`text-neutral-500 ${pdpType.micro}`}>{row.label}</span>
      <span
        className={cn(
          "font-extended text-right tracking-[0.2px]",
          pdpType.micro,
          isSelectedWin ? "text-black" : "text-neutral-600",
        )}
      >
        {row.display}
      </span>
    </div>
  );
}

function CompareAddButton({
  label,
  added,
  onClick,
  variant = "primary",
  className,
}: {
  label: string;
  added: boolean;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={added}
      className={cn(
        "inline-flex w-full min-w-0 items-center justify-center px-3 py-3 transition-colors",
        pdpType.micro,
        added
          ? pdpStrokeCtaMutedClass
          : variant === "primary"
            ? "rounded-full bg-black text-white"
            : pdpStrokeCtaClass,
        className,
      )}
    >
      <span className="font-extended truncate">{label}</span>
    </button>
  );
}

type PdpCompareModuleProps = {
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/** Tabby family — side-by-side compare + picker tray for swapping the right bag */
export function PdpCompareModule({
  onAddToBag,
  onPickerOpenChange,
}: PdpCompareModuleProps) {
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [insightDismissed, setInsightDismissed] = useState(false);

  const handlePickerOpenChange = (open: boolean) => {
    setPickerOpen(open);
    onPickerOpenChange?.(open);
  };

  const handleAlternativeSelect = (index: number) => {
    setAlternativeIndex(index);
    setInsightDismissed(false);
  };

  const selected = PDP_COMPARE_SELECTED;
  const selectedShortName = selected.shortName ?? selected.name;
  const alternative =
    PDP_FAMILY_COMPARE_ALTERNATIVES[alternativeIndex] ??
    PDP_FAMILY_COMPARE_ALTERNATIVES[0];
  const keyDifferences = getKeyDifferences(alternative.differences);

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
          <PdpModuleHeading>Compare the family</PdpModuleHeading>

          <div className="flex flex-col gap-4">
            <div
              className="grid grid-cols-2 items-stretch gap-2"
              aria-label="Compare Tabby family bags"
            >
              <article className="flex min-w-0 flex-col">
                <CompareProductCard item={selected} />
                <CompareAddButton
                  className="mt-auto shrink-0 pt-2"
                  label={
                    addedIds.has(selected.id)
                      ? "Added"
                      : `Add ${selectedShortName}`
                  }
                  added={addedIds.has(selected.id)}
                  onClick={() => handleAdd(selected.id)}
                  variant="primary"
                />
              </article>

              <article className="flex min-w-0 flex-col">
                <button
                  type="button"
                  onClick={() => handlePickerOpenChange(true)}
                  className="group block w-full min-w-0 text-left transition-colors active:opacity-80"
                  aria-label={`Compare with ${alternative.shortName}. Tap to choose a different bag.`}
                >
                  <CompareProductCard item={alternative} showChangeAffordance />
                </button>
                <CompareAddButton
                  className="mt-auto shrink-0 pt-2"
                  label={
                    addedIds.has(alternative.id)
                      ? "Added"
                      : `Add ${alternative.shortName}`
                  }
                  added={addedIds.has(alternative.id)}
                  onClick={() => handleAdd(alternative.id)}
                  variant="secondary"
                />
              </article>
            </div>

            <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
              {keyDifferences.map((row) => (
                <DifferenceRow key={row.id} row={row} />
              ))}
            </div>

            {!insightDismissed ? (
              <PdpAiInsightCard
                variant="minimal"
                title={alternative.aiInsight.title}
                body={alternative.aiInsight.body}
                footer={
                  <PdpTextLinkCta
                    type="button"
                    onClick={() => setInsightDismissed(true)}
                    className={pdpType.micro}
                  >
                    Got it
                  </PdpTextLinkCta>
                }
                ariaLive="polite"
              />
            ) : null}
          </div>
        </GridItem>
      </PageGrid>

      <PdpComparePickerSheet
        open={pickerOpen}
        alternatives={PDP_FAMILY_COMPARE_ALTERNATIVES}
        selectedIndex={alternativeIndex}
        onClose={() => handlePickerOpenChange(false)}
        onSelect={handleAlternativeSelect}
      />
    </section>
  );
}
