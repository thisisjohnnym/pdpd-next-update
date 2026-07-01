"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { CoachWordmark } from "./pdp-brand-logos";
import { PDP_SITE_FOOTER, type PdpSiteFooterGroup } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpPressableClass, pdpType } from "./pdp-type";

function FooterLinkGroup({ group }: { group: PdpSiteFooterGroup }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={`m-0 text-white ${pdpType.body}`}>{group.title}</p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {group.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={cn(
                "font-extended text-white/50 transition-colors active:text-white",
                pdpType.label,
                pdpPressableClass,
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Standard Coach site footer — last block on the PDP scroll (Paper node 4EZ-0) */
export function PdpSiteFooter({ embedded = false }: { embedded?: boolean }) {
  return (
    <footer
      data-header-surface="dark"
      style={{ backgroundColor: "#171717" }}
      className={
        embedded
          ? "relative w-full shrink-0 pt-8 pb-7 text-white"
          : cn(
              pdpModuleSectionClass({ rhythm: "break" }),
              "-mb-[var(--pdp-safe-area-bottom)] pt-8 pb-[calc(1.75rem+var(--pdp-safe-area-bottom))] text-white",
            )
      }
    >
      {embedded ? (
        <FooterContent />
      ) : (
        <PageGrid fullWidth>
          <GridItem mobile={12} desktop={24}>
            <FooterContent />
          </GridItem>
        </PageGrid>
      )}
    </footer>
  );
}

function FooterContent() {
  const { newsletter, groups, social, legal, copyright } = PDP_SITE_FOOTER;

  return (
    <div className="flex flex-col gap-9">
      <CoachWordmark
        className="text-white"
        style={{ width: 83, height: 9.254 }}
      />

      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="flex flex-col gap-1">
          <p className={`m-0 text-white ${pdpType.body}`}>{newsletter.title}</p>
          <p className={`m-0 text-pretty text-white ${pdpType.label}`}>
            {newsletter.description}
          </p>
        </div>
        <form
          className="flex w-full items-stretch overflow-hidden rounded-lg border border-white/35"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-label={newsletter.placeholder}
            placeholder={newsletter.placeholder}
            className="font-extended min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[13px] leading-none text-white placeholder:text-white/55 focus:outline-none"
          />
          <button
            type="submit"
            className={cn(
              "font-extended shrink-0 bg-white px-[18px] py-[13px] text-black",
              pdpType.body,
              pdpPressableClass,
            )}
          >
            {newsletter.cta}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-[26px]">
        {groups.map((group) => (
          <FooterLinkGroup key={group.id} group={group} />
        ))}
      </div>

      <div className="flex flex-col gap-5 border-t border-white/[0.18] pt-6">
        <nav
          aria-label="Social"
          className="flex items-center justify-center gap-5"
        >
          {social.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "text-white transition-opacity active:opacity-70",
                pdpPressableClass,
              )}
            >
              <MaterialIcon name={item.icon} size={24} style={{ fontSize: 22 }} />
            </a>
          ))}
        </nav>

        <nav aria-label="Legal" className="flex flex-col gap-3">
          {legal.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "font-extended text-white/50 transition-colors active:text-white",
                pdpType.label,
                pdpPressableClass,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className={`m-0 text-white/50 ${pdpType.label}`}>{copyright}</p>
      </div>
    </div>
  );
}
