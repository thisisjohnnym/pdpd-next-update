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
import { pdpType } from "./pdp-type";
import { revealStaggerDelay } from "./use-pdp-element-reveal";
import {
  useCarouselSnapStartActiveIndex,
  useDragToScroll,
} from "./use-infinite-centered-carousel";
import {
  PDP_V4_DETAILS_SECTION,
  PDP_V4_SPECS,
  PDP_V5_DETAILS_COLUMNS,
  PDP_V5_DETAILS_HEADLINE,
  PDP_V5_DETAILS_INTRO,
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
            className="font-extended m-0 text-center text-[28px] font-normal leading-[38px] tracking-tight text-balance text-white"
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
      <span className={cn(pdpType.headline, "tabular-nums text-neutral-900")}>
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
  itemGapClass = "gap-1",
}: {
  specs: readonly PdpProductDetailSpecV4[];
  leftAlign?: boolean;
  /** v5 bumps label/value/hint rhythm to 12px (`gap-3`). */
  itemGapClass?: string;
}) {
  const alignClass = leftAlign ? "items-start text-left" : "items-center text-center";

  let staggerIndex = 0;

  return (
    <div className="grid grid-cols-2">
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
              "flex min-w-0 flex-col py-5",
              itemGapClass,
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

/** One fact cell — label over value, hairline bottom-pinned so rows align. */
function SpecSheetV5Cell({
  spec,
  delay,
  showDivider = true,
}: {
  spec: PdpProductDetailSpecV4;
  delay: number;
  /** Last row drops its rule so it doesn't sit against the section below. */
  showDivider?: boolean;
}) {
  return (
    <PdpRevealItem delay={delay} className="flex flex-col">
      <div className={cn("flex flex-col gap-2", showDivider && "pb-5")}>
        <span className={cn(pdpType.label, "m-0 text-[#a1a1a1]")}>
          {spec.label}
        </span>
        <span
          className={cn(
            pdpType.body,
            "m-0 text-black",
            spec.tabular && "tabular-nums",
          )}
        >
          {spec.value}
        </span>
      </div>
      {showDivider ? (
        <div className="mt-auto h-px w-full bg-neutral-200" />
      ) : null}
    </PdpRevealItem>
  );
}

/**
 * v5 Details sheet (Paper node 407:399) — 28px heading, 16px intro, and a
 * two-column fact list with a hairline under every fact and no vertical rule.
 *
 * Rendered as a row-aligned grid (row-major placement) so a wrapped value —
 * e.g. "Phone - Wallet - Keys" on a narrow screen — never offsets the opposite
 * column into a staircase. Cells stretch to the row height and the hairline
 * bottom-pins, keeping every rule aligned across both columns.
 */
function SpecSheetV5({ eyebrow }: { eyebrow: string }) {
  const [leftColumn, rightColumn] = PDP_V5_DETAILS_COLUMNS;
  const rowCount = Math.max(leftColumn.length, rightColumn.length);
  const rows = Array.from({ length: rowCount }, (_, rowIndex) => [
    leftColumn[rowIndex],
    rightColumn[rowIndex],
  ]);

  let staggerIndex = 0;

  return (
    <div className="flex flex-col gap-5 px-4 pt-12 pb-16">
      <div className="flex flex-col gap-1.5">
        <PdpModuleHeading spacing="none" className="text-left">
          {eyebrow}
        </PdpModuleHeading>
        <PdpTextReveal
          as="p"
          delay={100}
          className={pdpModuleIntroClass("left")}
        >
          {PDP_V5_DETAILS_INTRO}
        </PdpTextReveal>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          {rows.map((row, rowIndex) =>
            row.map((spec, columnIndex) => {
              if (!spec) {
                return <div key={`empty-${rowIndex}-${columnIndex}`} />;
              }
              const delay = revealStaggerDelay(staggerIndex);
              staggerIndex += 1;
              return (
                <SpecSheetV5Cell
                  key={spec.id}
                  spec={spec}
                  delay={delay}
                  showDivider={rowIndex < rowCount - 1}
                />
              );
            }),
          )}
        </div>
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
  useV5DetailsSheet = false,
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
  /** Editorial two-column spec sheet (Paper node 407:399). v5 only. */
  useV5DetailsSheet?: boolean;
  /** When false, hide the closer-look image tile gallery beneath the specs. */
  showCloserLook?: boolean;
  /** Left-align the module title on v4. */
  leftAlignModuleHeadings?: boolean;
}) {
  const { specs, closerLook, eyebrow } = PDP_PRODUCT_DETAILS;
  const v5DetailsLayout = !showCloserLook && useV4Spacing;

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative w-full shrink-0 overflow-clip bg-white",
        useV4Spacing ? "pt-0" : "pt-14",
      )}
    >
      {useV5DetailsSheet ? (
        <SpecSheetV5 eyebrow={PDP_V5_DETAILS_HEADLINE} />
      ) : useV4Specs ? (
        <div
          className={cn(
            "px-4",
            !showCloserLook && useV4Spacing ? "pt-6 pb-6" : "pt-4 pb-10",
          )}
        >
          <div
            className={cn(
              "mb-5 flex flex-col gap-1.5",
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
          <SpecListV4
            specs={PDP_V4_SPECS}
            leftAlign={leftAlignModuleHeadings}
            itemGapClass={v5DetailsLayout ? "gap-3" : "gap-1"}
          />
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
            className={cn(pdpType.headline, "m-0 leading-6")}
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
