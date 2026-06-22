"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_SITE_FOOTER, type PdpSiteFooterGroup } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpPressableClass, pdpType } from "./pdp-type";

const COACH_C_MASK = "url(/images/coach-c-mark.png)";

function CoachCMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: 20,
        height: 20,
        WebkitMaskImage: COACH_C_MASK,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: COACH_C_MASK,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

function FooterLinkGroup({ group }: { group: PdpSiteFooterGroup }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <p className={`m-0 text-white ${pdpType.label}`}>{group.title}</p>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {group.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={cn(
                "font-extended text-neutral-400 transition-colors active:text-white",
                pdpType.micro,
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

/** Standard Coach Outlet site footer — last block on the PDP scroll */
export function PdpSiteFooter({ embedded = false }: { embedded?: boolean }) {
  return (
    <footer
      data-header-surface="dark"
      className={
        embedded
          ? "relative w-full shrink-0 bg-black pt-8 pb-8 text-white"
          : cn(pdpModuleSectionClass({ rhythm: "break" }), "bg-black pt-12 text-white")
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
  const { brand, newsletter, groups, social, legal, copyright } = PDP_SITE_FOOTER;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-white">
        <CoachCMark />
        <span className="font-extended text-sm tracking-[0.2px]">{brand}</span>
      </div>

      <div className="flex flex-col gap-3">
        <p className={`m-0 text-white ${pdpType.label}`}>{newsletter.title}</p>
        <p className={`m-0 max-w-xs text-neutral-400 ${pdpType.micro}`}>{newsletter.description}</p>
        <form
          className="flex max-w-sm items-stretch gap-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-label={newsletter.placeholder}
            placeholder={newsletter.placeholder}
            className="font-extended min-w-0 flex-1 border-b border-neutral-700 bg-transparent pb-2 text-[12px] text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className={cn(
              "font-extended shrink-0 border border-white px-4 py-2 text-[11px] tracking-[0.4px] text-white uppercase transition-colors active:bg-white active:text-black",
              pdpPressableClass,
            )}
          >
            {newsletter.cta}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-8">
        {groups.map((group) => (
          <FooterLinkGroup key={group.id} group={group} />
        ))}
      </div>

      <nav aria-label="Social" className="flex flex-wrap items-center gap-4">
        {social.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "text-neutral-400 transition-colors active:text-white",
              pdpPressableClass,
            )}
          >
            <MaterialIcon name={item.icon} size={20} />
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-4 border-t border-neutral-800 pt-6">
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          {legal.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "font-extended text-neutral-400 transition-colors active:text-white",
                pdpType.micro,
                pdpPressableClass,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={`m-0 text-neutral-500 ${pdpType.micro}`}>{copyright}</p>
      </div>
    </div>
  );
}
