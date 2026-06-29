"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_PAY_OVER_TIME } from "./pdp-data";
import { pdpPressableClass } from "./pdp-type";

/** Afterpay row — add-to-bag confirmation tray */
export function PdpPayOverTimeCard() {
  const { icon, amount, body } = PDP_PAY_OVER_TIME;

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
        <span className="font-extended text-pretty text-[11px] leading-4 text-neutral-500">
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
