export const PDP_PRODUCT = {
  name: "Tabby 26",
  subtitle: "Our staple shoulder bag with pillow quilting",
  price: "$575",
  imageSrc: "/images/gallery/tabby-product-immersive.png",
  imageAlt: "Tabby 26 black quilted shoulder bag with gold C clasp and chain strap",
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
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: "$68",
    imageSrc: "/images/gallery/tabby-detail-clasp.png",
    imageAlt: "Gold chain strap with leather weave detail",
  },
  {
    id: "strap-extender",
    name: "Bag Strap Extender",
    price: "$38",
    imageSrc: "/images/gallery/tabby-angle.png",
    imageAlt: "Adjustable bag strap extender in black leather",
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: "$42",
    imageSrc: "/images/gallery/tabby-product-immersive.png",
    imageAlt: "Gold heart bag charm on chain",
  },
  {
    id: "leather-key-ring",
    name: "Leather Key Ring",
    price: "$35",
    imageSrc: "/images/gallery/tabby-back.png",
    imageAlt: "Black leather key ring with gold hardware",
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: "$52",
    imageSrc: "/images/gallery/tabby-interior-open.png",
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
    price: 575,
    imageSrc: PDP_PRODUCT.imageSrc,
    imageAlt: PDP_PRODUCT.imageAlt,
    defaultSelected: true,
    locked: true,
  },
  {
    id: "cherry-charm",
    name: "Cherry Bag Charm",
    price: 45,
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
    defaultSelected: true,
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: 68,
    imageSrc: "/images/gallery/tabby-detail-clasp.png",
    imageAlt: "Gold chain strap with leather weave detail",
    defaultSelected: false,
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: 42,
    imageSrc: "/images/gallery/tabby-product-immersive.png",
    imageAlt: "Gold heart bag charm on chain",
    defaultSelected: false,
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: 52,
    imageSrc: "/images/gallery/tabby-interior-open.png",
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
      y: 58,
      label: "Main compartment",
      title: "Main compartment",
      body: "Room for your everyday carry without feeling overstuffed.",
      fits: ["Phone", "Wallet", "Keys", "Sunglasses"],
    },
    {
      id: "size",
      x: 48,
      y: 50,
      label: "Bag size",
      title: "Tabby 26 dimensions",
      body: "Structured at a mid-size scale — roomy enough for daily essentials, compact enough for evenings out.",
      fits: ['10.5" wide', '6.5" tall', '3" deep'],
    },
    {
      id: "pocket",
      x: 62,
      y: 68,
      label: "Slip pocket",
      title: "Interior slip pocket",
      body: "Keep small items easy to grab on the go.",
      fits: ["Cards", "Lip balm", "AirPods"],
    },
  ] satisfies PdpBagSizeHotspot[],
} as const;

export type PdpSimilarItem = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpCompareItem = PdpSimilarItem & {
  size: string;
  strap: string;
  material: string;
  closure: string;
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
  price: PDP_PRODUCT.price,
  imageSrc: PDP_PRODUCT.imageSrc,
  imageAlt: PDP_PRODUCT.imageAlt,
  size: '10" W x 6" H x 3" D',
  strap: "Chain & leather",
  material: "Quilted leather",
  closure: "C clasp turn-lock",
};

