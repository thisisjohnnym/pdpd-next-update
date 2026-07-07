export const PDP_PRODUCT = {
  name: "Tabby Shoulder Bag 26",
  subtitle: "Quilted Leather",
  price: "$550",
  imageSrc: "/images/gallery/tabby-product-front-916.jpg",
  imageAlt:
    "Tabby Shoulder Bag 26 in black full-grain leather with gold C clasp and detachable straps",
} as const;

export type PdpBagUpsell = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

/** Upsells shown in the add-to-bag confirmation tray */
export const PDP_BAG_UPSELLS: PdpBagUpsell[] = [
  {
    id: "cherry-charm",
    name: "Cherry Bag Charm",
    price: "$45",
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: "$68",
    imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
    imageAlt: "Gold chain strap with leather weave detail",
  },
  {
    id: "strap-extender",
    name: "Bag Strap Extender",
    price: "$38",
    imageSrc: "/images/gallery/tabby-leather-side-gusset.png",
    imageAlt: "Adjustable bag strap extender in black leather",
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: "$42",
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Gold heart bag charm on chain",
  },
  {
    id: "leather-key-ring",
    name: "Leather Key Ring",
    price: "$35",
    imageSrc: "/images/gallery/tabby-leather-back.png",
    imageAlt: "Black leather key ring with gold hardware",
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: "$52",
    imageSrc: "/images/gallery/tabby-leather-interior-packed.png",
    imageAlt: "Compact card case with bag clip attachment",
  },
];

/** Afterpay messaging in the add-to-bag confirmation tray */
export const PDP_PAY_OVER_TIME = {
  icon: "credit_card",
  amount: "4 interest-free payments of $118.75",
  body: "Pay over time with Afterpay. No impact to credit.",
} as const;

export type PdpBundleItem = {
  id: string;
  name: string;
  /** Whole-dollar price */
  price: number;
  imageSrc: string;
  imageAlt: string;
  defaultSelected?: boolean;
  /** Current PDP — always included in bundle */
  locked?: boolean;
};

export type PdpBundleAddPayload = {
  items: PdpBundleItem[];
  subtotal: number;
  total: number;
};

/** Multi-select bundle — Tabby + accessories */
export const PDP_BUNDLE_DISCOUNT = 0.1;

export const PDP_BUNDLE_ITEMS: PdpBundleItem[] = [
  {
    id: "tabby-26",
    name: PDP_PRODUCT.name,
    price: 550,
    imageSrc: PDP_PRODUCT.imageSrc,
    imageAlt: PDP_PRODUCT.imageAlt,
    defaultSelected: true,
    locked: true,
  },
  {
    id: "cherry-charm",
    name: "Cherry Bag Charm",
    price: 45,
    imageSrc: "/images/similar/cherry-charm.png",
    imageAlt: "Glittered red cherry bag charm with gold-tone clip",
    defaultSelected: true,
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: 68,
    imageSrc: "/images/similar/charm-chain-strap.png",
    imageAlt: "Gold-tone curb chain strap with assorted charms",
    defaultSelected: false,
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: 42,
    imageSrc: "/images/similar/heart-charm.png",
    imageAlt: "Pink leather heart bag charm on strap",
    defaultSelected: false,
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: 52,
    imageSrc: "/images/similar/card-case-clip.jpg",
    imageAlt: "Black leather zip card case with D-ring clip",
    defaultSelected: false,
  },
];

type PdpBagSizeHotspot = {
  id: string;
  /** Horizontal position within the image frame (0–100) */
  x: number;
  /** Vertical position within the image frame (0–100) */
  y: number;
  label: string;
  title: string;
  body: string;
  fits: string[];
};

/** Interactive capacity explorer — tap hotspots on product shot */
const PDP_BAG_SIZE = {
  title: "What fits inside",
  imageSrc: PDP_PRODUCT.imageSrc,
  imageAlt: PDP_PRODUCT.imageAlt,
  hotspots: [
    {
      id: "main",
      x: 38,
      y: 50,
      label: "Main compartment",
      title: "Main compartment",
      body: "Room for your everyday carry without feeling overstuffed.",
      fits: ["Phone", "Wallet", "Keys", "Sunglasses"],
    },
    {
      id: "size",
      x: 48,
      y: 42,
      label: "Bag size",
      title: "Tabby Shoulder Bag 26 dimensions",
      body: "Structured at a mid-size scale — roomy enough for daily essentials, compact enough for evenings out.",
      fits: ['10.5" wide', '6.5" tall', '3" deep'],
    },
    {
      id: "pocket",
      x: 62,
      y: 60,
      label: "Slip pocket",
      title: "Interior slip pocket",
      body: "Keep small items easy to grab on the go.",
      fits: ["Cards", "Lip balm", "AirPods"],
    },
  ] satisfies PdpBagSizeHotspot[],
} as const;

const PDP_COMPARE_TEASER = {
  title: "Compare with similar",
  linkLabel: "Compare sizes, style, occasions",
  /** Current PDP item */
  selected: {
    label: "This",
    imageSrc: PDP_PRODUCT.imageSrc,
    imageAlt: PDP_PRODUCT.imageAlt,
    highlights: ["Structured shape", "More strap options"],
  },
  /** Default alternative shown in the teaser */
  alternative: {
    label: "Alt",
    imageSrc: "/images/compare/tabby-pillow-magenta.png",
    imageAlt: "Pillow Tabby shoulder bag in magenta quilted leather",
    highlights: ["Softer silhouette", "Chain strap"],
  },
} as const;

const PDP_COMPLETE_THE_LOOK = {
  title: "Complete the look",
  items: [
    {
      id: "complete-charm",
      name: "Charm",
      price: "$45",
      imageSrc: "/images/gallery/tabby-leather-front-charm.png",
      imageAlt: "Cherry bag charm on gold chain",
    },
    {
      id: "complete-wallet",
      name: "Wallet",
      price: "$128",
      imageSrc: "/images/gallery/tabby-interior-packed.png",
      imageAlt: "Slim wallet styled with Tabby Shoulder Bag 26",
    },
  ],
} as const;

export type PdpSimilarItem = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpCompareMaterialSwatch = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type PdpCompareItem = PdpSimilarItem & {
  size: string;
  strap: string;
  /** Accessible label — paired with material swatch clip */
  material: string;
  materialSwatch: PdpCompareMaterialSwatch;
  closure: string;
  /** Short label for compare CTAs — e.g. "Tabby 26" */
  shortName?: string;
};

export type PdpCompareDifferenceAdvantage =
  | "selected"
  | "alternative"
  | "neutral";

export type PdpCompareDifferenceRow = {
  id: string;
  label: string;
  display: string;
  advantage: PdpCompareDifferenceAdvantage;
  /** Price delta rows use accent styling */
  variant?: "price";
};

/**
 * Comparative axis — read as a relative delta vs the pinned bag. Direction is
 * derived from the two 0..1 positions; the words describe each direction.
 */
export type PdpCompareScale = {
  id: string;
  label: string;
  /** 0..1 position of the pinned (selected) bag */
  selected: number;
  /** 0..1 position of the alternative bag */
  alternative: number;
  /** Word when the alternative sits higher, e.g. "Larger" */
  highLabel: string;
  /** Word when the alternative sits lower, e.g. "Lighter" */
  lowLabel: string;
  /**
   * Prescriptive magnitude phrase shown instead of the bare direction word —
   * e.g. '½" larger', '~20% roomier', '≈4 oz lighter'. Omit when the two bags
   * are effectively equal (renders as "Same").
   */
  delta?: string;
};

export type PdpFamilyCompareAlternative = PdpCompareItem & {
  shortName: string;
  /** One-line takeaway shown above the scales */
  summary: string;
  /** Glanceable axes (Size / Capacity / Weight) rendered as comparative tracks */
  scales: PdpCompareScale[];
  differences: PdpCompareDifferenceRow[];
  aiInsight: {
    title: string;
    body: string;
  };
};

const PDP_COMPARE_CATEGORIES = [
  { id: "size", label: "Size" },
  { id: "strap", label: "Strap" },
  { id: "material", label: "Material" },
  { id: "closure", label: "Closure" },
] as const;

/** Current PDP item — pinned in the compare module */
export const PDP_COMPARE_SELECTED: PdpCompareItem = {
  id: "tabby-26",
  name: PDP_PRODUCT.name,
  shortName: "Tabby 26",
  price: PDP_PRODUCT.price,
  imageSrc: "/images/compare/tabby-26.png",
  imageAlt: PDP_PRODUCT.imageAlt,
  size: '10" W x 6" H x 3" D',
  strap: "Detachable leather",
  material: "Full-grain leather",
  materialSwatch: {
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Close-up of full-grain pebbled leather texture",
    objectPosition: "center 45%",
  },
  closure: "C clasp turn-lock",
};

function parsePriceAmount(price: string): number {
  return Number.parseInt(price.replace(/\D/g, ""), 10) || 0;
}

function buildPriceDifferenceRow(
  selectedPrice: string,
  alternativePrice: string,
): PdpCompareDifferenceRow {
  const delta =
    parsePriceAmount(selectedPrice) - parsePriceAmount(alternativePrice);

  if (delta === 0) {
    return {
      id: "price",
      label: "Price",
      display: "Same",
      advantage: "neutral",
      variant: "price",
    };
  }

  return {
    id: "price",
    label: "Price",
    display: delta > 0 ? `+$${delta}` : `−$${-delta}`,
    advantage: "neutral",
    variant: "price",
  };
}

/** Tabby family alternatives — one compared at a time with relative differences + AI assist */
export const PDP_FAMILY_COMPARE_ALTERNATIVES: PdpFamilyCompareAlternative[] = [
  {
    id: "pillow-tabby-magenta",
    name: "Pillow Tabby Shoulder Bag",
    shortName: "Pillow Tabby",
    price: "$595",
    imageSrc: "/images/compare/tabby-pillow-magenta.png",
    imageAlt: "Pillow Tabby shoulder bag in magenta quilted leather with chain strap",
    size: '10.5" W x 6.5" H x 3" D',
    strap: "Chain & leather",
    material: "Pillow-quilted leather",
    materialSwatch: {
      src: "/images/compare/tabby-pillow-magenta.png",
      alt: "Close-up of magenta pillow-quilted leather texture",
      objectPosition: "center 85%",
    },
    closure: "C clasp turn-lock",
    summary: "Bigger, roomier & lighter — built for weekends.",
    scales: [
      { id: "size", label: "Size", selected: 0.45, alternative: 0.62, highLabel: "Larger", lowLabel: "Smaller", delta: '½" larger' },
      { id: "carry-capacity", label: "Capacity", selected: 0.4, alternative: 0.66, highLabel: "Roomier", lowLabel: "Less room", delta: "~20% roomier" },
      { id: "weight", label: "Weight", selected: 0.58, alternative: 0.36, highLabel: "Heavier", lowLabel: "Lighter", delta: "≈4 oz lighter" },
    ],
    differences: [
      {
        id: "size",
        label: "Size",
        display: "Slightly larger",
        advantage: "alternative",
      },
      {
        id: "material",
        label: "Material",
        display: "Pillow-quilted leather",
        advantage: "alternative",
      },
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "More room",
        advantage: "alternative",
      },
      {
        id: "structured-shape",
        label: "Silhouette",
        display: "Softer, puffed",
        advantage: "alternative",
      },
      {
        id: "strap-options",
        label: "Strap style",
        display: "Chain & leather",
        advantage: "alternative",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Weekends & travel",
        advantage: "alternative",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Lighter feel",
        advantage: "alternative",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$595"),
    ],
    aiInsight: {
      title: "Based on your browsing",
      body: "You've been looking at work bags — Tabby 26 fits better for carry capacity and structured shape.",
    },
  },
  {
    id: "quilted-tabby-black",
    name: "Quilted Tabby Shoulder Bag",
    shortName: "Quilted Tabby",
    price: "$650",
    imageSrc: "/images/compare/tabby-quilted-black.png",
    imageAlt: "Quilted Tabby shoulder bag in black with gold chain strap",
    size: '10" W x 6" H x 3" D',
    strap: "Chain crossbody",
    material: "Quilted leather",
    materialSwatch: {
      src: "/images/compare/tabby-quilted-black.png",
      alt: "Close-up of black quilted leather texture",
      objectPosition: "center 85%",
    },
    closure: "C clasp turn-lock",
    summary: "Same size, dressier quilting — made for evenings out.",
    scales: [
      { id: "size", label: "Size", selected: 0.5, alternative: 0.5, highLabel: "Larger", lowLabel: "Smaller" },
      { id: "carry-capacity", label: "Capacity", selected: 0.5, alternative: 0.5, highLabel: "Roomier", lowLabel: "Less room" },
      { id: "weight", label: "Weight", selected: 0.5, alternative: 0.5, highLabel: "Heavier", lowLabel: "Lighter" },
    ],
    differences: [
      {
        id: "size",
        label: "Size",
        display: "Same footprint",
        advantage: "neutral",
      },
      {
        id: "material",
        label: "Material",
        display: "Quilted leather",
        advantage: "alternative",
      },
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "structured-shape",
        label: "Silhouette",
        display: "Quilted, dressier",
        advantage: "alternative",
      },
      {
        id: "strap-options",
        label: "Strap style",
        display: "Chain crossbody",
        advantage: "alternative",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Evenings out",
        advantage: "alternative",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Similar",
        advantage: "neutral",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$650"),
    ],
    aiInsight: {
      title: "Based on your browsing",
      body: "Your recent views lean dressy — Quilted Tabby wins for evenings, but Tabby 26 stays sharper for office days.",
    },
  },
  {
    id: "beaded-floral-tabby",
    name: "Beaded Floral Tabby",
    shortName: "Beaded Floral",
    price: "$695",
    imageSrc: "/images/compare/tabby-beaded-floral.png",
    imageAlt: "Beaded floral Tabby shoulder bag with wood-bead embroidery and gold C clasp",
    size: '10" W x 6" H x 3" D',
    strap: "Detachable leather",
    material: "Beaded floral",
    materialSwatch: {
      src: "/images/compare/tabby-beaded-floral.png",
      alt: "Close-up of beaded floral embroidery on Tabby bag",
      objectPosition: "center 72%",
    },
    closure: "C clasp turn-lock",
    summary: "Same shape, beaded for events — a statement piece.",
    scales: [
      { id: "size", label: "Size", selected: 0.5, alternative: 0.5, highLabel: "Larger", lowLabel: "Smaller" },
      { id: "carry-capacity", label: "Capacity", selected: 0.5, alternative: 0.5, highLabel: "Roomier", lowLabel: "Less room" },
      { id: "weight", label: "Weight", selected: 0.46, alternative: 0.58, highLabel: "Heavier", lowLabel: "Lighter", delta: "≈2 oz heavier" },
    ],
    differences: [
      {
        id: "size",
        label: "Size",
        display: "Same footprint",
        advantage: "neutral",
      },
      {
        id: "material",
        label: "Material",
        display: "Beaded floral",
        advantage: "alternative",
      },
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "structured-shape",
        label: "Silhouette",
        display: "Structured, embellished",
        advantage: "alternative",
      },
      {
        id: "strap-options",
        label: "Strap style",
        display: "Detachable leather",
        advantage: "neutral",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Events & occasions",
        advantage: "alternative",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Slightly heavier",
        advantage: "alternative",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$695"),
    ],
    aiInsight: {
      title: "Based on your browsing",
      body: "Beaded Floral is the statement pick for events — Tabby 26 is the everyday carry you'll reach for all week.",
    },
  },
  {
    id: "tabby-charms",
    name: "Tabby Shoulder Bag 26",
    shortName: "Tabby Charms",
    price: "$550",
    imageSrc: "/images/compare/tabby-charms.png",
    imageAlt: "Tabby Shoulder Bag 26 in black leather with Rexy and bag charms",
    size: '10" W x 6" H x 3" D',
    strap: "Detachable leather",
    material: "Full-grain leather",
    materialSwatch: {
      src: "/images/compare/tabby-charms.png",
      alt: "Close-up of smooth black leather on Tabby bag",
      objectPosition: "center 75%",
    },
    closure: "C clasp turn-lock",
    summary: "The same Tabby 26 — pre-styled with charms to gift.",
    scales: [
      { id: "size", label: "Size", selected: 0.5, alternative: 0.5, highLabel: "Larger", lowLabel: "Smaller" },
      { id: "carry-capacity", label: "Capacity", selected: 0.5, alternative: 0.5, highLabel: "Roomier", lowLabel: "Less room" },
      { id: "weight", label: "Weight", selected: 0.5, alternative: 0.5, highLabel: "Heavier", lowLabel: "Lighter" },
    ],
    differences: [
      {
        id: "size",
        label: "Size",
        display: "Same",
        advantage: "neutral",
      },
      {
        id: "material",
        label: "Material",
        display: "Full-grain leather",
        advantage: "neutral",
      },
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Same",
        advantage: "neutral",
      },
      {
        id: "structured-shape",
        label: "Silhouette",
        display: "Structured",
        advantage: "neutral",
      },
      {
        id: "strap-options",
        label: "Strap style",
        display: "Detachable leather",
        advantage: "neutral",
      },
      {
        id: "charm-styling",
        label: "Charm styling",
        display: "Pre-styled set",
        advantage: "alternative",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Gifting",
        advantage: "alternative",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$550"),
    ],
    aiInsight: {
      title: "Based on your browsing",
      body: "Same bag, different vibe — the charms edition is ready to gift; black Tabby 26 lets you build your own pairing.",
    },
  },
];

