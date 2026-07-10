"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_COLORS,
  pdpColorIsSelectable,
  type PdpColor,
} from "../pdp-data";
import { PdpIconSwap } from "../pdp-icon-swap";
import { PdpModuleHeading } from "../pdp-module-heading";
import { pdpModuleIntroClass } from "../pdp-module-section";
import { PdpRevealItem } from "../pdp-reveal-item";
import { PdpTextReveal } from "../pdp-text-reveal";
import { pdpPressableClass, pdpType } from "../pdp-type";
import { revealStaggerDelay } from "../use-pdp-element-reveal";

import {
  PDP_CLOSER_LOOK_FEATURES,
  PDP_CLOSER_LOOK_SECTION,
} from "./pdp-data-v2";
import { PDP_HERO_FITS_INSIDE_TARGET_ID } from "./pdp-hero-fits-inside-button";
import { PdpV5HighlightDetailSheet } from "./pdp-v5-highlight-detail-sheet";
import { getPdpVersionConfig } from "./pdp-version-config";
import { usePdpVersion } from "./pdp-version-context";

const DEFAULT_COLOR =
  PDP_COLORS.find((color) => color.id === "black") ?? PDP_COLORS[0];
const STAGE_FEATURE =
  PDP_CLOSER_LOOK_FEATURES.find((feature) => feature.kind === "colors") ??
  PDP_CLOSER_LOOK_FEATURES[0];
const CLOSER_LOOK_DETAIL_SHEET_ID = "pdp-v5-closer-look-detail-sheet";

/**
 * v5 "Every detail, up close" — Apple-style product stage that replaces the
 * craftsmanship carousel. Fixed hero with squared feature chips; Colors opens
 * an editorial color navigator with a live product preview.
 */
export function PdpV5CloserLook() {
  const { headline, intro } = PDP_CLOSER_LOOK_SECTION;
  const { leftAlignModuleHeadings, useV4ModuleSpacing } =
    getPdpVersionConfig(usePdpVersion());
  const [openFeatureId, setOpenFeatureId] = useState<string | null>(null);
  const [previewColorId, setPreviewColorId] = useState(
    DEFAULT_COLOR?.id ?? "black",
  );
  const openFeature =
    PDP_CLOSER_LOOK_FEATURES.find((feature) => feature.id === openFeatureId) ??
    null;
  const isColorsTray = openFeature?.kind === "colors";
  const previewColor =
    PDP_COLORS.find((color) => color.id === previewColorId) ?? DEFAULT_COLOR;
  const alignClass = leftAlignModuleHeadings
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <section
      data-header-surface="light"
      aria-label={headline}
      className={cn(
        "w-full shrink-0 bg-white text-black",
        useV4ModuleSpacing ? "pt-14 pb-10" : "pt-12 pb-8",
      )}
    >
      {/* Keep the hero Fits Inside scroll target when craftsmanship is replaced. */}
      <span id={PDP_HERO_FITS_INSIDE_TARGET_ID} className="sr-only" />

      <div
        className={cn(
          "flex flex-col",
          useV4ModuleSpacing ? "gap-8 px-3" : "gap-6 px-3",
        )}
      >
        <div className={cn("flex flex-col gap-3", alignClass)}>
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

        <PdpRevealItem
          as="div"
          delay={revealStaggerDelay(0)}
          className="relative mx-auto aspect-[3/4] w-full max-w-[32rem] overflow-hidden bg-neutral-100 sm:aspect-[4/5]"
        >
          {PDP_COLORS.map((color) => (
            <Image
              key={color.id}
              src={color.hero}
              alt={previewColor?.id === color.id ? color.heroAlt : ""}
              fill
              aria-hidden={previewColor?.id !== color.id}
              className={cn(
                "pointer-events-none select-none object-contain p-4 transition-opacity duration-300 ease-out",
                previewColor?.id === color.id ? "opacity-100" : "opacity-0",
              )}
              sizes="(min-width: 1024px) 28rem, 92vw"
              priority={color.id === DEFAULT_COLOR?.id}
            />
          ))}
          {!previewColor && STAGE_FEATURE ? (
            <Image
              src={STAGE_FEATURE.src}
              alt={STAGE_FEATURE.alt}
              fill
              className="pointer-events-none select-none object-cover"
              sizes="(min-width: 1024px) 28rem, 92vw"
              priority
            />
          ) : null}
        </PdpRevealItem>

        <PdpTextReveal as="div" delay={160} className="m-0">
          <div
            aria-label="Closer look features"
            className={cn(
              "-mx-3 flex gap-2 overflow-x-auto px-3 pb-1",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {PDP_CLOSER_LOOK_FEATURES.map((feature) => {
              const sheetOpen = openFeatureId === feature.id;

              return (
                <button
                  key={feature.id}
                  type="button"
                  aria-controls={CLOSER_LOOK_DETAIL_SHEET_ID}
                  aria-expanded={sheetOpen}
                  aria-label={
                    sheetOpen
                      ? `Close ${feature.label}`
                      : `More about ${feature.label}`
                  }
                  onClick={() =>
                    setOpenFeatureId((current) =>
                      current === feature.id ? null : feature.id,
                    )
                  }
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-none px-4",
                    "border border-neutral-200 bg-transparent text-black",
                    "transition-[border-color,background-color,transform] duration-200 ease-out",
                    "active:scale-[0.96] active:bg-neutral-50",
                    sheetOpen && "border-neutral-400",
                    pdpPressableClass,
                    pdpType.body,
                    "font-normal",
                  )}
                >
                  {feature.kind === "colors" ? (
                    <span
                      aria-hidden
                      className="size-4 shrink-0 rounded-full ring-1 ring-black/20 transition-[background-color] duration-200 ease-out"
                      style={{
                        backgroundColor:
                          previewColor?.chromeSample ??
                          feature.swatchColor ??
                          "#1a1a1a",
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="relative flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-black/35"
                    >
                      <PdpIconSwap
                        active={sheetOpen}
                        activeIcon={
                          <MaterialIcon
                            name="close"
                            size={14}
                            className="text-black"
                          />
                        }
                        inactiveIcon={
                          <MaterialIcon
                            name="add"
                            size={14}
                            className="text-black"
                          />
                        }
                        className="size-3.5"
                      />
                    </span>
                  )}
                  <span className="translate-y-[2px] whitespace-nowrap">
                    {feature.label}
                  </span>
                </button>
              );
            })}
          </div>
        </PdpTextReveal>
      </div>

      <PdpV5HighlightDetailSheet
        id={CLOSER_LOOK_DETAIL_SHEET_ID}
        card={openFeature}
        open={openFeatureId !== null}
        onClose={() => setOpenFeatureId(null)}
        maxHeight={isColorsTray ? "88dvh" : undefined}
      >
        {isColorsTray && previewColor ? (
          <CloserLookColorNavigator
            selectedColor={previewColor}
            onSelectColor={setPreviewColorId}
          />
        ) : openFeature?.kind === "feature" ? (
          <CloserLookPhotoPlaceholder label={openFeature.label} />
        ) : null}
      </PdpV5HighlightDetailSheet>
    </section>
  );
}

/** Content-team cue — replace with the feature photo when assets land. */
function CloserLookPhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={`Photo placeholder for ${label}`}
      className="mt-4 flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center"
    >
      <MaterialIcon name="image" size={26} className="text-neutral-400" />
      <p className={cn(pdpType.label, "m-0 text-neutral-500")}>
        Photo placeholder
      </p>
      <p className={cn(pdpType.caption, "m-0 text-neutral-400")}>
        Add photo for {label}
      </p>
    </div>
  );
}

