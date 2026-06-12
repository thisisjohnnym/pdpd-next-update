"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_CLEANER, type PdpLeatherCleanerProduct } from "./pdp-data";
import { pdpModuleHeadingClass, pdpModuleSectionClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function LeatherCleanerCard({
  product,
  added,
  onAdd,
}: {
  product: PdpLeatherCleanerProduct;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <article className="flex min-w-0 flex-col gap-2">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-cover object-center"
          sizes="40vw"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-extended text-sm tracking-[0.2px] text-black">
          {product.name}
        </p>
        <p className={`text-neutral-600 ${pdpType.micro}`}>{product.detail}</p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className={`font-extended text-black ${pdpType.label}`}>
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          onClick={onAdd}
          disabled={added}
          className={cn(
            "font-extended inline-flex items-center gap-0.5 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.2px] transition-colors",
            added
              ? "border-neutral-200 bg-neutral-100 text-neutral-500"
              : "border-neutral-300 bg-white text-black active:bg-neutral-50",
          )}
        >
          <span className="-translate-y-px">{added ? "Added" : "Add"}</span>
          {!added ? (
            <MaterialIcon name="add" size={18} className="text-black" />
          ) : null}
        </button>
      </div>
    </article>
  );
}

/** Coach leather cleaner pair — compact care add-on at the end of the gallery flow */
export function PdpLeatherCleanerModule({
  onQuickAdd,
}: {
  onQuickAdd?: () => void;
}) {
  const { title, products } = PDP_LEATHER_CLEANER;
  const [addedIds, setAddedIds] = useState<Set<string>>(() => new Set());

  const handleAdd = (id: string) => {
    if (addedIds.has(id)) {
      return;
    }

    onQuickAdd?.();
    setAddedIds((current) => new Set(current).add(id));
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-3">
            <h2 className={pdpModuleHeadingClass({ lead: false, size: "sm" })}>
              {title}
            </h2>

            <div className="border border-neutral-200 bg-white p-3">
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <LeatherCleanerCard
                    key={product.id}
                    product={product}
                    added={addedIds.has(product.id)}
                    onAdd={() => handleAdd(product.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}
