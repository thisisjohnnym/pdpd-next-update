"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT_DETAILS,
  type PdpProductDetailTile,
  type PdpProductSpec,
} from "./pdp-data";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextReveal } from "./pdp-text-reveal";
import { pdpType, pdpPressableClass } from "./pdp-type";

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
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-5 bottom-5">
        <PdpTextReveal
          as="h2"
          className="font-extended m-0 text-[2.5rem] font-normal leading-[0.95] tracking-[-0.01em] text-white"
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

function PayOverTimeCard() {
  const { icon, amount, body } = PDP_PRODUCT_DETAILS.payOverTime;

  return (
    <button
      type="button"
      aria-label={`${amount}. ${body}`}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-2xl bg-neutral-100 px-[18px] py-4 text-left",
        pdpPressableClass,
      )}
    >
      <MaterialIcon
        name={icon}
        size={24}
        className="shrink-0 text-neutral-700"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-extended text-balance text-sm font-normal leading-[18px] tracking-[0.2px] text-black tabular-nums">
          {amount}
        </span>
        <span className="font-extended text-balance text-[11px] leading-4 text-neutral-500">
          {body}
        </span>
      </span>
      <MaterialIcon
        name="chevron_right"
        size={20}
        className="shrink-0 text-neutral-400"
      />
    </button>
  );
}

/** Product details — macro hero, spec row, a 2×2 visual gallery, and pay-over-time */
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
          className="font-extended m-0 text-xl font-normal leading-6 tracking-[-0.01em] text-neutral-900"
        >
          {closerLook.heading}
        </PdpTextReveal>
        <div className="grid grid-cols-2 gap-x-2 gap-y-7">
          {closerLook.tiles.map((tile) => (
            <DetailTile key={tile.id} tile={tile} />
          ))}
        </div>
      </PdpRevealItem>

      <PdpRevealItem delay={140} className="px-2">
        <PayOverTimeCard />
      </PdpRevealItem>
    </section>
  );
}
