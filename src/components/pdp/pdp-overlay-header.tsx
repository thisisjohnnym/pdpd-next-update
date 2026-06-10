"use client";

import Image from "next/image";
import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useHeaderContrast } from "./use-header-contrast";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";

const LOGO_WIDTH = 640;
const LOGO_HEIGHT = 72;
const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;
const LOGO_HEIGHT_PX = 14;
const LOGO_WIDTH_PX = (LOGO_WIDTH / LOGO_HEIGHT) * LOGO_HEIGHT_PX;

export function PdpOverlayHeader({ bagCount = 0 }: { bagCount?: number }) {
  const headerRef = useRef<HTMLElement>(null);
  const visible = useScrollNavVisibility();
  const foreground = useHeaderContrast(headerRef);
  const isLight = foreground === "light";

  return (
    <header
      ref={headerRef}
      data-header-chrome
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-30 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <PageGrid fullWidth className="pointer-events-auto relative pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <GridItem mobile={12} desktop={24}>
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center transition-colors duration-300"
            style={{ height: HEADER_ROW_HEIGHT }}
          >
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "flex items-center justify-self-start transition-colors duration-300",
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <MaterialIcon name="menu" size={HEADER_ICON_SIZE} />
            </button>

            <Image
              src="/images/coach-outlet-logo.png"
              alt="Coach Outlet"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              unoptimized
              className={cn(
                "block max-w-[min(100%,142px)] shrink-0 transition-[filter] duration-300",
                isLight && "brightness-0 invert",
              )}
              style={{
                width: LOGO_WIDTH_PX,
                height: LOGO_HEIGHT_PX,
                objectFit: "contain",
              }}
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
                isLight ? "text-white" : "text-neutral-900",
              )}
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <MaterialIcon name="shopping_bag" size={HEADER_ICON_SIZE} />
              {bagCount > 0 ? (
                <span
                  key={bagCount}
                  aria-hidden
                  className={cn(
                    "font-extended animate-bag-badge-pop absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none tracking-[0.2px] transition-colors duration-300",
                    isLight ? "bg-white text-black" : "bg-black text-white",
                  )}
                >
                  <span>
                    {bagCount > 9 ? "9+" : bagCount}
                  </span>
                </span>
              ) : null}
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </header>
  );
}
