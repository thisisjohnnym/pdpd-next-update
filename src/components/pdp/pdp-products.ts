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
  | { kind: "image"; src: string; alt: string; objectPosition?: string };

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
      subtitle: "A compact crossbody in smooth leather.",
      price: "$298",
    },
    hero: {
      kind: "image",
      src: "/images/gallery/tabby-on-model-back.png",
      alt: "Kira Crossbody worn over the shoulder with a brown bomber jacket and plaid skirt",
      objectPosition: "center 28%",
    },
    slides: [
      {
        src: "/images/similar/tabby-chain-crossbody.png",
        alt: "Kira Crossbody in black leather with a gold chain strap",
        objectPosition: "center center",
        aspect: "4/5",
      },
      {
        src: "/images/gallery/tabby-patio-pink-dress.png",
        alt: "Kira Crossbody styled with a dress for an evening out",
        objectPosition: "center 30%",
        aspect: "4/5",
      },
    ],
    detail: {
      heading: "Details",
      body: "A pared-back everyday crossbody — smooth leather, signature C hardware, and an adjustable strap for hands-free carry.",
      specs: [
        { label: "Size", value: '8.5" W x 5" H x 2" D' },
        { label: "Strap", value: "Adjustable crossbody" },
        { label: "Material", value: "Smooth leather" },
        { label: "Closure", value: "Zip top" },
      ],
    },
  },
};

export function getPdpProduct(id: PdpProductId): PdpProductConfig {
  return PDP_PRODUCTS[id] ?? PDP_PRODUCTS[DEFAULT_PRODUCT_ID];
}

/**
 * Maps a "Recently viewed" card id to a switchable product. Cards without an
 * entry stay on the current PDP (no demo data behind them yet).
 */
const RECENTLY_VIEWED_PRODUCT_MAP: Record<string, PdpProductId> = {
  "kira-crossbody": "kira",
};
