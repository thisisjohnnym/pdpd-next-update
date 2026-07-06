"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT_DETAILS,
  type PdpProductDetailSpec,
  type PdpProductDetailTile,
} from "./pdp-data";
import {
  pdpCarouselScrollWrapClass,
  pdpDetailTileCardClass,
  pdpDetailTileScrollClass,
} from "./pdp-carousel";
import { PdpCarouselDotIndicator } from "./pdp-carousel-dot-indicator";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleIntroClass } from "./pdp-module-section";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextReveal } from "./pdp-text-reveal";
import { revealStaggerDelay } from "./use-pdp-element-reveal";
import {
  useCarouselSnapStartActiveIndex,
  useDragToScroll,
} from "./use-infinite-centered-carousel";
import {
  PDP_V4_DETAILS_SECTION,
  PDP_V4_SPECS,
  type PdpProductDetailSpecV4,
} from "./version/pdp-v4-specs";

/** Paper AHD-0 — column-major tile order (leather/hardware | interior/patina) */
const V2_TILE_COLUMNS: [number, number][] = [
  [0, 2],
  [1, 3],
];

const SPEC_COL_CLASS = [
  "pr-2",
  "border-l border-neutral-200 pl-4 pr-3",
  "border-l border-neutral-200 pl-4",
] as const;

/** Two-up divider classes — first cell flush, second gains the hairline. */
const SPEC_PAIR_COL_CLASS = [
  "pr-2",
  "border-l border-neutral-200 pl-4",
] as const;

/** Full-bleed macro — close-up of the bag with "The details" overlaid */
function MacroHero() {
  const { macro, eyebrow } = PDP_PRODUCT_DETAILS;

  return (
    <PdpRevealItem>
      <div className="relative h-[340px] w-full shrink-0 overflow-hidden bg-neutral-200">
        <Image
          src={macro.src}
          alt={macro.alt}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover object-center"
          style={{
            objectPosition: macro.objectPosition ?? "center",
            transform: `scale(${macro.scale ?? 1})`,
            transformOrigin: "center center",
            filter: "brightness(40%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-5 bottom-[22px]">
          <PdpTextReveal
            as="h2"
            delay={revealStaggerDelay(1)}
            className="font-extended m-0 text-center text-[28px] font-normal leading-[38px] tracking-[-0.01em] text-balance text-white"
          >
            {eyebrow}
          </PdpTextReveal>
        </div>
      </div>
    </PdpRevealItem>
  );
}

/** One spec cell — value over label. `colClass` carries the hairline divider. */
function SpecCell({
  spec,
  colClass,
}: {
  spec: PdpProductDetailSpec;
  colClass?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5",
        colClass,
      )}
    >
      <span className="font-extended text-xl font-normal leading-[22px] tracking-[-0.02em] text-neutral-900 tabular-nums">
        {spec.value}
      </span>
      <span className="w-full text-center font-sans text-[11px] capitalize leading-[14px] text-neutral-500">
        {spec.label}
      </span>
    </div>
  );
}

/** Three-up spec row with hairline dividers — Paper AHD-0 */
function SpecRow({ specs }: { specs: readonly PdpProductDetailSpec[] }) {
  return (
    <PdpRevealItem className="px-2 py-6">
      <div className="flex">
        {specs.map((spec, index) => (
          <SpecCell key={spec.id} spec={spec} colClass={SPEC_COL_CLASS[index]} />
        ))}
      </div>
    </PdpRevealItem>
  );
}

/**
 * v4 spec layout — editorial two-column sheet with hairline rules (Paper r5 `LD6-0`).
 * Horizontal rules between rows + a vertical rule between columns anchor the grid
 * without a boxed container.
 */