/** Alternatives shown beside the selected item in compare */
export const PDP_COMPARE_OPTIONS: PdpCompareItem[] = [
  {
    id: "tabby-20",
    name: "Tabby Shoulder Bag 20",
    price: "$495",
    imageSrc: "/images/gallery/tabby-angle.png",
    imageAlt: "Tabby Shoulder Bag 20 in black quilted leather",
    size: '8.5" W x 5" H x 2.5" D',
    strap: "Chain & leather",
    material: "Quilted leather",
    closure: "C clasp turn-lock",
  },
  {
    id: "soft-tabby",
    name: "Soft Tabby Shoulder Bag",
    price: "$550",
    imageSrc: "/images/gallery/tabby-on-model-front.png",
    imageAlt: "Soft Tabby shoulder bag worn crossbody",
    size: '11" W x 7" H x 3" D',
    strap: "Leather shoulder",
    material: "Soft pebbled leather",
    closure: "Magnetic snap",
  },
  {
    id: "tabby-chain",
    name: "Tabby Chain Crossbody",
    price: "$425",
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Tabby chain crossbody with gold hardware",
    size: '9" W x 6" H x 2" D',
    strap: "Chain crossbody",
    material: "Smooth leather",
    closure: "Turn-lock clasp",
  },
  {
    id: "pillow-tabby",
    name: "Pillow Tabby Shoulder Bag",
    price: "$595",
    imageSrc: "/images/gallery/tabby-back.png",
    imageAlt: "Pillow Tabby shoulder bag back view",
    size: '10.5" W x 6.5" H x 3" D',
    strap: "Chain & leather",
    material: "Pillow-quilted leather",
    closure: "C clasp turn-lock",
  },
];

/** Recommendation carousel — similar bags below gallery */
export const PDP_SIMILAR_ITEMS: PdpSimilarItem[] = [
  {
    id: "tabby-20",
    name: "Tabby Shoulder Bag 20",
    price: "$495",
    imageSrc: "/images/gallery/tabby-angle.png",
    imageAlt: "Tabby Shoulder Bag 20 in black quilted leather",
  },
  {
    id: "soft-tabby",
    name: "Soft Tabby Shoulder Bag",
    price: "$550",
    imageSrc: "/images/gallery/tabby-on-model-front.png",
    imageAlt: "Soft Tabby shoulder bag worn crossbody",
  },
  {
    id: "tabby-chain",
    name: "Tabby Chain Crossbody",
    price: "$425",
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Tabby chain crossbody with gold hardware",
  },
  {
    id: "pillow-tabby",
    name: "Pillow Tabby Shoulder Bag",
    price: "$595",
    imageSrc: "/images/gallery/tabby-back.png",
    imageAlt: "Pillow Tabby shoulder bag back view",
  },
  {
    id: "tabby-wristlet",
    name: "Tabby Wristlet",
    price: "$195",
    imageSrc: "/images/gallery/tabby-detail-clasp.png",
    imageAlt: "Tabby wristlet with C clasp detail",
  },
  {
    id: "quilted-tabby",
    name: "Quilted Tabby Tote",
    price: "$650",
    imageSrc: "/images/gallery/tabby-on-model-plaid.png",
    imageAlt: "Quilted Tabby tote styled on model",
  },
];

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

/** Bottom-of-page product search — prompt + suggested terms */
export const PDP_PRODUCT_SEARCH = {
  title: "Something else on your mind?",
  placeholder: "Search bags, charms, wallets…",
  suggestions: [
    "Tabby bags",
    "Crossbody bags",
    "Bag charms",
    "New arrivals",
    "Shoulder bags",
  ],
} as const;

/** Gallery hero — on-model city street lifestyle shot */
export const PDP_GALLERY_HERO_IMAGE = "/images/gallery/hero-city-street.png";

/** Hero crop — nudge up so the bag sits above bottom chrome */
export const PDP_GALLERY_HERO_IMAGE_FOCUS = {
  objectPosition: "center 46%",
  scale: 1.08,
  translateY: "-5%",
} as const;

/** Full-bleed rotating product video for Gallery tab */
export const PDP_GALLERY_HERO_VIDEO = "/videos/gallery-360.webm";

/** Match studio backdrop so letterboxing feels seamless */
export const PDP_GALLERY_VIDEO_BG = "#e9e9e9";

export type PdpProductHotspot = {
  id: string;
  /** Horizontal position within the image frame (0–100) */
  x: number;
  /** Vertical position within the image frame (0–100) */
  y: number;
  title: string;
  body: string;
};

