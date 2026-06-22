"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { heroProductHudOffset } from "./pdp-viewport-chrome";
import { pdpBodyRhythm, pdpType } from "./pdp-type";
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
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const hudBottom = heroProductHudOffset();
  const playHeroEnter = useHeroEnterOnce();

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15]"
        style={{
          height: `calc(13rem + ${hudBottom})`,
          minHeight: "52vh",
          opacity,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div
          className={cn(
            "pdp-hero-bottom-scrim absolute inset-0",
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
        <PageGrid fullWidth className="pb-1">
          <GridItem mobile={12} desktop={24}>
            <div className={`font-extended flex items-start justify-between gap-4 tracking-[0.2px] text-white ${heroHudTextShadow}`}>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className={`text-base text-white ${pdpBodyRhythm}`}>
                  {summary.name}
                </p>
                <p className={cn("text-white/75", pdpType.micro)}>
                  {summary.subtitle}
                </p>
              </div>
              <p className={`shrink-0 pt-px text-sm text-white ${pdpBodyRhythm}`}>
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
