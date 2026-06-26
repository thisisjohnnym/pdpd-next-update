"use client";

import Image from "next/image";
import { useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpComparePickerSheet } from "./pdp-compare-picker-sheet";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import {
  PDP_COMPARE_SELECTED,
  PDP_FAMILY_COMPARE_ALTERNATIVES,
  type PdpCompareDifferenceRow,
  type PdpCompareItem,
  type PdpCompareScale,
  type PdpFamilyCompareAlternative,
} from "./pdp-data";
import { pdpType, pdpStrokeCtaClass, pdpStrokeCtaMutedClass } from "./pdp-type";
import { useTransientAddedSet } from "./use-transient-added-set";

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
            className="absolute left-2 top-2 z-10 inline-flex items-center justify-center gap-1 rounded-full border border-neutral-200 bg-white/95 px-3 py-1.5 text-black shadow-sm"
            aria-hidden
          >
            <MaterialIcon
              name="swap_horiz"
              size={18}
              className="shrink-0 leading-none"
            />
            <span className={cn(pdpType.micro, "leading-none")}>Change</span>
          </span>
        ) : null}
      </div>
      <div className="mb-4 px-0.5 pt-1.5">
        <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
          {item.name}
        </p>
        <p className={`font-extended text-black ${pdpType.micro}`}>{item.price}</p>
      </div>
    </>
  );
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
          isSelectedWin ? "text-black" : "text-neutral-400",
        )}
      >
        {row.display}
      </span>
    </div>
  );
}

const SCALE_IDS = new Set(["size", "carry-capacity", "weight"]);

/** Relative delta vs the pinned bag — arrow + one word, no legend to decode */
// fallow-ignore-next-line complexity
function CompareDeltaRow({ scale }: { scale: PdpCompareScale }) {
  const diff = scale.alternative - scale.selected;
  const isSame = Math.abs(diff) < 0.02;
  const isHigher = diff > 0;
  const word = isSame ? "Same" : isHigher ? scale.highLabel : scale.lowLabel;

  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className={cn("text-neutral-500", pdpType.micro)}>
        {scale.label}
      </span>
      <span
        className={cn(
          "font-extended inline-flex items-center gap-1 tracking-[0.2px]",
          pdpType.micro,
          isSame ? "text-neutral-400" : "text-black",
        )}
      >
        {isSame ? null : (
          <MaterialIcon
            name={isHigher ? "arrow_upward" : "arrow_downward"}
            size={18}
            className="shrink-0 leading-none"
          />
        )}
        {word}
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
  const { isAdded, confirmAdd } = useTransientAddedSet();
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [showAllDifferences, setShowAllDifferences] = useState(false);

  const handlePickerOpenChange = (open: boolean) => {
    setPickerOpen(open);
    onPickerOpenChange?.(open);
  };

  const handleAlternativeSelect = (index: number) => {
    setAlternativeIndex(index);
    setInsightDismissed(false);
    setShowAllDifferences(false);
  };

  const selected = PDP_COMPARE_SELECTED;
  const selectedShortName = selected.shortName ?? selected.name;
  const alternative =
    PDP_FAMILY_COMPARE_ALTERNATIVES[alternativeIndex] ??
    PDP_FAMILY_COMPARE_ALTERNATIVES[0];
  const priceRow = alternative.differences.find(
    (row) => row.variant === "price",
  );
  const verbalRows = alternative.differences.filter(
    (row) => row.variant !== "price" && !SCALE_IDS.has(row.id),
  );

  const handleAdd = (id: string) => {
    onAddToBag?.();
    confirmAdd(id);
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpModuleHeading>Compare the family</PdpModuleHeading>

          <div className="flex flex-col gap-4">
            <PdpRevealItem
              className="grid grid-cols-2 items-stretch gap-2"
              aria-label="Compare Tabby family bags"
            >
              <article className="flex min-w-0 flex-col">
                <CompareProductCard item={selected} />
                <CompareAddButton
                  className="mt-auto shrink-0"
                  label={
                    isAdded(selected.id)
                      ? "Added"
                      : `Add ${selectedShortName}`
                  }
                  added={isAdded(selected.id)}
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
                  className="mt-auto shrink-0"
                  label={
                    isAdded(alternative.id)
                      ? "Added"
                      : `Add ${alternative.shortName}`
                  }
                  added={isAdded(alternative.id)}
                  onClick={() => handleAdd(alternative.id)}
                  variant="secondary"
                />
              </article>
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className={cn("text-neutral-500", pdpType.tag)}>
                    {alternative.shortName} vs {selectedShortName}
                  </span>
                  <p
                    className={cn(
                      "font-extended text-black",
                      pdpType.body,
                    )}
                  >
                    {alternative.summary}
                  </p>
                </div>

                <div className="flex flex-col border-y border-neutral-200 py-2">
                  <div className="flex flex-col">
                    {alternative.scales.map((scale) => (
                      <CompareDeltaRow key={scale.id} scale={scale} />
                    ))}
                  </div>
                </div>

                {priceRow ? (
                  <div className="border-b border-neutral-200">
                    <DifferenceRow row={priceRow} />
                  </div>
                ) : null}

                {verbalRows.length > 0 ? (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setShowAllDifferences((open) => !open)}
                      aria-expanded={showAllDifferences}
                      className={cn(
                        "flex items-center justify-between gap-2 py-1 text-left text-neutral-500 transition-colors active:text-black",
                        pdpType.micro,
                      )}
                    >
                      <span className="font-extended">
                        {showAllDifferences
                          ? "Hide details"
                          : "Show all differences"}
                      </span>
                      <MaterialIcon
                        name="expand_more"
                        size={18}
                        className={cn(
                          "shrink-0 leading-none transition-transform duration-300 ease-out",
                          showAllDifferences && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      role="region"
                      aria-hidden={!showAllDifferences}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-200 ease-out",
                        showAllDifferences ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="flex flex-col divide-y divide-neutral-200 border-t border-neutral-200">
                          {verbalRows.map((row) => (
                            <DifferenceRow key={row.id} row={row} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </PdpRevealItem>

            {/* Temporarily hidden — "Based on your browsing" insight card */}
            {false && !insightDismissed ? (
              <PdpRevealItem delay={210}>
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
              </PdpRevealItem>
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