/** Detail hotspots — product immersive studio shot */
export const PDP_PRODUCT_IMMERSIVE_HOTSPOTS: PdpProductHotspot[] = [
  {
    id: "c-clasp",
    x: 50,
    y: 72,
    title: "The iconic C",
    body: "Inspired by a turn-lock from Coach archives, the sculpted C clasp became Tabby's signature when the silhouette returned in 2018.",
  },
  {
    id: "quilting",
    x: 63,
    y: 78,
    title: "Pillow quilting",
    body: "Diagonal stitching creates a padded, dimensional finish — soft to the touch with a structured silhouette.",
  },
  {
    id: "chain-strap",
    x: 30,
    y: 66,
    title: "Chain & leather strap",
    body: "Interwoven metal chain and leather lets you wear Tabby on the shoulder or crossbody.",
  },
];

export type PdpGalleryImmersiveSlide = {
  type: "immersive";
  src: string;
  alt: string;
  shopTheLookId?: string;
  /** 12px white inset — matches grid margin; only for select lifestyle shots */
  insetMargins?: boolean;
  /** Image focal point within 4:5 crop */
  objectPosition?: string;
  scale?: string;
  hotspots?: PdpProductHotspot[];
};

export type PdpGalleryEditorialSlide = {
  type: "editorial";
  src: string;
  alt: string;
  caption: string;
  secondarySrc?: string;
  secondaryAlt?: string;
};

export type PdpGalleryVideoSlide = {
  type: "video";
  src: string;
  poster?: string;
  alt: string;
  label?: string;
};

export type PdpGallerySlide =
  | PdpGalleryImmersiveSlide
  | PdpGalleryEditorialSlide
  | PdpGalleryVideoSlide;

/** First portrait below hero — patio lifestyle shot */
export const PDP_GALLERY_HERO_FOLLOWUP_IMAGE =
  "/images/gallery/tabby-patio-pink-dress.png";

/** Product immersive — below details editorial */
export const PDP_GALLERY_PRODUCT_IMMERSIVE =
  "/images/gallery/tabby-product-immersive.png";

/** Tabby 26 gallery — 360 video, portrait, portrait, editorial, product immersive */
export const PDP_GALLERY_SLIDES: PdpGallerySlide[] = [
  {
    type: "video",
    src: PDP_GALLERY_HERO_VIDEO,
    poster: PDP_GALLERY_PRODUCT_IMMERSIVE,
    alt: "360° rotating view of Tabby 26 shoulder bag",
    label: "360° view",
  },
  {
    type: "immersive",
    src: PDP_GALLERY_HERO_FOLLOWUP_IMAGE,
    alt: "Model in a pink tiered dress carrying Tabby 26 on a patio",
    insetMargins: true,
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-model-full.png",
    alt: "Model wearing Tabby 26 with denim jacket and wide-leg jeans",
    shopTheLookId: "denim-daytime",
  },
  {
    type: "editorial",
    src: "/images/gallery/tabby-front-charm.png",
    alt: "Tabby 26 front view with gold C clasp and chain strap",
    caption:
      "The details behind the icon – explore the quilting, craftsmanship, and signature finishes that make Tabby unmistakably Coach.",
  },
  {
    type: "immersive",
    src: PDP_GALLERY_PRODUCT_IMMERSIVE,
    alt: "Tabby 26 black quilted shoulder bag with gold C clasp, chain strap, and cherry charm",
    objectPosition: "center 78%",
    scale: "scale-100",
    hotspots: PDP_PRODUCT_IMMERSIVE_HOTSPOTS,
  },
];

export type PdpGalleryPhoto = {
  id: string;
  src: string;
  alt: string;
};

