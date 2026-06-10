/** Mobile-first PDP copy — one step larger on small screens, unchanged at lg+ */
export const pdpType = {
  /** Captions, quotes, descriptive paragraphs */
  caption: "text-sm leading-[1.35] tracking-[0.2px] lg:text-xs",
  /** Product names, spec values, list rows */
  body: "text-sm leading-snug tracking-[0.2px] lg:text-xs",
  /** Prices, metadata, secondary lines */
  label: "text-xs tracking-[0.2px] lg:text-[11px]",
  /** Badges, chips, time labels */
  micro: "text-[11px] tracking-[0.2px] lg:text-[10px]",
  /** Uppercase tags (THIS ITEM, etc.) */
  tag: "text-[11px] uppercase tracking-[0.6px] lg:text-[10px]",
} as const;
