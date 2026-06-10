"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PDP_SIMILAR_ITEMS } from "./pdp-data";

type PdpSimilarItemsCarouselProps = {
  onAddToBag: () => void;
};

/** Horizontal recommendation rail — similar bags with quick add to bag */
export function PdpSimilarItemsCarousel({ onAddToBag }: PdpSimilarItemsCarouselProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag();
      return new Set(current).add(id);
    });
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass()}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <h2 className={pdpModuleHeadingClass()}>Similar items</h2>

          <ul
            className="m-0 flex list-none gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            aria-label="Similar items"
          >
            {PDP_SIMILAR_ITEMS.map((item) => {
              const added = addedIds.has(item.id);

              return (
                <li
                  key={item.id}
                  className="flex w-[148px] shrink-0 snap-start flex-col snap-always"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="148px"
                    />
                  </div>

                  <p className="font-extended mt-3 line-clamp-2 text-xs leading-snug tracking-[0.2px] text-black">
                    {item.name}
                  </p>
                  <p className="font-extended mt-1 text-xs tracking-[0.2px] text-black">
                    {item.price}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAdd(item.id)}
                    disabled={added}
                    className={cn(
                      "font-extended mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full py-2.5 text-xs tracking-[0.2px] transition-colors",
                      added
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-black text-white",
                    )}
                  >
                    <span className="translate-y-[1.5px]">
                      {added ? "Added" : "Add to Bag"}
                    </span>
                    {!added ? (
                      <MaterialIcon name="add" size={18} className="text-white" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </GridItem>
      </PageGrid>
    </section>
  );
}
