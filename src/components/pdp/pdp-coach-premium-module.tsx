"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_COACH_PREMIUM, type PdpCoachPremiumPerk } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpRevealItem } from "./pdp-reveal-item";
import { PdpToast } from "./pdp-toast";
import { pdpType, pdpPressableClass } from "./pdp-type";

function CoachPremiumPerkRow({ perk }: { perk: PdpCoachPremiumPerk }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white/[0.12]"
      >
        <MaterialIcon
          name={perk.icon}
          size={18}
          filled={perk.showVerifiedBadge}
          className={perk.showVerifiedBadge ? "text-[#1D9BF0]" : "text-white"}
        />
      </span>
      <p className={`m-0 text-pretty text-white ${pdpType.body}`}>
        {perk.showVerifiedBadge ? (
          <>
            Blue checkmark{" "}
            <MaterialIcon
              name="verified"
              size={18}
              filled
              className="inline-block align-middle text-[#1D9BF0]"
              style={{ fontSize: 13 }}
            />{" "}
            verified on your comments
          </>
        ) : (
          perk.label
        )}
      </p>
    </li>
  );
}

/** Coach Premium membership pitch — dark card, last block on the PDP */
export function PdpCoachPremiumModule() {
  const { title, body, perks, cta, toast } = PDP_COACH_PREMIUM;
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ rhythm: "default" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <PdpRevealItem className="flex flex-col gap-8 rounded-2xl bg-[#1C1C1C] px-4 pt-6 pb-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="font-extended m-0 text-[28px] leading-[34px] font-normal tracking-[0.4px] text-balance text-white">
                {title}
              </h2>
              <p
                className={`font-extended m-0 text-pretty text-white ${pdpType.body}`}
              >
                {body}
              </p>
            </div>

            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {perks.map((perk) => (
                <CoachPremiumPerkRow key={perk.id} perk={perk} />
              ))}
            </ul>

            <div className="flex flex-col items-stretch gap-2">
              <button
                type="button"
                onClick={() => setToastOpen(true)}
                className={cn(
                  "font-extended flex h-[50px] w-full items-center justify-center rounded-full bg-white text-base leading-none tracking-[0.2px] text-black",
                  pdpPressableClass,
                )}
              >
                {cta}
              </button>
              <p className={`m-0 text-center text-white/50 ${pdpType.micro}`}>
                {toast}
              </p>
            </div>
          </PdpRevealItem>
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
