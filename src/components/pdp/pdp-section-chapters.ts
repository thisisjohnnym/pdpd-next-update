/** Wayfinding chapters for the long PDP scroll — order matches the page flow */
export type PdpChapter = {
  /** Matches the DOM anchor id: `pdp-chapter-${id}` with `data-chapter` */
  id: string;
  label: string;
  /** One-line description shown in the jump menu */
  sub: string;
};

export const PDP_CHAPTER_ANCHOR_PREFIX = "pdp-chapter-";

export function pdpChapterAnchorId(id: string) {
  return `${PDP_CHAPTER_ANCHOR_PREFIX}${id}`;
}

export const PDP_CHAPTERS: PdpChapter[] = [
  { id: "overview", label: "Overview", sub: "" },
  { id: "the-details", label: "The Details", sub: "" },
  { id: "the-feel", label: "The Feel", sub: "Leather aging, sounds & weight" },
  { id: "make-it-yours", label: "Make it Yours", sub: "Straps & charms" },
  { id: "reviews", label: "Reviews & comments", sub: "4.8 · 128 reviews" },
  { id: "the-family", label: "The Tabby family", sub: "Compare styles" },
  { id: "more", label: "More to explore", sub: "Bundle & recently viewed" },
];
