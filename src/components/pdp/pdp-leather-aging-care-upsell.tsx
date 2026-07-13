"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING, PDP_LEATHER_CLEANER } from "./pdp-data";
import {
  pdpAddIconLabelClass,
  pdpPillRadiusClass,
  pdpPressableClass,
  pdpProductPriceClass,
  pdpProductTitleClass,
  pdpStrokeCtaClass,
  pdpStrokeCtaMutedClass,
  pdpType,
} from "./pdp-type";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { useMountTransition } from "./use-mount-transition";
import { useTransientAddedSet } from "./use-transient-added-set";

function formatCarePrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function AgingCareUpsellRow({
  product,
  added,
  onQuickAdd,
  squareButtonCorners,
}: {
  product: (typeof PDP_LEATHER_CLEANER.products)[number];
  added: boolean;
  onQuickAdd: () => void;
  squareButtonCorners: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-contain object-center p-1"
          sizes="48px"
        />
      </div>

      <p className={cn(pdpProductTitleClass, "min-w-0 flex-1 truncate text-sm text-black")}>
        {product.name}
      </p>

      <p className={cn(pdpProductPriceClass, "shrink-0 text-sm text-black")}>
        {formatCarePrice(product.price)}
      </p>

      <button
        type="button"
        onClick={onQuickAdd}
        disabled={added}
        className={cn(
          "font-extended inline-flex shrink-0 items-center justify-center gap-0.5 px-2.5 py-1.5 text-[11px] leading-none tracking-[0.2px] transition-colors",
          added ? pdpStrokeCtaMutedClass : pdpStrokeCtaClass,
          pdpPillRadiusClass(squareButtonCorners),
        )}
      >
        <span className={pdpAddIconLabelClass}>{added ? "Added" : "Add"}</span>
        {!added ? (
          <MaterialIcon
            name="add"
            size={18}
            className="shrink-0 text-black"
            aria-hidden
          />
        ) : null}
      </button>
    </div>
  );
}

function AgingCareHelp({
  label,
  lines,
}: {
  label: string;
  lines: readonly { productId: string; text: string }[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltip = useMountTransition(open, 220);

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", close);

    return () => {
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative self-start">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="aging-care-help-tooltip"
        className={cn(
          "inline-flex items-center gap-1.5 text-left text-black transition-colors active:text-black/70",
          pdpPressableClass,
        )}
      >
        <MaterialIcon name="help_outline" size={18} className="shrink-0 text-black" />
        <span className={pdpType.micro}>{label}</span>
      </button>

      {tooltip.mounted ? (
        <div
          id="aging-care-help-tooltip"
          role="tooltip"
          data-state={tooltip.state}
          className="pdp-pop-up absolute bottom-full left-0 z-20 mb-2 w-[min(17rem,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col gap-1.5">
            {lines.map((line) => (
              <p key={line.productId} className={`text-neutral-600 ${pdpType.micro}`}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Leather cleaner + conditioner rows — hidden at "New", reveals on later stages. */
export function PdpLeatherAgingCareUpsell({
  stageIndex,
  isDragging = false,
  onQuickAdd,
  className,
  alwaysVisible = false,
}: {
  stageIndex: number;
  isDragging?: boolean;
  onQuickAdd?: () => void;
  className?: string;
  /** Skip stage-gated collapse (v5 wipe module always shows care). */
  alwaysVisible?: boolean;
}) {
  const { careNudge } = PDP_LEATHER_AGING;
  const { squareButtonCorners } = getPdpVersionConfig(usePdpVersion());
  const { isAdded: isCareAdded, confirmAdd: confirmCareAdd } =
    useTransientAddedSet();

  const careProducts = useMemo(
    () =>
      careNudge.productIds
        .map((productId) =>
          PDP_LEATHER_CLEANER.products.find((product) => product.id === productId),
        )
        .filter((product): product is (typeof PDP_LEATHER_CLEANER.products)[number] =>
          Boolean(product),
        ),
    [careNudge.productIds],
  );

  if (!careProducts.length) {
    return null;
  }

  const collapsed = !alwaysVisible && stageIndex === 0;

  return (
    <div
      className={cn(
        "w-full self-stretch overflow-hidden",
        alwaysVisible || isDragging
          ? "transition-none"
          : "transition-[max-height,margin,opacity] duration-500 ease-out",
        collapsed
          ? "max-h-0 opacity-0"
          : alwaysVisible
            ? "mt-0 max-h-none opacity-100"
            : "mt-2 max-h-56 opacity-100",
        className,
      )}
      aria-hidden={collapsed}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col divide-y divide-neutral-200/80">
          {careProducts.map((product) => (
            <AgingCareUpsellRow
              key={product.id}
              product={product}
              added={isCareAdded(product.id)}
              squareButtonCorners={squareButtonCorners}
              onQuickAdd={() => {
                onQuickAdd?.();
                confirmCareAdd(product.id);
              }}
            />
          ))}
        </div>

        <AgingCareHelp label={careNudge.help.label} lines={careNudge.help.lines} />
      </div>
    </div>
  );
}