/** Extended gallery — opened from the bottom "View more photos" affordance */
export const PDP_GALLERY_MORE_PHOTOS: PdpGalleryPhoto[] = [
  {
    id: "model-denim",
    src: "/images/gallery/tabby-model-full.png",
    alt: "Model wearing Tabby 26 with denim jacket and wide-leg jeans",
  },
  {
    id: "interior-open",
    src: "/images/gallery/tabby-interior-open.png",
    alt: "Tabby 26 interior open with compartments and gold hardware",
  },
  {
    id: "interior-packed",
    src: "/images/gallery/tabby-interior-packed.png",
    alt: "Tabby 26 interior packed with phone, wallet, and everyday essentials",
  },
  {
    id: "hero-city",
    src: "/images/gallery/hero-city-street.png",
    alt: "Model in a black leather jacket carrying Tabby 26 on a city street",
  },
  {
    id: "patio-lifestyle",
    src: "/images/gallery/tabby-patio-pink-dress.png",
    alt: "Model in a pink tiered dress carrying Tabby 26 on a patio",
  },
  {
    id: "product-immersive",
    src: "/images/gallery/tabby-product-immersive.png",
    alt: "Tabby 26 black quilted shoulder bag with gold C clasp and chain strap",
  },
  {
    id: "front-charm",
    src: "/images/gallery/tabby-front-charm.png",
    alt: "Tabby 26 front view with gold C clasp and cherry charm",
  },
  {
    id: "on-model-front",
    src: "/images/gallery/tabby-on-model-front.png",
    alt: "Model wearing Tabby 26 crossbody with a casual outfit",
  },
  {
    id: "on-model-back",
    src: "/images/gallery/tabby-on-model-back.png",
    alt: "Model from behind wearing Tabby 26 on the shoulder",
  },
  {
    id: "on-model-plaid",
    src: "/images/gallery/tabby-on-model-plaid.png",
    alt: "Model styled with Tabby 26 and a plaid coat",
  },
  {
    id: "hero-model",
    src: "/images/gallery/tabby-hero-model.png",
    alt: "Model wearing Tabby 26 with a grey sweater and light-wash jeans",
  },
  {
    id: "angle",
    src: "/images/gallery/tabby-angle.png",
    alt: "Tabby 26 angled product shot showing quilting detail",
  },
  {
    id: "back",
    src: "/images/gallery/tabby-back.png",
    alt: "Tabby 26 back view with chain strap detail",
  },
  {
    id: "clasp-detail",
    src: "/images/gallery/tabby-detail-clasp.png",
    alt: "Close-up of Tabby 26 gold C clasp hardware",
  },
  {
    id: "interior",
    src: "/images/gallery/tabby-interior.png",
    alt: "Tabby 26 interior lining and organization",
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
  "denim-daytime": {
    id: "denim-daytime",
    title: "Shop the look",
    items: [
      {
        id: "tabby-26",
        name: "Tabby 26 Shoulder Bag",
        price: "$575",
        href: "https://www.coach.com/shop/women/bags/shoulder-bags/tabby-shoulder-bag-26/CCZ47.html",
        imageSrc: "/images/gallery/tabby-front-charm.png",
        imageAlt: "Tabby 26 shoulder bag in black",
      },
      {
        id: "denim-jacket",
        name: "Denim Trucker Jacket",
        price: "$395",
        href: "https://www.coach.com/shop/women/ready-to-wear/jackets",
        imageSrc: "/images/gallery/tabby-model-full.png",
        imageAlt: "Dark-wash denim trucker jacket",
      },
      {
        id: "wide-leg-jean",
        name: "Wide-Leg Jean",
        price: "$195",
        href: "https://www.coach.com/shop/women/ready-to-wear/jeans",
        imageSrc: "/images/gallery/tabby-model-full.png",
        imageAlt: "Light-wash wide-leg jeans",
      },
      {
        id: "essential-tee",
        name: "Essential Cotton Tee",
        price: "$75",
        href: "https://www.coach.com/shop/women/ready-to-wear/tops",
        imageSrc: "/images/gallery/hero-modelshot.png",
        imageAlt: "White cotton tee",
      },
      {
        id: "leather-boot",
        name: "Leather Ankle Boot",
        price: "$295",
        href: "https://www.coach.com/shop/women/shoes/boots",
        imageSrc: "/images/gallery/tabby-on-model-front.png",
        imageAlt: "Black leather ankle boot",
      },
    ],
  },
};

/** Editorial — everyday carry capacity */
export const PDP_EVERYDAY_CARRY = {
  src: "/images/gallery/interior-packed-bleed.png",
  alt: "Tabby 26 interior packed with phone, wallet, keys, and everyday essentials",
  caption:
    "Designed for every day. Tabby 26 comfortably fits your phone, wallet, keys, sunglasses, and a few essentials.",
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
      src: "/images/gallery/hero-modelshot.png",
      alt: "Tabby 26 worn on the shoulder",
    },
    {
      id: "crossbody",
      label: "Crossbody",
      src: "/images/gallery/tabby-model-full.png",
      alt: "Tabby 26 worn crossbody with denim",
    },
    {
      id: "tucked-chain",
      label: "Tucked chain",
      src: "/images/gallery/tabby-front-charm.png",
      alt: "Tabby 26 with tucked chain strap detail",
    },
    {
      id: "dressed-up",
      label: "Dressed up",
      src: "/images/gallery/tabby-on-model-plaid.png",
      alt: "Tabby 26 styled with a plaid coat",
    },
    {
      id: "casual-denim",
      label: "Casual denim",
      src: "/images/gallery/tabby-on-model-front.png",
      alt: "Tabby 26 with casual denim outfit",
    },
  ] satisfies PdpWearStyle[],
} as const;

