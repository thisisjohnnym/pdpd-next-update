"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleSectionClass } from "./pdp-module-section";
import {
  pdpCarouselCard15Class,
  pdpCarouselImageClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";
import { PDP_SIMILAR_ITEMS } from "./pdp-data";
import { pdpType } from "./pdp-type";

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
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpModuleHeading>Similar items</PdpModuleHeading>

          <div className={pdpCarouselScrollWrapClass}>
            <ul
              className={cn(
                "m-0 flex list-none gap-3",
                pdpCarouselScrollClass,
              )}
              aria-label="Similar items"
            >
            {PDP_SIMILAR_ITEMS.map((item) => {
              const added = addedIds.has(item.id);

              return (
                <li
                  key={item.id}
                  className={cn("flex flex-col", pdpCarouselCard15Class)}
                >
                  <div
                    className="relative w-full overflow-hidden bg-neutral-100"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className={cn("object-cover object-center", pdpCarouselImageClass)}
                      sizes="(max-width: 1023px) 66vw, 33vw"
                    />
                  </div>

                  <p className={`font-extended mt-3 line-clamp-2 text-black ${pdpType.body}`}>
                    {item.name}
                  </p>
                  <p className={`font-extended mt-1 text-black ${pdpType.label}`}>
                    {item.price}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAdd(item.id)}
                    disabled={added}
                    className={cn(
                      "mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full py-3 transition-colors",
                      pdpType.body,
                      added
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-black text-white",
                    )}
                  >
                    {!added ? (
                      <MaterialIcon
                        name="shopping_bag"
                        size={18}
                        className="shrink-0 text-white"
                        aria-hidden
                      />
                    ) : null}
                    <span className="font-extended -translate-y-px">
                      {added ? "Added" : "Add to bag"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
