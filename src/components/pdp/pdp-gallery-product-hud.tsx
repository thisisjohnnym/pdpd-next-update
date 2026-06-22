"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useTabbyFamilyCompareExperiment } from "./experiments/tabby-family-compare-flag";
import { useActiveProduct } from "./pdp-active-product-context";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { heroProductHudOffset } from "./pdp-viewport-chrome";
import {
  isHeroOverlayVisible,
  useHeroScrollOpacity,
} from "./use-hero-scroll-opacity";
import { useHeroEnterOnce } from "./use-hero-enter-once";

const heroHudTextShadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]";

/** Product info + scrim — hero only, fades on scroll */
export function PdpGalleryProductHud() {
  const opacity = useHeroScrollOpacity();
  const visible = isHeroOverlayVisible(opacity);
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const tabbyExperiment = useTabbyFamilyCompareExperiment();
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const showTabbyExperiment = productId === "tabby" && Boolean(tabby) && tabbyExperiment;
  const hudBottom = heroProductHudOffset(showTabbyExperiment);
  const playHeroEnter = useHeroEnterOnce();

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15]"
        style={{
          height: `calc(10.5rem + ${hudBottom})`,
          opacity,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0)_0%,rgb(0_0_0/0.72)_30%,rgb(0_0_0/0.28)_56%,transparent_84%)]",
            playHeroEnter && "pdp-hero-scrim-enter",
          )}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-[38]"
        style={{
          bottom: hudBottom,
          opacity,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div className={cn(playHeroEnter && "pdp-hero-hud-enter")}>
          <PageGrid fullWidth className="pb-2.5">
            <GridItem mobile={12} desktop={24}>
              <div
                className={cn(
                  "font-extended flex items-start justify-between gap-4 tracking-[0.2px] text-white",
                  heroHudTextShadow,
                )}
              >
                <div className="flex min-w-0 flex-col">
                  <p className="text-base font-normal leading-none tracking-[0.2px]">
                    {summary.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-none tracking-[0.2px] text-white/75">
                    {summary.subtitle}
                  </p>
                </div>
                <p className="shrink-0 pt-px text-sm font-normal leading-none tracking-[0.2px]">
                  {summary.price}
                </p>
              </div>
            </GridItem>
          </PageGrid>
        </div>
      </div>
    </>
  );
}
