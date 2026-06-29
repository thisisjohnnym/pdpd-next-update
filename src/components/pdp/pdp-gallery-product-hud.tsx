"use client";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "./pdp-active-product-context";
import { useOptionalTabbyVariant } from "./pdp-tabby-variant-context";
import { PdpHeroGalleryIndicator } from "./pdp-hero-gallery-indicator";
import { HERO_FRAME_BOTTOM_PAD_PX } from "./pdp-hero-tokens";
import { heroProductHudOffset } from "./pdp-viewport-chrome";
import { useHeroEnterOnce } from "./use-hero-enter-once";
import {
  isHeroUiChromeVisible,
  useHeroUiChrome,
} from "./use-hero-ui-chrome";

const heroHudTextShadow = "drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]";

/** Product name + price inside hero video frame (docs/pdp-hero-chrome.md). */
export function PdpGalleryProductHud() {
  const { opacity } = useHeroUiChrome();
  const visible = isHeroUiChromeVisible(opacity);
  const { product, productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();
  const summary =
    productId === "tabby" && tabby ? tabby.summary : product.summary;
  const hudBottom = heroProductHudOffset();
  const playHeroEnter = useHeroEnterOnce();

  return (
    <div
      className="pdp-hero-ui-chrome pointer-events-none absolute inset-x-0 z-[38]"
      style={{
        bottom: hudBottom,
        visibility: visible ? "visible" : "hidden",
        paddingLeft: "var(--hero-inset, 0px)",
        paddingRight: "var(--hero-inset, 0px)",
      }}
    >
      <div
        className={cn("px-2", playHeroEnter && "pdp-hero-hud-enter")}
        style={{ paddingBottom: HERO_FRAME_BOTTOM_PAD_PX }}
      >
        <div className="mb-4 flex">
          <PdpHeroGalleryIndicator />
        </div>
        <div
          className={cn(
            "font-extended tracking-[0.2px] text-white",
            heroHudTextShadow,
          )}
        >
          <div className="flex items-center justify-between gap-4 text-base font-normal leading-none">
            <p className="min-w-0 truncate">{summary.name}</p>
            <p className="shrink-0 tabular-nums">{summary.price}</p>
          </div>
          <p className="mt-0.5 text-xs font-normal leading-none tracking-[0.2px] text-white/75">
            in {summary.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
