"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselCard15Class,
  pdpCarouselScrollClass,
} from "./pdp-carousel";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PDP_RECENTLY_VIEWED } from "./pdp-data";
import { pdpType } from "./pdp-type";

/** History rail — same card scale as similar items, with viewed-time chips */
export function PdpRecentlyViewedCarousel() {
  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0 overflow-visible">
          <h2 className={pdpModuleHeadingClass()}>Recently viewed</h2>

          <ul
            className={cn(
              "m-0 flex list-none gap-3",
              pdpCarouselScrollClass,
            )}
            aria-label="Recently viewed items"
          >
            {PDP_RECENTLY_VIEWED.map((item, index) => (
              <li
                key={item.id}
                className={cn("flex flex-col", pdpCarouselCard15Class)}
              >
                <button
                  type="button"
                  className="group relative w-full text-left"
                  aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.03]"
                      sizes="(max-width: 1023px) 66vw, 33vw"
                      priority={index === 0}
                    />

                    <span
                      className={`font-extended absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-neutral-700 shadow-sm backdrop-blur-sm ${pdpType.micro}`}
                    >
                      {item.viewedLabel}
                    </span>
                  </div>
                </button>

                <p className={`font-extended mt-3 line-clamp-2 text-black ${pdpType.body}`}>
                  {item.name}
                </p>
                <p className={`font-extended mt-1 text-black ${pdpType.label}`}>
                  {item.price}
                </p>
                <button
                  type="button"
                  className={`font-extended mt-3 inline-flex items-center gap-0.5 text-black ${pdpType.label}`}
                >
                  View again
                  <MaterialIcon name="arrow_forward" size={18} className="text-black" />
                </button>
              </li>
            ))}
          </ul>
        </GridItem>
      </PageGrid>
    </section>
  );
}
