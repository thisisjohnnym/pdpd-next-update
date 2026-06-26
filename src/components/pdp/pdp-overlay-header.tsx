"use client";

import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useHeaderContrast } from "./use-header-contrast";
import { CoachWordmark } from "./pdp-brand-logos";
import { PDP_BRAND_BAR_HEIGHT } from "./pdp-brand-bar";
import { pdpPressableIconClass } from "./pdp-type";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";
import { useHeroRevealApplier } from "./use-pdp-hero-reveal";

const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;

export function PdpOverlayHeader({
  bagCount = 0,
  onOpenMenu,
  hugBrandBar = false,
}: {
  bagCount?: number;
  onOpenMenu?: () => void;
  /** When the brand bar is above the hero, ride below it then scrub to top */
  hugBrandBar?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const hugRef = useRef<HTMLDivElement>(null);
  const visible = useScrollNavVisibility();
  const foreground = useHeaderContrast(headerRef);
  const isLight = foreground === "light";

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
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div
        ref={hugRef}
        style={{
          paddingLeft: "var(--hero-inset, calc(var(--hero-reveal, 0) * 8px))",
          paddingRight: "var(--hero-inset, calc(var(--hero-reveal, 0) * 8px))",
        }}
      >
      <PageGrid fullWidth className="pointer-events-auto relative pb-2.5 pt-[calc(var(--pdp-safe-area-top)+0.75rem)]">
        <GridItem mobile={12} desktop={24}>
          <div
            className="pdp-hero-header-enter grid grid-cols-[1fr_auto_1fr] items-center transition-colors duration-300"
            style={{ height: HEADER_ROW_HEIGHT }}
          >
            <button
              type="button"
              aria-label="Open menu"
              onClick={onOpenMenu}
              className={cn(
                "flex items-center justify-self-start transition-colors duration-300",
                pdpPressableIconClass,
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <MaterialIcon name="menu" size={HEADER_ICON_SIZE} />
            </button>

            <CoachWordmark
              className={cn(
                "h-2.5 w-auto transition-colors duration-300",
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
                "relative flex items-center justify-center justify-self-end transition-colors duration-300",
                pdpPressableIconClass,
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <span
                className="relative inline-flex shrink-0 items-center justify-center"
                style={{ width: HEADER_ICON_SIZE, height: HEADER_ICON_SIZE }}
              >
                <MaterialIcon
                  name="shopping_bag"
                  size={HEADER_ICON_SIZE}
                  filled={bagCount > 0}
                />
                {bagCount > 0 ? (
                  <span
                    key={bagCount}
                    aria-hidden
                    className={cn(
                      "pdp-bag-badge animate-bag-badge-pop pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[30%] text-[9px] font-semibold leading-none tracking-[0.1px] tabular-nums transition-colors duration-300",
                      isLight ? "text-black" : "text-white",
                    )}
                  >
                    {bagCount > 9 ? "9+" : bagCount}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
        </GridItem>
      </PageGrid>
      </div>
    </header>
  );
}
