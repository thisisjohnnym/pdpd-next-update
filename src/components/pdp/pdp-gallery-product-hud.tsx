"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { BOTTOM_CTA_OFFSET } from "./pdp-viewport-chrome";
import { PDP_PRODUCT } from "./pdp-data";
import { pdpBodyRhythm, pdpType } from "./pdp-type";
import {
  isHeroOverlayVisible,
  useHeroScrollOpacity,
} from "./use-hero-scroll-opacity";

/** Product info + scrim — hero only, fades on scroll */
export function PdpGalleryProductHud() {
  const opacity = useHeroScrollOpacity();
  const visible = isHeroOverlayVisible(opacity);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: `calc(7.5rem + ${BOTTOM_CTA_OFFSET})`,
          opacity,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div className="pdp-hero-scrim-enter absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-10"
        style={{
          bottom: BOTTOM_CTA_OFFSET,
          opacity,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div className="pdp-hero-hud-enter">
        <PageGrid fullWidth className="pb-3">
          <GridItem mobile={12} desktop={24}>
            <div className="font-extended flex items-start justify-between gap-4 tracking-[0.2px] text-white">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className={`text-base text-white/90 ${pdpBodyRhythm}`}>
                  {PDP_PRODUCT.name}
                </p>
                <p className={`text-white/60 ${pdpType.label}`}>
                  {PDP_PRODUCT.subtitle}
                </p>
              </div>
              <p className={`shrink-0 pt-px text-sm text-white/90 ${pdpBodyRhythm}`}>
                {PDP_PRODUCT.price}
              </p>
            </div>
          </GridItem>
        </PageGrid>
        </div>
      </div>
    </>
  );
}
