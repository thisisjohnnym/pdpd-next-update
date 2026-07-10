"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpCarouselScrollClass,
  pdpCarouselScrollWrapClass,
} from "../pdp-carousel";
import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpRevealItem } from "../pdp-reveal-item";
import {
  getAvailableSizesForStyle,
  getNearestAvailableSize,
} from "../pdp-tabby-catalog";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import {
  DEFAULT_TABBY_SIZE,
  DEFAULT_TABBY_STYLE_ID,
  getTabbySizeOption,
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";
import { PdpTextReveal } from "../pdp-text-reveal";
import {
  pdpPillRadiusClass,
  pdpPressableClass,
  pdpPressableIconClass,
  pdpStrokeCtaClass,
  pdpType,
} from "../pdp-type";
import {
  useCarouselSnapStartActiveIndex,
  useDragToScroll,
} from "../use-infinite-centered-carousel";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_CLOSER_LOOK_SECTION,
  PDP_FIND_YOUR_TABBY_FAMILY,
  PDP_FIND_YOUR_TABBY_SIZE_SCALE,
  type FindYourTabbyFamilyMember,
  type FindYourTabbyFamilyStyleId,
} from "./pdp-data-v2";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

type SlideSizeMap = Record<FindYourTabbyFamilyStyleId, TabbySize>;

function isExplorerStyle(
  styleId: TabbyStyleId,
): styleId is FindYourTabbyFamilyStyleId {
  return PDP_FIND_YOUR_TABBY_FAMILY.some((member) => member.styleId === styleId);
}

function resolveExplorerStyle(
  styleId: TabbyStyleId | null | undefined,
): FindYourTabbyFamilyStyleId {
  if (styleId && isExplorerStyle(styleId)) {
    return styleId;
  }
  if (isExplorerStyle(DEFAULT_TABBY_STYLE_ID)) {
    return DEFAULT_TABBY_STYLE_ID;
  }
  return PDP_FIND_YOUR_TABBY_FAMILY[0]!.styleId;
}

function buildInitialSizes(
  preferred: TabbySize,
): SlideSizeMap {
  return Object.fromEntries(
    PDP_FIND_YOUR_TABBY_FAMILY.map((member) => [
      member.styleId,
      getNearestAvailableSize(member.styleId, preferred),
    ]),
  ) as SlideSizeMap;
}

function slideIndexForStyle(styleId: FindYourTabbyFamilyStyleId): number {
  const index = PDP_FIND_YOUR_TABBY_FAMILY.findIndex(
    (member) => member.styleId === styleId,
  );
  return index === -1 ? 0 : index;
}

/**
 * v5 "Find your Tabby" — carousel-first family explorer.
 * One horizontal rail of silhouettes; size chips update the active slide only.
 * No drawers, apply step, or nested panels.
 */