/** @deprecated Carousel compare — use PDP_FAMILY_COMPARE_ALTERNATIVES */
const PDP_COMPARE_OPTIONS: PdpCompareItem[] = [
  {
    id: "beaded-floral-tabby",
    name: "Beaded Floral Tabby",
    price: "$695",
    imageSrc: "/images/compare/tabby-beaded-floral.png",
    imageAlt: "Beaded floral Tabby shoulder bag with wood-bead embroidery and gold C clasp",
    size: '10" W x 6" H x 3" D',
    strap: "Detachable leather",
    material: "Beaded floral",
    materialSwatch: {
      src: "/images/compare/tabby-beaded-floral.png",
      alt: "Close-up of beaded floral embroidery on Tabby bag",
      objectPosition: "center 72%",
    },
    closure: "C clasp turn-lock",
  },
  {
    id: "tabby-charms",
    name: "Tabby Shoulder Bag 26",
    price: "$550",
    imageSrc: "/images/compare/tabby-charms.png",
    imageAlt: "Tabby Shoulder Bag 26 in black leather with Rexy and bag charms",
    size: '10" W x 6" H x 3" D',
    strap: "Detachable leather",
    material: "Full-grain leather",
    materialSwatch: {
      src: "/images/compare/tabby-charms.png",
      alt: "Close-up of smooth black leather on Tabby bag",
      objectPosition: "center 75%",
    },
    closure: "C clasp turn-lock",
  },
  {
    id: "pillow-tabby-magenta",
    name: "Pillow Tabby Shoulder Bag",
    price: "$595",
    imageSrc: "/images/compare/tabby-pillow-magenta.png",
    imageAlt: "Pillow Tabby shoulder bag in magenta quilted leather with chain strap",
    size: '10.5" W x 6.5" H x 3" D',
    strap: "Chain & leather",
    material: "Pillow-quilted leather",
    materialSwatch: {
      src: "/images/compare/tabby-pillow-magenta.png",
      alt: "Close-up of magenta pillow-quilted leather texture",
      objectPosition: "center 85%",
    },
    closure: "C clasp turn-lock",
  },
  {
    id: "quilted-tabby-black",
    name: "Quilted Tabby Shoulder Bag",
    price: "$650",
    imageSrc: "/images/compare/tabby-quilted-black.png",
    imageAlt: "Quilted Tabby shoulder bag in black with gold chain strap",
    size: '10" W x 6" H x 3" D',
    strap: "Chain crossbody",
    material: "Quilted leather",
    materialSwatch: {
      src: "/images/compare/tabby-quilted-black.png",
      alt: "Close-up of black quilted leather texture",
      objectPosition: "center 85%",
    },
    closure: "C clasp turn-lock",
  },
];

/** Recommendation carousel — similar bags below gallery */
const PDP_SIMILAR_ITEMS: PdpSimilarItem[] = [
  {
    id: "crochet-fringe-tabby",
    name: "Crochet Tabby Shoulder Bag",
    price: "$650",
    imageSrc: "/images/similar/tabby-crochet-fringe.png",
    imageAlt: "Crochet Tabby shoulder bag in black with fringe and gold C clasp",
  },
  {
    id: "soft-tabby",
    name: "Soft Tabby Shoulder Bag",
    price: "$550",
    imageSrc: "/images/similar/tabby-suede.png",
    imageAlt: "Soft Tabby shoulder bag in brown suede with gold C clasp",
  },
  {
    id: "tabby-chain",
    name: "Tabby Chain Crossbody",
    price: "$425",
    imageSrc: "/images/similar/tabby-chain-crossbody.png",
    imageAlt: "Tabby chain crossbody in black leather with gold chain strap",
  },
  {
    id: "tabby-oxblood",
    name: "Tabby Shoulder Bag 26",
    price: "$550",
    imageSrc: "/images/similar/tabby-oxblood-leather.png",
    imageAlt: "Tabby Shoulder Bag 26 in oxblood full-grain leather with gold C clasp",
  },
];

/** Cross-sell grid — often bought with Tabby 26 */
const PDP_YMAL = {
  eyebrow: "You might also like",
  subtitle: "Based on what others bought with this bag",
  items: [
    {
      id: "ymal-cherry-charm",
      name: "Cherry Bag Charm",
      price: "$45",
      imageSrc: "/images/gallery/tabby-leather-front-charm.png",
      imageAlt: "Red cherry bag charm on gold chain",
    },
    {
      id: "ymal-chain-strap",
      name: "Signature Chain Strap",
      price: "$68",
      imageSrc: "/images/similar/tabby-chain-crossbody.png",
      imageAlt: "Gold chain strap with leather weave detail",
    },
    {
      id: "ymal-heart-charm",
      name: "Heart Bag Charm",
      price: "$42",
      imageSrc: "/images/gallery/tabby-leather-front-charm.png",
      imageAlt: "Gold heart bag charm on chain",
    },
    {
      id: "ymal-strap-extender",
      name: "Bag Strap Extender",
      price: "$38",
      imageSrc: "/images/gallery/tabby-leather-side-gusset.png",
      imageAlt: "Adjustable bag strap extender in black leather",
    },
  ] satisfies PdpSimilarItem[],
} as const;

export const PDP_MORE_LIKE_THIS = {
  eyebrow: "More like this",
  subtitle: "Similar silhouettes in the Tabby family",
  items: PDP_SIMILAR_ITEMS,
} as const;

export const PDP_RECENTLY_VIEWED_SECTION = {
  eyebrow: "Recently viewed",
  subtitle: "Pick up where you left off",
} as const;

export type PdpCoachPremiumPerk = {
  id: string;
  label: string;
  icon: string;
  /** Renders the Instagram-style verified badge beside the label */
  showVerifiedBadge?: boolean;
};

export const PDP_COACH_PREMIUM = {
  title: "Coach Premium",
  body: "A membership for devoted Coach fans — unlock perks across shopping, shipping, and community.",
  cta: "Sign up",
  toast: "Coach Premium sign-up is coming soon.",
  perks: [
    {
      id: "deals",
      label: "First access to deals and drops",
      icon: "bolt",
    },
    {
      id: "shipping",
      label: "Priority shipping on every order",
      icon: "local_shipping",
    },
    {
      id: "verified",
      label: "Blue checkmark on your comments",
      icon: "verified",
      showVerifiedBadge: true,
    },
  ] satisfies PdpCoachPremiumPerk[],
} as const;

export type PdpProductSpec = {
  id: string;
  label: string;
  value: string;
};

export type PdpProductDetailTile = {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
};

export const PDP_PRODUCT_DETAILS = {
  eyebrow: "The details",
  /** Full-bleed macro at the top of the module — "The details" overlay */
  macro: {
    src: "/images/gallery/tabby-detail-quilt.png",
    alt: "Close-up of the quilted leather Tabby Shoulder Bag 26 with signature brass C hardware and chain",
    /** Paper `4O6-0` — backgroundSize ~149% crops side letterboxing */
    objectPosition: "center",
    scale: 1.49067,
  },
  specs: [
    { id: "dimensions", label: "Dimensions", value: '10" × 6"' },
    { id: "weight", label: "Weight", value: "0.9 lb" },
    { id: "drop", label: "Strap drop", value: '22"' },
  ] satisfies PdpProductSpec[],
  /** "A closer look" — 2×2 visual detail gallery (row-major order) */
  closerLook: {
    heading: "A closer look",
    tiles: [
      {
        id: "leather",
        title: "Pillowy quilted leather",
        caption: "Full-grain, made to age",
        src: "/images/gallery/tabby-detail-clasp.png",
        alt: "Pillowy quilted full-grain leather with diamond stitching",
      },
      {
        id: "interior",
        title: "Roomy interior",
        caption: "Slip pocket fits a phone",
        src: "/images/gallery/tabby-leather-interior-open.png",
        alt: "Open interior of the Tabby Shoulder Bag showing the slip pocket",
      },
      {
        id: "hardware",
        title: "Solid brass C-clasp",
        caption: "Brushed gold, signature turn-lock",
        src: "/images/gallery/tabby-leather-detail-hardware.png",
        alt: "Brushed brass turn-lock hardware engraved with the Coach logo",
      },
      {
        id: "patina",
        title: "Ages beautifully",
        caption: "Patina after 6 months",
        src: "/images/gallery/tabby-leather-aging-six-months.png",
        alt: "The Tabby Shoulder Bag showing a soft patina after six months of wear",
      },
    ] satisfies PdpProductDetailTile[],
  },
} as const;

export type PdpSiteFooterLink = {
  label: string;
  href: string;
};

export type PdpSiteFooterGroup = {
  id: string;
  title: string;
  links: PdpSiteFooterLink[];
};

type PdpSiteFooterSocial = {
  label: string;
  href: string;
  icon: string;
};

