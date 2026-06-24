"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  PDP_PRODUCT_DETAILS,
  type PdpProductDetailRow,
  type PdpProductSpec,
} from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpTextReveal } from "./pdp-text-reveal";
import { pdpType, pdpPressableClass } from "./pdp-type";

function SpecTile({ spec }: { spec: PdpProductSpec }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-2xl bg-neutral-100 px-4 py-3.5">
      <span className="font-extended text-lg font-normal leading-none tracking-[0.2px] text-black tabular-nums">
        {spec.value}
      </span>
      <span className={`text-neutral-500 ${pdpType.label}`}>{spec.label}</span>
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
        "flex w-full items-center gap-3 rounded-2xl bg-neutral-100 px-4 py-3.5 text-left",
        pdpPressableClass,
      )}
    >
      <MaterialIcon
        name={icon}
        size={24}
        className="shrink-0 text-neutral-700"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-extended text-sm font-normal leading-snug tracking-[0.2px] text-black tabular-nums">
          {amount}
        </span>
        <span className={`text-neutral-500 ${pdpType.label}`}>{body}</span>
      </span>
      <MaterialIcon
        name="chevron_right"
        size={20}
        className="shrink-0 text-neutral-400"
      />
    </button>
  );
}

function DetailRow({
  row,
  open,
  onToggle,
}: {
  row: PdpProductDetailRow;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `product-detail-${row.id}`;
  const paragraphs = row.body.split("\n\n");

  return (
    <div className="border-t border-neutral-200 first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-3 py-4 text-left",
          pdpPressableClass,
        )}
      >
        <span className="font-extended text-[15px] font-normal tracking-[0.2px] text-black text-balance">
          {row.title}
        </span>
        <MaterialIcon
          name={open ? "remove" : "add"}
          size={20}
          className="shrink-0 text-neutral-500"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-3 pb-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`m-0 text-pretty text-neutral-700 ${pdpType.caption}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Product details — spec tiles, pay-over-time, and an accordion of deeper detail */
export function PdpProductDetailsModule() {
  const { eyebrow, specs, rows } = PDP_PRODUCT_DETAILS;
  const [openId, setOpenId] = useState<string | null>(rows[0]?.id ?? null);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "default" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <PdpRevealItem className="flex flex-col gap-3">
              <PdpTextReveal
                as="span"
                className={`text-neutral-400 ${pdpType.tag}`}
              >
                {eyebrow}
              </PdpTextReveal>
              <div className="flex items-stretch gap-2">
                {specs.map((spec) => (
                  <SpecTile key={spec.id} spec={spec} />
                ))}
              </div>
            </PdpRevealItem>

            <PdpRevealItem delay={80}>
              <PayOverTimeCard />
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
              <div className="flex flex-col">
                {rows.map((row) => (
                  <DetailRow
                    key={row.id}
                    row={row}
                    open={openId === row.id}
                    onToggle={() =>
                      setOpenId((current) =>
                        current === row.id ? null : row.id,
                      )
                    }
                  />
                ))}
              </div>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
