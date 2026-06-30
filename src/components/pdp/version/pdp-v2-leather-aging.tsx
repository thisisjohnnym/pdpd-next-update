"use client";

import Image from "next/image";
import { Fragment, useState } from "react";

import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING } from "../pdp-data";
import { pdpType } from "../pdp-type";

/**
 * v2-only leather aging module (Paper AP5-0).
 *
 * Single rounded card with three stacked sections:
 *  1. warm header (title)
 *  2. fixed-height stage image (430px)
 *  3. warm controls — dot track + stage labels + caption
 *
 * Tap a stage label/dot to switch. Reuses PDP_LEATHER_AGING.stages (each stage has an image).
 * No drag, no care upsell — those are v1-only.
 */
export function PdpV2LeatherAging() {
  const { stages, title, image } = PDP_LEATHER_AGING;
  const maxIndex = stages.length - 1;
  const [stageIndex, setStageIndex] = useState(0);

  const stage = stages[stageIndex]!;

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white px-2"
    >
      <div className="overflow-hidden rounded-[8px]">
        {/* 1 — warm header */}
        <div className="flex flex-col items-center bg-[#F2ECEA] px-2 py-6">
          <h2 className={cn(pdpType.headline, "m-0 text-center")}>{title}</h2>
        </div>

        {/* 2 — stage image */}
        <div className="relative h-[430px] w-full bg-neutral-200">
          {stages.map((item, index) => {
            const itemImage = item.image ?? image;
            const active = index === stageIndex;

            return (
              <Image
                key={item.id}
                src={itemImage.src}
                alt={itemImage.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out",
                  active ? "opacity-100" : "opacity-0",
                )}
                style={{ objectPosition: itemImage.objectPosition ?? "center" }}
              />
            );
          })}
        </div>

        {/* 3 — warm controls */}
        <div className="flex flex-col items-center gap-4 bg-[#EFEAE7] px-2 py-6">
          <div className="flex w-[90%] flex-col gap-2.5">
            {/* dot track */}
            <div className="flex items-center px-2">
              {stages.map((item, index) => {
                const active = index === stageIndex;
                const isLast = index === maxIndex;

                return (
                  <Fragment key={item.id}>
                    <span className="flex size-[22px] shrink-0 items-center justify-center">
                      <span
                        className={cn(
                          "rounded-full transition-[width,height,background-color] duration-300 ease-out",
                          active
                            ? "size-[22px] bg-[#c38980]"
                            : "size-3 border-2 border-solid border-black bg-[#eee9e7]",
                        )}
                      />
                    </span>
                    {!isLast ? (
                      <span aria-hidden className="h-[2px] grow bg-black" />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>

            {/* stage labels */}
            <div className="flex items-center justify-between">
              {stages.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === maxIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStageIndex(index)}
                    aria-current={stageIndex === index ? "step" : undefined}
                    className={cn(
                      pdpType.label,
                      "flex-1 leading-[110%] text-black transition-colors active:text-neutral-600",
                      isFirst && "text-left",
                      isLast && "text-right",
                      !isFirst && !isLast && "text-center",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* stage caption */}
          <p
            className={cn(
              pdpType.label,
              "text-balance text-center text-black opacity-70",
            )}
          >
            {`${stage.timeline} — ${stage.summary}`}
          </p>
        </div>
      </div>
    </section>
  );
}
