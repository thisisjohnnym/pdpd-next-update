import {
  PDP_BAG_UPSELLS,
  PDP_COLORS,
  DEFAULT_COLOR_ID,
  type PdpBagUpsell,
  type PdpColor,
} from "./pdp-data";
import type { PdpProductId } from "./pdp-products";

const KIRA_COLORS: PdpColor[] = [
  {
    id: "black",
    name: "Black",
    swatch: "/images/gallery/kira-crossbody-product-hero.jpg",
    hero: "/images/gallery/kira-crossbody-product-hero.jpg",
    heroAlt: "Kira Crossbody in black pebbled leather with gold C hardware",
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "chalk",
    name: "Chalk",
    swatch: "/images/gallery/kira-crossbody-product-hero.jpg",
    hero: "/images/gallery/kira-crossbody-product-hero.jpg",
    heroAlt: "Kira Crossbody in chalk pebbled leather with gold C hardware",
    chromeSample: "#ddd8ce",
    availability: "in_stock",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/images/gallery/kira-crossbody-product-hero.jpg",
    hero: "/images/gallery/kira-crossbody-product-hero.jpg",
    heroAlt: "Kira Crossbody in oxblood pebbled leather with gold C hardware",
    chromeSample: "#6b2c32",
    availability: "low_stock",
  },
];

const KIRA_BAG_UPSELLS: PdpBagUpsell[] = [
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: "$68",
    imageSrc: "/images/similar/leather-chain-strap.png",
    imageAlt: "Gold and leather chain strap for crossbody wear",
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: "$42",
    imageSrc: "/images/similar/heart-charm.png",
    imageAlt: "Gold heart bag charm on chain",
  },
  {
    id: "card-case-clip",
    name: "Card Case with Clip",
    price: "$78",
    imageSrc: "/images/similar/card-case-clip.jpg",
    imageAlt: "Slim card case with clip in black leather",
  },
];

const COLORS_BY_PRODUCT: Record<PdpProductId, PdpColor[]> = {
  tabby: PDP_COLORS,
  kira: KIRA_COLORS,
};

const UPSELLS_BY_PRODUCT: Record<PdpProductId, PdpBagUpsell[]> = {
  tabby: PDP_BAG_UPSELLS,
  kira: KIRA_BAG_UPSELLS,
};

const DEFAULT_COLOR_BY_PRODUCT: Record<PdpProductId, string> = {
  tabby: DEFAULT_COLOR_ID,
  kira: "black",
};

export function getPdpColors(productId: PdpProductId): PdpColor[] {
  return COLORS_BY_PRODUCT[productId] ?? PDP_COLORS;
}

export function getPdpBagUpsells(productId: PdpProductId): PdpBagUpsell[] {
  return UPSELLS_BY_PRODUCT[productId] ?? PDP_BAG_UPSELLS;
}

export function getDefaultColorId(productId: PdpProductId): string {
  return DEFAULT_COLOR_BY_PRODUCT[productId] ?? DEFAULT_COLOR_ID;
}
