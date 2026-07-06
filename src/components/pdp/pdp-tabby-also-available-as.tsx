"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { getTabbyFamilyExplorerLinks } from "./pdp-tabby-catalog";
import { versionedProductPath } from "./pdp-product-routes";
import { useTabbyVariant } from "./pdp-tabby-variant-context";
import { pdpPressableClass, pdpType } from "./pdp-type";
import { usePdpVersion } from "./version/pdp-version-context";

/** Editorial family navigation — adjacent Tabby silhouettes as separate PDPs. */
export function PdpTabbyAlsoAvailableAs() {
  const router = useRouter();
  const version = usePdpVersion();
  const { styleId, size, selectedColorId } = useTabbyVariant();

  const links = useMemo(
    () => getTabbyFamilyExplorerLinks(styleId, size, selectedColorId),
    [selectedColorId, size, styleId],
  );

  if (links.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Explore the Tabby family"
      className="pdp-tabby-family-explorer flex flex-col gap-2 border-0"
    >
      <p className={cn("font-extended m-0 text-black", pdpType.label)}>
        Explore the Tabby family
      </p>

      <ul className="m-0 flex list-none flex-col p-0">
        {links.map((link) => (
          <li
            key={link.id}
            className="border-t border-neutral-200 first:border-t-0 last:border-b"
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
                  "font-extended flex w-full items-center gap-3.5 py-4 text-left",
                  pdpPressableClass,
                )}
              >
                <TabbyFamilyExplorerRowContent link={link} />
              </button>
            ) : (
              <a
                href={link.href}
                className={cn(
                  "font-extended flex w-full items-center gap-3.5 py-4 text-left text-black no-underline",
                  pdpPressableClass,
                )}
              >
                <TabbyFamilyExplorerRowContent link={link} />
              </a>
            )}
          </li>
        ))}
      </ul>
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
      <div className="relative size-[60px] shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={link.thumbnail}
          alt={link.thumbnailAlt}
          fill
          className="object-cover object-center"
          sizes="60px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("text-black", pdpType.body)}>{link.name}</span>
        <span className={cn("text-neutral-500", pdpType.label)}>
          {link.descriptor}
        </span>
      </div>

      <MaterialIcon
        name="chevron_right"
        size={20}
        className="shrink-0 text-neutral-400"
        aria-hidden
      />
    </>
  );
}
