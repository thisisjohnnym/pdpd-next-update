"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useScrollNavVisibility } from "./use-scroll-nav-visibility";
import {
  isHeroOverlayVisible,
  useHeroScrollOpacity,
} from "./use-hero-scroll-opacity";

const LOGO_WIDTH = 640;
const LOGO_HEIGHT = 72;
const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;
const LOGO_HEIGHT_PX = 14;
const LOGO_WIDTH_PX = (LOGO_WIDTH / LOGO_HEIGHT) * LOGO_HEIGHT_PX;

export function PdpOverlayHeader() {
  const visible = useScrollNavVisibility();
  const gradientOpacity = useHeroScrollOpacity();
  const showGradient = isHeroOverlayVisible(gradientOpacity);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-30 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(env(safe-area-inset-top,0px)+7rem)] bg-gradient-to-b from-white/90 via-white/45 to-transparent backdrop-blur-lg transition-opacity duration-300"
        style={{
          opacity: gradientOpacity,
          visibility: showGradient ? "visible" : "hidden",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.65) 55%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.65) 55%, transparent 100%)",
        }}
      />

      <PageGrid fullWidth className="pointer-events-auto relative pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <GridItem mobile={12} desktop={24}>
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center"
            style={{ height: HEADER_ROW_HEIGHT }}
          >
            <button
              type="button"
              aria-label="Open menu"
              className="flex items-center justify-self-start text-neutral-900"
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
              className="block max-w-[min(100%,142px)] shrink-0"
              style={{
                width: LOGO_WIDTH_PX,
                height: LOGO_HEIGHT_PX,
                objectFit: "contain",
              }}
            />

            <button
              type="button"
              aria-label="Shopping bag"
              className="flex items-center justify-center justify-self-end text-neutral-900"
              style={{ width: HEADER_ROW_HEIGHT, height: HEADER_ROW_HEIGHT }}
            >
              <MaterialIcon name="shopping_bag" size={HEADER_ICON_SIZE} />
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </header>
  );
}
