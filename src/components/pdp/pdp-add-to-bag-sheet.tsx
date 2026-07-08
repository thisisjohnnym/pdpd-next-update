"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  pdpBottomSheetScrollRegionClass,
} from "./pdp-bottom-sheet";

import {
  PDP_BUNDLE_DISCOUNT,
  PDP_PRODUCT,
  type PdpBagUpsell,
  type PdpBundleAddPayload,
  type PdpColor,
} from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { getPdpBagUpsells, getPdpColors } from "./pdp-product-colors";
import type { PdpProductConfig } from "./pdp-products";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { PdpPayOverTimeCard } from "./pdp-pay-over-time-card";
import { pdpPillRadiusClass, pdpProductPriceClass, pdpProductTitleClass, pdpStrokeCtaClass, pdpStrokeCtaMutedClass, pdpAddIconLabelClass, pdpType } from "./pdp-type";
import { getPdpVersionConfig } from "./version/pdp-version-config";
import { usePdpVersion } from "./version/pdp-version-context";
import { useOverlayDismiss } from "./use-overlay-dismiss";
import { useTransientAddedSet } from "./use-transient-added-set";

type BagConfirmation =
  | { type: "product" }
  | { type: "bundle"; payload: PdpBundleAddPayload };

type PdpAddToBagSheetProps = {
  open: boolean;
  onClose: () => void;
  selectedColorId: string;
  onQuickAdd?: () => void;
  confirmation?: BagConfirmation;
};

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function BagBundlePricing({
  bundle,
  hasDiscount,
  savings,
}: {
  bundle: PdpBundleAddPayload;
  hasDiscount: boolean;
  savings: number;
}) {
  return (
    <div className="flex shrink-0 flex-col items-end">
      {hasDiscount ? (
        <span className="font-extended text-xs tracking-[0.2px] text-neutral-400 line-through tabular-nums">
          {formatPrice(bundle.subtotal)}
        </span>
      ) : null}
      <span className={cn(pdpProductPriceClass, "text-base text-black")}>
        {formatPrice(bundle.total)}
      </span>
      {hasDiscount ? (
        <span className="font-extended mt-0.5 text-[11px] tracking-[0.2px] text-neutral-600 tabular-nums">
          You saved {formatPrice(savings)}
        </span>
      ) : null}
    </div>
  );
}

