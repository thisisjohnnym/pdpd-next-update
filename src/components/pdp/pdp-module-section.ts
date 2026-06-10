import { cn } from "@/lib/cn";

type PdpModuleSectionOptions = {
  /** White default; muted for recently viewed */
  variant?: "white" | "muted";
  /** First module after gallery — no top border */
  first?: boolean;
  /**
   * Vertical rhythm tier for bottom-of-page modules:
   * - compact — paired with the module above (e.g. Compare after Similar)
   * - default — standard section spacing
   * - roomy — new content chapter (e.g. Bundle builder)
   * - break — major narrative shift (e.g. Reviews)
   */
  rhythm?: "compact" | "default" | "roomy" | "break";
};

/** Shared vertical rhythm for stacked bottom-of-page modules */
export function pdpModuleSectionClass({
  variant = "white",
  first = false,
  rhythm = "default",
}: PdpModuleSectionOptions = {}) {
  return cn(
    "relative w-full shrink-0",
    variant === "muted" ? "bg-neutral-100" : "bg-white",
    first && "pt-12",
    !first &&
      rhythm === "compact" &&
      "pt-9 pb-4",
    !first &&
      rhythm === "default" &&
      "pt-16 pb-6",
    !first &&
      rhythm === "roomy" &&
      "pt-20 pb-8",
    !first &&
      rhythm === "break" &&
      "pt-24 pb-10",
  );
}

/** Module title — bold extended for section anchoring */
export function pdpModuleHeadingClass({ lead = true }: { lead?: boolean } = {}) {
  return cn(
    "font-extended m-0 text-base font-bold tracking-[0.2px] text-black",
    lead && "mb-5",
  );
}
