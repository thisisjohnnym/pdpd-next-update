export const PDP_PRODUCT = {
  name: "Tabby 26",
  subtitle: "Shoulder bag with pillow quilting",
  price: "$575",
} as const;

/** Gallery hero — on-model lifestyle shot */
export const PDP_GALLERY_HERO_IMAGE = "/images/gallery/hero-modelshot.png";

/** Full-bleed rotating product video for Gallery tab */
export const PDP_GALLERY_HERO_VIDEO = "/videos/gallery-360.webm";

/** Match studio backdrop so letterboxing feels seamless */
export const PDP_GALLERY_VIDEO_BG = "#e9e9e9";

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
};

export type PdpGalleryEditorialSlide = {
  type: "editorial";
  src: string;
  alt: string;
  caption: string;
  secondarySrc?: string;
  secondaryAlt?: string;
};

export type PdpGallerySlide = PdpGalleryImmersiveSlide | PdpGalleryEditorialSlide;

/** First portrait below hero — patio lifestyle shot */
export const PDP_GALLERY_HERO_FOLLOWUP_IMAGE =
  "/images/gallery/tabby-patio-pink-dress.png";

/** Product immersive — below details editorial */
export const PDP_GALLERY_PRODUCT_IMMERSIVE =
  "/images/gallery/tabby-product-immersive.png";

/** Tabby 26 gallery — portrait, portrait, editorial, product immersive */
export const PDP_GALLERY_SLIDES: PdpGallerySlide[] = [
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
    alt: "Tabby 26 black quilted shoulder bag with gold C clasp and chain strap",
    objectPosition: "center 72%",
    scale: "scale-100",
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
  verified?: boolean;
};

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

export const PDP_FEATURED_REVIEWS: PdpFeaturedReview[] = [
  {
    id: "maren",
    rating: 5,
    quote:
      "The perfect everyday bag — fits everything I need without feeling bulky. The quilting feels luxe in person.",
    author: "Maren K.",
    verified: true,
  },
  {
    id: "jules",
    rating: 5,
    quote:
      "Wore this on a weekend trip and it held up beautifully. Strap sits comfortably crossbody all day.",
    author: "Jules T.",
    verified: true,
  },
];
