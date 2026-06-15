export const PDP_PRODUCT = {
  name: "Tabby Shoulder Bag 26",
  subtitle: "Our signature shoulder bag in full-grain leather.",
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
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
    defaultSelected: true,
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: 68,
    imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
    imageAlt: "Gold chain strap with leather weave detail",
    defaultSelected: false,
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: 42,
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Gold heart bag charm on chain",
    defaultSelected: false,
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: 52,
    imageSrc: "/images/gallery/tabby-leather-interior-packed.png",
    imageAlt: "Compact card case with bag clip attachment",
    defaultSelected: false,
  },
];

export type PdpBagSizeHotspot = {
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
export const PDP_BAG_SIZE = {
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

export type PdpFamilySizeOption = {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

/** Tabby family size picker — Mini / Medium / Large silhouettes */
export const PDP_FAMILY_SIZES = {
  title: "Also available in this family",
  selectedId: "medium",
  options: [
    {
      id: "mini",
      label: "Mini",
      imageSrc: "/images/similar/tabby-chain-crossbody.png",
      imageAlt: "Tabby Mini chain crossbody bag",
    },
    {
      id: "medium",
      label: "Medium",
      imageSrc: PDP_PRODUCT.imageSrc,
      imageAlt: PDP_PRODUCT.imageAlt,
    },
    {
      id: "large",
      label: "Large",
      imageSrc: "/images/gallery/tabby-model-full.png",
      imageAlt: "Tabby Large shoulder bag on model",
    },
  ] satisfies PdpFamilySizeOption[],
} as const;

export const PDP_COMPARE_TEASER = {
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

export const PDP_COMPLETE_THE_LOOK = {
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

export type PdpFamilyCompareAlternative = PdpCompareItem & {
  shortName: string;
  differences: PdpCompareDifferenceRow[];
  aiInsight: {
    title: string;
    body: string;
  };
};

export const PDP_COMPARE_CATEGORIES = [
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
  imageSrc: PDP_PRODUCT.imageSrc,
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
    differences: [
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Larger",
        advantage: "selected",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Work",
        advantage: "selected",
      },
      {
        id: "structured-shape",
        label: "Structured shape",
        display: "Yes",
        advantage: "selected",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$595"),
      {
        id: "strap-options",
        label: "Strap options",
        display: "More",
        advantage: "selected",
      },
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
    differences: [
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Evenings",
        advantage: "alternative",
      },
      {
        id: "structured-shape",
        label: "Structured shape",
        display: "Yes",
        advantage: "selected",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$650"),
      {
        id: "strap-options",
        label: "Strap options",
        display: "More",
        advantage: "selected",
      },
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
    differences: [
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Occasions",
        advantage: "alternative",
      },
      {
        id: "structured-shape",
        label: "Structured shape",
        display: "Yes",
        advantage: "selected",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$695"),
      {
        id: "strap-options",
        label: "Strap options",
        display: "Fewer",
        advantage: "alternative",
      },
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
    differences: [
      {
        id: "carry-capacity",
        label: "Carry capacity",
        display: "Same",
        advantage: "neutral",
      },
      {
        id: "weight",
        label: "Weight",
        display: "Similar",
        advantage: "neutral",
      },
      {
        id: "best-for",
        label: "Best for",
        display: "Everyday",
        advantage: "neutral",
      },
      {
        id: "structured-shape",
        label: "Structured shape",
        display: "Yes",
        advantage: "selected",
      },
      buildPriceDifferenceRow(PDP_COMPARE_SELECTED.price, "$550"),
      {
        id: "strap-options",
        label: "Charm styling",
        display: "Pre-styled",
        advantage: "alternative",
      },
    ],
    aiInsight: {
      title: "Based on your browsing",
      body: "Same bag, different vibe — the charms edition is ready to gift; black Tabby 26 lets you build your own pairing.",
    },
  },
];

/** @deprecated Carousel compare — use PDP_FAMILY_COMPARE_ALTERNATIVES */
export const PDP_COMPARE_OPTIONS: PdpCompareItem[] = [
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
export const PDP_SIMILAR_ITEMS: PdpSimilarItem[] = [
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
export const PDP_YMAL = {
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

export const PDP_SHOPPING_ASSISTANT_PROMPT = {
  title: "Still deciding?",
  body: "Tell us what you're looking for and we'll narrow it down.",
  cta: "Open shopping assistant",
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
    imageSrc: "/images/gallery/tabby-on-model-plaid.png",
    imageAlt: "Rowan satchel styled on model",
    viewedLabel: "Today",
  },
  {
    id: "brooklyn-shoulder",
    name: "Brooklyn Shoulder Bag 34",
    price: "$450",
    imageSrc: "/images/gallery/tabby-patio-pink-dress.png",
    imageAlt: "Brooklyn shoulder bag on model",
    viewedLabel: "Yesterday",
  },
  {
    id: "kira-crossbody",
    name: "Kira Crossbody",
    price: "$298",
    imageSrc: "/images/gallery/tabby-on-model-back.png",
    imageAlt: "Kira crossbody bag on model",
    viewedLabel: "2 days ago",
  },
  {
    id: "morgan-hobo",
    name: "Morgan Hobo",
    price: "$425",
    imageSrc: "/images/gallery/tabby-hero-model.png",
    imageAlt: "Morgan hobo bag on model",
    viewedLabel: "Last week",
  },
  {
    id: "field-tote",
    name: "Field Tote 40",
    price: "$495",
    imageSrc: "/images/gallery/tabby-model-full.png",
    imageAlt: "Field tote styled with denim",
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
export const PDP_PRODUCT_SEARCH = {
  title: PDP_AI_CONCIERGE.title,
  placeholder: PDP_AI_CONCIERGE.placeholder,
  suggestions: PDP_AI_CONCIERGE.prompts.map((prompt) => prompt.question),
} as const;

/** Gallery hero — on-model lifestyle, bomber + shearling */
export const PDP_GALLERY_HERO_IMAGE = "/images/gallery/hero-model-bomber.png";

/** Hero framing — portrait on-model, bias right so model fills mobile cover */
export const PDP_GALLERY_HERO_IMAGE_FOCUS = {
  objectPosition: "72% 34%",
  scale: 1,
  translateY: "0%",
} as const;

/** Full-bleed rotating product video for Gallery tab */
export const PDP_GALLERY_HERO_VIDEO = "/videos/soft-tabby-360.webm";

/** Capacity showcase — what fits inside the bag */
export const PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO = "/videos/what-fits-inside.webm";

/** Highlight montage — styling, details, and product moments */
export const PDP_GALLERY_SHOWCASE_VIDEO = "/videos/soft-tabby-showcase.webm";

/** Match studio backdrop so letterboxing feels seamless */
export const PDP_GALLERY_VIDEO_BG = "#e9e9e9";

/** Tailwind class for studio product photography frames */
export const PDP_STUDIO_BACKDROP_CLASS = "bg-[#e9e9e9]";

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
export const PDP_PRODUCT_IMMERSIVE_HOTSPOTS: PdpProductHotspot[] = [
  {
    id: "c-clasp",
    x: 44,
    y: 66,
    title: "The iconic C",
    body: "Inspired by a turn-lock from Coach archives, the sculpted C clasp became Tabby's signature when the silhouette returned in 2018.",
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
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
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

export type PdpGalleryProductCollageTile = {
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
export const PDP_GALLERY_HERO_FOLLOWUP_IMAGE =
  "/images/gallery/tabby-leather-on-model-laugh.png";

/** Product hero — front view with charm (posters, compare, hotspots) */
export const PDP_GALLERY_PRODUCT_IMMERSIVE =
  "/images/gallery/tabby-leather-front-charm.png";

/** Native 9:16 studio product shot — 2nd frame in scroll (below hero) */
export const PDP_GALLERY_PRODUCT_FRONT_IMAGE =
  "/images/gallery/tabby-product-front-916.jpg";

/** Lead product shot — first frame below hero (native 9:16) */
export const PDP_GALLERY_DRAG_ZOOM_HINT = "Drag anywhere to zoom";

export const PDP_GALLERY_PRODUCT_FRONT_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: PDP_GALLERY_PRODUCT_FRONT_IMAGE,
  alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view with gold C turnlock clasp and detachable straps",
  objectPosition: "center",
  scale: "scale-100",
  headerSurface: "light",
  dragZoom: true,
};

/** On-model — 3rd frame in scroll (below hero + product front) */
export const PDP_GALLERY_ON_MODEL_DENIM_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/mode22.png",
  alt: "Model wearing Tabby Shoulder Bag 26 crossbody with a Coach tee and suede mini skirt",
  objectPosition: "center top",
};

/** On-model trench + plaid — first frame below hero */
export const PDP_GALLERY_ON_MODEL_FULL_DENIM_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-on-model-trench.png",
  alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
  objectPosition: "center top",
};

/** Interior open — fourth frame below hero */
export const PDP_GALLERY_INTERIOR_OPEN_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-interior-open.png",
  alt: "Tabby Shoulder Bag 26 interior open showing accordion compartments and gold hardware",
  objectPosition: "center center",
};

/** Capacity editorial break — lifestyle carry */
export const PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, AirPods, and essentials",
  objectPosition: "center center",
  caption:
    "Three compartments — room for the whole day, never overstuffed.",
};

/** Craftsmanship editorial break — glovetanned leather story */
export const PDP_GALLERY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/tabby-leather-detail-hardware.png",
  alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
  caption:
    "Glovetanned full-grain leather with signature hardware — soft, rich, and made to last.",
};

/** Standard studio product photography — hardware detail with hotspots */
export const PDP_GALLERY_PRODUCT_SHOTS: PdpGallerySlide[] = [
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather, gold C clasp, and accordion interior",
    objectPosition: "center center",
    hotspots: PDP_PRODUCT_IMMERSIVE_HOTSPOTS,
  },
];

/**
 * Scroll strategy — Desire → Function → Ecommerce (post-gallery modules in gallery-view)
 *
 * Tightened gallery: one lifestyle beat per idea, overflow in View more photos.
 */
export const PDP_GALLERY_DESIRE_SLIDES: PdpGallerySlide[] = [
  PDP_GALLERY_PRODUCT_FRONT_SLIDE,
  PDP_GALLERY_ON_MODEL_DENIM_SLIDE,
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-on-model-trench.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
    shopTheLookId: "trench-daytime",
  },
  {
    type: "video",
    src: PDP_GALLERY_SHOWCASE_VIDEO,
    poster: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Tabby Shoulder Bag 26 highlight montage",
  },
  { type: "ugc-videos" },
  { type: "as-seen-on" },
];

/** Capacity, craft detail, and touch-first interactives */
export const PDP_GALLERY_FUNCTION_SLIDES: PdpGallerySlide[] = [
  {
    type: "video",
    src: PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO,
    poster: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "What fits inside Tabby Shoulder Bag 26",
    caption: PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE.caption,
  },
  {
    type: "video",
    src: PDP_GALLERY_HERO_VIDEO,
    poster: PDP_GALLERY_PRODUCT_IMMERSIVE,
    alt: "360° rotating view of Tabby Shoulder Bag 26",
    showMuteControl: false,
  },
  ...PDP_GALLERY_PRODUCT_SHOTS,
  { type: "leather-aging" },
  { type: "weight-feel" },
  { type: "signature-sounds" },
  { type: "strap-simulation" },
];

/** @deprecated Use PDP_GALLERY_DESIRE_SLIDES */
export const PDP_GALLERY_MEDIA_SLIDES: PdpGallerySlide[] = PDP_GALLERY_DESIRE_SLIDES;

/** @deprecated Use PDP_GALLERY_FUNCTION_SLIDES */
export const PDP_GALLERY_EXPERIENCE_SLIDES: PdpGallerySlide[] = PDP_GALLERY_FUNCTION_SLIDES;

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
    src: "/images/gallery/tabby-leather-on-model-trench.png",
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
        imageSrc: "/images/gallery/tabby-leather-on-model-trench.png",
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
        id: "chain-strap",
        name: "Signature Chain Strap",
        subtitle: "Gold chain · crossbody",
        price: "$68",
        imageSrc: "/images/similar/tabby-chain-crossbody.png",
        imageAlt: "Signature chain strap with gold hardware",
      },
      {
        id: "strap-extender",
        name: "Bag Strap Extender",
        subtitle: "Adjustable leather",
        price: "$38",
        imageSrc: "/images/gallery/tabby-leather-back.png",
        imageAlt: "Black leather bag strap extender",
      },
      {
        id: "slim-shoulder-strap",
        name: "Slim Leather Strap",
        subtitle: "Shoulder carry",
        price: "$45",
        imageSrc: "/images/gallery/tabby-leather-product-alt.png",
        imageAlt: "Slim black leather shoulder strap",
      },
    ],
  },
};

export type PdpBagStory = {
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

export type PdpStrapSimulationMode = {
  id: string;
  label: string;
  detail: string;
  answer: string;
  /** Included with bag vs add-on price */
  priceLabel?: string;
  /** Matches PDP_STRAP_OPTIONS id — enables quick add on this preview */
  quickAddOptionId?: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
    fit?: "cover" | "contain";
  };
};

/** Strap swap simulator — preview detachable carry setups on the bag */
export const PDP_STRAP_SIMULATION = {
  moment: "Customize",
  title: "Swap the straps",
  intro: "Detachable clips — tap a strap to preview it on your Tabby.",
  hint: "Tap to swap straps",
  modes: [
    {
      id: "included-dual",
      label: "Dual leather",
      detail: "Shoulder + crossbody straps included.",
      answer: "Both leather straps clip on — wear shoulder or crossbody out of the box.",
      priceLabel: "Included",
      image: {
        src: "/images/gallery/tabby-leather-product-alt.png",
        alt: "Tabby Shoulder Bag 26 with included shoulder and crossbody leather straps",
        objectPosition: "center center",
        fit: "contain",
      },
    },
    {
      id: "chain-strap",
      label: "Chain",
      detail: "Gold chain crossbody carry.",
      answer: "Signature chain strap swaps onto the same hardware — dressier, hands-free.",
      priceLabel: "$68",
      quickAddOptionId: "chain-strap",
      image: {
        src: "/images/similar/tabby-chain-crossbody.png",
        alt: "Tabby Shoulder Bag 26 with signature gold chain crossbody strap",
        objectPosition: "center center",
        fit: "contain",
      },
    },
    {
      id: "slim-shoulder",
      label: "Slim strap",
      detail: "Cleaner shoulder silhouette.",
      answer: "Slim leather strap for a tighter shoulder carry — less bulk at the collar.",
      priceLabel: "$45",
      image: {
        src: "/images/gallery/tabby-product-front-916.jpg",
        alt: "Tabby Shoulder Bag 26 with slim shoulder strap",
        objectPosition: "center center",
        fit: "contain",
      },
    },
    {
      id: "strap-extender",
      label: "Extender",
      detail: "Extra drop for layers.",
      answer: "Strap extender adds length for coats and taller frames — same clips, longer hang.",
      priceLabel: "$38",
      image: {
        src: "/images/gallery/tabby-leather-product-front.png",
        alt: "Tabby Shoulder Bag 26 with extended strap drop",
        objectPosition: "center center",
        fit: "contain",
      },
    },
  ] satisfies PdpStrapSimulationMode[],
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
export const PDP_EVERYDAY_CARRY = {
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, keys, and everyday essentials",
  caption:
    "Designed for every day — however your Saturday, workday, or dinner plans unfold.",
} as const;

export type PdpWearStyle = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Moment #3 — styling validation */
export const PDP_HOW_TO_WEAR = {
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
      src: "/images/gallery/tabby-leather-on-model-trench.png",
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

export type PdpMaterialDetail = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

export type PdpMaterialExploreZone = {
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
export const PDP_CRAFTSMANSHIP_EDITORIAL_SRC =
  "/images/gallery/tabby-leather-front-charm.png";

/** Moment #4 — touch-to-reveal leather macro exploration */
export const PDP_MATERIAL_EXPLORATION = {
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

export type PdpLeatherAgingTrait = {
  id: "patina" | "softening" | "wear";
  label: string;
  detail: string;
};

export type PdpLeatherAgingStage = {
  id: string;
  label: string;
  timeline: string;
  summary: string;
  traits: PdpLeatherAgingTrait[];
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
export const PDP_LEATHER_AGING = {
  moment: "Material",
  title: "Leather aging simulator",
  intro:
    "See how glovetanned full-grain leather evolves — patina, softening, and honest wear over years of daily carry.",
  image: {
    src: "/images/gallery/tabby-leather-front-charm.png",
    alt: "Tabby Shoulder Bag 26 in black full-grain leather — aging simulation",
    objectPosition: "center 72%",
  },
  stages: [
    {
      id: "new",
      label: "New",
      timeline: "Day one",
      summary: "Factory-fresh grain, structured silhouette, crisp edges.",
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
      summary: "Warm highlights emerge; leather relaxes into daily rhythm.",
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
        brightness: 0.97,
        contrast: 1.03,
        saturate: 0.94,
        sepia: 0.14,
        patinaOpacity: 0.55,
        patinaGradient:
          "radial-gradient(ellipse 42% 28% at 72% 18%, rgba(196, 148, 88, 0.42), transparent 72%), radial-gradient(ellipse 36% 24% at 24% 82%, rgba(168, 124, 72, 0.32), transparent 70%), radial-gradient(ellipse 28% 20% at 50% 46%, rgba(140, 108, 68, 0.18), transparent 68%)",
        wearOpacity: 0.42,
        wearGradient:
          "linear-gradient(158deg, transparent 44%, rgba(0, 0, 0, 0.12) 49%, transparent 54%), linear-gradient(24deg, transparent 58%, rgba(0, 0, 0, 0.1) 63%, transparent 68%), radial-gradient(ellipse 18% 10% at 68% 34%, rgba(0, 0, 0, 0.16), transparent 72%)",
        softenOpacity: 0.35,
        softenBlur: 0.6,
        softenMask:
          "radial-gradient(ellipse 30% 18% at 68% 32%, black, transparent 72%), radial-gradient(ellipse 24% 14% at 28% 78%, black, transparent 70%)",
      },
    },
    {
      id: "two-years",
      label: "2 years",
      timeline: "Two years of carry",
      summary: "Lived-in depth — supple drape with an honest crease map.",
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
} as const;

export type PdpLeatherCleanerProduct = {
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
      imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
      imageAlt: "Coach Leather Cleaner for glovetanned leather",
    },
    {
      id: "coach-leather-moisturizer",
      name: "Leather Moisturizer",
      detail: "Conditions pebbled leather to stay soft and resist drying.",
      price: 22,
      imageSrc: "/images/gallery/tabby-leather-back.png",
      imageAlt: "Coach Leather Moisturizer for full-grain leather bags",
    },
  ] satisfies PdpLeatherCleanerProduct[],
} as const;

export type PdpWeightFeelEntry = {
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
    src: "/images/gallery/tabby-leather-product-alt.png",
    alt: "Tabby Shoulder Bag 26 in black full-grain leather with detachable straps",
    objectPosition: "center 62%",
  },
  reveal: {
    headline: "Comparable to carrying a water bottle.",
    subline: "Under 2 lbs — light enough for all-day crossbody, substantial enough to feel premium.",
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
export const PDP_MATERIAL_STORY = {
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
};

/** Product sounds — turnlock, zipper, opening (replace audio with studio recordings) */
export const PDP_SIGNATURE_SOUNDS = {
  title: "Signature sounds",
  sounds: [
    {
      id: "tabby-turnlock",
      label: "Hear the Tabby clasp",
      hint: "click · snap",
      playingHint: "Tabby turnlock",
      audioSrc: "/audio/tabby-turnlock.mp3",
      imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
      imageAlt: "Gold Tabby C turnlock clasp",
    },
    {
      id: "tabby-zipper",
      label: "Hear the zipper",
      hint: "Smooth brass hardware",
      playingHint: "Luxury zipper pull",
      audioSrc: "/audio/tabby-zipper.mp3",
      imageSrc: "/images/gallery/tabby-detail-clasp.png",
      imageAlt: "Tabby bag zipper and hardware detail",
    },
    {
      id: "tabby-bag-open",
      label: "Opening the bag",
      hint: "Accordion expands · soft leather",
      playingHint: "Interior opening",
      audioSrc: "/audio/tabby-bag-open.mp3",
      imageSrc: "/images/gallery/tabby-leather-interior-open.png",
      imageAlt: "Tabby bag interior accordion gussets open",
    },
  ] satisfies PdpSignatureSound[],
} as const;

/** Moment #5 — brand heritage */
export const PDP_HERITAGE_STORY = {
  moment: "Moment #5",
  title: "Heritage story",
  src: "/images/gallery/tabby-leather-front-charm.png",
  alt: "Tabby Shoulder Bag 26 — a Coach icon reimagined for today",
  caption:
    "Inspired by a Coach design from the 1970s and reimagined for today.",
} as const;

export type PdpColor = {
  id: string;
  name: string;
  swatch: string;
  hero: string;
  heroAlt: string;
};

export const PDP_COLORS: PdpColor[] = [
  {
    id: "black",
    name: "Black",
    swatch: "/images/colors/soft-tabby/black.png",
    hero: "/images/colors/soft-tabby/black.png",
    heroAlt: "Tabby Shoulder Bag 26 in black leather",
  },
  {
    id: "canyon",
    name: "Canyon",
    swatch: "/images/colors/soft-tabby/canyon.png",
    hero: "/images/colors/soft-tabby/canyon.png",
    heroAlt: "Tabby Shoulder Bag 26 in canyon suede",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/images/colors/soft-tabby/oxblood.png",
    hero: "/images/colors/soft-tabby/oxblood.png",
    heroAlt: "Tabby Shoulder Bag 26 in oxblood leather",
  },
  {
    id: "black-charm",
    name: "Black Charm",
    swatch: "/images/colors/soft-tabby/black-charm.png",
    hero: "/images/colors/soft-tabby/black-charm.png",
    heroAlt: "Tabby Shoulder Bag 26 in black with bag charms",
  },
  {
    id: "beaded",
    name: "Beaded Floral",
    swatch: "/images/colors/soft-tabby/beaded.png",
    hero: "/images/colors/soft-tabby/beaded.png",
    heroAlt: "Tabby Shoulder Bag 26 in beaded floral",
  },
  {
    id: "tan-fringe",
    name: "Tan Fringe",
    swatch: "/images/colors/soft-tabby/tan-fringe.png",
    hero: "/images/colors/soft-tabby/tan-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in tan suede with fringe",
  },
  {
    id: "black-fringe",
    name: "Black Fringe",
    swatch: "/images/colors/soft-tabby/black-fringe.png",
    hero: "/images/colors/soft-tabby/black-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in black suede with fringe",
  },
  {
    id: "olive",
    name: "Olive",
    swatch: "/images/colors/soft-tabby/olive.png",
    hero: "/images/colors/soft-tabby/olive.png",
    heroAlt: "Tabby Shoulder Bag 26 in olive suede",
  },
  {
    id: "mustard",
    name: "Mustard",
    swatch: "/images/colors/soft-tabby/mustard.png",
    hero: "/images/colors/soft-tabby/mustard.png",
    heroAlt: "Tabby Shoulder Bag 26 in mustard suede",
  },
];

export const PDP_MEDIA_SLIDES = [
  {
    src: "/images/gallery/tabby-leather-on-model-trench.png",
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
  title: "On TikTok",
  followCta: {
    label: "Follow us on TikTok",
    href: "https://www.tiktok.com/@coach",
  },
  videos: [
    {
      id: "ugc-leather-detail",
      src: "/videos/tabby-detail.mp4",
      poster: "/images/gallery/tabby-leather-detail-hardware.png",
      alt: "Customer close-up of Tabby glovetanned leather and gold hardware",
      handle: "@stylebyjess",
      context: "Leather detail",
      verified: true,
    },
    {
      id: "ugc-coffee-run",
      src: "/videos/soft-tabby-showcase.webm",
      poster: "/images/reviews/ugc-coffee-run.png",
      alt: "Customer styling Tabby Shoulder Bag 26 for a weekend coffee run",
      handle: "@jordanl.bk",
      context: "Saturday coffee run",
      verified: true,
    },
    {
      id: "ugc-city-commute",
      src: "/videos/what-fits-inside.webm",
      poster: "/images/reviews/ugc-on-street.png",
      alt: "Customer carrying Tabby through a city commute",
      handle: "@alexr.nyc",
      context: "City commute",
      verified: true,
    },
    {
      id: "ugc-creator-fit",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/mode22.png",
      alt: "Creator crossbody styling with Tabby Shoulder Bag 26",
      handle: "@tabbyfits",
      context: "How I wear it",
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
      src: "/images/gallery/tabby-leather-on-model-trench.png",
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
export const PDP_UGC_CONTEXT = {
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

export type PdpCommunityMediaItem = {
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
export const PDP_COMMUNITY_VALIDATION = {
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

export type PdpFeaturedReview = {
  id: string;
  rating: number;
  quote: string;
  author: string;
  date: string;
  verified?: boolean;
  photos?: PdpReviewPhoto[];
  likes: number;
};

export const PDP_CUSTOMER_REVIEWS: PdpFeaturedReview[] = [
  {
    id: "maren",
    rating: 5,
    quote:
      "The perfect everyday bag — fits everything I need without feeling bulky. The quilting feels luxe in person and the gold hardware catches the light beautifully.",
    author: "Maren K.",
    date: "Oct 12, 2025",
    verified: true,
    likes: 42,
  },
  {
    id: "jules",
    rating: 5,
    quote:
      "Wore this on a weekend trip and it held up beautifully. Strap sits comfortably crossbody all day and the flap stays secure.",
    author: "Jules T.",
    date: "Sep 28, 2025",
    verified: true,
    likes: 28,
  },
  {
    id: "priya",
    rating: 5,
    quote:
      "Obsessed with the leather finish — photos do not do it justice. Looks elevated with denim and dresses alike.",
    author: "Priya S.",
    date: "Sep 14, 2025",
    verified: true,
    likes: 56,
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
    quote:
      "Beautiful craftsmanship and the C clasp feels substantial. Wish the interior pocket were slightly larger, but still my go-to bag.",
    author: "Elena R.",
    date: "Aug 30, 2025",
    verified: true,
    likes: 19,
  },
  {
    id: "danielle",
    rating: 5,
    quote:
      "Finally a bag that fits my phone, wallet, keys, and sunglasses without looking overstuffed. The chain strap is the perfect length.",
    author: "Danielle M.",
    date: "Aug 18, 2025",
    verified: true,
    likes: 34,
  },
  {
    id: "sofia",
    rating: 5,
    quote:
      "Got the black colorway and it goes with literally everything. Leather has a soft hand-feel but holds its shape well.",
    author: "Sofia L.",
    date: "Jul 22, 2025",
    verified: true,
    likes: 21,
  },
  {
    id: "hannah",
    rating: 5,
    quote:
      "Bought this as a treat-yourself purchase and zero regrets. The cherry charm pairing is so fun — already getting compliments.",
    author: "Hannah W.",
    date: "Jul 9, 2025",
    verified: true,
    likes: 47,
  },
  {
    id: "taylor",
    rating: 4,
    quote:
      "Classic Tabby silhouette with a modern leather update. Straps are easy to swap between shoulder and crossbody carry.",
    author: "Taylor B.",
    date: "Jun 25, 2025",
    verified: true,
    likes: 15,
  },
  {
    id: "nicole",
    rating: 5,
    quote:
      "Transitioned from a larger tote and this size is ideal for daily errands. Quality is what you expect from Coach.",
    author: "Nicole A.",
    date: "Jun 3, 2025",
    verified: true,
    likes: 38,
  },
  {
    id: "rachel",
    rating: 5,
    quote:
      "The gold hardware against the black leather is stunning. Interior lining feels durable and wipes clean easily.",
    author: "Rachel P.",
    date: "May 19, 2025",
    verified: true,
    likes: 31,
  },
  {
    id: "amanda",
    rating: 4,
    quote:
      "Lovely bag overall. Arrived quickly and packaged well. Strap length works for shoulder or crossbody on my frame (5'6\").",
    author: "Amanda C.",
    date: "May 2, 2025",
    verified: true,
    likes: 12,
  },
  {
    id: "lily",
    rating: 5,
    quote:
      "This has become my default going-out bag. Structured enough for evenings, relaxed enough for daytime coffee runs.",
    author: "Lily H.",
    date: "Apr 14, 2025",
    verified: true,
    likes: 26,
  },
];

export const PDP_FEATURED_REVIEWS = PDP_CUSTOMER_REVIEWS.slice(0, 2);

export const PDP_REVIEWS_SUMMARY = {
  average: 4.8,
  count: 128,
} as const;

export const PDP_LIKE_SUMMARY = {
  count: 100_000,
  label: "100k",
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

export const PDP_REVIEWS_RATING_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
] as const;

/** Reviews carousel — contextual UGC from PDP_UGC_CONTEXT */
export const PDP_UGC_REVIEW_STORIES: PdpUgcStory[] = [
  PDP_UGC_CONTEXT.stories[0]!,
  PDP_UGC_CONTEXT.stories[1]!,
  PDP_UGC_CONTEXT.stories[2]!,
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
];

/** @deprecated Use PDP_UGC_REVIEW_STORIES — plain src/alt for legacy callers */
export const PDP_REVIEW_PHOTOS: PdpReviewPhoto[] = PDP_UGC_REVIEW_STORIES.map(
  (story) => ({
    src: story.src,
    alt: story.alt,
  }),
);