export const PDP_SITE_FOOTER = {
  brand: "Coach Outlet",
  newsletter: {
    title: "Stay connected",
    description: "Be the first to know about new arrivals, store openings and early access events.",
    placeholder: "Email address",
    cta: "Sign up",
  },
  groups: [
    {
      id: "service",
      title: "Customer Service",
      links: [
        { label: "Contact us", href: "#" },
        { label: "Track order", href: "#" },
        { label: "Shipping", href: "#" },
        { label: "Returns & exchanges", href: "#" },
        { label: "Product care", href: "#" },
        { label: "Size guide", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About Coach", href: "#" },
        { label: "Coachtopia", href: "#" },
        { label: "Coach (Re)Loved", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Affiliate program", href: "#" },
        { label: "Coach Foundation", href: "#" },
        { label: "Tapestry, Inc.", href: "#" },
      ],
    },
    {
      id: "services",
      title: "Coach Services",
      links: [
        { label: "Store locator", href: "#" },
        { label: "Personalization", href: "#" },
        { label: "Bag repairs", href: "#" },
        { label: "Gift cards", href: "#" },
        { label: "Coach Cares", href: "#" },
      ],
    },
  ] satisfies PdpSiteFooterGroup[],
  social: [
    { label: "Instagram", href: "#", icon: "photo_camera" },
    { label: "TikTok", href: "#", icon: "music_note" },
    { label: "YouTube", href: "#", icon: "smart_display" },
    { label: "Facebook", href: "#", icon: "thumb_up" },
    { label: "Pinterest", href: "#", icon: "push_pin" },
  ] satisfies PdpSiteFooterSocial[],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "CA Transparency Act", href: "#" },
    { label: "Do Not Sell My Personal Information", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "Cookie settings", href: "#" },
  ] satisfies PdpSiteFooterLink[],
  copyright: "© 2026 Coach IP Holdings LLC. All rights reserved.",
} as const;

export type PdpRecentlyViewedItem = PdpSimilarItem & {
  viewedLabel: string;
};

/** Browsing history rail — portrait cards with relative time */
export const PDP_RECENTLY_VIEWED: PdpRecentlyViewedItem[] = [
  {
    id: "rowan-satchel",
    name: "Rowan Satchel",
    price: "$395",
    imageSrc: "/images/recently-viewed/rowan-satchel.jpg",
    imageAlt: "Coach Rowan Satchel in black crossgrain leather with top handles and crossbody strap",
    viewedLabel: "Today",
  },
  {
    id: "brooklyn-shoulder",
    name: "Brooklyn Shoulder Bag 34",
    price: "$450",
    imageSrc: "/images/recently-viewed/brooklyn-shoulder.jpg",
    imageAlt: "Coach Brooklyn Shoulder Bag 34 in maple natural grain leather",
    viewedLabel: "Yesterday",
  },
  {
    id: "kira-crossbody",
    name: "Kira Crossbody",
    price: "$298",
    imageSrc: "/images/gallery/kira-crossbody-product-hero.jpg",
    imageAlt: "Kira Crossbody in black pebbled leather with gold C hardware and wristlet strap on a studio grey background",
    viewedLabel: "2 days ago",
  },
  {
    id: "morgan-hobo",
    name: "Morgan Hobo",
    price: "$425",
    imageSrc: "/images/recently-viewed/morgan-shoulder.jpg",
    imageAlt: "Coach Morgan Shoulder Bag in black leather with a snake-embossed C buckle",
    viewedLabel: "Last week",
  },
  {
    id: "field-tote",
    name: "Field Tote 40",
    price: "$495",
    imageSrc: "/images/recently-viewed/field-tote.jpg",
    imageAlt: "Coach Field Tote 40 in green leather with embossed Coach Leatherware badge",
    viewedLabel: "Last week",
  },
];

export type PdpAiConciergeImage = {
  src: string;
  alt: string;
};

export type PdpAiConciergePrompt = {
  id: string;
  question: string;
  icon: string;
  category: string;
  response: {
    headline: string;
    body: string;
    highlights?: string[];
    images: PdpAiConciergeImage[];
  };
};

/** AI Concierge — experiential prompts with inline answers */
export const PDP_AI_CONCIERGE = {
  title: "AI Concierge",
  placeholder: "Ask anything about Tabby — styling, sizing, charms, real customer photos…",
  fallbackResponse: {
    headline: "I'm on it",
    body: "I can pull styling inspiration, occasion advice, charm pairings, and real customer photos. Try one of the prompts below, or keep typing.",
  },
  prompts: [
    {
      id: "nyc-styling",
      question: "Show me how people style Tabby in NYC.",
      icon: "location_city",
      category: "Styling",
      response: {
        headline: "Tabby on NYC streets",
        body: "City shoppers carry it shoulder-to-office and crossbody on weekends. Structured leather and gold hardware hold up against denim, wool coats, and subway commutes.",
        highlights: ["Shoulder for work", "Crossbody on weekends", "Pairs with denim + coats"],
        images: [
          {
            src: "/images/reviews/ugc-on-street.png",
            alt: "Customer styling Tabby Shoulder Bag 26 on a New York City street",
          },
          {
            src: "/images/gallery/tabby-on-model-denim.png",
            alt: "Model wearing Tabby crossbody with denim in the city",
          },
        ],
      },
    },
    {
      id: "wedding-guest",
      question: "Would this work for a wedding guest outfit?",
      icon: "celebration",
      category: "Occasion",
      response: {
        headline: "Yes — polished without competing",
        body: "Black Tabby reads dressy without pulling focus from the outfit. Customers style it shoulder carry with tailored separates, satin, and minimal jewelry.",
        highlights: ["Shoulder carry reads refined", "Black leather works with color", "Compact enough for dancing"],
        images: [
          {
            src: "/images/gallery/tabby-patio-pink-dress.png",
            alt: "Tabby Shoulder Bag 26 styled for an evening out",
          },
          {
            src: "/images/gallery/tabby-leather-on-model-laugh.png",
            alt: "Model wearing Tabby with dressed-up separates",
          },
        ],
      },
    },
    {
      id: "charm-pairing",
      question: "What's the most popular charm pairing?",
      icon: "loyalty",
      category: "Accessories",
      response: {
        headline: "Cherry charm leads",
        body: "The most-added pairing on Tabby 26 is the Cherry Bag Charm on gold chain — playful contrast against black pebbled leather. Heart charm is a close second for gifting.",
        highlights: ["Cherry charm · most popular", "Gold chain hardware match", "Also pairs with heart charm"],
        images: [
          {
            src: "/images/gallery/tabby-leather-front-charm.png",
            alt: "Tabby Shoulder Bag 26 with cherry bag charm",
          },
          {
            src: "/images/reviews/ugc-silver-quilted-charm.png",
            alt: "Customer photo of Tabby with a bag charm",
          },
        ],
      },
    },
    {
      id: "petite-ugc",
      question: "Show me real customer photos from petite shoppers.",
      icon: "photo_library",
      category: "Community",
      response: {
        headline: "Petite shoppers, real photos",
        body: "Short strap and crossbody carry show up most in petite customer photos — higher on the hip, hands free, no overwhelm on the frame.",
        highlights: ["Short strap · higher carry", "Crossbody for hands-free", "Verified buyer photos"],
        images: [
          {
            src: "/images/reviews/ugc-mirror-selfie.png",
            alt: "Petite customer mirror selfie with Tabby Shoulder Bag 26",
          },
          {
            src: "/images/reviews/ugc-coffee-run.png",
            alt: "Petite customer wearing Tabby crossbody on a coffee run",
          },
        ],
      },
    },
  ] satisfies PdpAiConciergePrompt[],
} as const;

/** @deprecated Use PDP_AI_CONCIERGE */
const PDP_PRODUCT_SEARCH = {
  title: PDP_AI_CONCIERGE.title,
  placeholder: PDP_AI_CONCIERGE.placeholder,
  suggestions: PDP_AI_CONCIERGE.prompts.map((prompt) => prompt.question),
} as const;

/** Immersive hero — full-bleed 9:16 on-model lifestyle video */
export const PDP_GALLERY_IMMERSIVE_HERO_VIDEO = "/videos/tabby-hero.mp4";

/** First-frame still — fallback whenever the hero video can't autoplay (e.g. iOS Low Power Mode) */
export const PDP_GALLERY_IMMERSIVE_HERO_POSTER = "/images/posters/tabby-hero.jpg";

/** Full-bleed rotating product video for Gallery tab */
export const PDP_GALLERY_HERO_VIDEO = "/videos/soft-tabby-360.webm";

/** Capacity showcase — what fits inside the bag */
const PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO = "/videos/what-fits-inside.webm";

/** Highlight montage — styling, details, and product moments */
const PDP_GALLERY_SHOWCASE_VIDEO = "/videos/soft-tabby-showcase.webm";

/** Match studio backdrop so letterboxing feels seamless */
const PDP_GALLERY_VIDEO_BG = "#eeeeee";

/** Tailwind class for studio product photography frames */
export const PDP_STUDIO_BACKDROP_CLASS = "bg-pdp-surface-grey";

export type PdpProductHotspot = {
  id: string;
  /** Horizontal position within the image frame (0–100) */
  x: number;
  /** Vertical position within the image frame (0–100) */
  y: number;
  title: string;
  body: string;
};

/** Detail hotspots — interior leather + hardware close-up */
const PDP_PRODUCT_IMMERSIVE_HOTSPOTS: PdpProductHotspot[] = [
  {
    id: "c-clasp",
    x: 44,
    y: 66,
    title: "The iconic C",
    body: "Archival turn-lock DNA — the sculpted C clasp has defined Tabby since 2018.",
  },
  {
    id: "full-grain-leather",
    x: 58,
    y: 39,
    title: "Full-grain leather",
    body: "Genuine full-grain leather with a refined pebbled finish — structured, durable, and made to age beautifully.",
  },
  {
    id: "accordion-interior",
    x: 34,
    y: 17,
    title: "Accordion interior",
    body: "Three gusseted compartments expand to hold your everyday essentials without losing shape.",
  },
];

export type PdpInfluencerCredit = {
  handle: string;
  profileUrl: string;
  platform: "instagram" | "tiktok";
};

export type PdpGalleryImmersiveSlide = {
  type: "immersive";
  src: string;
  alt: string;
  shopTheLookId?: string;
  /** Purchasable strap accessories — shows overlay card on this frame */
  strapOptionsId?: string;
  influencer?: PdpInfluencerCredit;
  /** 12px white inset — matches grid margin; only for select lifestyle shots */
  insetMargins?: boolean;
  /** Image focal point within frame crop */
  objectPosition?: string;
  /** Frame ratio — 9:16 for tall on-model portraits; 4:5 default */
  aspect?: "4/5" | "9/16";
  scale?: string;
  /** Panel scroll — fit full studio frame without cropping */
  panelContain?: boolean;
  /** Drag-to-zoom lens overlay — studio product shots */
  dragZoom?: boolean;
  /** Header icon contrast when this frame is active */
  headerSurface?: "light" | "dark";
  hotspots?: PdpProductHotspot[];
};

export type PdpGalleryEditorialSlide = {
  type: "editorial";
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  /** Inset editorial video — poster uses src */
  videoSrc?: string;
  showMuteControl?: boolean;
  /** Drag-to-zoom lens inside inset frame */
  dragZoom?: boolean;
  scale?: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
  /** Subtle text link below caption */
  cta?: {
    label: string;
    href: string;
  };
};

export type PdpGalleryVideoSlide = {
  type: "video";
  src: string;
  poster?: string;
  alt: string;
  /** Hide mute toggle — 360 spins are silent by default */
  showMuteControl?: boolean;
  /** Frame ratio — 9:16 for TikTok-style clips, 4:5 for product spins */
  aspect?: "4/5" | "9/16";
  /** Optional overlay copy — replaces a separate editorial panel */
  caption?: string;
};

export type PdpGallerySignatureSoundsSlide = {
  type: "signature-sounds";
};

export type PdpGalleryLeatherAgingSlide = {
  type: "leather-aging";
};

export type PdpGalleryWeightFeelSlide = {
  type: "weight-feel";
};

export type PdpGalleryBagStoriesSlide = {
  type: "bag-stories";
};

export type PdpGalleryStrapSimulationSlide = {
  type: "strap-simulation";
};

export type PdpGalleryViewMorePhotosSlide = {
  type: "view-more-photos";
};

export type PdpGalleryUgcContextSlide = {
  type: "ugc-context";
};

export type PdpGalleryUgcVideosSlide = {
  type: "ugc-videos";
};

export type PdpGalleryAsSeenOnSlide = {
  type: "as-seen-on";
};

export type PdpGalleryProductCollageSlide = {
  type: "product-collage";
};

type PdpGalleryProductCollageTile = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type PdpGallerySlide =
  | PdpGalleryImmersiveSlide
  | PdpGalleryEditorialSlide
  | PdpGalleryVideoSlide
  | PdpGallerySignatureSoundsSlide
  | PdpGalleryLeatherAgingSlide
  | PdpGalleryWeightFeelSlide
  | PdpGalleryBagStoriesSlide
  | PdpGalleryStrapSimulationSlide
  | PdpGalleryViewMorePhotosSlide
  | PdpGalleryUgcContextSlide
  | PdpGalleryUgcVideosSlide
  | PdpGalleryAsSeenOnSlide
  | PdpGalleryProductCollageSlide;

/** Back, angle, and gusset — one collage panel in the product scroll */
export const PDP_GALLERY_PRODUCT_DETAIL_COLLAGE = {
  hero: {
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Tabby Shoulder Bag 26 straight back view with zip pocket and leather straps",
    objectPosition: "center center",
  },
  secondary: [
    {
      src: "/images/gallery/tabby-leather-back-angle.png",
      alt: "Tabby Shoulder Bag 26 back view at an angle showing pebbled leather and zip pocket",
      objectPosition: "center 55%",
    },
    {
      src: "/images/gallery/tabby-leather-detail-hardware.png",
      alt: "Close-up of Tabby Shoulder Bag 26 gold C clasp and glovetanned leather",
      objectPosition: "center center",
    },
  ] satisfies PdpGalleryProductCollageTile[],
} as const;