export function PdpV5CloserLook() {
  const { headline, intro } = PDP_CLOSER_LOOK_SECTION;
  const { leftAlignModuleHeadings, squareButtonCorners } =
    getPdpVersionConfig(usePdpVersion());
  const tabby = useOptionalTabbyVariant();

  const liveSize = tabby?.size ?? DEFAULT_TABBY_SIZE;
  const liveStyleId = resolveExplorerStyle(tabby?.styleId);

  const [slideSizes, setSlideSizes] = useState<SlideSizeMap>(() =>
    buildInitialSizes(liveSize),
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = useCarouselSnapStartActiveIndex(scrollRef);
  useDragToScroll(scrollRef);

  useEffect(() => {
    setSlideSizes(buildInitialSizes(liveSize));
  }, [liveSize, liveStyleId]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const child = el.children[slideIndexForStyle(liveStyleId)] as
      | HTMLElement
      | undefined;
    if (!child) {
      return;
    }
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({
      left: child.offsetLeft - paddingLeft,
      behavior: "auto",
    });
  }, [liveStyleId]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const clamped = Math.min(
      Math.max(index, 0),
      PDP_FIND_YOUR_TABBY_FAMILY.length - 1,
    );
    const child = el.children[clamped] as HTMLElement | undefined;
    if (!child) {
      return;
    }
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({
      left: child.offsetLeft - paddingLeft,
      behavior: "smooth",
    });
  }, []);

  const selectSize = (
    styleId: FindYourTabbyFamilyStyleId,
    size: TabbySize,
  ) => {
    const available = getAvailableSizesForStyle(styleId);
    if (!available.includes(size)) {
      return;
    }
    setSlideSizes((prev) => ({ ...prev, [styleId]: size }));
  };

  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === PDP_FIND_YOUR_TABBY_FAMILY.length - 1;

  return (
    <section
      data-header-surface="light"
      aria-label={headline}
      className="w-full shrink-0 bg-white pt-10 pb-8 text-black"
    >
      <div className={cn("flex flex-col gap-5", alignClass, "px-3")}>
        <div className={cn("flex flex-col gap-1.5", alignClass)}>
          <PdpModuleHeading
            spacing="none"
            className={leftAlignModuleHeadings ? "text-left" : "text-center"}
          >
            {headline}
          </PdpModuleHeading>
          <PdpTextReveal
            as="p"
            delay={100}
            className={pdpModuleIntroClass(
              leftAlignModuleHeadings ? "left" : "center",
            )}
          >
            {intro}
          </PdpTextReveal>
        </div>
      </div>

      <div className={cn(pdpCarouselScrollWrapClass, "relative mt-5")}>
        <div
          ref={scrollRef}
          className={cn(
            pdpCarouselScrollClass,
            "pdp-fy-family-carousel pdp-carousel-draggable flex items-start gap-3",
          )}
          aria-label="Tabby family silhouettes"
        >
          {PDP_FIND_YOUR_TABBY_FAMILY.map((member, index) => (
            <FamilySilhouetteSlide
              key={member.styleId}
              member={member}
              size={slideSizes[member.styleId]}
              onSelectSize={(size) => selectSize(member.styleId, size)}
              onShop={() =>
                tabby?.navigateToStyleSize(
                  member.styleId,
                  slideSizes[member.styleId],
                )
              }
              showShop={Boolean(tabby)}
              squareButtonCorners={squareButtonCorners}
              leftAlign={leftAlignModuleHeadings}
              priority={index === 0}
              revealDelay={revealStaggerDelay(Math.min(index, 2))}
            />
          ))}
        </div>

        <FamilyCarouselArrow
          direction="prev"
          disabled={atStart}
          onClick={() => scrollToIndex(activeIndex - 1)}
        />
        <FamilyCarouselArrow
          direction="next"
          disabled={atEnd}
          onClick={() => scrollToIndex(activeIndex + 1)}
        />
      </div>
    </section>
  );
}