function BagBundleSummary({
  bundle,
  hasDiscount,
  savings,
}: {
  bundle: PdpBundleAddPayload;
  hasDiscount: boolean;
  savings: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-[#f2f2f2] px-3 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn(pdpProductTitleClass, "text-base text-black")}>
            Your bundle
          </p>
          <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
            {bundle.items.length} item
            {bundle.items.length === 1 ? "" : "s"}
            {hasDiscount
              ? ` · ${Math.round(PDP_BUNDLE_DISCOUNT * 100)}% bundle savings applied`
              : ""}
          </p>
        </div>
        <BagBundlePricing
          bundle={bundle}
          hasDiscount={hasDiscount}
          savings={savings}
        />
      </div>

      <ul className="flex flex-col gap-2 border-t border-neutral-200 pt-3">
        {bundle.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden bg-neutral-100">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                className="object-cover object-center"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn(pdpType.productNameCompact, "truncate text-black")}>
                {item.name}
              </p>
            </div>
            <span className="font-extended shrink-0 text-xs tracking-[0.2px] text-black tabular-nums">
              {formatPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BagProductCard({
  selectedColor,
  product,
  embedded = false,
}: {
  selectedColor: PdpColor;
  product: PdpProductConfig;
  embedded?: boolean;
}) {
  const imageSrc =
    product.hero.kind === "image"
      ? product.hero.src
      : PDP_PRODUCT.imageSrc;
  const imageAlt =
    product.hero.kind === "image" ? product.hero.alt : PDP_PRODUCT.imageAlt;

  return (
    <div
      className={cn(
        "flex overflow-hidden",
        embedded ? "bg-transparent" : "rounded-lg bg-neutral-50",
      )}
    >
      <div className="relative w-[7.25rem] shrink-0 self-stretch min-h-[6.75rem]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="116px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3.5">
        <p className={cn(pdpProductTitleClass, "text-base text-black")}>
          {product.summary.name}
        </p>
        <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
          {selectedColor.name} · {product.summary.subtitle}
        </p>
        <p className={cn(pdpProductPriceClass, "mt-1.5 text-base text-black")}>
          {product.summary.price}
        </p>
      </div>
    </div>
  );
}

function BagUpsellAddButton({
  added,
  onAdd,
}: {
  added: boolean;
  onAdd: () => void;
}) {
  const { squareButtonCorners } = getPdpVersionConfig(usePdpVersion());

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={added}
      className={cn(
        "font-extended inline-flex shrink-0 items-center justify-center gap-1 px-3.5 py-2 text-xs tracking-[0.2px] transition-colors",
        added ? pdpStrokeCtaMutedClass : pdpStrokeCtaClass,
        pdpPillRadiusClass(squareButtonCorners),
      )}
    >
      <span className={pdpAddIconLabelClass}>
        {added ? "Added" : "Quick add"}
      </span>
      {!added ? (
        <MaterialIcon
          name="add"
          size={18}
          className="shrink-0 text-black"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function BagUpsellItem({
  item,
  added,
  onAdd,
}: {
  item: PdpBagUpsell;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <li className="border-t border-neutral-200 first:border-t-0">
      <div className="flex items-center gap-3 py-3">
        <div className="relative size-20 shrink-0 overflow-hidden bg-neutral-100">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover object-center"
            sizes="80px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className={cn(pdpType.productNameCompact, "truncate text-black")}>
            {item.name}
          </p>
          <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600 tabular-nums">
            {item.price}
          </p>
        </div>

        <BagUpsellAddButton added={added} onAdd={onAdd} />
      </div>
    </li>
  );
}

function BagUpsellList({
  upsells,
  isAdded,
  onQuickAdd,
}: {
  upsells: PdpBagUpsell[];
  isAdded: (id: string) => boolean;
  onQuickAdd: (id: string) => void;
}) {
  return (
    <section className="flex flex-col gap-1.5 pt-3">
      <p className={cn(pdpType.productName, "text-black")}>
        Complete the look
      </p>

      <ul className="flex flex-col">
        {upsells.map((item) => (
          <BagUpsellItem
            key={item.id}
            item={item}
            added={isAdded(item.id)}
            onAdd={() => onQuickAdd(item.id)}
          />
        ))}
      </ul>
    </section>
  );
}

/** Bottom tray — add-to-bag confirmation, checkout, and quick-add upsells */
export function PdpAddToBagSheet({
  open,
  onClose,
  selectedColorId,
  onQuickAdd,
  confirmation = { type: "product" },
}: PdpAddToBagSheetProps) {
  const { productId, product } = useActiveProduct();
  const titleId = useId();
  const { isAdded: isQuickAdded, confirmAdd: confirmQuickAdd } =
    useTransientAddedSet();
  const [hasBeenOpen, setHasBeenOpen] = useState(false);
  const mounted = useOverlayDismiss(open, onClose);
  const { squareButtonCorners } = getPdpVersionConfig(usePdpVersion());

  const colors = getPdpColors(productId);
  const upsells = getPdpBagUpsells(productId);
  const selectedColor =
    colors.find((color) => color.id === selectedColorId) ?? colors[0];

  const isBundle = confirmation.type === "bundle";
  const bundle = isBundle ? confirmation.payload : null;
  const hasDiscount =
    bundle !== null && bundle.subtotal > bundle.total;
  const savings =
    bundle !== null ? bundle.subtotal - bundle.total : 0;

  useEffect(() => {
    if (open) {
      setHasBeenOpen(true);
    }
  }, [open]);

  const handleQuickAdd = (id: string) => {
    onQuickAdd?.();
    confirmQuickAdd(id);
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close add to bag"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open })}
      >
        <div className={pdpBottomSheetHeaderClass}>
          <div className={pdpBottomSheetGrabHandleClass} />
        </div>

        <div
          data-pdp-sheet-scroll
          className={pdpBottomSheetScrollRegionClass(
            "px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]",
          )}
        >
          {hasBeenOpen ? (
          <>
          <div className="flex items-center gap-2 pb-4">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black">
              <MaterialIcon name="check" size={18} className="text-white" />
            </span>
            <h2 id={titleId} className={pdpSheetHeadingClass()}>
              {isBundle ? "Bundle added to your bag" : "Added to your bag"}
            </h2>
          </div>

          {isBundle && bundle ? (
            <BagBundleSummary
              bundle={bundle}
              hasDiscount={hasDiscount}
              savings={savings}
            />
          ) : (
            <>
              <div
                className={cn(
                  "mb-3 overflow-hidden bg-neutral-50",
                  squareButtonCorners ? "rounded-none" : "rounded-2xl",
                )}
              >
                <BagProductCard
                  selectedColor={selectedColor}
                  product={product}
                  embedded
                />
              </div>
              <div className="mb-4 px-1">
                <PdpPayOverTimeCard embedded />
              </div>
            </>
          )}

          <div className="flex gap-2 py-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "font-extended flex h-12 min-w-0 flex-1 items-center justify-center text-sm tracking-[0.2px]",
                pdpStrokeCtaClass,
                pdpPillRadiusClass(squareButtonCorners),
              )}
            >
              <span className="translate-y-px">Keep shopping</span>
            </button>
            <button
              type="button"
              className={cn(
                "font-extended flex h-12 min-w-0 flex-1 items-center justify-center bg-black text-sm tracking-[0.2px] text-white",
                pdpPillRadiusClass(squareButtonCorners),
              )}
            >
              <span className="translate-y-px">Checkout</span>
            </button>
          </div>

          {!isBundle ? (
            <BagUpsellList
              upsells={upsells}
              isAdded={isQuickAdded}
              onQuickAdd={handleQuickAdd}
            />
          ) : null}
          </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
