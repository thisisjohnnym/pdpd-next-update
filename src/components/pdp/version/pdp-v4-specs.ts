import type { PdpProductDetailSpec } from "../pdp-data";

/** v4 Details fact — editorial spec row (Paper r5 `LD6-0`). */
export type PdpProductDetailSpecV4 = PdpProductDetailSpec & {
  /** Apply tabular numerals to measured values (dimensions, weight). */
  tabular?: boolean;
  /** Quiet second line — keeps the primary value to one short phrase. */
  hint?: string;
};

/** v4/v5 Details module — intro beneath "The Details" heading. */
export const PDP_V4_DETAILS_SECTION = {
  intro:
    "Full-grain leather, measured dimensions, and shoulder-or-crossbody carry — the essentials at a glance.",
} as const;

/**
 * v4-only Details facts (Paper r5 `LD6-0`).
 *
 * Row pairs are ordered short-with-short so the two-column grid stays even.
 * Longer context lives on optional `hint` lines instead of wrapping values.
 */
export const PDP_V4_SPECS = [
  {
    id: "material",
    label: "Material",
    value: "Full-grain leather",
    hint: "Glove-tanned",
  },
  {
    id: "dimensions",
    label: "Dimensions",
    value: "10 × 6 × 3.25 in",
    tabular: true,
  },
  {
    id: "weight",
    label: "Weight",
    value: "0.9 lb",
    tabular: true,
  },
  {
    id: "fits",
    label: "Fits",
    value: "Phone · wallet · keys",
  },
  {
    id: "strap",
    label: "Strap",
    value: '22" drop',
    hint: "Adjustable · shoulder or crossbody",
    tabular: true,
  },
  {
    id: "hardware",
    label: "Hardware",
    value: "Signature C clasp",
    hint: "Turn-lock · brushed gold",
  },
] satisfies PdpProductDetailSpecV4[];
