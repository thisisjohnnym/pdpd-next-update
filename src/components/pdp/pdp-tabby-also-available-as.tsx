"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { getTabbyFamilyExplorerLinks } from "./pdp-tabby-catalog";
import { versionedProductPath } from "./pdp-product-routes";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpPressableClass, pdpType } from "./pdp-type";
import { usePdpVersion } from "./version/pdp-version-context";

type PdpTabbyAlsoAvailableAsProps = {
  /**
   * Tuck the silhouette list behind the heading as a disclosure (closed by
   * default). Used in the v5 desktop buy panel so the sticky rail stays compact;
   * mobile keeps the list fully exposed.
   */
  collapsible?: boolean;
};

/** How many silhouettes to tease before the "View all" reveal. */
const TABBY_FAMILY_TEASER_COUNT = 2;

/** Editorial family navigation — adjacent Tabby silhouettes as separate PDPs. */
export function PdpTabbyAlsoAvailableAs({
  collapsible = false,
}: PdpTabbyAlsoAvailableAsProps) {
  const router = useRouter();
  const version = usePdpVersion();
  const { styleId, size, selectedColorId } = useTabbyVariant();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const links = useMemo(
    () => getTabbyFamilyExplorerLinks(styleId, size, selectedColorId),
    [selectedColorId, size, styleId],
  );

  if (links.length === 0) {
    return null;
  }

  const expanded = collapsible ? open : true;
  const teaserLinks = links.slice(0, TABBY_FAMILY_TEASER_COUNT);
  const extraLinks = links.slice(TABBY_FAMILY_TEASER_COUNT);
  const hasMore = extraLinks.length > 0;

  const renderRow = (
    link: (typeof links)[number],
    isFirst: boolean,
  ) => (
    <li
      key={link.id}
      className={cn(
        "border-t border-neutral-200",
        isFirst && "border-t-0",
      )}
    >
      {link.kind === "internal" ? (
        <button
          type="button"
          onClick={() =>
            router.push(
              versionedProductPath(version, "tabby", {
                tabbySlug: link.slug,
                colorId: link.colorId,
              }),
            )
          }
          className={cn(
            "font-extended flex w-full items-center gap-3 py-2.5 text-left",
            pdpPressableClass,
          )}
        >
          <TabbyFamilyExplorerRowContent link={link} />
        </button>
      ) : (
        <a
          href={link.href}
          className={cn(
            "font-extended flex w-full items-center gap-3 py-2.5 text-left text-black no-underline",
            pdpPressableClass,
          )}
        >
          <TabbyFamilyExplorerRowContent link={link} />
        </a>
      )}
    </li>
  );

  return (
    <nav
      aria-label="Explore Other Tabby Silhouettes"
      className="pdp-tabby-family-explorer flex flex-col gap-1.5 border-0"
    >
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={cn(
            "font-extended m-0 flex w-full items-center justify-between gap-3 text-black",
            pdpType.label,
            pdpPressableClass,
          )}
        >
          <span>Explore Other Tabby Silhouettes</span>
          <MaterialIcon
            name="expand_more"
            size={20}
            aria-hidden
            className={cn(
              "shrink-0 text-neutral-500 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      ) : (
        <p className={cn("font-extended m-0 text-black", pdpType.label)}>
          Explore Other Tabby Silhouettes
        </p>
      )}

      <div className={cn(collapsible && !expanded && "hidden")}>
        <ul className="m-0 flex list-none flex-col p-0">
          {teaserLinks.map((link, index) => renderRow(link, index === 0))}
        </ul>

        {hasMore ? (
          <>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                showAll ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  showAll ? "opacity-100" : "opacity-0",
                )}
              >
                <ul
                  className="m-0 flex list-none flex-col p-0"
                  aria-hidden={!showAll}
                >
                  {extraLinks.map((link) => renderRow(link, false))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              aria-expanded={showAll}
              className={cn(
                "font-extended mt-1 flex w-full items-center justify-center gap-1 py-2.5 text-neutral-600",
                pdpType.micro,
                pdpPressableClass,
              )}
            >
              <span>
                {showAll
                  ? "Show less"
                  : `View all ${links.length} silhouettes`}
              </span>
              <MaterialIcon
                name="expand_more"
                size={16}
                aria-hidden
                className={cn(
                  "shrink-0 text-neutral-500 transition-transform duration-200 motion-reduce:transition-none",
                  showAll && "rotate-180",
                )}
              />
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

function TabbyFamilyExplorerRowContent({
  link,
}: {
  link: ReturnType<typeof getTabbyFamilyExplorerLinks>[number];
}) {
  return (
    <>
      <div className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={link.thumbnail}
          alt={link.thumbnailAlt}
          fill
          className="object-cover object-center"
          sizes="48px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className={cn("text-black", pdpType.label)}>{link.name}</span>
        <span className={cn("line-clamp-1 text-neutral-500", pdpType.micro)}>
          {link.descriptor}
        </span>
      </div>

      <MaterialIcon
        name="chevron_right"
        size={18}
        className="shrink-0 text-neutral-400"
        aria-hidden
      />
    </>
  );
}
