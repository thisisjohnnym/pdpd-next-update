"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselCard15Class,
  pdpCarouselImageClass,
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "./pdp-carousel";
import { PDP_RECENTLY_VIEWED, PDP_RECENTLY_VIEWED_SECTION } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";
import { PdpTextLinkCta } from "./pdp-text-link-cta";

/** History rail — last block on the PDP, portrait cards with viewed-time chips */
export function PdpRecentlyViewedCarousel() {
  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <PdpModuleHeading>{PDP_RECENTLY_VIEWED_SECTION.eyebrow}</PdpModuleHeading>

          <PdpRevealItem className={pdpCarouselScrollWrapClass}>
            <ul
              className={cn(
                "m-0 flex list-none gap-2",
                pdpCarouselScrollClass,
              )}
              aria-label="Recently viewed items"
            >
              {PDP_RECENTLY_VIEWED.map((item, index) => (
                <li
                  key={item.id}
                  className={cn("flex flex-col", pdpCarouselCard15Class)}
                >
                  <div className="group relative w-full">
                    <div
                      className="relative w-full overflow-hidden bg-neutral-100"
                      style={{ aspectRatio: "4 / 5" }}
                    >
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className={cn(
                        "object-cover object-center transition-[filter] duration-300 group-hover:brightness-[1.03]",
                        pdpCarouselImageClass,
                      )}
                      sizes="45vw"
                      priority={index === 0}
                    />
                    <span
                      aria-hidden
                      className={`font-extended pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center bg-white/90 px-2 py-0.5 leading-none text-neutral-700 shadow-sm backdrop-blur-sm ${pdpType.micro}`}
                    >
                      {item.viewedLabel}
                    </span>
                  </div>
                </div>
                <p
                  className={`font-extended mt-2 line-clamp-2 text-black ${pdpType.label}`}
                >
                  {item.name}
                </p>
                <p className={`font-extended mt-0.5 text-black ${pdpType.micro}`}>
                  {item.price}
                </p>
                <PdpTextLinkCta
                  type="button"
                  className={cn("mt-2", pdpType.label)}
                  aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                >
                  View again
                </PdpTextLinkCta>
              </li>
            ))}
            </ul>
          </PdpRevealItem>
        </GridItem>
      </PageGrid>
    </section>
  );
}