export type PdpMaterialDetail = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Craftsmanship editorial — Material Story follows this slide */
export const PDP_CRAFTSMANSHIP_EDITORIAL_SRC =
  "/images/gallery/tabby-front-charm.png";

/** Moment #4 — material & construction details */
export const PDP_MATERIAL_STORY = {
  moment: "Moment #4",
  title: "Material story",
  caption:
    "Pillow quilting creates the dimensional softness that defines Tabby.",
  details: [
    {
      id: "quilting",
      label: "Close crop of quilting",
      src: "/images/gallery/tabby-angle.png",
      alt: "Close crop of Tabby 26 pillow quilting",
    },
    {
      id: "leather",
      label: "Macro leather texture",
      src: "/images/gallery/tabby-back.png",
      alt: "Macro leather texture on Tabby 26",
    },
    {
      id: "hardware",
      label: "Hardware detail",
      src: "/images/gallery/tabby-detail-clasp.png",
      alt: "Gold hardware detail on Tabby 26 C clasp",
    },
  ] satisfies PdpMaterialDetail[],
} as const;

/** Moment #5 — brand heritage */
export const PDP_HERITAGE_STORY = {
  moment: "Moment #5",
  title: "Heritage story",
  src: "/images/gallery/tabby-front-charm.png",
  alt: "Tabby 26 — a Coach icon reimagined for today",
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
    id: "chalk",
    name: "Chalk",
    swatch: "/images/colors/chalk.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in chalk on model",
  },
  {
    id: "black",
    name: "Black",
    swatch: "/images/colors/black.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in black on model",
  },
  {
    id: "brown",
    name: "Brown",
    swatch: "/images/colors/brown.png",
    hero: "/images/hero-community.png",
    heroAlt: "Tabby 26 in brown on model",
  },
  {
    id: "ivory",
    name: "Ivory",
    swatch: "/images/colors/chalk.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in ivory on model",
  },
  {
    id: "oak",
    name: "Oak",
    swatch: "/images/colors/brown.png",
    hero: "/images/hero-community.png",
    heroAlt: "Tabby 26 in oak on model",
  },
  {
    id: "stone",
    name: "Stone",
    swatch: "/images/colors/chalk.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in stone on model",
  },
  {
    id: "mahogany",
    name: "Mahogany",
    swatch: "/images/colors/brown.png",
    hero: "/images/hero-community.png",
    heroAlt: "Tabby 26 in mahogany on model",
  },
  {
    id: "onyx",
    name: "Onyx",
    swatch: "/images/colors/black.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in onyx on model",
  },
  {
    id: "sand",
    name: "Sand",
    swatch: "/images/colors/chalk.png",
    hero: "/images/gallery-hero.png",
    heroAlt: "Tabby 26 in sand on model",
  },
];

