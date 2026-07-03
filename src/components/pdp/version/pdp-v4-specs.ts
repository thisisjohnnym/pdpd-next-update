import type { PdpProductSpec } from "../pdp-data";

/**
 * v4-only Details spec chips (Paper r5 `LD6-0`).
 *
 * Replaces the frozen three-up `PDP_PRODUCT_DETAILS.specs` ("Dimensions 10\" × 6\"",
 * Weight, Strap drop) with a labeled five-up layout: a 3-up dimension row
 * (Height / Width / Depth) followed by a 2-up row (Weight / Strap drop).
 *
 * Values sourced from coach.com's Tabby Shoulder Bag 26 in Pebbled Leather
 * (style CH857, $475): Length 10.25" / Height 6.0" / Width 3.25". Coach's
 * "Length" (side-to-side) maps to our Width; their "Width" (front-to-back) maps
 * to our Depth. Weight (0.9 lb) and Strap drop (22") reuse the frozen v1 values
 * verbatim — the frozen `pdp-data.ts` is never mutated for v4.
 */
export const PDP_V4_SPECS = [
  { id: "height", label: "Height", value: '6"' },
  { id: "width", label: "Width", value: '10"' },
  { id: "depth", label: "Depth", value: '3.25"' },
  { id: "weight", label: "Weight", value: "0.9 lb" },
  { id: "drop", label: "Strap drop", value: '22"' },
] satisfies PdpProductSpec[];
