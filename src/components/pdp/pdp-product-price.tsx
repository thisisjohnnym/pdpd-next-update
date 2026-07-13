"use client";

import { cn } from "@/lib/cn";

import { pdpProductPriceClass } from "./pdp-type";

type PdpProductPriceProps = {
  /** Current / sale price shown prominently */
  price: string;
  /** Original price — struck when different from `price` */
  compareAtPrice?: string;
  className?: string;
  as?: "p" | "span";
};

/**
 * Product price — optional compare-at strikeout (sale state).
 * Sale amount leads; original follows muted with line-through.
 */
export function PdpProductPrice({
  price,
  compareAtPrice,
  className,
  as: Tag = "p",
}: PdpProductPriceProps) {
  const showCompare =
    Boolean(compareAtPrice) && compareAtPrice !== price;

  if (!showCompare) {
    return (
      <Tag className={cn(pdpProductPriceClass, className)}>{price}</Tag>
    );
  }

  return (
    <Tag
      className={cn(
        pdpProductPriceClass,
        "inline-flex items-baseline gap-1.5 tabular-nums",
        className,
      )}
    >
      <span className="text-black">{price}</span>
      <span className="text-neutral-400 line-through">{compareAtPrice}</span>
    </Tag>
  );
}
