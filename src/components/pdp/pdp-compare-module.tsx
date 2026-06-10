"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import {
  pdpCarouselScrollClass,
  pdpCompareCarouselCardClass,
} from "./pdp-carousel";
import {
  PDP_COLORS,
  PDP_COMPARE_CATEGORIES,
  PDP_COMPARE_OPTIONS,
  PDP_COMPARE_SELECTED,
  type PdpCompareItem,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

const CARD_WIDTH_CLASS = pdpCompareCarouselCardClass;

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
    <article
      className={cn(
        "flex shrink-0 snap-start flex-col snap-always",
        CARD_WIDTH_CLASS,
      )}
    >
      <p
        className={cn(
          "font-extended mb-1 h-3",
          pdpType.micro,
          item.selected ? "text-black uppercase tracking-[0.6px]" : "invisible",
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
          sizes="(max-width: 1023px) 66vw, 33vw"
        />
      </div>

      <p className={`font-extended mt-1.5 line-clamp-1 text-black ${pdpType.label}`}>
        {item.name}
      </p>
      <p className={`font-extended text-black ${pdpType.micro}`}>
        {item.price}
      </p>
      <p
        className={cn(
          "text-neutral-500",
          pdpType.micro,
          !item.colorLabel && "invisible",
        )}
      >
        {item.colorLabel ?? "—"}
      </p>

      <div className="mt-2 flex flex-col border-t border-neutral-200">
        {PDP_COMPARE_CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            className={cn(
              "border-neutral-200 py-1.5",
              index > 0 && "border-t",
            )}
          >
            <p className={`mb-0.5 text-neutral-500 ${pdpType.micro}`}>
              {category.label}
            </p>
            {category.id === "material" ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-neutral-100">
                <Image
                  src={item.materialSwatch.src}
                  alt={item.materialSwatch.alt}
                  fill
                  className="object-cover scale-[1.35]"
                  style={{
                    objectPosition: item.materialSwatch.objectPosition ?? "center",
                  }}
                  sizes="(max-width: 1023px) 66vw, 33vw"
                />
                <span className="sr-only">{item.material}</span>
              </div>
            ) : (
              <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
                {item[category.id]}
              </p>
            )}
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
        <GridItem mobile={12} desktop={24} className="min-w-0 overflow-visible">
          <h2 className={cn(pdpModuleHeadingClass({ lead: false }), "mb-3")}>
            Compare
          </h2>

          <div
            className={cn("flex gap-2", pdpCarouselScrollClass)}
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