function SpecListV4({
  specs,
  leftAlign = true,
}: {
  specs: readonly PdpProductDetailSpecV4[];
  leftAlign?: boolean;
}) {
  const alignClass = leftAlign ? "items-start text-left" : "items-center text-center";

  let staggerIndex = 0;

  return (
    <div className="grid grid-cols-2 border-y border-neutral-200">
      {specs.map((spec, index) => {
        const delay = revealStaggerDelay(staggerIndex);
        staggerIndex += 1;
        const isRightColumn = index % 2 === 1;
        const isNotFirstRow = index >= 2;

        return (
          <PdpRevealItem
            key={spec.id}
            delay={delay}
            className={cn(
              "flex min-w-0 flex-col gap-1 py-5",
              alignClass,
              isNotFirstRow && "border-t border-neutral-200",
              isRightColumn ? "border-l border-neutral-200 pl-5" : "pr-5",
            )}
          >
            <span className="font-sans text-[11px] leading-[14px] tracking-[0.03em] text-neutral-400">
              {spec.label}
            </span>
            <span
              className={cn(
                "font-extended text-[14px] font-normal leading-[1.35] tracking-[0.2px] text-balance text-neutral-900",
                spec.tabular && "tabular-nums",
              )}
            >
              {spec.value}
            </span>
            {spec.hint ? (
              <span className="font-sans text-[11px] leading-[1.35] text-pretty text-neutral-400">
                {spec.hint}
              </span>
            ) : null}
          </PdpRevealItem>
        );
      })}
    </div>
  );
}

/** One detail card — image with a title + caption beneath */
function DetailTile({
  tile,
  squareCorners = false,
  className,
}: {
  tile: PdpProductDetailTile;
  /** v4 Paper r5 `LDS-0` drops the rounded tile corners. */
  squareCorners?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div
        className={cn(
          "relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-neutral-200",
          squareCorners ? "rounded-none" : "rounded-lg",
        )}
      >
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 45rem, 50vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-px">
        <span className="font-extended text-pretty text-xs font-normal leading-4 text-neutral-900">
          {tile.title}
        </span>
        <span className="font-extended text-pretty text-[11px] leading-4 text-neutral-500">
          {tile.caption}
        </span>
      </div>
    </div>
  );
}