/** First portrait below hero — lifestyle follow-up */
const PDP_GALLERY_HERO_FOLLOWUP_IMAGE =
  "/images/gallery/tabby-leather-on-model-laugh.png";

/** Product hero — front view with charm (posters, compare, hotspots) */
const PDP_GALLERY_PRODUCT_IMMERSIVE =
  "/images/gallery/tabby-leather-front-charm.png";

/** Native 9:16 studio product shot — 2nd frame in scroll (below hero) */
const PDP_GALLERY_PRODUCT_FRONT_IMAGE =
  "/images/gallery/tabby-product-front-916.jpg";

/** Lead product shot — first frame below hero (native 9:16) */
export const PDP_GALLERY_DRAG_ZOOM_HINT = "Press & hold to zoom";

const PDP_GALLERY_PRODUCT_FRONT_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: PDP_GALLERY_PRODUCT_FRONT_IMAGE,
  alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view with gold C turnlock clasp and detachable straps",
  objectPosition: "center",
  scale: "scale-100",
  headerSurface: "light",
  aspect: "9/16",
  dragZoom: true,
};

/** On-model — editorial inset below product front */
const PDP_GALLERY_ON_MODEL_DENIM_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/mode22.png",
  alt: "Model wearing Tabby Shoulder Bag 26 crossbody with a Coach tee and suede mini skirt",
  objectPosition: "center top",
  caption:
    "Full-grain glovetanned leather with signature hardware — shoulder or crossbody, your call.",
};

/** On-model trench — fourth frame in scroll (below hero + product + editorial) */
const PDP_GALLERY_ON_MODEL_TRENCH_IMAGE =
  "/images/gallery/tabby-on-model-trench.jpg";

/** On-model trench + plaid — first frame below hero */
const PDP_GALLERY_ON_MODEL_FULL_DENIM_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
  alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat over the shoulder",
  objectPosition: "center top",
};

/** Interior open — fourth frame below hero */
const PDP_GALLERY_INTERIOR_OPEN_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-interior-open.png",
  alt: "Tabby Shoulder Bag 26 interior open showing accordion compartments and gold hardware",
  objectPosition: "center center",
};

/** Capacity editorial break — what fits inside (inset video + caption) */
const PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  videoSrc: PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO,
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "What fits inside Tabby Shoulder Bag 26",
  objectPosition: "center center",
  caption:
    "Three compartments — room for the whole day, never overstuffed.",
  cta: {
    label: "See what fits inside",
    href: "#faq-what-fits",
  },
};

/** Craftsmanship editorial break — glovetanned leather story */
const PDP_GALLERY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/tabby-leather-detail-hardware.png",
  alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
  caption:
    "Glovetanned full-grain leather with signature hardware — soft, rich, and made to last.",
};

/** Standard studio product photography — hardware detail with hotspots */
const PDP_GALLERY_PRODUCT_SHOTS: PdpGallerySlide[] = [
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather, gold C clasp, and accordion interior",
    objectPosition: "center center",
    aspect: "9/16",
    hotspots: PDP_PRODUCT_IMMERSIVE_HOTSPOTS,
  },
];

/**
 * Scroll strategy — Desire → Function → Ecommerce (post-gallery modules in gallery-view)
 *
 * Tightened gallery: one lifestyle beat per idea, overflow in View more photos.
 */
const PDP_GALLERY_DESIRE_SLIDES: PdpGallerySlide[] = [
  PDP_GALLERY_PRODUCT_FRONT_SLIDE,
  PDP_GALLERY_ON_MODEL_DENIM_SLIDE,
  {
    type: "immersive",
    src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat over the shoulder",
    aspect: "9/16",
    shopTheLookId: "trench-daytime",
  },
];

/** 360 spin — editorial inset after material detail */
const PDP_GALLERY_360_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  videoSrc: PDP_GALLERY_HERO_VIDEO,
  src: PDP_GALLERY_PRODUCT_FRONT_IMAGE,
  alt: "360° rotating view of Tabby Shoulder Bag 26",
  objectPosition: "center",
  showMuteControl: false,
  caption:
    "See it from every angle — signature C clasp, detachable straps, and glovetanned leather throughout.",
};

/** Capacity, craft detail, and touch-first interactives */
const PDP_GALLERY_FUNCTION_SLIDES: PdpGallerySlide[] = [
  PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE,
  ...PDP_GALLERY_PRODUCT_SHOTS,
  PDP_GALLERY_360_EDITORIAL_SLIDE,
  { type: "leather-aging" },
  { type: "signature-sounds" },
  { type: "weight-feel" },
  { type: "ugc-videos" },
  { type: "strap-simulation" },
  { type: "view-more-photos" },
];

/** @deprecated Use PDP_GALLERY_DESIRE_SLIDES */
const PDP_GALLERY_MEDIA_SLIDES: PdpGallerySlide[] = PDP_GALLERY_DESIRE_SLIDES;

/** @deprecated Use PDP_GALLERY_FUNCTION_SLIDES */
const PDP_GALLERY_EXPERIENCE_SLIDES: PdpGallerySlide[] = PDP_GALLERY_FUNCTION_SLIDES;

/** Tabby Shoulder Bag 26 gallery — desire scroll, then function, then ecommerce below */
export const PDP_GALLERY_SLIDES: PdpGallerySlide[] = [
  ...PDP_GALLERY_DESIRE_SLIDES,
  ...PDP_GALLERY_FUNCTION_SLIDES,
];

export type PdpGalleryPhoto = {
  id: string;
  src: string;
  alt: string;
};

/** Extended gallery — opened from the bottom "View more photos" affordance */
export const PDP_GALLERY_MORE_PHOTOS: PdpGalleryPhoto[] = [
  {
    id: "on-model-tee",
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a Coach tee and suede mini skirt",
  },
  {
    id: "on-model-trench",
    src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
  },
  {
    id: "on-model-laugh",
    src: "/images/gallery/tabby-leather-on-model-laugh.png",
    alt: "Model laughing while wearing Tabby Shoulder Bag 26 with a trench coat and plaid skirt",
  },
  {
    id: "craft-detail",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
  },
  {
    id: "interior-open",
    src: "/images/gallery/tabby-leather-interior-open.png",
    alt: "Tabby Shoulder Bag 26 interior open with accordion compartments and gold hardware",
  },
  {
    id: "interior-packed",
    src: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, and everyday essentials",
  },
  {
    id: "product-front",
    src: PDP_GALLERY_PRODUCT_FRONT_IMAGE,
    alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view",
  },
  {
    id: "front-charm",
    src: "/images/gallery/tabby-leather-front-charm.png",
    alt: "Tabby Shoulder Bag 26 front view with gold C clasp and cherry charm",
  },
  {
    id: "back-angle",
    src: "/images/gallery/tabby-leather-back-angle.png",
    alt: "Tabby Shoulder Bag 26 back view at an angle",
  },
  {
    id: "back",
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Tabby Shoulder Bag 26 straight back view with zip pocket",
  },
  {
    id: "side-gusset",
    src: "/images/gallery/tabby-leather-side-gusset.png",
    alt: "Tabby Shoulder Bag 26 side view showing accordion gussets",
  },
  {
    id: "detail-hardware",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp",
  },
];

