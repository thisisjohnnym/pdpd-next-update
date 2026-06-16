"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_CLEANER, type PdpLeatherCleanerProduct } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpType, pdpStrokeCtaClass, pdpStrokeCtaMutedClass, pdpAddIconLabelClass } from "./pdp-type";

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
            "font-extended inline-flex items-center justify-center gap-1 px-2.5 py-1 text-[11px] leading-none tracking-[0.2px] transition-colors",
            added ? pdpStrokeCtaMutedClass : pdpStrokeCtaClass,
          )}
        >
          <span className={pdpAddIconLabelClass}>{added ? "Added" : "Add"}</span>
          <MaterialIcon
            name="add"
            size={18}
            className={cn("shrink-0", added ? "invisible" : "text-black")}
            aria-hidden={added}
          />
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
      id="pdp-leather-care"
      data-header-surface="light"
      className={pdpModuleSectionClass()}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <PdpModuleHeading>{title}</PdpModuleHeading>

          <div className="border border-neutral-200 bg-white p-4">
            <div className="grid grid-cols-2 gap-4">
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
        </GridItem>
      </PageGrid>
    </section>
  );
}
