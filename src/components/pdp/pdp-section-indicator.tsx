"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  PDP_CHAPTERS,
  pdpChapterAnchorId,
  type PdpChapter,
} from "./pdp-section-chapters";
import { useScrollSnapshot } from "./use-coalesced-scroll";
import { pdpType, pdpPressableClass } from "./pdp-type";

/** Approx header height (safe-area + nav row) — keeps the active probe + jump under the header */
const HEADER_OFFSET = 72;

type PresentChapter = PdpChapter & { top: number };

function readPresentChapters(scrollY: number): PresentChapter[] {
  if (typeof document === "undefined") {
    return [];
  }

  return PDP_CHAPTERS.flatMap((chapter) => {
    const el = document.getElementById(pdpChapterAnchorId(chapter.id));
    if (!el) {
      return [];
    }
    const top = el.getBoundingClientRect().top + scrollY;
    return [{ ...chapter, top }];
  }).sort((a, b) => a.top - b.top);
}

export function PdpSectionIndicator({
  suppressed = false,
}: {
  suppressed?: boolean;
}) {
  const { scrollY, viewportHeight } = useScrollSnapshot();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derived during render from the live DOM — re-runs on every scroll snapshot,
  // so no effect/setState loop is needed to track the active chapter.
  const chapters = mounted ? readPresentChapters(scrollY) : [];
  const probe = scrollY + HEADER_OFFSET + 8;
  let activeIndex = 0;
  chapters.forEach((chapter, index) => {
    if (chapter.top <= probe) {
      activeIndex = index;
    }
  });

  const jumpTo = useCallback((id: string) => {
    const scrollToAnchor = (behavior: ScrollBehavior) => {
      const el = document.getElementById(pdpChapterAnchorId(id));
      if (!el) {
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
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

  // Clean on land — reveal only after scrolling past the hero.
  const pastHero = viewportHeight > 0 && scrollY > viewportHeight * 0.85;
  const visible = pastHero && !suppressed && chapters.length > 0;

  const scrollMax =
    document.documentElement.scrollHeight - viewportHeight || 1;
  const progress = Math.min(1, Math.max(0, scrollY / scrollMax));
  const active = chapters[activeIndex];

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-x-0 z-[25] transition-[transform,opacity] duration-300 ease-out",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        style={{ top: "calc(var(--pdp-safe-area-top) + 3.5rem)" }}
        aria-hidden={!visible}
      >
        <PageGrid fullWidth>
          <GridItem mobile={12} desktop={24}>
            <div className="pdp-glass-light--cta flex flex-col gap-2 rounded-2xl px-3.5 py-2.5">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-neutral-200/80">
                <div
                  className="h-full rounded-full bg-black transition-[width] duration-200 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="font-extended truncate text-[13px] font-normal tracking-[0.2px] text-black">
                    {active?.label}
                  </span>
                  <span className="shrink-0 text-neutral-400 tabular-nums text-[11px]">
                    {activeIndex + 1} of {chapters.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-label="Jump to section"
                  className={cn(
                    "-my-2 flex min-h-10 shrink-0 items-center gap-1.5 py-2 text-neutral-600",
                    pdpPressableClass,
                  )}
                >
                  <span className={pdpType.label}>Jump to</span>
                  <MaterialIcon
                    name={menuOpen ? "close" : "menu"}
                    size={18}
                    className="text-neutral-700"
                  />
                </button>
              </div>
            </div>
          </GridItem>
        </PageGrid>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[44]">
          <button
            type="button"
            aria-label="Close jump menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 size-full bg-black/30"
          />
          <div
            className="absolute inset-x-0"
            style={{ top: "calc(var(--pdp-safe-area-top) + 3.5rem)" }}
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
