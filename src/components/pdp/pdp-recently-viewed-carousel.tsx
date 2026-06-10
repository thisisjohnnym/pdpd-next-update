"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { PDP_RECENTLY_VIEWED } from "./pdp-data";

/** Timeline-style history rail — portrait cards, time chips, view again */
export function PdpRecentlyViewedCarousel() {
  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="mb-6 flex items-center gap-2">
            <MaterialIcon name="history" size={20} className="text-neutral-700" />
            <h2 className={pdpModuleHeadingClass({ lead: false })}>Recently viewed</h2>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[calc(50%-0.5px)] h-px bg-neutral-300"
            />

            <ul
              className="relative m-0 flex list-none gap-4 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
              aria-label="Recently viewed items"
            >
              {PDP_RECENTLY_VIEWED.map((item, index) => (
                <li
                  key={item.id}
                  className="flex w-[124px] shrink-0 snap-start flex-col snap-always"
                >
                  <div className="relative mb-3 flex justify-center">
                    <span
                      aria-hidden
                      className="absolute top-1/2 z-0 size-2 -translate-y-1/2 rounded-full bg-neutral-400 ring-4 ring-neutral-100"
                    />

                    <button
                      type="button"
                      className="group relative z-10 w-full text-left"
                      aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden border border-white bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 group-active:scale-[0.98]">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.03]"
                          sizes="124px"
                          priority={index === 0}
                        />

                        <span className="font-extended absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] tracking-[0.2px] text-neutral-700 shadow-sm backdrop-blur-sm">
                          {item.viewedLabel}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-extended line-clamp-2 min-h-[2.5rem] text-[11px] leading-snug tracking-[0.2px] text-black">
                      {item.name}
                    </p>
                    <p className="font-extended mt-0.5 text-[11px] tracking-[0.2px] text-neutral-600">
                      {item.price}
                    </p>
                    <button
                      type="button"
                      className="font-extended mt-2 inline-flex items-center gap-0.5 text-[11px] tracking-[0.2px] text-black"
                    >
                      View again
                      <MaterialIcon name="arrow_forward" size={18} className="text-black" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
