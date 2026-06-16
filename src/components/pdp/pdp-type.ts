/** Mobile-first PDP copy — Helvetica Extended everywhere */
export const pdpType = {
  /** Captions, quotes, descriptive paragraphs */
  caption: "font-extended text-sm leading-[1.35] tracking-[0.2px] lg:text-xs",
  /** Product names, spec values, list rows */
  body: "font-extended text-sm leading-snug tracking-[0.2px] lg:text-xs",
  /** Prices, metadata, secondary lines */
  label: "font-extended text-xs tracking-[0.2px] lg:text-[11px]",
  /** Badges, chips, time labels */
  micro: "font-extended text-[11px] tracking-[0.2px] lg:text-[10px]",
  /** Uppercase tags (THIS ITEM, etc.) */
  tag: "font-extended text-[11px] uppercase tracking-[0.6px] lg:text-[10px]",
} as const;

/** Subtle touch press — scale on coarse pointers (mobile) */
export const pdpPressableClass = "pdp-pressable";

/** Filled CTAs — scale only, no opacity dip */
export const pdpPressableSolidClass = "pdp-pressable pdp-pressable--solid";

/** Icon / ghost controls — slightly stronger scale */
export const pdpPressableIconClass = "pdp-pressable pdp-pressable--icon";

/** "Add" / "Added" label beside Material add icon — counters .font-extended top nudge */
export const pdpAddIconLabelClass = "font-extended pdp-add-icon-label";

/** Pill outline CTA — white fill, soft grey stroke (Add buttons, sheet actions) */
export const pdpStrokeCtaClass =
  "rounded-full border border-neutral-200 bg-white text-black transition-colors active:bg-neutral-50 pdp-pressable";

/** Outline CTA disabled / added state — same border box as default so the pill does not shrink */
export const pdpStrokeCtaMutedClass =
  "rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500";

/** Underlined text CTA — primary (Shop Shoulder Bags) */
export const pdpTextLinkCtaClass =
  "font-extended inline-flex items-center gap-1 text-black transition-colors active:text-neutral-700 pdp-pressable";

export const pdpTextLinkCtaLabelClass =
  "underline decoration-black underline-offset-[3px] group-active:decoration-neutral-700";

/** Underlined text CTA — secondary (See what fits inside) */
export const pdpTextLinkCtaMutedClass =
  "font-extended inline-flex items-center gap-1 text-neutral-600 transition-colors active:text-black pdp-pressable";

export const pdpTextLinkCtaMutedLabelClass =
  "underline decoration-neutral-300 underline-offset-[3px] group-active:decoration-neutral-500";