/** Paper AHD-0 — two columns, 28px vertical rhythm between tiles */
function DetailTileColumns({
  tiles,
  squareCorners = false,
  columnGapClass = "gap-2",
}: {
  tiles: readonly PdpProductDetailTile[];
  squareCorners?: boolean;
  /** v4 Paper r5 `LDS-0` widens the inter-column gap to 16px. */
  columnGapClass?: string;
}) {
  let staggerIndex = 0;

  return (
    <div className={cn("flex", columnGapClass)}>
      {V2_TILE_COLUMNS.map((columnIndices, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-7">
          {columnIndices.map((tileIndex) => {
            const tile = tiles[tileIndex];
            if (!tile) {
              return null;
            }
            const delay = revealStaggerDelay(staggerIndex);
            staggerIndex += 1;

            return (
              <PdpRevealItem key={tile.id} delay={delay}>
                <DetailTile tile={tile} squareCorners={squareCorners} />
              </PdpRevealItem>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** v4 — horizontal peek rail with dot pagination (Paper r5 `LDS-0`) */
function DetailTileCarousel({
  tiles,
  squareCorners = false,
}: {
  tiles: readonly PdpProductDetailTile[];
  squareCorners?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = useCarouselSnapStartActiveIndex(scrollRef);

  useDragToScroll(scrollRef);

  return (
    <>
      <div className={cn(pdpCarouselScrollWrapClass, "relative")}>
        <div
          ref={scrollRef}
          className={cn(
            "pdp-carousel-draggable overflow-y-clip pb-2",
            pdpDetailTileScrollClass,
          )}
          aria-label="Product detail highlights"
        >
          {tiles.map((tile, index) => (
            <PdpRevealItem key={tile.id} delay={revealStaggerDelay(index)}>
              <DetailTile
                tile={tile}
                squareCorners={squareCorners}
                className={pdpDetailTileCardClass}
              />
            </PdpRevealItem>
          ))}
        </div>
      </div>
      <PdpCarouselDotIndicator
        activeIndex={activeIndex}
        count={tiles.length}
        ariaLabel="Detail tile position"
        className="mt-4"
      />
    </>
  );
}

/** Product details — macro hero, spec row, and 2×2 visual gallery */
export function PdpProductDetailsModule({
  showHeading = true,
  useV4Specs = false,
  useV4Spacing = false,
  useV4DetailsTileCarousel = false,
  showCloserLook = true,
  leftAlignModuleHeadings = false,
}: {
  /** When false the "A closer look" sub-heading is hidden (v2 Paper AHD-0). */
  showHeading?: boolean;
  /** Render the v4 four-fact spec layout (Dimensions/Weight/Carry/Capacity — Paper r5 LD6-0). */
  useV4Specs?: boolean;
  /** Apply the r5 gallery padding/gap + square tile corners (Paper r5 LDS-0). v4 only. */
  useV4Spacing?: boolean;
  /** Horizontal peek rail for closer-look tiles instead of the 2×2 grid. v4 only. */
  useV4DetailsTileCarousel?: boolean;
  /** When false, hide the closer-look image tile gallery beneath the specs. */
  showCloserLook?: boolean;
  /** Left-align the module title on v4. */
  leftAlignModuleHeadings?: boolean;
}) {
  const { specs, closerLook, eyebrow } = PDP_PRODUCT_DETAILS;

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative w-full shrink-0 overflow-clip bg-white",
        useV4Spacing ? "pt-0" : "pt-14",
      )}
    >
      {useV4Specs ? (
        <div className="px-4 pb-10 pt-4">
          <div
            className={cn(
              "mb-5 flex flex-col gap-2",
              leftAlignModuleHeadings ? "items-start" : "items-center text-center",
            )}
          >
            <PdpModuleHeading
              spacing="none"
              className={leftAlignModuleHeadings ? "text-left" : "text-center"}
            >
              {eyebrow}
            </PdpModuleHeading>
            <PdpTextReveal
              as="p"
              delay={100}
              className={pdpModuleIntroClass(
                leftAlignModuleHeadings ? "left" : "center",
              )}
            >
              {PDP_V4_DETAILS_SECTION.intro}
            </PdpTextReveal>
          </div>
          <SpecListV4 specs={PDP_V4_SPECS} leftAlign={leftAlignModuleHeadings} />
        </div>
      ) : (
        <MacroHero />
      )}

      {!useV4Specs ? (
        <SpecRow specs={specs} />
      ) : null}

      {showCloserLook ? (
      <div
        className={cn(
          "flex flex-col",
          useV4Spacing ? "px-4 pb-4" : "px-2 pb-6",
          showHeading && "gap-4 pt-[30px]",
          !showHeading && (useV4Spacing ? "pt-6" : "pt-[30px]"),
        )}
      >
        {showHeading ? (
          <PdpTextReveal
            as="h3"
            className="font-extended m-0 text-xl font-normal leading-6 tracking-[-0.01em] text-balance text-neutral-900"
          >
            {closerLook.heading}
          </PdpTextReveal>
        ) : null}
        {showHeading ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-7">
            {closerLook.tiles.map((tile, index) => (
              <PdpRevealItem key={tile.id} delay={revealStaggerDelay(index)}>
                <DetailTile tile={tile} />
              </PdpRevealItem>
            ))}
          </div>
        ) : useV4DetailsTileCarousel ? (
          <DetailTileCarousel
            tiles={closerLook.tiles}
            squareCorners={useV4Spacing}
          />
        ) : (
          <DetailTileColumns
            tiles={closerLook.tiles}
            squareCorners={useV4Spacing}
            columnGapClass={useV4Spacing ? "gap-4" : "gap-2"}
          />
        )}
      </div>
      ) : null}
    </section>
  );
}
