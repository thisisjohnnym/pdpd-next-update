"use client";

import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { useHeaderContrast } from "./use-header-contrast";
import { pdpPressableIconClass } from "./pdp-type";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";
import { useScrollSnapshot } from "./use-coalesced-scroll";

const HEADER_ICON_SIZE = 24;
const HEADER_ROW_HEIGHT = 24;
/** Brand toggle is a hero element — collapses once the page is scrolled */
const TOGGLE_VISIBLE_BELOW = 24;

/** Coach serif wordmark — extracted from the Paper design (currentColor fill) */
function CoachWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 11.373 83 9.254"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="Coach"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.533 12.977C28.859 12.047 26.645 11.527 24.29 11.527 21.906 11.527 19.693 12.047 18.047 12.977 16.827 13.688 16.118 14.783 16.118 16.014 16.118 17.245 16.827 18.339 18.047 19.05 19.721 19.98 21.935 20.5 24.29 20.5 26.673 20.5 28.887 19.98 30.533 19.05 31.753 18.339 32.462 17.245 32.462 16.014 32.462 14.783 31.753 13.688 30.533 12.977ZM24.261 20.09C22.758 20.09 20.232 19.242 20.232 16.014 20.232 13.196 22.247 11.938 24.261 11.938 26.957 11.938 28.546 13.47 28.546 16.014 28.575 18.749 27.156 20.09 24.261 20.09Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83 12.074V11.664H76.19V12.074H77.637V15.603H71.933V12.074H73.409V11.719 11.664H66.57V12.074H68.046V19.98H66.57V20.391H73.409V19.98H71.933V16.014H77.637V19.98H76.19V20.391H82.943 83V19.98H81.525V12.074H83Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.776 11.527H40.549L33.399 19.98H31.753V20.391H35.867V19.98H33.938L35.669 17.956H42.082L44.011 20.008H42.139V20.418H50.68V19.98H48.779L40.776 11.527ZM36.009 17.518L38.648 14.372 41.685 17.518H36.009Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.748 12.512C11.634 12.457 11.294 12.239 10.726 12.02 10.102 11.801 9.109 11.5 7.832 11.5 5.789 11.5 3.887 11.883 2.497 12.567 0.851 13.36 0 14.564 0 15.986 0 18.941 2.866 20.473 8.314 20.473 9.648 20.473 10.811 20.145 11.776 19.488L13.422 20.336H13.734V16.944H13.422L13.394 16.971V16.998C13.394 17.026 13.11 17.792 12.372 18.558 11.691 19.269 10.442 20.117 8.399 20.117 7.037 20.117 5.931 19.624 5.193 18.722 4.625 18.011 4.285 17.026 4.285 16.041 4.285 13.387 6.413 11.965 8.399 11.965 9.761 11.965 10.981 12.375 11.946 13.169 12.769 13.825 13.223 14.591 13.394 15.111V15.138H13.734V11.664H13.422L11.748 12.512Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M62.115 12.512C62.002 12.457 61.661 12.239 61.094 12.02 60.469 11.801 59.476 11.5 58.199 11.5 56.156 11.5 54.255 11.883 52.865 12.567 51.219 13.36 50.367 14.564 50.367 15.986 50.367 18.941 53.233 20.473 58.682 20.473 60.015 20.473 61.179 20.145 62.144 19.488L63.789 20.336H64.101V16.944H63.789L63.761 16.971V16.998C63.761 17.026 63.477 17.792 62.739 18.558 62.058 19.269 60.81 20.117 58.767 20.117 57.405 20.117 56.298 19.624 55.56 18.722 54.993 18.011 54.652 17.026 54.652 16.041 54.652 13.387 56.78 11.965 58.767 11.965 60.129 11.965 61.349 12.375 62.314 13.169 63.137 13.825 63.591 14.591 63.761 15.111V15.138H64.101V11.664H63.789L62.115 12.512Z"
      />
    </svg>
  );
}

/** Static, non-functional Coach / Coach Outlet brand toggle (visual only for now) */
function BrandToggle() {
  return (
    <div
      role="group"
      aria-label="Brand"
      className="flex w-full items-stretch gap-1 rounded-full bg-[#eeeeee] p-1"
    >
      <span
        aria-current="true"
        className="flex flex-1 items-center justify-center rounded-full bg-[#171717] py-3"
      >
        <CoachWordmark className="h-2.5 w-auto text-white" />
      </span>
      <span className="flex flex-1 items-center justify-center gap-[3px] rounded-full py-3 text-neutral-500">
        <CoachWordmark className="h-2.5 w-auto" />
        <span className="font-extended text-[13px] font-normal leading-none tracking-[0.01em]">
          Outlet
        </span>
      </span>
    </div>
  );
}

export function PdpOverlayHeader({
  bagCount = 0,
  onOpenMenu,
}: {
  bagCount?: number;
  onOpenMenu?: () => void;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const visible = useScrollNavVisibility();
  const foreground = useHeaderContrast(headerRef);
  const isLight = foreground === "light";
  const { scrollY } = useScrollSnapshot();
  const toggleVisible = scrollY <= TOGGLE_VISIBLE_BELOW;

  return (
    <header
      ref={headerRef}
      data-header-chrome
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-30 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <PageGrid fullWidth className="pointer-events-auto relative pb-2.5 pt-[calc(var(--pdp-safe-area-top)+0.75rem)]">
        <GridItem mobile={12} desktop={24}>
          {/* Brand toggle — hero-only; collapses on scroll */}
          <div
            aria-hidden={!toggleVisible}
            className={cn(
              "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
              toggleVisible
                ? "mb-3 grid-rows-[1fr] opacity-100"
                : "mb-0 grid-rows-[0fr] opacity-0",
            )}
          >
            <div
              className={cn(
                "min-h-0 overflow-hidden",
                toggleVisible ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <BrandToggle />
            </div>
          </div>

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
                      "pdp-bag-badge animate-bag-badge-pop pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-[30%] text-[9px] font-semibold leading-none tracking-[0.1px] transition-colors duration-300",
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
    </header>
  );
}
