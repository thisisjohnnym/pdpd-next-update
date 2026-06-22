"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleSectionClass } from "../pdp-module-section";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import {
  pdpPressableClass,
  pdpPressableIconClass,
  pdpType,
} from "../pdp-type";
import {
  buildTabbyFamilyExplorer,
  type TabbyFamilyExplorerMember,
} from "./tabby-family-compare-data";

const SWIPE_THRESHOLD_PX = 44;

function ExplorerArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous Tabby style" : "Next Tabby style"}
      className={cn(
        "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-black shadow-sm backdrop-blur transition-opacity",
        isPrev ? "left-1 lg:left-2" : "right-1 lg:right-2",
        disabled
          ? "cursor-not-allowed opacity-0"
          : cn("opacity-100", pdpPressableIconClass),
      )}
    >
      <MaterialIcon
        name={isPrev ? "chevron_left" : "chevron_right"}
        size={24}
        className="leading-none"
      />
    </button>
  );
}

/**
 * Experiment variant — Tabby family explorer.
 * An Apple-style single-product family browser: one silhouette at a time, with
 * the image, name, positioning line, traits, and CTA all changing together.
 * Arrows, dots, and swipe move between styles; the live PDP style is flagged.
 */
export function TabbyFamilyCompareExperiment() {
  const tabby = useOptionalTabbyVariant();
  const currentStyleId = tabby?.styleId ?? null;

  const members = useMemo<TabbyFamilyExplorerMember[]>(
    () => (currentStyleId ? buildTabbyFamilyExplorer(currentStyleId) : []),
    [currentStyleId],
  );

  const currentIndex = useMemo(() => {
    const found = members.findIndex((member) => member.isCurrent);
    return found === -1 ? 0 : found;
  }, [members]);

  const [index, setIndex] = useState(currentIndex);
  const touchStartX = useRef<number | null>(null);

  // Keep the featured slide aligned with the live PDP style.
  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const goTo = useCallback(
    (next: number) => {
      setIndex((current) => {
        const clamped = Math.min(Math.max(next, 0), members.length - 1);
        return clamped === current ? current : clamped;
      });
    },
    [members.length],
  );

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStartX.current;
      touchStartX.current = null;
      if (start === null) {
        return;
      }
      const delta = (event.changedTouches[0]?.clientX ?? start) - start;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
        return;
      }
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    [goTo, index],
  );

  if (!tabby || members.length === 0) {
    return null;
  }

  const featured = members[index] ?? members[0]!;
  const atStart = index === 0;
  const atEnd = index === members.length - 1;

  return (
    <section
      data-header-surface="light"
      data-experiment="tabby-family-compare"
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="mb-6 flex flex-col gap-1">
            <PdpModuleHeading spacing="none">
              Explore the Tabby family
            </PdpModuleHeading>
            <p className={cn("m-0 text-neutral-500", pdpType.body)}>
              One icon, many personalities. Swipe to find your Tabby.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[420px]">
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                key={featured.styleId}
                className="animate-pdp-family-explorer-enter"
                aria-live="polite"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 [transform:translateZ(0)]">
                  <Image
                    src={featured.imageSrc}
                    alt={featured.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 420px, 92vw"
                    priority={false}
                  />
                  <ExplorerArrow
                    direction="prev"
                    disabled={atStart}
                    onClick={() => goTo(index - 1)}
                  />
                  <ExplorerArrow
                    direction="next"
                    disabled={atEnd}
                    onClick={() => goTo(index + 1)}
                  />
                </div>

                <div className="mt-5 text-center">
                  {featured.isCurrent ? (
                    <span
                      className={cn(
                        "mb-3 inline-flex items-center rounded-full bg-black px-3 py-1.5 text-white",
                        pdpType.micro,
                      )}
                    >
                      Current style
                    </span>
                  ) : null}
                  <h3 className={cn("m-0", pdpType.headline)}>{featured.name}</h3>
                  <p className={cn("mt-1.5 text-neutral-500", pdpType.body)}>
                    {featured.positioning}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {featured.isCurrent ? (
                <div
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-3.5 text-neutral-500",
                    pdpType.body,
                  )}
                  aria-disabled
                >
                  <MaterialIcon
                    name="check"
                    size={18}
                    className="leading-none"
                  />
                  <span className="font-extended">You&rsquo;re viewing this style</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => tabby.navigateToStyle(featured.styleId)}
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-full bg-black px-4 py-3.5 text-white",
                    pdpType.body,
                    pdpPressableClass,
                  )}
                >
                  <span className="font-extended">View {featured.name}</span>
                </button>
              )}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