/** Editorial color navigator — live product preview + compare chip rail. */
function CloserLookColorNavigator({
  selectedColor,
  onSelectColor,
}: {
  selectedColor: PdpColor;
  onSelectColor: (colorId: string) => void;
}) {
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const selectedIndex = Math.max(
    0,
    PDP_COLORS.findIndex((color) => color.id === selectedColor.id),
  );

  useEffect(() => {
    chipRefs.current.get(selectedColor.id)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedColor.id]);

  const goRelative = (delta: number) => {
    const next = PDP_COLORS[selectedIndex + delta];
    if (next) {
      onSelectColor(next.id);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4">
      <div
        role="listbox"
        aria-label="Compare colors"
        className={cn(
          "-mx-3 flex gap-2 overflow-x-auto px-3 pb-0.5",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {PDP_COLORS.map((color) => {
          const selected = color.id === selectedColor.id;
          const selectable = pdpColorIsSelectable(color.availability);

          return (
            <button
              key={color.id}
              ref={(node) => {
                if (node) {
                  chipRefs.current.set(color.id, node);
                } else {
                  chipRefs.current.delete(color.id);
                }
              }}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={`${color.name}${selectable ? "" : ", sold out"}`}
              onClick={() => onSelectColor(color.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-none px-3",
                "border bg-transparent text-black",
                "transition-[border-color,background-color,transform,opacity] duration-200 ease-out",
                "active:scale-[0.96] active:bg-neutral-50",
                selected ? "border-black" : "border-neutral-200",
                !selectable && "opacity-55",
                pdpPressableClass,
                pdpType.label,
              )}
            >
              <span
                aria-hidden
                className="size-3.5 shrink-0 rounded-full ring-1 ring-black/15"
                style={{ backgroundColor: color.chromeSample }}
              />
              <span className="translate-y-[1px] whitespace-nowrap">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative aspect-[5/4] w-full overflow-hidden bg-neutral-100">
        {PDP_COLORS.map((color) => (
          <Image
            key={color.id}
            src={color.hero}
            alt={selectedColor.id === color.id ? color.heroAlt : ""}
            fill
            aria-hidden={selectedColor.id !== color.id}
            className={cn(
              "pointer-events-none select-none object-contain p-3 transition-opacity duration-300 ease-out",
              selectedColor.id === color.id ? "opacity-100" : "opacity-0",
            )}
            sizes="(min-width: 1024px) 26rem, 92vw"
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn(pdpType.headline, "m-0 text-black")}>
            {selectedColor.name}
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Previous color"
            disabled={selectedIndex <= 0}
            onClick={() => goRelative(-1)}
            className={cn(
              "flex size-9 items-center justify-center border border-neutral-200 bg-transparent text-black",
              "transition-[background-color,opacity,transform] duration-200 ease-out",
              "active:scale-[0.96] active:bg-neutral-50",
              "disabled:pointer-events-none disabled:opacity-35",
              pdpPressableClass,
            )}
          >
            <MaterialIcon name="chevron_left" size={20} />
          </button>
          <button
            type="button"
            aria-label="Next color"
            disabled={selectedIndex >= PDP_COLORS.length - 1}
            onClick={() => goRelative(1)}
            className={cn(
              "flex size-9 items-center justify-center border border-neutral-200 bg-transparent text-black",
              "transition-[background-color,opacity,transform] duration-200 ease-out",
              "active:scale-[0.96] active:bg-neutral-50",
              "disabled:pointer-events-none disabled:opacity-35",
              pdpPressableClass,
            )}
          >
            <MaterialIcon name="chevron_right" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
