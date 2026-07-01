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
        "absolute top-1/2 z-10 inline-flex size-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur transition-opacity",
        isPrev ? "left-2" : "right-2",
        disabled
          ? "cursor-not-allowed opacity-0"
          : cn("opacity-100", pdpPressableIconClass),
      )}
    >
      <MaterialIcon
        name={isPrev ? "chevron_left" : "chevron_right"}
        size={20}
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
          <div className="mb-6 flex flex-col items-center gap-1 text-center">
            <PdpModuleHeading spacing="none" className="text-center">
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
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 [transform:translateZ(0)]">
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
                  <h3 className={cn("m-0", pdpType.headline)}>{featured.name}</h3>
                  <p className={cn("mt-1.5 text-neutral-500", pdpType.body)}>
                    {featured.positioning}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex min-h-[52px] w-full items-center justify-center">
              {featured.isCurrent ? (
                <div
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0F0F0] py-2 pl-2 pr-3 text-neutral-500",
                    pdpType.label,
                  )}
                  aria-disabled
                >
                  <MaterialIcon
                    name="check_circle"
                    filled
                    size={18}
                    className="leading-none text-black"
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
