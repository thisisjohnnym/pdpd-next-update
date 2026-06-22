import {
  PDP_GALLERY_IMMERSIVE_HERO_POSTER,
  PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
  PDP_PRODUCT,
} from "./pdp-data";

export type PdpProductId = "tabby" | "kira";

/** Above-the-fold + bottom-bar copy shared by every layout */
export type PdpProductSummary = {
  name: string;
  subtitle: string;
  price: string;
};

/** Stripped-layout gallery frame — a single image, no interactive modules */
export type PdpStrippedSlide = {
  src: string;
  alt: string;
  objectPosition?: string;
  aspect?: "4/5" | "9/16";
};

export type PdpProductSpec = {
  label: string;
  value: string;
};

export type PdpProductDetail = {
  heading: string;
  body: string;
  specs: PdpProductSpec[];
};

export type PdpProductHero =
  | { kind: "video"; videoSrc: string; poster: string; alt: string }
  | {
      kind: "image";
      src: string;
      alt: string;
      objectPosition?: string;
      /** "immersive" = full-viewport video-style · "static" = framed product shot */
      format?: "immersive" | "static";
      aspect?: "4/5" | "9/16";
    };

export type PdpProductConfig = {
  id: PdpProductId;
  /** "full" = robust Tabby template · "stripped" = pared-back template */
  layout: "full" | "stripped";
  summary: PdpProductSummary;
  hero: PdpProductHero;
  /** Stripped layout only — short gallery below the hero */
  slides?: PdpStrippedSlide[];
  /** Stripped layout only — copy + spec block standing in for rich modules */
  detail?: PdpProductDetail;
};

export const DEFAULT_PRODUCT_ID: PdpProductId = "tabby";

const PDP_PRODUCTS: Record<PdpProductId, PdpProductConfig> = {
  tabby: {
    id: "tabby",
    layout: "full",
    summary: {
      name: PDP_PRODUCT.name,
      subtitle: PDP_PRODUCT.subtitle,
      price: PDP_PRODUCT.price,
    },
    hero: {
      kind: "video",
      videoSrc: PDP_GALLERY_IMMERSIVE_HERO_VIDEO,
      poster: PDP_GALLERY_IMMERSIVE_HERO_POSTER,
      alt: "Model in camel trench coat carrying Tabby Shoulder Bag 26 on a city street",
    },
  },
  kira: {
    id: "kira",
    layout: "stripped",
    summary: {
      name: "Kira Crossbody",
      subtitle: "Quilted Leather",
      price: "$298",
    },
    hero: {
      kind: "image",
      format: "static",
      aspect: "4/5",
      src: "/images/gallery/kira-crossbody-product-hero.jpg",
      alt: "Kira Crossbody in black pebbled leather with gold C hardware and wristlet strap on a studio grey background",
      objectPosition: "center 72%",
    },
    slides: [
      {
        src: "/images/gallery/kira-crossbody-wristlet-lifestyle.jpg",
        alt: "Model in a signature C monogram trench coat and jeans holding Kira Crossbody by the wristlet strap",
        objectPosition: "center center",
        aspect: "4/5",
      },
      {
        src: "/images/gallery/kira-crossbody-on-model-trench.png",
        alt: "Model in a signature C monogram trench coat wearing Kira Crossbody in black pebbled leather with gold C hardware",
        objectPosition: "center center",
        aspect: "4/5",
      },
      {
        src: "/images/gallery/kira-crossbody-interior-open.jpg",
        alt: "Open interior of Kira Crossbody showing zip compartments, card slots, and gold hardware",
        objectPosition: "center center",
        aspect: "4/5",
      },
      {
        src: "/images/gallery/kira-crossbody-hardware-detail.jpg",
        alt: "Close-up of Kira Crossbody gold zippers, Coach-engraved pulls, and strap clasp on black pebbled leather",
        objectPosition: "center center",
        aspect: "4/5",
      },
    ],
    detail: {
      heading: "Details",
      body: "A pared-back everyday crossbody — quilted leather, signature C hardware, and a chain strap for hands-free carry.",
      specs: [
        { label: "Size", value: '8.5" W x 5" H x 2" D' },
        { label: "Strap", value: "Chain crossbody" },
        { label: "Material", value: "Quilted leather" },
        { label: "Closure", value: "C clasp turn-lock" },
      ],
    },
  },
};

export function getPdpProduct(id: PdpProductId): PdpProductConfig {
  return PDP_PRODUCTS[id] ?? PDP_PRODUCTS[DEFAULT_PRODUCT_ID];
}

export function isStaticImageHero(hero: PdpProductHero): boolean {
  return hero.kind === "image" && hero.format === "static";
}

/**
 * Maps a "Recently viewed" card id to a switchable product. Cards without an
 * entry stay on the current PDP (no demo data behind them yet).
 */
const RECENTLY_VIEWED_PRODUCT_MAP: Record<string, PdpProductId> = {
  "kira-crossbody": "kira",
};

export function getRecentlyViewedProductId(cardId: string): PdpProductId | null {
  return RECENTLY_VIEWED_PRODUCT_MAP[cardId] ?? null;
}
