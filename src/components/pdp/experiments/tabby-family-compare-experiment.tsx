"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { getAvailableSizesForStyle } from "../pdp-tabby-catalog";
import { PdpModuleHeading } from "../pdp-module-heading";
import { PdpRevealItem } from "../pdp-reveal-item";
import { pdpModuleSectionClass } from "../pdp-module-section";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import {
  tabbyProductPath,
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";
import { pdpType, pdpStrokeCtaClass, pdpStrokeCtaMutedClass } from "../pdp-type";
import { useTransientAddedSet } from "../use-transient-added-set";
import {
  buildTabbyCompareAttributeRows,
  buildTabbyCompareProduct,
  canAddExactCompareProduct,
  getDefaultComparisonTarget,
  type TabbyCompareProduct,
} from "./tabby-family-compare-data";
import { TabbyFamilyComparePickerSheet } from "./tabby-family-compare-picker-sheet";

function CompareProductCard({
  item,
  subtitle,
  badge,
  onOpenPicker,
}: {
  item: Pick<TabbyCompareProduct, "name" | "price" | "imageSrc" | "imageAlt">;
  subtitle?: string;
  badge?: string;
  onOpenPicker?: () => void;
}) {
  const imageBlock = (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
      <Image
        src={item.imageSrc}
        alt={item.imageAlt}
        fill
        className="object-cover object-center"
        sizes="45vw"
      />
      {badge ? (
        <span
          className={cn(
            "absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-black shadow-sm",
            pdpType.micro,
          )}
        >
          {badge}
        </span>
      ) : null}
      {onOpenPicker ? (
        <span
          className="absolute bottom-2 left-2 right-2 z-10 inline-flex items-center justify-center gap-1 rounded-full bg-white/95 px-3 py-2 text-black shadow-sm"
          aria-hidden
        >
          <MaterialIcon
            name="compare_arrows"
            size={18}
            className="shrink-0 leading-none"
          />
          <span className={cn(pdpType.micro, "leading-none")}>
            Compare another style
          </span>
        </span>
      ) : null}
    </div>
  );

  return (
    <>
      {onOpenPicker ? (
        <button
          type="button"
          onClick={onOpenPicker}
          className="group block w-full min-w-0 text-left transition-colors active:opacity-80"
        >
          {imageBlock}
        </button>
      ) : (
        imageBlock
      )}
      <div className="mb-4 px-0.5 pt-1.5">
        <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
          {item.name}
        </p>
        {subtitle ? (
          <p className={cn("font-extended text-neutral-500", pdpType.micro)}>
            {subtitle}
          </p>
        ) : null}
        <p className={`font-extended text-black ${pdpType.micro}`}>{item.price}</p>
      </div>
    </>
  );
}

function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <span className={cn("text-neutral-500", pdpType.micro)}>{label}</span>
      <span
        className={cn(
          "font-extended text-right tracking-[0.2px] text-black",
          pdpType.micro,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function CompareActionButton({
  label,
  added,
  onClick,
  variant = "primary",
  disabled = false,
  className,
}: {
  label: string;
  added?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || added}
      className={cn(
        "inline-flex w-full min-w-0 items-center justify-center px-3 py-3 transition-colors",
        pdpType.micro,
        added
          ? pdpStrokeCtaMutedClass
          : variant === "primary"
            ? "rounded-full bg-black text-white"
            : pdpStrokeCtaClass,
        disabled && !added && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="font-extended truncate">{added ? "Added" : label}</span>
    </button>
  );
}

type TabbyFamilyCompareExperimentProps = {
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/**
 * Experiment variant — Explore / Compare Tabby Styles family discovery module.
 * Does not mutate the primary PDP selection unless the shopper taps View product.
 */
export function TabbyFamilyCompareExperiment({
  onAddToBag,
  onPickerOpenChange,
}: TabbyFamilyCompareExperimentProps) {
  const router = useRouter();
  const tabby = useOptionalTabbyVariant();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { isAdded, confirmAdd } = useTransientAddedSet();

  const currentProduct = useMemo<TabbyCompareProduct | null>(() => {
    if (!tabby) {
      return null;
    }

    return buildTabbyCompareProduct(
      tabby.styleId,
      tabby.size,
      tabby.selectedColorId,
    );
  }, [tabby]);

  const [comparisonTarget, setComparisonTarget] = useState<{
    styleId: TabbyStyleId;
    size: TabbySize;
  } | null>(null);

  useEffect(() => {
    if (!tabby) {
      return;
    }

    setComparisonTarget((current) => {
      if (current) {
        return current;
      }

      const fallback = getDefaultComparisonTarget(
        tabby.styleId,
        tabby.size,
        tabby.selectedColorId,
      );

      return {
        styleId: fallback.styleId,
        size: fallback.size,
      };
    });
  }, [tabby]);

  if (!tabby || !currentProduct || !comparisonTarget) {
    return null;
  }

  const comparisonProduct = buildTabbyCompareProduct(
    comparisonTarget.styleId,
    comparisonTarget.size,
    tabby.selectedColorId,
  );

  const compareRows = buildTabbyCompareAttributeRows(
    currentProduct,
    comparisonProduct,
  );

  const canAddComparison = canAddExactCompareProduct(
    comparisonProduct,
    tabby.selectedColorId,
  );

  const handlePickerOpenChange = (open: boolean) => {
    setPickerOpen(open);
    onPickerOpenChange?.(open);
  };

  const handleComparisonSelect = (styleId: TabbyStyleId, size: TabbySize) => {
    if (styleId === tabby.styleId && size === tabby.size) {
      const alternateSize = getAvailableSizesForStyle(styleId).find(
        (entry) => entry !== size,
      );

      if (alternateSize) {
        setComparisonTarget({ styleId, size: alternateSize });
      }

      return;
    }

    setComparisonTarget({ styleId, size });
  };

  const handleViewProduct = () => {
    router.push(
      tabbyProductPath(comparisonProduct.slug, comparisonProduct.colorId),
    );
  };

  const handleAddComparison = () => {
    if (!canAddComparison) {
      return;
    }

    onAddToBag?.();
    confirmAdd(comparisonProduct.slug);
  };

  return (
    <section
      data-header-surface="light"
      data-experiment="tabby-family-compare"
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpModuleHeading>Explore the Tabby family</PdpModuleHeading>
          <PdpRevealItem delay={80}>
            <p className={cn("mb-4 text-neutral-600", pdpType.body)}>
              Find the silhouette, size, and finish that fits you best.
            </p>
          </PdpRevealItem>

          <div className="flex flex-col gap-4">
            <PdpRevealItem
              className="grid grid-cols-2 items-stretch gap-2"
              aria-label="Compare Tabby styles"
            >
              <article className="flex min-w-0 flex-col">
                <CompareProductCard
                  item={currentProduct}
                  subtitle={currentProduct.subtitle}
                  badge="Your selection"
                />
                <CompareActionButton
                  className="mt-auto shrink-0"
                  label={`Add ${currentProduct.shortLabel}`}
                  added={isAdded(currentProduct.slug)}
                  onClick={() => {
                    onAddToBag?.();
                    confirmAdd(currentProduct.slug);
                  }}
                  variant="primary"
                />
              </article>

              <article className="flex min-w-0 flex-col">
                <CompareProductCard
                  item={comparisonProduct}
                  subtitle={comparisonProduct.subtitle}
                  onOpenPicker={() => handlePickerOpenChange(true)}
                />
                {comparisonProduct.unavailable ? (
                  <p className={cn("mb-2 px-0.5 text-neutral-500", pdpType.micro)}>
                    This combination is not available right now.
                  </p>
                ) : comparisonProduct.adjustmentMessage ? (
                  <p className={cn("mb-2 px-0.5 text-neutral-500", pdpType.micro)}>
                    {comparisonProduct.adjustmentMessage}
                  </p>
                ) : null}
                <CompareActionButton
                  className="mt-auto shrink-0"
                  label="View product"
                  onClick={handleViewProduct}
                  variant="primary"
                  disabled={comparisonProduct.unavailable}
                />
                {canAddComparison ? (
                  <CompareActionButton
                    className="mt-2 shrink-0"
                    label={`Add ${comparisonProduct.shortLabel}`}
                    added={isAdded(comparisonProduct.slug)}
                    onClick={handleAddComparison}
                    variant="secondary"
                  />
                ) : null}
              </article>
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
              <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
                {compareRows.map((row) => (
                  <CompareRow key={row.id} label={row.label} value={row.value} />
                ))}
              </div>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>

      <TabbyFamilyComparePickerSheet
        open={pickerOpen}
        currentStyleId={tabby.styleId}
        comparison={comparisonProduct}
        onClose={() => handlePickerOpenChange(false)}
        onSelect={handleComparisonSelect}
      />
    </section>
  );
}
