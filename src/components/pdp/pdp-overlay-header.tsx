"use client";

import { useRef } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { PdpHeroBagGlyph, PdpHeroMenuGlyph } from "@/components/icons/pdp-hero-glyphs";
import { cn } from "@/lib/cn";

import { useHeaderContrast } from "./use-header-contrast";
import { CoachWordmark } from "./pdp-brand-logos";
import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";
import {
  HERO_NAV_ICON_HIT_V4_PX,
  HERO_NAV_PADDING_INLINE_V4_PX,
  HERO_NAV_PADDING_TOP_V4_PX,
} from "./pdp-hero-tokens";
import { PdpSiteSwitcherStrip } from "./pdp-site-switcher-strip";
import { pdpPressableIconClass } from "./pdp-type";
import { useScrollSnapshot } from "./use-coalesced-scroll";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";
import { useHeroRevealApplier } from "./use-pdp-hero-reveal";
import { PdpIconSwap } from "./pdp-icon-swap";
import { HERO_CHROME_COLOR_TRANSITION_CLASS } from "./pdp-hero-chrome-surface";
import { useReducedMotion } from "./use-reduced-motion";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";

const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;
/** Site switcher only peeks when the page is effectively at the top. */
const SITE_SWITCHER_TOP_THRESHOLD_PX = 12;

// fallow-ignore-next-line complexity
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
  const reducedMotion = useReducedMotion();
  const visible = useScrollNavVisibility();
  const { scrollY } = useScrollSnapshot();
  const contrastZones = useHeaderContrast(headerRef);
  const chromeTransitionClass = reducedMotion
    ? undefined
    : HERO_CHROME_COLOR_TRANSITION_CLASS;
  const { useV4ModuleSpacing, showSlimSiteSwitcher } = getPdpVersionConfig(
    usePdpVersion(),
  );
  const iconHit = useV4ModuleSpacing ? HERO_NAV_ICON_HIT_V4_PX : HEADER_ROW_HEIGHT;
  const siteSwitcherExpanded =
    showSlimSiteSwitcher && scrollY <= SITE_SWITCHER_TOP_THRESHOLD_PX;

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

  const headerRow = (
    <div
      className={cn(
        "pdp-hero-header-enter grid grid-cols-[1fr_auto_1fr] items-center",
        chromeTransitionClass,
      )}
      style={{ height: iconHit }}
    >
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
        className={cn(
          "flex items-center justify-center justify-self-start",
          pdpPressableIconClass,
          chromeTransitionClass,
          contrastZones.menu === "light" ? "text-white" : "text-neutral-900",
        )}
        style={{ width: iconHit, height: iconHit }}
      >
        <PdpIconSwap
          active={menuOpen}
          activeIcon={<PdpHeroMenuGlyph open size={HEADER_ICON_SIZE} />}
          inactiveIcon={<PdpHeroMenuGlyph size={HEADER_ICON_SIZE} />}
        />
      </button>

      <span
        data-pdp-header-wordmark
        className="flex items-center justify-center"
      >
        <CoachWordmark
          className={cn(
            "h-2.5 w-auto -translate-y-px",
            chromeTransitionClass,
            contrastZones.logo === "light" ? "text-white" : "text-neutral-900",
          )}
        />
      </span>

      <button
        type="button"
        data-pdp-header-action="bag"
        aria-label={
          bagCount > 0
            ? `Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`
            : "Shopping bag"
        }
        className={cn(
          "relative flex items-center justify-center justify-self-end",
          pdpPressableIconClass,
          chromeTransitionClass,
          contrastZones.bag === "light" ? "text-white" : "text-neutral-900",
        )}
        style={{ width: iconHit, height: iconHit }}
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
          inactiveIcon={<PdpHeroBagGlyph count={0} size={HEADER_ICON_SIZE} />}
        />
      </button>
    </div>
  );

  // When the strip is expanded it owns safe-area; when tucked, the logo row does.
  const headerRowPaddingTop =
    showSlimSiteSwitcher && siteSwitcherExpanded
      ? HERO_NAV_PADDING_TOP_V4_PX
      : `calc(var(--pdp-safe-area-top) + ${HERO_NAV_PADDING_TOP_V4_PX}px)`;

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
        {showSlimSiteSwitcher ? (
          <div
            className={cn(
              "pointer-events-auto grid transition-[grid-template-rows] ease-out",
              reducedMotion ? "duration-0" : "duration-300",
              siteSwitcherExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
            aria-hidden={!siteSwitcherExpanded}
          >
            <div className="min-h-0 overflow-hidden">
              <PdpSiteSwitcherStrip
                includeSafeArea
                inert={!siteSwitcherExpanded}
              />
            </div>
          </div>
        ) : null}

        {useV4ModuleSpacing ? (
          // Hero chrome is edge-to-edge with bespoke padding (docs/design-system/grid.md),
          // so v4 skips PageGrid and uses the Paper r5 `M15-0` inset directly.
          <div
            className={cn(
              "pointer-events-auto relative",
              !reducedMotion && "transition-[padding-top] duration-300 ease-out",
            )}
            style={{
              paddingLeft: HERO_NAV_PADDING_INLINE_V4_PX,
              paddingRight: HERO_NAV_PADDING_INLINE_V4_PX,
              paddingTop: headerRowPaddingTop,
            }}
          >
            {headerRow}
          </div>
        ) : (
          <PageGrid
            fullWidth
            className={cn(
              "pointer-events-auto relative pb-2.5",
              showSlimSiteSwitcher && siteSwitcherExpanded
                ? "pt-3"
                : "pt-[calc(var(--pdp-safe-area-top)+0.75rem)]",
            )}
          >
            <GridItem mobile={12} desktop={24}>
              {headerRow}
            </GridItem>
          </PageGrid>
        )}
      </div>
    </header>
  );
}
