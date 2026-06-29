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

/** Full-bleed macro — close-up of the bag with "The details" overlaid */
function MacroHero() {
  const { macro, eyebrow } = PDP_PRODUCT_DETAILS;

  return (
    <div className="relative aspect-[375/340] max-h-[58vh] w-full overflow-hidden bg-neutral-200">
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
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-5 bottom-5">
        <PdpTextReveal
          as="h2"
          className="font-extended m-0 text-[2.5rem] font-normal leading-[0.95] tracking-[-0.01em] text-balance text-white"
        >
          {eyebrow}
        </PdpTextReveal>
      </div>
    </div>
  );
}

/** Three-up spec row with hairline dividers */
function SpecRow({ specs }: { specs: readonly PdpProductSpec[] }) {
  return (
    <div className="flex">
      {specs.map((spec, index) => (
        <div
          key={spec.id}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 px-2",
            index > 0 && "border-l border-neutral-200",
          )}
        >
          <span className="font-extended text-xl font-normal leading-[22px] tracking-[-0.02em] text-neutral-900 tabular-nums">
            {spec.value}
          </span>
          <span className="text-center text-[11px] capitalize leading-[14px] text-neutral-500">
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
      <div className="relative aspect-[174/194] overflow-hidden rounded-lg bg-neutral-200">
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

/** Product details — macro hero, spec row, and 2×2 visual gallery */
export function PdpProductDetailsModule() {
  const { specs, closerLook } = PDP_PRODUCT_DETAILS;

  return (
    <section
      data-header-surface="light"
      className="relative w-full shrink-0 bg-white pb-7"
    >
      <PdpRevealItem>
        <MacroHero />
      </PdpRevealItem>

      <PdpRevealItem className="px-2 pb-[18px] pt-[26px]">
        <SpecRow specs={specs} />
      </PdpRevealItem>

      <PdpRevealItem delay={80} className="flex flex-col gap-4 px-2 pb-2 pt-[30px]">
        <PdpTextReveal
          as="h3"
          className="font-extended m-0 text-xl font-normal leading-6 tracking-[-0.01em] text-balance text-neutral-900"
        >
          {closerLook.heading}
        </PdpTextReveal>
        <div className="grid grid-cols-2 gap-x-2 gap-y-7">
          {closerLook.tiles.map((tile) => (
            <DetailTile key={tile.id} tile={tile} />
          ))}
        </div>
      </PdpRevealItem>
    </section>
  );
}
