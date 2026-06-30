"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT_DETAILS,
  type PdpProductDetailTile,
  type PdpProductSpec,
} from "./pdp-data";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextReveal } from "./pdp-text-reveal";

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

/** Full-bleed macro — close-up of the bag with "The details" overlaid */
function MacroHero() {
  const { macro, eyebrow } = PDP_PRODUCT_DETAILS;

  return (
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
          className="font-extended m-0 text-center text-[28px] font-normal leading-[38px] tracking-[-0.01em] text-balance text-white"
        >
          {eyebrow}
        </PdpTextReveal>
      </div>
    </div>
  );
}

/** Three-up spec row with hairline dividers — Paper AHD-0 */
function SpecRow({ specs }: { specs: readonly PdpProductSpec[] }) {
  return (
    <div className="flex">
      {specs.map((spec, index) => (
        <div
          key={spec.id}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5",
            SPEC_COL_CLASS[index],
          )}
        >
          <span className="font-extended text-xl font-normal leading-[22px] tracking-[-0.02em] text-neutral-900 tabular-nums">
            {spec.value}
          </span>
          <span className="w-full text-center font-sans text-[11px] capitalize leading-[14px] text-neutral-500">
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** One detail card — image with a title + caption beneath */
function DetailTile({ tile }: { tile: PdpProductDetailTile }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-[194px] w-full shrink-0 overflow-hidden rounded-lg bg-neutral-200">
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
}: {
  tiles: readonly PdpProductDetailTile[];
}) {
  return (
    <div className="flex gap-2">
      {V2_TILE_COLUMNS.map((columnIndices, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-7">
          {columnIndices.map((tileIndex) => {
            const tile = tiles[tileIndex];
            if (!tile) {
              return null;
            }
            return <DetailTile key={tile.id} tile={tile} />;
          })}
        </div>
      ))}
    </div>
  );
}

/** Product details — macro hero, spec row, and 2×2 visual gallery */
export function PdpProductDetailsModule({
  showHeading = true,
}: {
  /** When false the "A closer look" sub-heading is hidden (v2 Paper AHD-0). */
  showHeading?: boolean;
}) {
  const { specs, closerLook } = PDP_PRODUCT_DETAILS;

  return (
    <section
      data-header-surface="light"
      className="relative w-full shrink-0 overflow-clip bg-white pt-14"
    >
      <PdpRevealItem>
        <MacroHero />
      </PdpRevealItem>

      <PdpRevealItem className="px-2 py-6">
        <SpecRow specs={specs} />
      </PdpRevealItem>

      <PdpRevealItem
        delay={80}
        className={cn(
          "flex flex-col px-2 pb-6",
          showHeading && "gap-4 pt-[30px]",
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
            {closerLook.tiles.map((tile) => (
              <DetailTile key={tile.id} tile={tile} />
            ))}
          </div>
        ) : (
          <DetailTileColumns tiles={closerLook.tiles} />
        )}
      </PdpRevealItem>
    </section>
  );
}
