"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpJumpBarTitle } from "./pdp-jump-bar-title";
import { PdpIconSwap } from "./pdp-icon-swap";
import { pdpChapterAnchorId } from "./pdp-section-chapters";
import { PDP_CHROME_HEADER_OFFSET, usePdpChromeMode } from "./use-pdp-chrome-mode";
import { usePdpVersion } from "./version/pdp-version-context";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { useMountTransition } from "./use-mount-transition";
import { useRafLerp } from "./use-raf-lerp";
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

  const { sectionChapters } = getPdpVersionConfig(usePdpVersion());
  const { chapters, activeIndex, active, jumpBarActive, sectionProgress } =
    usePdpChromeMode(mounted, sectionChapters);
  const menu = useMountTransition(menuOpen, 220);

  // Show on scroll-down from "The Details" onward (mutually exclusive with the
  // CTA). Keep it up while the jump menu is open so it doesn't vanish mid-tap.
  const visible = (jumpBarActive || menuOpen) && !suppressed;

  const measureRef = useRef<HTMLDivElement>(null);
  const [targetWidth, setTargetWidth] = useState<number | null>(null);
  const labels = chapters.map((chapter) => chapter.label);
  const activeLabel = active?.label ?? "";

  const lerpedSectionProgress = useRafLerp(sectionProgress, { enabled: visible });
  const smoothedWidth = useRafLerp(targetWidth ?? 0, {
    enabled: targetWidth !== null && visible,
  });

  useEffect(() => {
    const node = measureRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      setTargetWidth(node.offsetWidth);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [activeLabel, activeIndex, chapters.length]);

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
        <div className="relative px-2 lg:px-5">
          <div
            ref={measureRef}
            aria-hidden
            className="pointer-events-none invisible absolute flex items-center gap-2.5 whitespace-nowrap py-2.5 pl-3.5 pr-3"
          >
            <MaterialIcon name="list" size={18} />
            <span className="flex items-baseline gap-2">
              <span className="font-extended text-[13px] font-normal tracking-[0.2px]">
                {activeLabel}
              </span>
              <span className="shrink-0 tabular-nums text-[11px]">
                {activeIndex + 1} / {chapters.length}
              </span>
            </span>
            <MaterialIcon name="expand_less" size={18} />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Jump to section"
            className={cn(
              "pdp-glass-light--jump-bar pointer-events-auto relative overflow-hidden rounded-full py-2.5 pl-3.5 pr-3",
              pdpPressableClass,
            )}
            style={{
              width: targetWidth !== null ? Math.ceil(smoothedWidth) : undefined,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 z-0 rounded-full bg-neutral-900/10"
              style={{ width: `${lerpedSectionProgress * 100}%` }}
            />
            <span className="relative z-10 flex items-center gap-2.5">
              <MaterialIcon name="list" size={18} className="text-neutral-700" />
              <span className="flex items-baseline gap-2">
                <PdpJumpBarTitle labels={labels} activeIndex={activeIndex} />
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
            </span>
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
                            <PdpIconSwap
                              active={index < activeIndex}
                              activeIcon={
                                <MaterialIcon
                                  name="check"
                                  size={18}
                                  className="text-neutral-400"
                                />
                              }
                              inactiveIcon={
                                <span className="flex size-5 items-center justify-center">
                                  <span
                                    className={cn(
                                      "size-2 rounded-full",
                                      isActive ? "bg-black" : "bg-neutral-300",
                                    )}
                                  />
                                </span>
                              }
                              className="flex size-5 shrink-0 items-center justify-center"
                            />
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
