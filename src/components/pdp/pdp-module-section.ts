import { cn } from "@/lib/cn";

import { pdpType, pdpBodyRhythm } from "./pdp-type";

type PdpModuleSectionOptions = {
  /** White default; muted for recently viewed */
  variant?: "white" | "muted";
  /** First module after gallery — no top border */
  first?: boolean;
  /**
   * Vertical rhythm tier for bottom-of-page modules:
   * - default / compact / roomy — uniform stack spacing (16 top · 16 bottom)
   * - break — last major block; extra padding below (e.g. Reviews)
   */
  rhythm?: "compact" | "default" | "roomy" | "break";
};

/** Uniform vertical padding for stacked PDP modules */
const PDP_MODULE_STACK_PADDING = "pt-16 pb-16";
const PDP_MODULE_STACK_FIRST_PADDING = "pt-12 pb-16";
const PDP_MODULE_BREAK_PADDING = "pt-16 pb-12";

/** Shared vertical rhythm for stacked bottom-of-page modules */
export function pdpModuleSectionClass({
  variant = "white",
  first = false,
  rhythm = "default",
}: PdpModuleSectionOptions = {}) {
  const isStackRhythm =
    rhythm === "default" || rhythm === "compact" || rhythm === "roomy";

  return cn(
    "relative w-full shrink-0",
    // Temporarily flatten muted modules to white — everything on white for now
    "bg-white",
    first && PDP_MODULE_STACK_FIRST_PADDING,
    !first && isStackRhythm && PDP_MODULE_STACK_PADDING,
    !first && rhythm === "break" && PDP_MODULE_BREAK_PADDING,
  );
}

/** Consistent space below module titles when `lead` is false */
export function pdpModuleHeadingLeadClass() {
  return "mb-4";
}
/** Primary H1 — modules, sheets, drawers */
function pdpPageHeadingClass({ lead = true }: { lead?: boolean } = {}) {
  return cn(pdpType.headline, "m-0 text-balance", lead && "mb-4");
}

/** Sheet / drawer title — same scale as module H1s */
export function pdpSheetHeadingClass() {
  return pdpPageHeadingClass({ lead: false });
}

/** Module section title — defaults to primary H1 scale */
export function pdpModuleHeadingClass({
  lead = true,
  size = "lg",
}: { lead?: boolean; size?: "lg" | "sm" } = {}) {
  if (size === "sm") {
    return cn(
      `font-extended m-0 text-sm ${pdpBodyRhythm} text-black`,
      lead && "mb-3",
    );
  }

  return pdpPageHeadingClass({ lead });
}
