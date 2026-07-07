/** Coach body copy rhythm — sizes vary; leading + tracking match coach.com PDP (16px / 21.6px ref) */
export const pdpBodyRhythm =
  "font-normal leading-[1.35] tracking-[0.2px] text-pretty" as const;

/** Display-level tracking — module titles, product names, sticky chrome */
export const pdpDisplayTracking = "tracking-tight" as const;

/** Primary product name row (hero footer, buy panel, stripped hero) */
export const pdpProductTitleClass =
  `font-extended ${pdpDisplayTracking}` as const;

/** Price beside primary product name */
export const pdpProductPriceClass =
  `font-extended ${pdpDisplayTracking} tabular-nums` as const;

/** Sticky chrome labels — jump bar, section nav */
export const pdpChromeLabelClass =
  `font-extended font-normal ${pdpDisplayTracking}` as const;

/** Mobile-first PDP copy — Helvetica Extended everywhere */
export const pdpType = {
  /**
   * Primary H1 / display headline — PDP module + sheet titles
   * (coach.com ref: 32px / 1.15 / 0.2px — PDP keeps mobile text-xl scale + tracking-tight)
   */
  headline: `font-extended text-xl font-normal ${pdpDisplayTracking} text-balance text-black`,
  /** Captions, quotes, descriptive paragraphs */
  caption: `font-extended text-sm ${pdpBodyRhythm} lg:text-xs`,
  /** Product names, spec values, list rows */
  body: `font-extended text-sm ${pdpBodyRhythm} lg:text-xs`,
  /** Product titles in rails, cards, and compare rows */
  productName: `font-extended text-sm font-normal leading-[1.35] ${pdpDisplayTracking} text-pretty lg:text-xs`,
  /** Compact product titles — shop-the-look, picker rows */
  productNameCompact: `font-extended text-xs font-normal leading-[1.35] ${pdpDisplayTracking} lg:text-[11px]`,
  /** Prices, metadata, secondary lines */
  label: `font-extended text-xs ${pdpBodyRhythm} lg:text-[11px]`,
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

/** "Add" / "Added" label beside Material add icon — extended face optical nudge */
export const pdpAddIconLabelClass = "font-extended pdp-add-icon-label";

/** Pill CTA corner radius — squared on v5, full pill elsewhere */
export function pdpPillRadiusClass(square = false) {
  return square ? "rounded-none" : "rounded-full";
}

/** Pill outline CTA — white fill, soft grey stroke (Add buttons, sheet actions) */
export const pdpStrokeCtaClass =
  "pdp-stroke-cta rounded-full border border-neutral-200 bg-white text-black transition-colors active:bg-neutral-50 pdp-pressable";

/** Outline CTA disabled / added state — same border box as default so the pill does not shrink */
export const pdpStrokeCtaMutedClass =
  "pdp-stroke-cta rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500";

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

/** Default sizing/shape for bottom-bar variant pills */
const pdpVariantPillShapeClass = "h-12 rounded-full";

/** Bottom-bar variant pill — sizing-free base (apply height/radius separately) */
export const pdpVariantPillBaseClass =
  "font-extended flex min-w-0 flex-1 items-center gap-2 bg-white px-3 text-left text-[12px] leading-none text-black transition-colors active:bg-neutral-50 pdp-pressable";

/** Frost variant pill base — sizing-free (apply height/radius separately) */
export const pdpVariantPillFrostBaseClass =
  "font-extended flex min-w-0 flex-1 items-center gap-2 px-3 text-left text-[12px] leading-none text-white pdp-frost-dark active:brightness-95 pdp-pressable";

/** Bottom-bar variant pill — Style / Size / Color triggers */
export const pdpVariantPillClass = `${pdpVariantPillBaseClass} ${pdpVariantPillShapeClass}`;

/** Frost variant pill — docked hero buy bar */
export const pdpVariantPillFrostClass = `${pdpVariantPillFrostBaseClass} ${pdpVariantPillShapeClass}`;
