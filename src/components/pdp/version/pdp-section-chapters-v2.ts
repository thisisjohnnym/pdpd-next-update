import type { PdpChapter } from "../pdp-section-chapters";

/**
 * v2 wayfinding chapters — stakeholder pivot.
 *
 * Differences from v1 (`PDP_CHAPTERS`):
 * - "Make it Yours" removed (strap/charm configurator is gone in v2)
 * - "Reviews & comments" renamed to "Reviews" (comments removed from reviews)
 *
 * v1 chapters in `pdp-section-chapters.ts` stay untouched.
 */
export const PDP_CHAPTERS_V2: PdpChapter[] = [
  { id: "overview", label: "Overview", sub: "" },
  { id: "the-details", label: "The Details", sub: "" },
  { id: "the-feel", label: "The Feel", sub: "Leather aging, sounds & weight" },
  { id: "reviews", label: "Reviews", sub: "4.8 · 128 reviews" },
  { id: "the-family", label: "The Tabby family", sub: "Compare styles" },
  { id: "more", label: "More to explore", sub: "Bundle & recently viewed" },
];
