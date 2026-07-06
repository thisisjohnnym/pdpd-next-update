"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_PAY_OVER_TIME } from "./pdp-data";
import { pdpPressableClass, pdpType } from "./pdp-type";

/** Afterpay row — quiet inline link below colors or in the add-to-bag tray */
export function PdpPayOverTimeCard({ embedded = false }: { embedded?: boolean }) {
  const { icon, amount, body } = PDP_PAY_OVER_TIME;

  return (
    <button
      type="button"
      aria-label={`${amount}. ${body}`}
      className={cn(
        "flex w-full items-center gap-2.5 bg-transparent text-left",
        embedded ? "py-2" : "py-2.5",
        pdpPressableClass,
      )}
    >
      <MaterialIcon
        name={icon}
        size={18}
        className="shrink-0 text-neutral-400"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            pdpType.label,
            "text-neutral-600 tabular-nums",
          )}
        >
          {amount}
        </span>
        <span className={cn(pdpType.micro, "text-neutral-400")}>{body}</span>
      </span>
      <MaterialIcon
        name="chevron_right"
        size={16}
        className="shrink-0 text-neutral-300"
      />
    </button>
  );
}