export const PDP_MEDIA_SLIDES = [
  {
    src: "/images/hero-community.png",
    alt: "Model wearing a black quilted Coach Tabby bag",
  },
  {
    src: "/images/gallery-hero.png",
    alt: "Tabby 26 shoulder bag styled on model",
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

export type PdpCommunityMediaItem = {
  id: string;
  label: string;
  type: "photo" | "video";
  src: string;
  alt: string;
  poster?: string;
};

/** Moment #6 — community validation (replaces star-rating reviews) */
export const PDP_COMMUNITY_VALIDATION = {
  moment: "Moment #6",
  title: "Community validation",
  caption: "See how the community styles Tabby.",
  items: [
    {
      id: "customer-photo",
      label: "Real customer photo",
      type: "photo",
      src: "/images/reviews/ugc-on-street.png",
      alt: "Customer styling Tabby 26 on the street",
    },
    {
      id: "creator-video",
      label: "Creator styling video",
      type: "video",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/hero-modelshot.png",
      alt: "Creator styling Tabby 26 in a short video",
    },
    {
      id: "influencer-clip",
      label: "Influencer clip",
      type: "video",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/tabby-model-full.png",
      alt: "Influencer clip featuring Tabby 26",
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
    photos: [
      {
        src: "/images/reviews/ugc-coffee-run.png",
        alt: "Customer photo of Tabby 26 styled with a plaid coat",
      },
    ],
  },
  {
    id: "priya",
    rating: 5,
    quote:
      "Obsessed with the pillow quilting — photos do not do it justice. Looks elevated with denim and dresses alike.",
    author: "Priya S.",
    date: "Sep 14, 2025",
    verified: true,
    likes: 56,
    photos: [
      {
        src: "/images/reviews/ugc-on-street.png",
        alt: "Customer photo of Tabby 26 styled with a tan jacket",
      },
      {
        src: "/images/reviews/ugc-outfit-flat.png",
        alt: "Customer outfit photo featuring Tabby 26",
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
    photos: [
      {
        src: "/images/reviews/ugc-mirror-selfie.png",
        alt: "Customer mirror selfie with Tabby 26",
      },
    ],
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
    photos: [
      {
        src: "/images/reviews/ugc-outfit-flat.png",
        alt: "Customer outfit photo featuring Tabby 26 with cherry charm",
      },
    ],
  },
  {
    id: "taylor",
    rating: 4,
    quote:
      "Classic Tabby silhouette with a modern quilted update. Chain can feel a little heavy at first but you adjust quickly.",
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
    photos: [
      {
        src: "/images/reviews/ugc-on-street.png",
        alt: "Customer street-style photo with Tabby 26",
      },
    ],
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
  recommendPercent: 94,
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
  body: "Many note that Tabby 26 is a refined, well-crafted bag that strikes an appealing balance between structure and style. The polished pebble leather and signature “C” plaque closure stand out as premium touches.",
  attribution: "Buyer highlights, summarized by AI",
} as const;

export const PDP_REVIEWS_RATING_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
] as const;

/** Customer-uploaded photos — editorial UGC strip */
export const PDP_REVIEW_PHOTOS: PdpReviewPhoto[] = [
  {
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer photo of Tabby 26 styled with a tan jacket",
  },
  {
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer photo of Tabby 26 with plaid coat",
  },
  {
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby 26",
  },
  {
    src: "/images/reviews/ugc-outfit-flat.png",
    alt: "Customer outfit photo featuring Tabby 26",
  },
];

