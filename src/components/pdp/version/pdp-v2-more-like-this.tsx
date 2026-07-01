"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import { PDP_MORE_LIKE_THIS } from "../pdp-data";
import { pdpType } from "../pdp-type";

/**
 * v2-only simplified "More like this" module (Paper B6C-0).
 *
 * Horizontal scroll rail with 158×198px product cards and a pill "Add to bag"
 * button. Matches Paper's fixed-width card layout exactly.
 */
export function PdpV2MoreLikeThis({
  onAddToBag,
}: {
  onAddToBag?: (id: string) => void;
}) {
  const { eyebrow, items } = PDP_MORE_LIKE_THIS;

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white pt-[56px]"
    >
      <div className="mb-5 flex flex-col items-center gap-1 px-3">
        <h2
          className={cn(
            "font-extended m-0 text-center font-normal tracking-tight text-black",
            pdpType.headline,
          )}
        >
          {eyebrow}
        </h2>
      </div>

      {/* Static 3-card clip — 3rd card peeks; not scrollable (Paper B6C-0) */}
      <div className="overflow-clip">
        <div className="flex gap-2 px-2 pb-1">
          {items.map((item) => (
            <div key={item.id} className="flex w-[158px] shrink-0 flex-col gap-2">
              <div className="relative h-[198px] w-[158px] overflow-hidden rounded-xl">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="158px"
                />
              </div>

              <p
                className={cn(
                  "font-extended m-0 text-center leading-snug text-black",
                  pdpType.body,
                )}
              >
                {item.name}
              </p>
              <p
                className={cn(
                  "font-extended -mt-1 m-0 text-center text-neutral-500",
                  pdpType.label,
                )}
              >
                {item.price}
              </p>

              <button
                type="button"
                onClick={() => onAddToBag?.(item.id)}
                className={cn(
                  "font-extended inline-flex h-[38px] w-full items-center justify-center gap-1.5 rounded-full border border-[#D4D4D4] text-black transition-colors active:bg-neutral-50",
                  pdpType.micro,
                )}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  aria-hidden
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2"
                    fill="none"
                    stroke="#171717"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add to bag
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
