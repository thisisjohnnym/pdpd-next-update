"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import {
  PDP_COLORS,
  PDP_COMPARE_CATEGORIES,
  PDP_COMPARE_OPTIONS,
  PDP_COMPARE_SELECTED,
  type PdpCompareItem,
} from "./pdp-data";

const COLUMN_WIDTH = 132;

type CompareItemView = PdpCompareItem & {
  selected?: boolean;
  colorLabel?: string;
};

function buildCompareItems(colorLabel: string): CompareItemView[] {
  return [
    {
      ...PDP_COMPARE_SELECTED,
      selected: true,
      colorLabel,
    },
    ...PDP_COMPARE_OPTIONS,
  ];
}

type CompareColumnProps = {
  item: CompareItemView;
};

function CompareColumn({ item }: CompareColumnProps) {
  return (
    <article className="flex w-[132px] shrink-0 snap-start flex-col snap-always">
      <p
        className={cn(
          "font-extended mb-2 h-[14px] text-[10px] uppercase tracking-[0.6px]",
          item.selected ? "text-black" : "invisible",
        )}
      >
        This item
      </p>

      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden bg-neutral-100",
          item.selected && "ring-1 ring-inset ring-black",
        )}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes={`${COLUMN_WIDTH}px`}
        />
      </div>

      <p className="font-extended mt-2 line-clamp-2 min-h-[2.5rem] text-[11px] leading-snug tracking-[0.2px] text-black">
        {item.name}
      </p>
      <p className="font-extended mt-1 text-[11px] tracking-[0.2px] text-black">
        {item.price}
      </p>
      <p
        className={cn(
          "mt-0.5 h-[14px] text-[10px] tracking-[0.2px] text-neutral-500",
          !item.colorLabel && "invisible",
        )}
      >
        {item.colorLabel ?? "—"}
      </p>

      <div className="mt-3 flex flex-col border-t border-neutral-200">
        {PDP_COMPARE_CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            className={cn(
              "border-neutral-200 py-3",
              index > 0 && "border-t",
            )}
          >
            <p className="mb-1.5 text-[11px] tracking-[0.2px] text-neutral-500">
              {category.label}
            </p>
            <p className="font-extended min-h-[2rem] text-[11px] leading-snug tracking-[0.2px] text-black">
              {item[category.id]}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

type PdpCompareModuleProps = {
  selectedColorId: string;
};

/** Horizontal compare carousel — current item + alternatives with four spec categories */
export function PdpCompareModule({ selectedColorId }: PdpCompareModuleProps) {
  const selectedColor =
    PDP_COLORS.find((color) => color.id === selectedColorId) ?? PDP_COLORS[0];
  const items = buildCompareItems(selectedColor.name);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <h2 className={pdpModuleHeadingClass()}>Compare</h2>

          <div
            className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            aria-label="Compare bags"
          >
            {items.map((item) => (
              <CompareColumn key={item.id} item={item} />
            ))}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
