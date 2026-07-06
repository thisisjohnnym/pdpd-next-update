import type { PdpUgcStory } from "../pdp-data";

/** v4-only "What owners say" preview — scannable highlights before the full reviews tray. */
export const PDP_V4_REVIEWS_SUMMARY = {
  headline: "What owners say",
  reviewHighlights: [
    "Premium leather",
    "Comfortable crossbody",
    "Fits everyday essentials",
    "True to photos",
  ],
  featuredQuote: {
    body: "Weekend trip tested. Crossbody all day, zero issues.",
    author: "Jules T.",
    verified: true,
  },
} as const;

/** Compact UGC row — evidence supporting the review highlights. */
export const PDP_V4_REVIEW_UGC_MOMENTS: readonly Pick<
  PdpUgcStory,
  "id" | "src" | "alt" | "context"
>[] = [
  {
    id: "weekend-trip",
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer wearing Tabby Shoulder Bag 26 crossbody on a city street",
    context: "Weekend trip tested",
  },
  {
    id: "everyday-carry",
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer with Tabby Shoulder Bag 26 outside a coffee shop",
    context: "Everyday carry",
  },
  {
    id: "phone-wallet",
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
    context: "Fits phone + wallet",
  },
];
