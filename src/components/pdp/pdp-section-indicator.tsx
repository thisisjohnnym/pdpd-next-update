"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpChapterAnchorId } from "./pdp-section-chapters";
import { PDP_CHROME_HEADER_OFFSET, usePdpChromeMode } from "./use-pdp-chrome-mode";
import { useMountTransition } from "./use-mount-transition";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { pdpType, pdpPressableClass } from "./pdp-type";

export function PdpSectionIndicator({
  suppressed = false,
}: {
  suppressed?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { chapters, activeIndex, active, jumpBarActive } =
    usePdpChromeMode(mounted);
  const menu = useMountTransition(menuOpen, 220);

  const jumpTo = useCallback((id: string) => {
    const scrollToAnchor = (behavior: ScrollBehavior) => {
      const el = document.getElementById(pdpChapterAnchorId(id));
      if (!el) {
        return;
      }
      const top =
        el.getBoundingClientRect().top + window.scrollY - PDP_CHROME_HEADER_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior });
    };

    scrollToAnchor("smooth");
    setMenuOpen(false);
    // Lazy sections between here and the target can mount mid-scroll and shift
    // layout — re-resolve the anchor once it settles so we land precisely.
    window.setTimeout(() => scrollToAnchor("smooth"), 420);
  }, []);

  if (!mounted) {
    return null;
  }

  // Only show on scroll-down past the 2nd chapter (mutually exclusive with the
  // CTA). Keep it up while the jump menu is open so it doesn't vanish mid-tap.
  const visible = (jumpBarActive || menuOpen) && !suppressed;

  return createPortal(
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 z-[41] transition-[transform,opacity] duration-300 ease-out",
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0",
        )}
        style={{
          bottom: BOTTOM_CHROME_OFFSET,
          paddingBottom: "0.625rem",
          paddingLeft: "var(--hero-inset, 0px)",
          paddingRight: "var(--hero-inset, 0px)",
        }}
        aria-hidden={!visible}
      >
        <div className="px-2 lg:px-5">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Jump to section"
            className={cn(
              "pdp-glass-light--cta pointer-events-auto inline-flex items-center gap-2.5 rounded-full py-2.5 pl-3.5 pr-3",
              pdpPressableClass,
            )}
          >
            <MaterialIcon name="list" size={18} className="text-neutral-700" />
            <span className="flex items-baseline gap-2">
              <span className="font-extended text-[13px] font-normal tracking-[0.2px] text-black">
                {active?.label}
              </span>
              <span className="shrink-0 text-neutral-400 tabular-nums text-[11px]">
                {activeIndex + 1} / {chapters.length}
              </span>
            </span>
            <MaterialIcon
              name="expand_less"
              size={18}
              className={cn(
                "text-neutral-600 transition-transform duration-300 ease-out",
                menuOpen && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {menu.mounted ? (
        <div className="fixed inset-0 z-[44]">
          <button
            type="button"
            aria-label="Close jump menu"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "pdp-fade absolute inset-0 size-full bg-black/30",
              menu.state === "open" ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className="pdp-pop-up absolute inset-x-0"
            data-state={menu.state}
            style={{ bottom: BOTTOM_CHROME_OFFSET, paddingBottom: "0.625rem" }}
          >
            <PageGrid fullWidth>
              <GridItem mobile={12} desktop={24}>
                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
                    <span className="text-[17px] font-medium leading-none tracking-[0.1px] text-neutral-900">
                      Explore this page
                    </span>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "-m-2 flex size-10 items-center justify-center text-neutral-500",
                        pdpPressableClass,
                      )}
                    >
                      <MaterialIcon name="close" size={20} />
                    </button>
                  </div>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {chapters.map((chapter, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <li key={chapter.id}>
                          <button
                            type="button"
                            onClick={() => jumpTo(chapter.id)}
                            aria-current={isActive ? "true" : undefined}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-3 text-left",
                              isActive && "bg-neutral-100",
                              pdpPressableClass,
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center",
                              )}
                            >
                              {index < activeIndex ? (
                                <MaterialIcon
                                  name="check"
                                  size={18}
                                  className="text-neutral-400"
                                />
                              ) : (
                                <span
                                  className={cn(
                                    "size-2 rounded-full",
                                    isActive ? "bg-black" : "bg-neutral-300",
                                  )}
                                />
                              )}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="font-extended text-[15px] font-normal tracking-[0.2px] text-black">
                                {chapter.label}
                              </span>
                              {chapter.sub ? (
                                <span className={`text-neutral-500 ${pdpType.label}`}>
                                  {chapter.sub}
                                </span>
                              ) : null}
                            </span>
                            {isActive ? (
                              <span
                                className={cn(
                                  "shrink-0 rounded-full bg-black px-2.5 py-1 text-white",
                                  pdpType.micro,
                                )}
                              >
                                You&rsquo;re here
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </GridItem>
            </PageGrid>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