function FamilyCarouselArrow({
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
      aria-label={isPrev ? "Previous silhouette" : "Next silhouette"}
      className={cn(
        "absolute top-[22%] z-10 hidden size-9 -translate-y-1/2 items-center justify-center",
        "bg-white/90 text-black backdrop-blur-sm",
        "outline outline-1 -outline-offset-1 outline-black/10",
        "transition-[opacity,transform] duration-200 ease-out",
        "disabled:pointer-events-none disabled:opacity-0",
        "lg:inline-flex",
        isPrev ? "left-3" : "right-3",
        !disabled && pdpPressableIconClass,
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

function FamilySilhouetteSlide({
  member,
  size,
  onSelectSize,
  onShop,
  showShop,
  squareButtonCorners,
  leftAlign,
  priority,
  revealDelay,
}: {
  member: FindYourTabbyFamilyMember;
  size: TabbySize;
  onSelectSize: (size: TabbySize) => void;
  onShop: () => void;
  showShop: boolean;
  squareButtonCorners: boolean;
  leftAlign: boolean;
  priority: boolean;
  revealDelay: number;
}) {
  const availableSizes = getAvailableSizesForStyle(member.styleId);
  /** Classic uses real size photos — skip synthetic scale so framing stays stable. */
  const sizeScale =
    member.styleId === "classic"
      ? 1
      : PDP_FIND_YOUR_TABBY_SIZE_SCALE[size];
  const productName = `${member.label} Tabby ${size}`;
  const ctaLabel = `Shop ${member.label} Tabby ${size}`;
  const alignClass = leftAlign
    ? "items-start text-left"
    : "items-center text-center";
  const usesSizePhoto = member.styleId === "classic";

  return (
    <PdpRevealItem
      as="article"
      delay={revealDelay}
      className={cn(
        "pdp-fy-family-slide flex shrink-0 snap-start snap-always flex-col gap-2.5",
        "w-[calc((100vw-1.25rem)/1.08)] lg:w-[calc((100vw-2.25rem)/2.35)]",
      )}
      aria-label={productName}
    >
      <div className="pdp-fy-hero relative aspect-square w-full overflow-hidden bg-neutral-100 sm:aspect-[5/4]">
        <div
          className="pdp-fy-bag-scale absolute inset-0"
          style={{ transform: `scale(${sizeScale})` }}
        >
          {usesSizePhoto ? (
            availableSizes.map((availableSize) => {
              const option = getTabbySizeOption(availableSize);
              const active = availableSize === size;

              return (
                <div
                  key={option.image}
                  className={cn(
                    "absolute inset-0",
                    "transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                    active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={!active}
                >
                  <Image
                    src={option.image}
                    alt={active ? productName : ""}
                    fill
                    className="pointer-events-none select-none object-contain pdp-fy-size-image"
                    sizes="(min-width: 1024px) 42vw, 92vw"
                    priority={priority && active}
                  />
                </div>
              );
            })
          ) : (
            <Image
              src={member.src}
              alt={productName}
              fill
              className="pointer-events-none select-none object-contain pdp-fy-bag-image"
              sizes="(min-width: 1024px) 42vw, 92vw"
              priority={priority}
            />
          )}
        </div>
      </div>

      <div className={cn("flex flex-col gap-3", alignClass)}>
        <div className={cn("flex flex-col gap-1", alignClass)}>
          <p
            key={`${member.styleId}-${size}-title`}
            className={cn(
              pdpType.productName,
              "pdp-fy-copy-in m-0 text-balance text-base tabular-nums text-black lg:text-sm",
            )}
            aria-live="polite"
          >
            {productName}
          </p>
          <p
            className={cn(
              pdpType.body,
              "m-0 max-w-[34ch] text-pretty text-neutral-600",
            )}
          >
            {member.editorial}
          </p>
        </div>

        <div
            role="listbox"
            aria-label={`${member.label} Tabby sizes`}
            className={cn(
              "flex flex-wrap items-center gap-x-1 gap-y-1.5",
              leftAlign ? "justify-start" : "justify-center",
            )}
          >
            <span
              className={cn(pdpType.label, "mr-1 text-neutral-500")}
            >
              Size
            </span>
            {availableSizes.map((availableSize) => {
              const selected = availableSize === size;

              return (
                <button
                  key={availableSize}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectSize(availableSize)}
                  className={cn(
                    "inline-flex min-h-8 min-w-8 items-center justify-center px-2.5 tabular-nums",
                    "transition-[background-color,color,transform] duration-200 ease-out",
                    "active:scale-[0.96]",
                    squareButtonCorners ? "rounded-none" : "rounded-full",
                    selected
                      ? "bg-black text-white"
                      : "bg-transparent text-neutral-500 hover:text-black",
                    pdpType.label,
                    pdpPressableClass,
                  )}
                >
                  {availableSize}
                </button>
              );
            })}
          </div>

        {showShop ? (
          <button
            type="button"
            onClick={onShop}
            className={cn(
              "inline-flex w-full items-center justify-center px-4 py-3",
              pdpStrokeCtaClass,
              pdpPillRadiusClass(squareButtonCorners),
              pdpType.body,
            )}
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </PdpRevealItem>
  );
}
