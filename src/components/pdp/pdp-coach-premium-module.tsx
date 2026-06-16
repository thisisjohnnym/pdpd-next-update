"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_COACH_PREMIUM, type PdpCoachPremiumPerk } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpToast } from "./pdp-toast";
import { pdpType, pdpPressableSolidClass } from "./pdp-type";

function CoachPremiumPerkRow({ perk }: { perk: PdpCoachPremiumPerk }) {
  return (
    <li className="flex items-start gap-3 border-t border-neutral-200 py-3.5 first:border-t-0">
      <MaterialIcon
        name={perk.icon}
        size={20}
        filled={perk.showVerifiedBadge}
        className={cn(
          "mt-0.5 shrink-0",
          perk.showVerifiedBadge ? "text-[#0095F6]" : "text-black",
        )}
        aria-hidden
      />
      <p className={`m-0 text-black ${pdpType.body}`}>
        {perk.showVerifiedBadge ? (
          <>
            Blue checkmark{" "}
            <MaterialIcon
              name="verified"
              size={18}
              filled
              className="inline-block align-middle text-[#0095F6]"
              style={{ fontSize: 11 }}
              aria-hidden
            />{" "}
            on your comments
          </>
        ) : (
          perk.label
        )}
      </p>
    </li>
  );
}

/** Coach Premium membership pitch — last block on the PDP */
export function PdpCoachPremiumModule() {
  const { title, body, perks, cta, toast } = PDP_COACH_PREMIUM;
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "break" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-6">
            <PdpRevealItem className="flex flex-col gap-3">
              <PdpModuleHeading spacing="none">{title}</PdpModuleHeading>
              <p className={`m-0 text-neutral-700 ${pdpType.caption}`}>{body}</p>
            </PdpRevealItem>

            <PdpRevealItem delay={80}>
              <ul className="m-0 list-none border border-neutral-200 bg-white px-4">
                {perks.map((perk) => (
                  <CoachPremiumPerkRow key={perk.id} perk={perk} />
                ))}
              </ul>
            </PdpRevealItem>

            <PdpRevealItem delay={140}>
              <button
                type="button"
                onClick={() => setToastOpen(true)}
                className={cn(
                  "font-extended flex h-12 w-full items-center justify-center rounded-full bg-black text-sm tracking-[0.2px] text-white transition-colors active:bg-neutral-800",
                  pdpPressableSolidClass,
                )}
              >
                {cta}
              </button>
            </PdpRevealItem>
          </div>
        </GridItem>
      </PageGrid>

      <PdpToast
        message={toast}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </section>
  );
}