export type PdpShopTheLookItem = {
  id: string;
  name: string;
  price: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpShopTheLookLook = {
  id: string;
  title: string;
  items: PdpShopTheLookItem[];
};

export const PDP_SHOP_THE_LOOK: Record<string, PdpShopTheLookLook> = {
  "trench-daytime": {
    id: "trench-daytime",
    title: "Shop the look",
    items: [
      {
        id: "tabby-26",
        name: "Tabby Shoulder Bag 26",
        price: "$550",
        href: "https://www.coach.com/shop/women/bags/shoulder-bags/tabby-shoulder-bag/CCZ47.html",
        imageSrc: "/images/gallery/tabby-leather-front-charm.png",
        imageAlt: "Tabby Shoulder Bag 26 in black full-grain leather",
      },
      {
        id: "trench-coat",
        name: "Heritage Trench Coat",
        price: "$695",
        href: "https://www.coach.com/shop/women/ready-to-wear/coats",
        imageSrc: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
        imageAlt: "Tan trench coat with leather trim",
      },
      {
        id: "plaid-skirt",
        name: "Plaid Pleated Mini Skirt",
        price: "$225",
        href: "https://www.coach.com/shop/women/ready-to-wear/skirts",
        imageSrc: "/images/gallery/tabby-leather-on-model-laugh.png",
        imageAlt: "Brown plaid pleated mini skirt",
      },
      {
        id: "essential-tee",
        name: "Essential Cotton Tee",
        price: "$75",
        href: "https://www.coach.com/shop/women/ready-to-wear/tops",
        imageSrc: "/images/gallery/tabby-leather-on-model-tee.png",
        imageAlt: "Grey cotton tee with Coach logo",
      },
      {
        id: "hoop-earring",
        name: "Gold Hoop Earring",
        price: "$85",
        href: "https://www.coach.com/shop/women/jewelry/earrings",
        imageSrc: "/images/gallery/tabby-leather-on-model-laugh.png",
        imageAlt: "Gold hoop earring",
      },
    ],
  },
};

export type PdpStrapOption = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpStrapOptionsSet = {
  id: string;
  title: string;
  options: PdpStrapOption[];
};

/** Strap accessories — opened from gallery frames that show carry options */
export const PDP_STRAP_OPTIONS: Record<string, PdpStrapOptionsSet> = {
  "tabby-straps": {
    id: "tabby-straps",
    title: "Strap options",
    options: [
      {
        id: "crossbody-strap",
        name: "Crossbody strap",
        subtitle: "Leather · gold hardware",
        price: "$75",
        imageSrc: "/images/similar/crossbody-strap.png",
        imageAlt: "Black leather crossbody strap with gold hardware and adjustable buckle",
      },
      {
        id: "chain-strap",
        name: "Charm chain strap",
        subtitle: "Gold chain · charms",
        price: "$68",
        imageSrc: "/images/similar/charm-chain-strap.png",
        imageAlt: "Gold charm chain strap with bow, butterfly, star, and heart charms",
      },
      {
        id: "chain-strap-with-charms",
        name: "Chain Strap with Charms",
        subtitle: "Gold chain · mixed charms",
        price: "$68",
        imageSrc: "/images/similar/chain-strap-with-charms.png",
        imageAlt:
          "Gold chain strap with mushroom, dinosaur, cherry, and crystal bow charms",
      },
    ],
  },
};

type PdpBagStory = {
  id: string;
  title: string;
  mood: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
  items: string[];
};

export type PdpStrapSimulationPreview = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type PdpStrapSimulationMode = {
  id: string;
  label: string;
  detail: string;
  answer: string;
  /** Included with bag vs add-on price */
  priceLabel?: string;
  /** Matches PDP_STRAP_OPTIONS id — enables quick add on this preview */
  quickAddOptionId?: string;
  /** Carousel thumbnail — accessory close-up */
  image: PdpStrapSimulationPreview & {
    fit?: "cover" | "contain";
  };
  /** Hero preview — full bag wearing this configuration */
  previewImage: PdpStrapSimulationPreview;
};

export type PdpStrapSimulationCharm = {
  id: string;
  label: string;
  priceLabel: string;
  /** Omitted for included stock options */
  quickAddOptionId?: string;
  stock?: boolean;
  image: PdpStrapSimulationPreview;
};

/** Strap swap simulator — preview detachable carry setups on the bag */
export type PdpStrapSetAddPayload = {
  /** Quick-add ids for staged straps and charms (duplicates preserved for quantity) */
  optionIds: string[];
  includeBag: boolean;
  total: number;
};

export const PDP_STRAP_SIMULATION = {
  moment: "Customize",
  title: "Make it Yours",
  subtitle: "Mix straps, charms, and your bag",
  intro: "Start with what’s included, then preview add-on straps and charms on your Tabby.",
  hint: "Tap to customize",
  modes: [
    {
      id: "included-dual",
      label: "Default straps",
      detail: "Shoulder + crossbody straps included.",
      answer: "Both leather straps clip on — wear shoulder or crossbody out of the box.",
      priceLabel: "Included",
      image: {
        src: "/images/gallery/tabby-make-it-yours-default.png",
        alt: "Tabby Shoulder Bag 26 with included shoulder and crossbody leather straps",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-make-it-yours-default.png",
        alt: "Tabby Shoulder Bag 26 with included shoulder and crossbody leather straps",
        objectPosition: "center center",
      },
    },
    {
      id: "crossbody-strap",
      label: "Crossbody",
      detail: "Leather · adjustable length.",
      answer:
        "Detachable leather crossbody strap with gold hardware — clips onto the same Tabby hardware.",
      priceLabel: "$75",
      quickAddOptionId: "crossbody-strap",
      image: {
        src: "/images/similar/crossbody-strap.png",
        alt: "Black leather crossbody strap with gold hardware and adjustable buckle",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-leather-product-front.png",
        alt: "Tabby Shoulder Bag 26 with detachable crossbody leather strap",
        objectPosition: "center 38%",
      },
    },
    {
      id: "chain-strap",
      label: "Charm chain",
      detail: "Gold chain with playful charms.",
      answer:
        "Charm chain strap swaps onto the same hardware — dressier crossbody with bow, star, and heart charms.",
      priceLabel: "$68",
      quickAddOptionId: "chain-strap",
      image: {
        src: "/images/similar/charm-chain-strap.png",
        alt: "Gold charm chain strap with bow, butterfly, star, and heart charms",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/similar/tabby-chain-crossbody.png",
        alt: "Tabby Shoulder Bag 26 with gold charm chain strap",
        objectPosition: "center center",
      },
    },
    {
      id: "chain-strap-with-charms",
      label: "Chain + charms",
      detail: "Mixed charms on gold chain.",
      answer:
        "Chain strap with charms — mushroom, cherries, dinosaur, and crystal bow on a gold curb chain.",
      priceLabel: "$68",
      quickAddOptionId: "chain-strap-with-charms",
      image: {
        src: "/images/similar/chain-strap-with-charms.png",
        alt: "Gold chain strap with mushroom, dinosaur, cherry, and crystal bow charms",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/compare/tabby-charms.png",
        alt: "Tabby Shoulder Bag 26 with charm chain strap and mixed bag charms",
        objectPosition: "center center",
      },
    },
    {
      id: "signature-jacquard-strap",
      label: "Signature jacquard",
      detail: "Signature C webbing · leather tabs.",
      answer:
        "Wide signature jacquard guitar strap in tan — clips onto the same Tabby hardware for an everyday logo look.",
      priceLabel: "$78",
      quickAddOptionId: "signature-jacquard-strap",
      image: {
        src: "/images/similar/signature-jacquard-strap.png",
        alt: "Coach signature C jacquard guitar strap in tan and brown with gold clips",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-leather-product-front.png",
        alt: "Tabby Shoulder Bag 26 with signature jacquard guitar strap",
        objectPosition: "center 38%",
      },
    },
    {
      id: "varsity-stripe-strap",
      label: "Varsity stripe",
      detail: "Bold webbing stripe · leather tabs.",
      answer:
        "Varsity stripe webbing guitar strap in cream, red, and green — a sporty pop that swaps onto the same hardware.",
      priceLabel: "$72",
      quickAddOptionId: "varsity-stripe-strap",
      image: {
        src: "/images/similar/varsity-stripe-strap.png",
        alt: "Coach varsity stripe webbing guitar strap in cream, red, and green with gold clips",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-leather-product-front.png",
        alt: "Tabby Shoulder Bag 26 with varsity stripe guitar strap",
        objectPosition: "center 38%",
      },
    },
    {
      id: "woven-leather-strap",
      label: "Woven leather",
      detail: "Braided leather · adjustable.",
      answer:
        "Hand-woven braided leather strap in tan with an adjustable buckle — texture and warmth on the same Tabby hardware.",
      priceLabel: "$95",
      quickAddOptionId: "woven-leather-strap",
      image: {
        src: "/images/similar/woven-leather-strap.png",
        alt: "Coach braided woven leather strap in tan with gold buckle and clips",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-leather-product-front.png",
        alt: "Tabby Shoulder Bag 26 with woven leather strap",
        objectPosition: "center 38%",
      },
    },
    {
      id: "leather-chain-strap",
      label: "Leather + chain",
      detail: "Gold chain top · leather drop.",
      answer:
        "Leather-and-chain strap — gold curb chain threaded with leather, dressy enough for evenings and still everyday wearable.",
      priceLabel: "$110",
      quickAddOptionId: "leather-chain-strap",
      image: {
        src: "/images/similar/leather-chain-strap.png",
        alt: "Coach leather and gold chain strap with black leather drop and gold hardware",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/similar/tabby-chain-crossbody.png",
        alt: "Tabby Shoulder Bag 26 with leather and chain strap",
        objectPosition: "center center",
      },
    },
    {
      id: "beaded-strap",
      label: "Beaded",
      detail: "Hand-beaded · pastel mix.",
      answer:
        "Hand-beaded crossbody strap in a pastel glass-bead mix — a playful, lightweight swap on the same hardware.",
      priceLabel: "$85",
      quickAddOptionId: "beaded-strap",
      image: {
        src: "/images/similar/beaded-strap.png",
        alt: "Coach hand-beaded crossbody strap in pastel pink, blue, and green glass beads",
        objectPosition: "center center",
        fit: "cover",
      },
      previewImage: {
        src: "/images/gallery/tabby-leather-product-alt.png",
        alt: "Tabby Shoulder Bag 26 with beaded crossbody strap",
        objectPosition: "center 42%",
      },
    },
  ] satisfies PdpStrapSimulationMode[],
  charms: [
    {
      id: "none",
      label: "No charm",
      priceLabel: "Included",
      stock: true,
      image: {
        src: "/images/gallery/tabby-make-it-yours-default.png",
        alt: "Tabby Shoulder Bag 26 without bag charms",
        objectPosition: "center center",
      },
    },
    {
      id: "cherry-charm",
      label: "Cherry charm",
      priceLabel: "$45",
      quickAddOptionId: "cherry-charm",
      image: {
        src: "/images/similar/cherry-charm.png",
        alt: "Coach cherry bag charm with red glitter cherries and gold hardware",
        objectPosition: "center center",
      },
    },
    {
      id: "heart-charm",
      label: "Heart charm",
      priceLabel: "$42",
      quickAddOptionId: "heart-charm",
      image: {
        src: "/images/similar/heart-charm.png",
        alt: "Coach puffy leather heart bag charm in pink with gold hardware",
        objectPosition: "center center",
      },
    },
    {
      id: "rexy-charm",
      label: "Rexy charm",
      priceLabel: "$58",
      quickAddOptionId: "rexy-charm",
      image: {
        src: "/images/similar/rexy-charm.png",
        alt: "Coach Rexy T-Rex bag charm in pale green leather with gold hardware",
        objectPosition: "center center",
      },
    },
    {
      id: "bow-charm",
      label: "Bow charm",
      priceLabel: "$48",
      quickAddOptionId: "bow-charm",
      image: {
        src: "/images/similar/bow-charm.png",
        alt: "Coach leather bow bag charm in blush pink with gold center hardware",
        objectPosition: "center center",
      },
    },
    {
      id: "strawberry-charm",
      label: "Strawberry charm",
      priceLabel: "$45",
      quickAddOptionId: "strawberry-charm",
      image: {
        src: "/images/similar/strawberry-charm.png",
        alt: "Coach strawberry bag charm in red glitter resin with gold leaf detail",
        objectPosition: "center center",
      },
    },
    {
      id: "tea-rose-charm",
      label: "Tea rose charm",
      priceLabel: "$52",
      quickAddOptionId: "tea-rose-charm",
      image: {
        src: "/images/similar/tea-rose-charm.png",
        alt: "Coach Tea Rose leather flower bag charm in cream and pink with gold center",
        objectPosition: "center center",
      },
    },
    {
      id: "star-charm",
      label: "Star charm",
      priceLabel: "$40",
      quickAddOptionId: "star-charm",
      image: {
        src: "/images/similar/star-charm.png",
        alt: "Coach wavy star bag charm in polished gold-tone metal",
        objectPosition: "center center",
      },
    },
    {
      id: "butterfly-charm",
      label: "Butterfly charm",
      priceLabel: "$50",
      quickAddOptionId: "butterfly-charm",
      image: {
        src: "/images/similar/butterfly-charm.png",
        alt: "Coach butterfly bag charm with blue and lavender enamel wings and gold trim",
        objectPosition: "center center",
      },
    },
  ] satisfies PdpStrapSimulationCharm[],
} as const;

/** What's in my bag — lifestyle carry stories, not inventory specs */
export const PDP_BAG_STORIES = {
  moment: "Everyday",
  title: "What's in my bag",
  intro: "Not a packing list — real moments, real carry.",
  stories: [
    {
      id: "saturday-morning",
      title: "Saturday morning",
      mood: "Farmers market, coffee run, nowhere to be.",
      image: {
        src: "/images/reviews/ugc-coffee-run.png",
        alt: "Tabby Shoulder Bag 26 on a Saturday coffee run",
        objectPosition: "center 40%",
      },
      items: ["sunglasses", "lip balm", "wallet", "keys"],
    },
    {
      id: "workday",
      title: "Workday",
      mood: "Desk to commute — headphones on, laptop light.",
      image: {
        src: "/images/gallery/tabby-leather-interior-packed.png",
        alt: "Tabby Shoulder Bag 26 packed for a workday",
        objectPosition: "center center",
      },
      items: ["notebook", "AirPods", "charger"],
    },
    {
      id: "dinner",
      title: "Dinner",
      mood: "Table for two — essentials only.",
      image: {
        src: "/images/gallery/tabby-patio-pink-dress.png",
        alt: "Tabby Shoulder Bag 26 worn out to dinner",
        objectPosition: "center 35%",
      },
      items: ["cardholder", "lipstick", "phone"],
    },
  ] satisfies PdpBagStory[],
} as const;

/** Editorial — everyday carry capacity */
const PDP_EVERYDAY_CARRY = {
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, keys, and everyday essentials",
  caption:
    "Designed for every day — however your Saturday, workday, or dinner plans unfold.",
} as const;

type PdpWearStyle = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Moment #3 — styling validation */
const PDP_HOW_TO_WEAR = {
  moment: "Moment #3",
  title: "How to wear it",
  caption: "One icon, multiple ways to wear it.",
  styles: [
    {
      id: "shoulder",
      label: "Shoulder carry",
      src: "/images/gallery/tabby-leather-on-model-tee.png",
      alt: "Tabby Shoulder Bag 26 worn on the shoulder",
    },
    {
      id: "crossbody",
      label: "Crossbody",
      src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
      alt: "Tabby Shoulder Bag 26 worn crossbody with a trench coat",
    },
    {
      id: "tucked-chain",
      label: "Strap detail",
      src: "/images/gallery/tabby-leather-product-alt.png",
      alt: "Tabby Shoulder Bag 26 with detachable leather strap detail",
    },
    {
      id: "dressed-up",
      label: "Dressed up",
      src: "/images/gallery/tabby-leather-on-model-laugh.png",
      alt: "Tabby Shoulder Bag 26 styled with a trench coat and plaid skirt",
    },
    {
      id: "casual-denim",
      label: "Coach tee",
      src: "/images/gallery/tabby-leather-on-model-tee.png",
      alt: "Tabby Shoulder Bag 26 with a Coach logo tee and suede skirt",
    },
  ] satisfies PdpWearStyle[],
} as const;

type PdpMaterialDetail = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

type PdpMaterialExploreZone = {
  id: string;
  label: string;
  detail: string;
  macroSrc: string;
  macroAlt: string;
  macroObjectPosition?: string;
  /** Hot zone on overview canvas (%) */
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Craftsmanship editorial — Material Story follows this slide */
const PDP_CRAFTSMANSHIP_EDITORIAL_SRC =
  "/images/gallery/tabby-leather-front-charm.png";

/** Moment #4 — touch-to-reveal leather macro exploration */
const PDP_MATERIAL_EXPLORATION = {
  moment: "Moment #4",
  title: "Material exploration",
  intro:
    "Drag across the leather to reveal grain, stitching, edge paint, and burnishing.",
  hint: "Drag anywhere to zoom",
  overview: {
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 glovetanned full-grain leather with gold C clasp hardware",
    objectPosition: "center center",
  },
  zones: [
    {
      id: "grain",
      label: "Grain",
      detail: "Full-grain pebble — soft, rich, and made to patina.",
      macroSrc: "/images/gallery/tabby-leather-back.png",
      macroAlt: "Macro full-grain pebbled leather texture",
      macroObjectPosition: "48% 42%",
      x: 12,
      y: 18,
      width: 38,
      height: 34,
    },
    {
      id: "stitching",
      label: "Stitching",
      detail: "Hand-finished saddle stitch along the accordion gusset.",
      macroSrc: "/images/gallery/tabby-leather-side-gusset.png",
      macroAlt: "Close-up of Tabby accordion gusset stitching",
      macroObjectPosition: "62% 38%",
      x: 52,
      y: 12,
      width: 34,
      height: 36,
    },
    {
      id: "edge-paint",
      label: "Edge paint",
      detail: "Painted edge for a clean silhouette and color depth.",
      macroSrc: "/images/gallery/tabby-leather-back-angle.png",
      macroAlt: "Painted leather edge on Tabby Shoulder Bag 26",
      macroObjectPosition: "82% 92%",
      x: 8,
      y: 64,
      width: 44,
      height: 24,
    },
    {
      id: "burnishing",
      label: "Burnishing",
      detail: "Burnished edge where leather meets hardware — polished to a soft sheen.",
      macroSrc: "/images/gallery/tabby-leather-detail-hardware.png",
      macroAlt: "Burnished leather edge near gold Tabby hardware",
      macroObjectPosition: "28% 74%",
      x: 54,
      y: 58,
      width: 36,
      height: 30,
    },
  ] satisfies PdpMaterialExploreZone[],
} as const;

type PdpLeatherAgingTrait = {
  id: "patina" | "softening" | "wear";
  label: string;
  detail: string;
};

type PdpLeatherAgingStageImage = {
  src: string;
  alt: string;
  objectPosition?: string;
  objectFit?: "contain" | "cover";
};

type PdpLeatherAgingStage = {
  id: string;
  label: string;
  timeline: string;
  summary: string;
  traits: PdpLeatherAgingTrait[];
  /** Optional stage photo — skips simulated wear overlays when set */
  image?: PdpLeatherAgingStageImage;
  visual: {
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
    patinaOpacity: number;
    patinaGradient: string;
    wearOpacity: number;
    wearGradient: string;
    softenOpacity: number;
    softenBlur: number;
    softenMask: string;
  };
};

/** Leather aging simulator — trust builder for long-term material quality */
const PDP_LEATHER_AGING_NEW_IMAGE = {
  src: "/images/gallery/tabby-leather-aging-new-day-one.jpg",
  alt: "Tabby Shoulder Bag 26 in black leather with gold C clasp hardware — new, day one",
  objectPosition: "center center",
  objectFit: "cover",
} as const satisfies PdpLeatherAgingStageImage;

const PDP_LEATHER_AGING_SIX_MONTHS_IMAGE = {
  src: "/images/gallery/tabby-leather-aging-six-months.jpg",
  alt: "Tabby Shoulder Bag 26 after six months of daily carry — softened leather with creasing and warm patina",
  objectPosition: "center center",
  objectFit: "cover",
} as const satisfies PdpLeatherAgingStageImage;

const PDP_LEATHER_AGING_TWO_YEARS_IMAGE = {
  src: "/images/gallery/tabby-leather-aging-two-years.jpg",
  alt: "Tabby Shoulder Bag 26 after two years of daily carry — rich patina and honest wear",
  objectPosition: "center center",
  objectFit: "cover",
} as const satisfies PdpLeatherAgingStageImage;

export const PDP_LEATHER_AGING = {
  moment: "Material",
  title: "How it evolves over time",
  intro:
    "Glovetanned full-grain leather develops character with daily carry — patina deepens, the hand softens, and wear tells your story.",
  image: PDP_LEATHER_AGING_NEW_IMAGE,
  stages: [
    {
      id: "new",
      label: "New",
      timeline: "Day one",
      summary:
        "Crisp grain, structured shape and factory-fresh. No special care needed yet.",
      image: PDP_LEATHER_AGING_NEW_IMAGE,
      traits: [
        {
          id: "patina",
          label: "Patina",
          detail: "Deep black finish — untouched pebble with a subtle factory sheen.",
        },
        {
          id: "softening",
          label: "Softening",
          detail: "Structured hand — holds its shape straight out of the box.",
        },
        {
          id: "wear",
          label: "Wear evolution",
          detail: "Clean edges and hardware — no creasing at closure or strap paths yet.",
        },
      ],
      visual: {
        brightness: 1.02,
        contrast: 1.08,
        saturate: 1.05,
        sepia: 0,
        patinaOpacity: 0,
        patinaGradient: "transparent",
        wearOpacity: 0,
        wearGradient: "transparent",
        softenOpacity: 0,
        softenBlur: 0,
        softenMask: "none",
      },
    },
    {
      id: "six-months",
      label: "6 months",
      timeline: "Six months in",
      summary:
        "Warm patina and a softer hand. A light clean and condition keeps leather supple as character develops.",
      image: PDP_LEATHER_AGING_SIX_MONTHS_IMAGE,
      traits: [
        {
          id: "patina",
          label: "Patina",
          detail: "Warm undertones along strap paths, corners, and clasp surround.",
        },
        {
          id: "softening",
          label: "Softening",
          detail: "Begins to relax — softer hand with subtle give at the gussets.",
        },
        {
          id: "wear",
          label: "Wear evolution",
          detail: "Light creasing at closure, strap anchors, and base corners.",
        },
      ],
      visual: {
        brightness: 1,
        contrast: 1,
        saturate: 1,
        sepia: 0,
        patinaOpacity: 0,
        patinaGradient: "transparent",
        wearOpacity: 0,
        wearGradient: "transparent",
        softenOpacity: 0,
        softenBlur: 0,
        softenMask: "none",
      },
    },
    {
      id: "two-years",
      label: "2 years",
      timeline: "Two years of carry",
      summary:
        "Rich depth, supple drape, honest creasing. Condition regularly to restore moisture and protect against drying.",
      image: PDP_LEATHER_AGING_TWO_YEARS_IMAGE,
      traits: [
        {
          id: "patina",
          label: "Patina",
          detail: "Rich charcoal depth with warm bronze undertones — character, not damage.",
        },
        {
          id: "softening",
          label: "Softening",
          detail: "Supple, broken-in drape — molds to your shoulder and daily essentials.",
        },
        {
          id: "wear",
          label: "Wear evolution",
          detail: "Honest crease map at handles, clasp zone, and high-contact edges.",
        },
      ],
      visual: {
        brightness: 0.91,
        contrast: 0.96,
        saturate: 0.82,
        sepia: 0.3,
        patinaOpacity: 0.82,
        patinaGradient:
          "radial-gradient(ellipse 48% 32% at 74% 16%, rgba(210, 158, 92, 0.52), transparent 74%), radial-gradient(ellipse 40% 28% at 22% 84%, rgba(184, 132, 78, 0.46), transparent 72%), radial-gradient(ellipse 34% 22% at 52% 48%, rgba(156, 116, 72, 0.34), transparent 70%), radial-gradient(ellipse 22% 16% at 38% 24%, rgba(128, 96, 60, 0.28), transparent 68%)",
        wearOpacity: 0.72,
        wearGradient:
          "linear-gradient(155deg, transparent 40%, rgba(0, 0, 0, 0.18) 46%, rgba(0, 0, 0, 0.08) 52%, transparent 58%), linear-gradient(20deg, transparent 52%, rgba(0, 0, 0, 0.16) 58%, transparent 64%), radial-gradient(ellipse 22% 12% at 66% 30%, rgba(0, 0, 0, 0.22), transparent 74%), radial-gradient(ellipse 16% 10% at 44% 68%, rgba(0, 0, 0, 0.18), transparent 72%)",
        softenOpacity: 0.55,
        softenBlur: 1.1,
        softenMask:
          "radial-gradient(ellipse 34% 20% at 66% 30%, black, transparent 74%), radial-gradient(ellipse 28% 16% at 30% 76%, black, transparent 72%), radial-gradient(ellipse 20% 12% at 50% 52%, black, transparent 70%)",
      },
    },
  ] satisfies PdpLeatherAgingStage[],
  /** Subtle care upsell — hidden at New, reveals on later timeline stages */
  careNudge: {
    productIds: ["coach-leather-cleaner", "coach-leather-conditioner"],
    help: {
      label: "Which do I need?",
      lines: [
        {
          productId: "coach-leather-cleaner",
          text: "Cleaner — lifts dirt and everyday grime without stripping natural oils.",
        },
        {
          productId: "coach-leather-conditioner",
          text: "Conditioner — restores moisture and keeps leather soft as patina develops.",
        },
      ],
    },
  },
} as const;

type PdpLeatherCleanerProduct = {
  id: string;
  name: string;
  detail: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
};

/** Coach leather care — lower-priority add-on pair for glovetanned bags */
export const PDP_LEATHER_CLEANER = {
  title: "Leather care",
  products: [
    {
      id: "coach-leather-cleaner",
      name: "Leather Cleaner",
      detail: "Removes surface dirt without stripping natural oils.",
      price: 16,
      imageSrc: "/images/products/coach-leather-cleaner.png",
      imageAlt: "Coach Leather Cleaner bottle — 4 fl. oz.",
    },
    {
      id: "coach-leather-conditioner",
      name: "Leather Conditioner",
      detail: "Conditions glovetanned leather to stay soft and resist drying.",
      price: 22,
      imageSrc: "/images/products/coach-leather-moisturizer.png",
      imageAlt: "Coach Leather Conditioner bottle — 4 fl. oz.",
    },
  ] satisfies PdpLeatherCleanerProduct[],
} as const;

export type PdpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Product FAQs — bottom-of-page accordion */
export const PDP_FAQ = {
  title: "FAQs",
  items: [
    {
      id: "what-fits",
      question: "What fits inside the Tabby Shoulder Bag 26?",
      answer:
        "Phone, wallet, keys, sunglasses, and a slim card case fit comfortably. The main compartment holds daily essentials; the back slip pocket keeps your phone within reach.",
    },
    {
      id: "straps-included",
      question: "Which straps are included?",
      answer:
        "Your Tabby comes with a detachable shoulder strap and crossbody strap in matching glovetanned leather. Additional chain and charm straps are available as add-ons.",
    },
    {
      id: "crossbody",
      question: "Can I wear it crossbody?",
      answer:
        "Yes. Clip on the included crossbody strap or swap to a chain strap for hands-free carry. Hardware is the same on every Tabby strap option.",
    },
    {
      id: "leather-care",
      question: "How do I care for glovetanned leather?",
      answer:
        "Wipe with a soft dry cloth after wear. For deeper cleaning, use Coach Leather Cleaner and follow with Leather Conditioner — both are formulated for glovetanned full-grain leather.",
    },
    {
      id: "returns",
      question: "What is the return policy?",
      answer:
        "Full-price items can be returned within 30 days with original receipt. Bags must be unworn with tags attached. Outlet purchases follow store policy — ask in store or chat for details.",
    },
    {
      id: "hardware",
      question: "Is the turnlock hardware durable?",
      answer:
        "The signature C turnlock is solid brass with a protective coating. It’s designed for daily open-and-close — the same hardware Coach has used on Tabby since the original archive design.",
    },
  ] satisfies PdpFaqItem[],
} as const;

type PdpWeightFeelEntry = {
  id: string;
  label: string;
  detail: string;
  icon: string;
};

/** Weight & feel — press-and-hold lift converts specs into sensation */
export const PDP_WEIGHT_FEEL = {
  moment: "Material",
  title: "Weight & feel",
  intro:
    "Hard to picture on a screen. Press and hold to lift — feel what everyday carry is like.",
  hint: "Press & hold to lift",
  holdMs: 720,
  hapticPattern: [14, 36, 18, 52, 22],
  image: {
    src: "/images/gallery/tabby-weight-lift-hand-hold.jpg",
    alt: "Hand lifting Tabby Shoulder Bag 26 by the strap — black leather with gold C clasp on a light gray background",
    objectPosition: "center 38%",
    backgroundColor: "#eeeeee",
  },
  liftedImage: {
    src: "/images/gallery/tabby-weight-lift-reveal.jpg",
    alt: "Hand lifting Tabby Shoulder Bag 26 after press and hold — black leather with gold C clasp on a light gray background",
    objectPosition: "center 38%",
    backgroundColor: "#eeeeee",
  },
  reveal: {
    headline: "Lighter than a 2 lb puppy.",
    subline: "Light enough for all-day crossbody, substantial enough to feel premium.",
    feelings: [
      {
        id: "in-hand",
        label: "In hand",
        detail: "Structured leather with balanced heft — not flimsy, not a burden.",
        icon: "back_hand",
      },
      {
        id: "on-shoulder",
        label: "On shoulder",
        detail: "Moves with you. No digging, no drag by end of day.",
        icon: "accessibility_new",
      },
      {
        id: "the-spec",
        label: "The spec, felt",
        detail: "1.8 lbs — about a full 16.9 oz water bottle.",
        icon: "water_full",
      },
    ] satisfies PdpWeightFeelEntry[],
  },
} as const;

/** @deprecated Use PDP_MATERIAL_EXPLORATION — kept for legacy references */
const PDP_MATERIAL_STORY = {
  moment: PDP_MATERIAL_EXPLORATION.moment,
  title: PDP_MATERIAL_EXPLORATION.title,
  caption: PDP_MATERIAL_EXPLORATION.intro,
  details: PDP_MATERIAL_EXPLORATION.zones.map((zone) => ({
    id: zone.id,
    label: zone.label,
    src: zone.macroSrc,
    alt: zone.macroAlt,
  })) satisfies PdpMaterialDetail[],
} as const;

export type PdpSignatureSound = {
  id: string;
  label: string;
  hint: string;
  playingHint: string;
  audioSrc: string;
  imageSrc: string;
  imageAlt: string;
  /** Full-bleed visual card instead of compact row */
  featured?: boolean;
  objectPosition?: string;
};

/** Product sounds — turnlock, zipper, opening (replace audio with studio recordings) */
export const PDP_SIGNATURE_SOUNDS = {
  title: "The Sounds of Tabby",
  sounds: [
    {
      id: "tabby-turnlock",
      label: "Signature clasp",
      hint: "click · snap",
      playingHint: "Tabby turnlock",
      audioSrc: "/audio/tabby-turnlock.mp3",
      imageSrc: "/images/gallery/tabby-sound-clasp-hands.jpg",
      imageAlt: "Fingers opening the gold Tabby C turnlock clasp on black glovetanned leather",
      featured: true,
      objectPosition: "center center",
    },
    {
      id: "tabby-zipper",
      label: "Precision zipper",
      hint: "Smooth brass hardware",
      playingHint: "Luxury zipper pull",
      audioSrc: "/audio/tabby-zipper.mp3",
      imageSrc: "/images/gallery/tabby-sound-zipper-coach-pull.jpg",
      imageAlt: "Gold Coach zipper pull on black glovetanned leather Tabby bag",
      featured: true,
      objectPosition: "center center",
    },
    {
      id: "tabby-leather-sound",
      label: "Soft leather",
      hint: "Grain · patina · touch",
      playingHint: "Leather texture",
      audioSrc: "/audio/tabby-bag-open.mp3",
      imageSrc: "/images/gallery/tabby-sound-leather-rub.jpg",
      imageAlt: "Hand rubbing glovetanned Tabby leather with a microfiber cloth near the gold C clasp",
      featured: true,
      objectPosition: "center center",
    },
  ] satisfies PdpSignatureSound[],
} as const;

/** Moment #5 — brand heritage */
const PDP_HERITAGE_STORY = {
  moment: "Moment #5",
  title: "Heritage story",
  src: "/images/gallery/tabby-leather-front-charm.png",
  alt: "Tabby Shoulder Bag 26 — a Coach icon reimagined for today",
  caption:
    "Inspired by a Coach design from the 1970s and reimagined for today.",
} as const;

export type PdpColorAvailability = "in_stock" | "low_stock" | "notify";

export type PdpColor = {
  id: string;
  name: string;
  swatch: string;
  hero: string;
  heroAlt: string;
  /** Sampled tone for bottom-bar color chrome */
  chromeSample: string;
  /** Mock inventory state for color picker UX */
  availability: PdpColorAvailability;
};

export function pdpColorIsSelectable(
  availability: PdpColorAvailability,
): boolean {
  return availability !== "notify";
}

export const PDP_COLOR_NOTIFY_TOAST =
  "We'll email you when this color is back in stock.";

export function pdpColorAvailabilityLabel(
  availability: PdpColorAvailability,
): string {
  switch (availability) {
    case "in_stock":
      return "In stock";
    case "low_stock":
      return "Only a few items left";
    case "notify":
      return "Sold out";
  }
}

export function pdpColorAvailabilityClass(
  availability: PdpColorAvailability,
): string {
  switch (availability) {
    case "in_stock":
      return "text-neutral-500";
    case "low_stock":
      return "text-amber-800";
    case "notify":
      return "text-neutral-600";
  }
}

export const PDP_COLORS: PdpColor[] = [
  {
    id: "black",
    name: "Black",
    swatch: "/images/colors/soft-tabby/black.png",
    hero: "/images/colors/soft-tabby/black.png",
    heroAlt: "Tabby Shoulder Bag 26 in black leather",
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "canyon",
    name: "Canyon",
    swatch: "/images/colors/soft-tabby/canyon.png",
    hero: "/images/colors/soft-tabby/canyon.png",
    heroAlt: "Tabby Shoulder Bag 26 in canyon suede",
    chromeSample: "#a34e3d",
    availability: "in_stock",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/images/colors/soft-tabby/oxblood.png",
    hero: "/images/colors/soft-tabby/oxblood.png",
    heroAlt: "Tabby Shoulder Bag 26 in oxblood leather",
    chromeSample: "#6b2c32",
    availability: "low_stock",
  },
  {
    id: "black-charm",
    name: "Black Charm",
    swatch: "/images/colors/soft-tabby/black-charm.png",
    hero: "/images/colors/soft-tabby/black-charm.png",
    heroAlt: "Tabby Shoulder Bag 26 in black with bag charms",
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "beaded",
    name: "Beaded Floral",
    swatch: "/images/colors/soft-tabby/beaded.png",
    hero: "/images/colors/soft-tabby/beaded.png",
    heroAlt: "Tabby Shoulder Bag 26 in beaded floral",
    chromeSample: "#8a7a6a",
    availability: "notify",
  },
  {
    id: "tan-fringe",
    name: "Tan Fringe",
    swatch: "/images/colors/soft-tabby/tan-fringe.png",
    hero: "/images/colors/soft-tabby/tan-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in tan suede with fringe",
    chromeSample: "#c4a06a",
    availability: "in_stock",
  },
  {
    id: "black-fringe",
    name: "Black Fringe",
    swatch: "/images/colors/soft-tabby/black-fringe.png",
    hero: "/images/colors/soft-tabby/black-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in black suede with fringe",
    chromeSample: "#1a1a1a",
    availability: "low_stock",
  },
  {
    id: "olive",
    name: "Olive",
    swatch: "/images/colors/soft-tabby/olive.png",
    hero: "/images/colors/soft-tabby/olive.png",
    heroAlt: "Tabby Shoulder Bag 26 in olive suede",
    chromeSample: "#556847",
    availability: "in_stock",
  },
  {
    id: "mustard",
    name: "Mustard",
    swatch: "/images/colors/soft-tabby/mustard.png",
    hero: "/images/colors/soft-tabby/mustard.png",
    heroAlt: "Tabby Shoulder Bag 26 in mustard suede",
    chromeSample: "#c9a227",
    availability: "notify",
  },
];

const PDP_MEDIA_SLIDES = [
  {
    src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
    alt: "Model wearing Tabby Shoulder Bag 26 in black full-grain leather",
  },
  {
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Tabby Shoulder Bag 26 styled on model",
  },
  {
    src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    alt: "Handbag product detail",
  },
  {
    src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    alt: "Coach bag on model",
  },
  {
    src: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80",
    alt: "Luxury handbag lifestyle shot",
  },
] as const;

export const DEFAULT_COLOR_ID = "black";

export type PdpUgcStory = {
  id: string;
  src: string;
  alt: string;
  objectPosition?: string;
  /** Short lifestyle tag — e.g. "Saturday coffee run" */
  context: string;
  scenario: string;
  wearer: string;
  colorway: string;
  carry: string;
  quote?: string;
  verified?: boolean;
};

export type PdpUgcVideo = {
  id: string;
  src: string;
  poster: string;
  alt: string;
  /** TikTok-style handle */
  handle: string;
  /** Short lifestyle tag on the clip */
  context: string;
  verified?: boolean;
};

/** Swipeable UGC clips in the gallery — TikTok-style vertical videos */
export const PDP_UGC_VIDEO_CAROUSEL = {
  title: "Carried by the community",
  followCta: {
    label: "Follow us on TikTok",
    href: "https://www.tiktok.com/@coach",
  },
  videos: [
    {
      id: "ugc-lolalilylang",
      src: "/videos/ugc-lolalilylang.mp4",
      poster: "/images/reviews/ugc-lolalilylang.png",
      alt: "TikTok creator @lolalilylang styling Tabby Shoulder Bag 26",
      handle: "@lolalilylang",
      context: "Tabby styling",
      verified: true,
    },
    {
      id: "ugc-itsnani333",
      src: "/videos/ugc-itsnani333.mp4",
      poster: "/images/reviews/ugc-itsnani333.png",
      alt: "TikTok creator @itsnani333 styling Tabby Shoulder Bag 26",
      handle: "@itsnani333",
      context: "Tabby styling",
      verified: true,
    },
    {
      id: "ugc-katiemcev0y",
      src: "/videos/ugc-katiemcev0y.mp4",
      poster: "/images/reviews/ugc-katiemcev0y.png",
      alt: "TikTok creator @katiemcev0y styling Tabby Shoulder Bag 26",
      handle: "@katiemcev0y",
      context: "Tabby styling",
      verified: true,
    },
    {
      id: "ugc-rachblaire",
      src: "/videos/ugc-rachblaire.mp4",
      poster: "/images/reviews/ugc-rachblaire.png",
      alt: "TikTok creator @rachblaire styling Tabby Shoulder Bag 26",
      handle: "@rachblaire",
      context: "Tabby styling",
      verified: true,
    },
  ] satisfies PdpUgcVideo[],
} as const;

export type PdpAsSeenOnCelebrity = {
  id: string;
  name: string;
  /** Where or how they wore it — event, show, street style */
  context: string;
  src: string;
  alt: string;
  objectPosition?: string;
};

/** Celebrity and editorial sightings — who's carrying Tabby and where */
export const PDP_AS_SEEN_ON = {
  title: "As seen on",
  celebrities: [
    {
      id: "selena-gomez",
      name: "Selena Gomez",
      context: "NYC street style",
      src: "/images/gallery/mode22.png",
      alt: "Selena Gomez carrying Tabby Shoulder Bag 26 on a New York City street",
      objectPosition: "center 35%",
    },
    {
      id: "jennifer-lopez",
      name: "Jennifer Lopez",
      context: "Coach Fall campaign",
      src: PDP_GALLERY_ON_MODEL_TRENCH_IMAGE,
      alt: "Jennifer Lopez with Tabby Shoulder Bag 26 in a tan trench coat",
      objectPosition: "center 40%",
    },
    {
      id: "lil-nas-x",
      name: "Lil Nas X",
      context: "Met Gala after-party",
      src: "/images/gallery/tabby-leather-on-model-tee.png",
      alt: "Lil Nas X wearing Tabby Shoulder Bag 26 with a graphic tee",
      objectPosition: "center 42%",
    },
    {
      id: "emma-chamberlain",
      name: "Emma Chamberlain",
      context: "Everyday carry",
      src: "/images/gallery/tabby-leather-on-model-laugh.png",
      alt: "Emma Chamberlain laughing with Tabby Shoulder Bag 26 on shoulder",
      objectPosition: "center 38%",
    },
    {
      id: "hunter-schafer",
      name: "Hunter Schafer",
      context: "Paris Fashion Week",
      src: "/images/gallery/hero-model-bomber.png",
      alt: "Hunter Schafer with Tabby Shoulder Bag 26 at Paris Fashion Week",
      objectPosition: "center 30%",
    },
  ] satisfies PdpAsSeenOnCelebrity[],
} as const;

/** UGC with context — who's wearing it, how, and where */
const PDP_UGC_CONTEXT = {
  moment: "Community",
  title: "In real life",
  intro: "Not random customer photos — context for who's wearing it, how, and where.",
  stories: [
    {
      id: "coffee-run",
      src: "/images/reviews/ugc-coffee-run.png",
      alt: "Customer in a brown track jacket and plaid skirt with Tabby Shoulder Bag 26 outside a coffee shop",
      objectPosition: "center 42%",
      context: "Saturday coffee run",
      scenario: "Farmers market loop — crossbody, hands free for an iced latte.",
      wearer: "Jordan L. · Brooklyn",
      colorway: "Black Tabby 26",
      carry: "Crossbody",
      quote: "My go-to for slow weekend mornings.",
      verified: true,
    },
    {
      id: "city-commute",
      src: "/images/reviews/ugc-on-street.png",
      alt: "Customer at Spring St subway station with Tabby Shoulder Bag 26 and coffee in hand",
      objectPosition: "center 38%",
      context: "City commute",
      scenario: "Subway to office — shoulder carry, structured enough for meetings.",
      wearer: "Alex R. · NYC",
      colorway: "Black Tabby 26",
      carry: "Shoulder",
      quote: "Reads polished without feeling precious.",
      verified: true,
    },
    {
      id: "mirror-selfie",
      src: "/images/reviews/ugc-mirror-selfie.png",
      alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
      context: "Getting ready",
      scenario: "Night out prep — short strap, higher on the hip.",
      wearer: "Mia T. · Austin",
      colorway: "Black Tabby 26",
      carry: "Short strap",
      verified: true,
    },
    {
      id: "outfit-flat",
      src: "/images/reviews/ugc-outfit-flat.png",
      alt: "Customer outfit flat lay with Tabby Shoulder Bag 26",
      context: "OOTD flat lay",
      scenario: "Weekend plans laid out — bag anchors the whole look.",
      wearer: "Sam K. · Denver",
      colorway: "Black Tabby 26",
      carry: "Crossbody",
    },
    {
      id: "unboxing",
      src: "/images/reviews/ugc-coach-x-artist-box.png",
      alt: "Customer unboxing Coach x artist Tabby bag",
      context: "Unboxing day",
      scenario: "First impression — tissue paper, hardware gleam, straps ready to swap.",
      wearer: "Renee P. · Atlanta",
      colorway: "Artist collab Tabby",
      carry: "Shoulder",
      quote: "Even the box felt giftable.",
      verified: true,
    },
    {
      id: "at-home",
      src: "/images/reviews/ugc-white-tabby-home.png",
      alt: "Customer photo of chalk Tabby bag at home",
      context: "At home",
      scenario: "Soft morning light — chalk leather against neutral interiors.",
      wearer: "Taylor M. · Portland",
      colorway: "Chalk Tabby",
      carry: "Shoulder",
    },
  ] satisfies PdpUgcStory[],
} as const;

type PdpCommunityMediaItem = {
  id: string;
  label: string;
  type: "photo" | "video";
  src: string;
  alt: string;
  poster?: string;
  context?: string;
  scenario?: string;
  wearer?: string;
  colorway?: string;
  carry?: string;
  quote?: string;
  verified?: boolean;
};

/** Moment #6 — community validation with contextual UGC */
const PDP_COMMUNITY_VALIDATION = {
  moment: "Moment #6",
  title: "Community validation",
  caption: "Real people, real context — not random snaps.",
  items: [
    {
      id: PDP_UGC_CONTEXT.stories[1]!.id,
      label: PDP_UGC_CONTEXT.stories[1]!.context,
      type: "photo",
      src: PDP_UGC_CONTEXT.stories[1]!.src,
      alt: PDP_UGC_CONTEXT.stories[1]!.alt,
      context: PDP_UGC_CONTEXT.stories[1]!.context,
      scenario: PDP_UGC_CONTEXT.stories[1]!.scenario,
      wearer: PDP_UGC_CONTEXT.stories[1]!.wearer,
      colorway: PDP_UGC_CONTEXT.stories[1]!.colorway,
      carry: PDP_UGC_CONTEXT.stories[1]!.carry,
      quote: PDP_UGC_CONTEXT.stories[1]!.quote,
      verified: PDP_UGC_CONTEXT.stories[1]!.verified,
    },
    {
      id: "creator-video",
      label: "Creator styling",
      type: "video",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/hero-modelshot.png",
      alt: "Creator styling Tabby Shoulder Bag 26 in a short video",
      context: "Creator styling",
      scenario: "Crossbody with denim — how she wears Tabby week to week.",
      wearer: "@stylebyjess",
      colorway: "Black Tabby 26",
      carry: "Crossbody",
    },
    {
      id: PDP_UGC_CONTEXT.stories[0]!.id,
      label: PDP_UGC_CONTEXT.stories[0]!.context,
      type: "photo",
      src: PDP_UGC_CONTEXT.stories[0]!.src,
      alt: PDP_UGC_CONTEXT.stories[0]!.alt,
      context: PDP_UGC_CONTEXT.stories[0]!.context,
      scenario: PDP_UGC_CONTEXT.stories[0]!.scenario,
      wearer: PDP_UGC_CONTEXT.stories[0]!.wearer,
      colorway: PDP_UGC_CONTEXT.stories[0]!.colorway,
      carry: PDP_UGC_CONTEXT.stories[0]!.carry,
      quote: PDP_UGC_CONTEXT.stories[0]!.quote,
      verified: PDP_UGC_CONTEXT.stories[0]!.verified,
    },
  ] satisfies PdpCommunityMediaItem[],
} as const;

export type PdpReviewPhoto = {
  src: string;
  alt: string;
};

/** Pexels model portraits — placeholder profile avatars for review authors */
const PDP_COMMENT_AUTHOR_AVATARS: Record<string, string> = {
  "Maren K.": "/images/avatars/maren-k.jpg",
  "Jules T.": "/images/avatars/jules-t.jpg",
  "Priya S.": "/images/avatars/priya-s.jpg",
  "Elena R.": "/images/avatars/elena-r.jpg",
  "Danielle M.": "/images/avatars/danielle-m.jpg",
  "Sofia L.": "/images/avatars/sofia-l.jpg",
  "Hannah W.": "/images/avatars/hannah-w.jpg",
  "Taylor B.": "/images/avatars/taylor-b.jpg",
  "Nicole A.": "/images/avatars/nicole-a.jpg",
  "Rachel P.": "/images/avatars/rachel-p.jpg",
  "Amanda C.": "/images/avatars/amanda-c.jpg",
  "Lily H.": "/images/avatars/lily-h.jpg",
  You: "/images/avatars/you.jpg",
};

export function getCommentAuthorAvatar(author: string) {
  return PDP_COMMENT_AUTHOR_AVATARS[author.trim()];
}

export type PdpCustomerComment = {
  id: string;
  quote: string;
  author: string;
  date: string;
  verified?: boolean;
  photos?: PdpReviewPhoto[];
  likes: number;
};

export type PdpFeaturedReview = {
  id: string;
  rating?: number;
  title?: string;
  body?: string;
  quote: string;
  recommendTags?: string[];
  author: string;
  date: string;
  verified?: boolean;
  photos?: PdpReviewPhoto[];
  likes: number;
};

export const PDP_CUSTOMER_REVIEWS: PdpFeaturedReview[] = [
  {
    id: "jules",
    rating: 5,
    title: "My go-to weekend bag",
    body: "Took this on a long weekend — crossbody during travel, shoulder for dinners. The strap adjusts easily and the interior fits everything I need without looking bulky.",
    quote: "Weekend trip tested. Crossbody all day, zero issues 💯",
    recommendTags: ["Weekend travel", "Strap versatility", "Everyday carry"],
    author: "Jules T.",
    date: "Sep 28, 2025",
    verified: true,
    likes: 9_400,
  },
  {
    id: "priya",
    rating: 5,
    title: "Even prettier in person",
    body: "The pebbled leather has more depth in real life than the product photos show. The C clasp feels weighty and the quilt lines are crisp. I've worn it crossbody for two weeks straight.",
    quote: "The leather in person >>> photos 😍",
    recommendTags: ["True to photos", "Leather quality", "Gift-worthy"],
    author: "Priya S.",
    date: "Sep 14, 2025",
    verified: true,
    likes: 25_700,
    photos: [
      {
        src: "/images/reviews/ugc-pillow-tabby-ombre.png",
        alt: "Customer photo of pink ombre Pillow Tabby shoulder bag",
      },
    ],
  },
  {
    id: "elena",
    rating: 4,
    title: "Beautiful hardware, snug pocket",
    body: "The C clasp feels substantial and satisfying every time I open the bag. My only wish is a slightly roomier interior pocket, but the overall quality makes it an easy recommend.",
    quote: "C clasp feels so good. Pocket could be bigger but still obsessed 🤍",
    recommendTags: ["Hardware quality", "Compact size"],
    author: "Elena R.",
    date: "Aug 30, 2025",
    likes: 19,
  },
  {
    id: "danielle",
    rating: 5,
    title: "Sleek but surprisingly spacious",
    body: "Phone, wallet, keys, and sunglasses all fit without the bag losing its shape. The silhouette stays clean even when fully packed.",
    quote: "Phone, wallet, keys, sunglasses — all in, still looks sleek 👏",
    recommendTags: ["Everyday carry", "Organization"],
    author: "Danielle M.",
    date: "Aug 18, 2025",
    likes: 34,
  },
  {
    id: "sofia",
    rating: 5,
    title: "The black goes with everything",
    body: "Soft leather, easy to dress up or down. I reach for this more than any other bag in my closet right now.",
    quote: "Black goes with literally everything 🖤 soft leather too",
    recommendTags: ["Versatile styling", "Soft leather"],
    author: "Sofia L.",
    date: "Jul 22, 2025",
    likes: 21,
  },
  {
    id: "hannah",
    rating: 5,
    title: "Worth the treat-yourself moment",
    body: "Packaging felt premium from the moment it arrived. The cherry charm pairing sold me — this has become my default going-out bag.",
    quote: "Treat yourself purchase, zero regrets. Cherry charm = chef's kiss 🍒",
    recommendTags: ["Gift-worthy", "Charm styling", "Premium feel"],
    author: "Hannah W.",
    date: "Jul 9, 2025",
    verified: true,
    likes: 15_800,
  },
  {
    id: "taylor",
    rating: 4,
    title: "Classic Tabby, easy strap swap",
    body: "Shoulder to crossbody takes seconds. Hardware feels durable and the leather has held up well through daily use.",
    quote: "Classic Tabby vibes, easy strap swap shoulder ↔ crossbody 👌",
    recommendTags: ["Strap versatility", "Durability"],
    author: "Taylor B.",
    date: "Jun 25, 2025",
    likes: 15,
  },
  {
    id: "nicole",
    rating: 5,
    title: "Perfect tote alternative",
    body: "I downsized from a larger tote and this carries errands without feeling too small. The structure keeps everything easy to find.",
    quote: "Downsized from a tote and this is the one for errands 🙌",
    recommendTags: ["Everyday carry", "Compact size"],
    author: "Nicole A.",
    date: "Jun 3, 2025",
    likes: 38,
  },
  {
    id: "rachel",
    rating: 5,
    title: "Gold on black is stunning",
    body: "The hardware against the black leather photographs beautifully and looks even better in person. Gets compliments every time I wear it.",
    quote: "Gold hardware on black leather? Stunning ✨",
    recommendTags: ["Hardware quality", "Statement piece"],
    author: "Rachel P.",
    date: "May 19, 2025",
    likes: 31,
  },
  {
    id: "amanda",
    rating: 4,
    title: "Beautiful unboxing, perfect strap drop",
    body: "Arrived thoughtfully packaged. At 5'6\" the strap length sits exactly where I want it for shoulder carry.",
    quote: "Packaged beautifully, strap length is perfect on me (5'6\") 📦",
    recommendTags: ["Strap fit", "Premium packaging"],
    author: "Amanda C.",
    date: "May 2, 2025",
    likes: 12,
  },
  {
    id: "lily",
    rating: 5,
    title: "Brunch to dinner, one bag",
    body: "Compact enough for daytime but polished enough for evening. This replaced two bags in my rotation.",
    quote: "Default going-out bag now. Coffee run to dinner 🥂",
    recommendTags: ["Day to night", "Versatile styling"],
    author: "Lily H.",
    date: "Apr 14, 2025",
    likes: 26,
  },
];

/** Reddit-style community comments — separate from formal buyer reviews */
export const PDP_CUSTOMER_COMMENTS: PdpCustomerComment[] = [
  {
    id: "maren",
    quote: "me walking out with this bag 😭",
    author: "Maren K.",
    date: "Oct 12, 2025",
    verified: true,
    likes: 31_400,
    photos: [
      {
        src: "/images/reviews/comment-cat.gif",
        alt: "Nyan Cat uploaded with comment",
      },
    ],
  },
  {
    id: "devon",
    quote: "the cherry charm with the silver tabby >>> 😭",
    author: "Devon R.",
    date: "Oct 5, 2025",
    likes: 8_420,
  },
  {
    id: "alex",
    quote: "why is this sold out in black every time",
    author: "Alex T.",
    date: "Sep 30, 2025",
    likes: 156,
  },
  {
    id: "morgan",
    quote: "manifesting this for my birthday 🎂",
    author: "Morgan L.",
    date: "Sep 22, 2025",
    likes: 89,
  },
  {
    id: "jordan",
    quote: "quilted tabby or pebbled — help me choose",
    author: "Jordan P.",
    date: "Sep 18, 2025",
    likes: 42,
  },
];

export type PdpReviewReply = {
  id: string;
  author: string;
  quote: string;
  date: string;
  likes: number;
  verified?: boolean;
};

/** Nested replies keyed by parent comment id */
export const PDP_COMMENT_REPLIES: Record<string, PdpReviewReply[]> = {
  maren: [
    {
      id: "maren-r1",
      author: "Sofia L.",
      quote: "Does the strap adjust easily?",
      date: "Oct 12, 2025",
      likes: 6,
    },
    {
      id: "maren-r2",
      author: "Coach",
      quote: "Yes — two drop lengths on the chain strap 🖤",
      date: "Oct 12, 2025",
      likes: 18,
      verified: true,
    },
    {
      id: "maren-r3",
      author: "Jules T.",
      quote: "Second this. I swap to crossbody every weekend.",
      date: "Oct 13, 2025",
      likes: 4,
      verified: true,
    },
    {
      id: "maren-r4",
      author: "Maren K.",
      quote: "@Jules the cherry chain for nights out 🍒",
      date: "Oct 13, 2025",
      likes: 9,
      verified: true,
    },
    {
      id: "maren-r5",
      author: "Nicole A.",
      quote: "Adding to cart rn",
      date: "Oct 13, 2025",
      likes: 3,
    },
    {
      id: "maren-r6",
      author: "Taylor B.",
      quote: "How smooth is the zipper day to day?",
      date: "Oct 14, 2025",
      likes: 2,
    },
    {
      id: "maren-r7",
      author: "Hannah W.",
      quote: "No snagging — lining feels durable too",
      date: "Oct 14, 2025",
      likes: 7,
    },
    {
      id: "maren-r8",
      author: "Elena R.",
      quote: "The quilting hits different in person ✨",
      date: "Oct 14, 2025",
      likes: 5,
    },
    {
      id: "maren-r9",
      author: "Rachel P.",
      quote: "Need this in black ASAP",
      date: "Oct 15, 2025",
      likes: 4,
    },
    {
      id: "maren-r10",
      author: "Priya S.",
      quote: "Black was back in stock last week 👀",
      date: "Oct 15, 2025",
      likes: 11,
      verified: true,
    },
    {
      id: "maren-r11",
      author: "Amanda C.",
      quote: "Same size as the 20? Asking for my sister",
      date: "Oct 16, 2025",
      likes: 2,
    },
  ],
};

const PDP_FEATURED_REVIEWS = PDP_CUSTOMER_REVIEWS.slice(0, 2);

export const PDP_REVIEWS_SUMMARY = {
  average: 4.8,
  count: 128,
  recommendPercent: 94,
} as const;

export const PDP_LIKE_SUMMARY = {
  count: 1_200_000,
  label: "1.2M",
} as const;

export const PDP_SAVE_SUMMARY = {
  count: 3_396,
  label: "3.4k",
} as const;

export const PDP_COMMENTS_SUMMARY = {
  count: 128,
  label: "128",
} as const;

export const PDP_REVIEWS_AI_SUMMARY = {
  headline: "What our customers think",
  body: "Many note that Tabby Shoulder Bag 26 is a refined, well-crafted bag that strikes an appealing balance between structure and style. The full-grain pebbled leather and signature C clasp stand out as premium touches.",
  attribution: "Buyer highlights, summarized by AI",
} as const;

const PDP_REVIEWS_RATING_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
] as const;

/** Reviews carousel — contextual UGC from PDP_UGC_CONTEXT */
export const PDP_UGC_REVIEW_STORIES: PdpUgcStory[] = [
  {
    id: "desk-to-gym",
    src: "/images/reviews/ugc-pink-tabby-stanley.png",
    alt: "Customer photo of pink quilted Tabby styled with a Stanley tumbler",
    context: "Desk to gym",
    scenario: "Workday to workout — quilted Tabby with a Stanley in tow.",
    wearer: "Casey W. · Chicago",
    colorway: "Pink quilted Tabby",
    carry: "Crossbody",
    verified: true,
  },
  {
    id: "dressed-up",
    src: "/images/reviews/ugc-silver-quilted-charm.png",
    alt: "Customer photo of silver quilted Tabby with cherry bag charm",
    context: "Dressed up",
    scenario: "Evening plans — silver quilt with a cherry charm pop.",
    wearer: "Nina D. · LA",
    colorway: "Silver quilted Tabby",
    carry: "Shoulder",
    quote: "The charm makes it feel personal.",
  },
  PDP_UGC_CONTEXT.stories[0]!,
  PDP_UGC_CONTEXT.stories[1]!,
  PDP_UGC_CONTEXT.stories[2]!,
];

/** @deprecated Use PDP_UGC_REVIEW_STORIES — plain src/alt for legacy callers */
const PDP_REVIEW_PHOTOS: PdpReviewPhoto[] = PDP_UGC_REVIEW_STORIES.map(
  (story) => ({
    src: story.src,
    alt: story.alt,
  }),
);

