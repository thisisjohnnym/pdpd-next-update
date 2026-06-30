"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/cn";

import { useActiveProduct } from "../pdp-active-product-context";
import {
  PDP_RECENTLY_VIEWED,
  PDP_RECENTLY_VIEWED_SECTION,
} from "../pdp-data";
import { getDefaultColorId } from "../pdp-product-colors";
import { productPath } from "../pdp-product-routes";
import { getRecentlyViewedProductId } from "../pdp-products";
import { useOptionalTabbyVariant } from "../pdp-tabby-variant-context";
import { pdpType, pdpPressableClass } from "../pdp-type";

/**
 * v2-only recently viewed list (Paper BC6-0).
 *
 * White-background vertical list (no grid wrapper): centered heading, 56×70 rounded
 * thumbnails, and an underlined "View again" text link with an arrow on each row.
 * Reuses PDP_RECENTLY_VIEWED + the same routing logic as the v1 carousel.
 */
export function PdpV2RecentlyViewed() {
  const router = useRouter();
  const { productId } = useActiveProduct();
  const tabby = useOptionalTabbyVariant();

  const handleViewAgain = (itemId: string) => {
    const targetProductId = getRecentlyViewedProductId(itemId);
    if (!targetProductId || targetProductId === productId) {
      return;
    }

    router.push(
      productPath(targetProductId, {
        tabbySlug: tabby?.slug,
        colorId: getDefaultColorId(targetProductId),
      }),
    );
  };

  return (
    <section
      data-header-surface="light"
      className="w-full shrink-0 bg-white px-2 pb-2 pt-14"
    >
      <h2
        className={cn(
          "font-extended m-0 mb-5 text-center font-normal tracking-tight text-black",
          pdpType.headline,
        )}
      >
        {PDP_RECENTLY_VIEWED_SECTION.eyebrow}
      </h2>

      <ul
        className="m-0 flex list-none flex-col gap-[14px] p-0"
        aria-label="Recently viewed items"
      >
        {PDP_RECENTLY_VIEWED.map((item) => {
          const isLinked = getRecentlyViewedProductId(item.id) !== null;

          return (
            <li key={item.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={isLinked ? () => handleViewAgain(item.id) : undefined}
                aria-label={`View again: ${item.name}, viewed ${item.viewedLabel}`}
                disabled={!isLinked}
                className={cn(
                  "flex min-w-0 grow items-center gap-2 text-left",
                  isLinked && pdpPressableClass,
                )}
              >
                <span className="relative h-[70px] w-[56px] shrink-0 overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="56px"
                  />
                </span>
                <span className="flex min-w-0 grow flex-col gap-2">
                  <span className={`font-extended text-black/50 ${pdpType.micro}`}>
                    {item.viewedLabel}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className={`font-extended text-black ${pdpType.body}`}>
                      {item.name}
                    </span>
                    <span
                      className={`font-extended text-black tabular-nums ${pdpType.micro}`}
                    >
                      {item.price}
                    </span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={isLinked ? () => handleViewAgain(item.id) : undefined}
                aria-label={`View again: ${item.name}`}
                disabled={!isLinked}
                className={cn(
                  "flex shrink-0 items-center gap-[5px] text-black",
                  isLinked && pdpPressableClass,
                )}
              >
                <span className={cn("font-extended underline underline-offset-[3px]", pdpType.label)}>
                  View again
                </span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  aria-hidden
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="#171717"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
