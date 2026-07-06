"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT_DETAILS,
  type PdpProductDetailSpec,
  type PdpProductDetailTile,
} from "./pdp-data";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextReveal } from "./pdp-text-reveal";
import { revealStaggerDelay } from "./use-pdp-element-reveal";
import { PDP_V4_SPECS } from "./version/pdp-v4-specs";

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

/**
 * v4 spec column classes — Paper r5 `LDA-0`. Every cell carries symmetric
 * `pl-16 pr-12` padding (the frozen v1/v2 rows kept the first cell flush).
 */
const SPEC_COL_CLASS_V4 = [
  "pl-4 pr-3",
  "border-l border-neutral-200 pl-4 pr-3",
  "border-l border-neutral-200 pl-4",
] as const;

const SPEC_PAIR_COL_CLASS_V4 = [
  "pl-4 pr-3",
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
function SpecCell({ spec, colClass }: { spec: PdpProductSpec; colClass?: string }) {
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
 * v4 five-up spec layout — Paper r5 `LD6-0`. A 3-up dimension row
 * (Height / Width / Depth) over a 2-up row (Weight / Strap drop).
 */
function SpecGridV4({ specs }: { specs: readonly PdpProductSpec[] }) {
  const dimensionRow = specs.slice(0, 3);
  const secondaryRow = specs.slice(3, 5);

  return (
    <div className="flex flex-col gap-4 px-2 py-6">
      <PdpRevealItem delay={revealStaggerDelay(0)}>
        <div className="flex">
          {dimensionRow.map((spec, index) => (
            <SpecCell
              key={spec.id}
              spec={spec}
              colClass={SPEC_COL_CLASS_V4[index]}
            />
          ))}
        </div>
      </PdpRevealItem>
      {secondaryRow.length ? (
        <PdpRevealItem delay={revealStaggerDelay(1)}>
          <div className="flex border-t border-neutral-200 pt-4">
            {secondaryRow.map((spec, index) => (
              <SpecCell
                key={spec.id}
                spec={spec}
                colClass={SPEC_PAIR_COL_CLASS_V4[index]}
              />
            ))}
          </div>
        </PdpRevealItem>
      ) : null}
    </div>
  );
}

/** One detail card — image with a title + caption beneath */
function DetailTile({
  tile,
  squareCorners = false,
}: {
  tile: PdpProductDetailTile;
  /** v4 Paper r5 `LDS-0` drops the rounded tile corners. */
  squareCorners?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={cn(
          "relative h-[194px] w-full shrink-0 overflow-hidden bg-neutral-200",
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

/** Product details — macro hero, spec row, and 2×2 visual gallery */
export function PdpProductDetailsModule({
  showHeading = true,
  useV4Specs = false,
  useV4Spacing = false,
}: {
  /** When false the "A closer look" sub-heading is hidden (v2 Paper AHD-0). */
  showHeading?: boolean;
  /** Render the v4 five-up spec layout (Height/Width/Depth/Weight/Strap drop — Paper r5 LD6-0). */
  useV4Specs?: boolean;
  /** Apply the r5 gallery padding/gap + square tile corners (Paper r5 LDS-0). v4 only. */
  useV4Spacing?: boolean;
}) {
  const { specs, closerLook } = PDP_PRODUCT_DETAILS;

  return (
    <section
      data-header-surface="light"
      className="relative w-full shrink-0 overflow-clip bg-white pt-14"
    >
      <MacroHero />

      {useV4Specs ? (
        <SpecGridV4 specs={PDP_V4_SPECS} />
      ) : (
        <SpecRow specs={specs} />
      )}

      <div
        className={cn(
          "flex flex-col",
          useV4Spacing ? "px-4 pb-4" : "px-2 pb-6",
          showHeading && "gap-4 pt-[30px]",
          !showHeading && "pt-[30px]",
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
        ) : (
          <DetailTileColumns
            tiles={closerLook.tiles}
            squareCorners={useV4Spacing}
            columnGapClass={useV4Spacing ? "gap-4" : "gap-2"}
          />
        )}
      </div>
    </section>
  );
}
