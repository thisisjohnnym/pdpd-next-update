"use client";

import { useRef } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { PdpHeroBagGlyph, PdpHeroMenuGlyph } from "@/components/icons/pdp-hero-glyphs";
import { cn } from "@/lib/cn";

import { useHeaderContrast } from "./use-header-contrast";
import { CoachWordmark } from "./pdp-brand-logos";
import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";
import { pdpPressableIconClass } from "./pdp-type";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";
import { useHeroRevealApplier } from "./use-pdp-hero-reveal";
import { PdpIconSwap } from "./pdp-icon-swap";
import {
  heroUsesLightChrome,
  HERO_CHROME_COLOR_TRANSITION_CLASS,
  useHeroChromeSurface,
} from "./pdp-hero-chrome-surface";
import { useScrollSnapshot } from "./use-coalesced-scroll";
import { useReducedMotion } from "./use-reduced-motion";

const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;
/** Nav follows slide chrome while the hero land is in view */
const HERO_LAND_SCROLL_FRACTION = 0.85;

export function PdpOverlayHeader({
  bagCount = 0,
  menuOpen = false,
  onOpenMenu,
  hugBrandBar = false,
}: {
  bagCount?: number;
  menuOpen?: boolean;
  onOpenMenu?: () => void;
  /** When the brand bar is above the hero, ride below it then scrub to top */
  hugBrandBar?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const hugRef = useRef<HTMLDivElement>(null);
  const heroSurface = useHeroChromeSurface();
  const { scrollY, viewportHeight } = useScrollSnapshot();
  const reducedMotion = useReducedMotion();
  const visible = useScrollNavVisibility();
  const contrastForeground = useHeaderContrast(headerRef);
  const overHeroLand =
    viewportHeight > 0 && scrollY < viewportHeight * HERO_LAND_SCROLL_FRACTION;
  const isLight = overHeroLand
    ? heroUsesLightChrome(heroSurface)
    : contrastForeground === "light";
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;

  // Ride below the brand switcher while it is revealed, then sit at the top.
  useHeroRevealApplier((reveal) => {
    const node = hugRef.current;
    if (!node) {
      return;
    }
    node.style.transform = `translateY(${
      hugBrandBar ? reveal * PDP_BRAND_BAR_HEIGHT : 0
    }px)`;
  });

  return (
    <header
      ref={headerRef}
      data-header-chrome
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-30 transition-transform duration-300 ease-out",
        hugBrandBar && "pdp-hero-ui-chrome",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div
        ref={hugRef}
        style={{
          paddingLeft: "var(--hero-inset, 0px)",
          paddingRight: "var(--hero-inset, 0px)",
        }}
      >
      <PageGrid fullWidth className="pointer-events-auto relative pb-2.5 pt-[calc(var(--pdp-safe-area-top)+0.75rem)]">
        <GridItem mobile={12} desktop={24}>
          <div
            className={cn(
              "pdp-hero-header-enter grid grid-cols-[1fr_auto_1fr] items-center",
              chromeTransitionClass,
            )}
            style={{ height: HEADER_ROW_HEIGHT }}
          >
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={onOpenMenu}
              className={cn(
                "flex items-center justify-self-start",
                pdpPressableIconClass,
                chromeTransitionClass,
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <PdpIconSwap
                active={menuOpen}
                activeIcon={<PdpHeroMenuGlyph open size={HEADER_ICON_SIZE} />}
                inactiveIcon={<PdpHeroMenuGlyph size={HEADER_ICON_SIZE} />}
              />
            </button>

            <CoachWordmark
              className={cn(
                "h-2.5 w-auto",
                chromeTransitionClass,
                isLight ? "text-white" : "text-neutral-900",
              )}
            />

            <button
              type="button"
              aria-label={
                bagCount > 0
                  ? `Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`
                  : "Shopping bag"
              }
              className={cn(
                "relative flex items-center justify-center justify-self-end",
                pdpPressableIconClass,
                chromeTransitionClass,
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <PdpIconSwap
                active={bagCount > 0}
                activeIcon={
                  <span
                    key={bagCount}
                    className="motion-safe:animate-bag-badge-pop inline-flex size-6 items-center justify-center"
                  >
                    <PdpHeroBagGlyph count={bagCount} size={HEADER_ICON_SIZE} />
                  </span>
                }
                inactiveIcon={
                  <PdpHeroBagGlyph count={0} size={HEADER_ICON_SIZE} />
                }
              />
            </button>
          </div>
        </GridItem>
      </PageGrid>
      </div>
    </header>
  );
}
