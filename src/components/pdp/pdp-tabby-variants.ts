/** Tabby product family — style dimension */
export type TabbyStyleId =
  | "classic"
  | "soft"
  | "quilted"
  | "pillow-quilted"
  | "signature-canvas"
  | "twisted"
  | "loved-leather"
  | "chain";

export type TabbyStyleGroupId = "core" | "special-editions";

export type TabbyStyleGroup = {
  id: TabbyStyleGroupId;
  label: string;
  styleIds: TabbyStyleId[];
};

export type TabbySize = 20 | 26 | 33 | 36;

export type TabbySizeOption = {
  size: TabbySize;
  /** Display dimensions for size comparison */
  dimensions: string;
  price: string;
  /** Coach.com Brass/Black product shot for size comparison */
  image: string;
  imageAlt: string;
};

export type TabbyStyle = {
  id: TabbyStyleId;
  /** Short label for pills / bottom bar */
  label: string;
  /** Style family line on picker cards */
  description: string;
  /** Material line under product title on hero HUD */
  materialLabel: string;
  thumbnail: string;
  thumbnailAlt: string;
};

export type TabbySku = {
  slug: string;
  styleId: TabbyStyleId;
  size: TabbySize;
  price: string;
};

export const TABBY_SIZES: TabbySize[] = [20, 26, 33, 36];

/** coach.com — Tabby Shoulder Bag in Brass/Black (CY201, CH857, CP151, CEM11) */
const SIZE_PRICES: Record<TabbySize, string> = {
  20: "$375",
  26: "$475",
  33: "$725",
  36: "$695",
};

const SIZE_DIMENSIONS: Record<TabbySize, string> = {
  20: '7.75" W × 4.25" H × 2.75" D',
  26: '10.25" W × 6" H × 3.25" D',
  33: '13" W × 7" H × 4" D',
  36: '14.25" W × 7.75" H × 4.75" D',
};

const SIZE_IMAGES: Record<TabbySize, { src: string; alt: string }> = {
  20: {
    src: "/images/compare/tabby-size-20.jpg",
    alt: "Tabby Shoulder Bag 20 in Brass/Black polished pebble leather",
  },
  26: {
    src: "/images/compare/tabby-size-26.jpg",
    alt: "Tabby Shoulder Bag 26 in Brass/Black polished pebble leather",
  },
  33: {
    src: "/images/compare/tabby-size-33.jpg",
    alt: "Tabby Shoulder Bag 33 in Brass/Black quilted nappa leather",
  },
  36: {
    src: "/images/compare/tabby-size-36.jpg",
    alt: "Tabby Shoulder Bag 36 in Brass/Black natural grain leather",
  },
};

/** Visual size cards — Coach product shots for side-by-side comparison */
const TABBY_SIZE_OPTIONS: TabbySizeOption[] = TABBY_SIZES.map((size) => ({
  size,
  dimensions: SIZE_DIMENSIONS[size],
  price: SIZE_PRICES[size],
  image: SIZE_IMAGES[size].src,
  imageAlt: SIZE_IMAGES[size].alt,
}));

export function getTabbySizeOption(size: TabbySize): TabbySizeOption {
  return TABBY_SIZE_OPTIONS.find((option) => option.size === size) ?? TABBY_SIZE_OPTIONS[1]!;
}

const TABBY_STYLES: TabbyStyle[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Original structured Tabby",
    materialLabel: "Full-Grain Leather",
    thumbnail: "/images/compare/tabby-style-classic.jpg",
    thumbnailAlt: "Classic Tabby Shoulder Bag 26 in Brass/Black polished pebble leather",
  },
  {
    id: "soft",
    label: "Soft",
    description: "Slouchier, softer silhouette",
    materialLabel: "Soft Leather",
    thumbnail: "/images/compare/tabby-style-soft.jpg",
    thumbnailAlt: "Soft Tabby Shoulder Bag in Brass/Black smooth leather",
  },
  {
    id: "quilted",
    label: "Quilted",
    description: "Diamond quilted leather",
    materialLabel: "Quilted Leather",
    thumbnail: "/images/compare/tabby-style-quilted.jpg",
    thumbnailAlt: "Tabby Shoulder Bag 26 With Quilting in Brass/Black nappa leather",
  },
  {
    id: "pillow-quilted",
    label: "Pillow",
    description: "Puffy padded construction",
    materialLabel: "Pillow-Quilted Leather",
    thumbnail: "/images/compare/tabby-style-pillow.jpg",
    thumbnailAlt: "Pillow Tabby Shoulder Bag 26 in Silver/Black nappa leather",
  },
  {
    id: "signature-canvas",
    label: "Signature",
    description: "Signature canvas versions",
    materialLabel: "Signature Canvas",
    thumbnail: "/images/compare/tabby-style-signature.jpg",
    thumbnailAlt: "Tabby Shoulder Bag 26 In Signature Canvas in Charcoal Black",
  },
  {
    id: "twisted",
    label: "Twisted",
    description: "Twist detail version",
    materialLabel: "Twisted Leather",
    thumbnail: "/images/compare/tabby-style-twisted.jpg",
    thumbnailAlt: "Twisted Tabby Shoulder Bag in Brass/Black glovetanned leather",
  },
  {
    id: "loved-leather",
    label: "Loved Leather",
    description: "Vintage/distressed leather treatment",
    materialLabel: "Loved Leather",
    thumbnail: "/images/compare/tabby-style-loved.jpg",
    thumbnailAlt: "Tabby Shoulder Bag 26 In Loved Leather in Silver/Black Brown",
  },
  {
    id: "chain",
    label: "Chain",
    description: "Chain-focused construction",
    materialLabel: "Chain Leather",
    thumbnail: "/images/compare/tabby-style-chain.jpg",
    thumbnailAlt: "Chain Tabby Shoulder Bag in Brass/Black soft grain leather",
  },
];

const TABBY_STYLE_GROUPS: TabbyStyleGroup[] = [
  {
    id: "core",
    label: "Core Styles",
    styleIds: ["classic", "soft", "quilted", "pillow-quilted"],
  },
  {
    id: "special-editions",
    label: "Special Editions",
    styleIds: ["signature-canvas", "twisted", "loved-leather", "chain"],
  },
];

export const DEFAULT_TABBY_STYLE_ID: TabbyStyleId = "quilted";
export const DEFAULT_TABBY_SIZE: TabbySize = 26;
export const DEFAULT_TABBY_SLUG = buildTabbySlug(DEFAULT_TABBY_SIZE, DEFAULT_TABBY_STYLE_ID);

function buildTabbySlug(size: TabbySize, styleId: TabbyStyleId): string {
  return `tabby-shoulder-bag-${size}-${styleId}`;
}

export function parseTabbySlug(slug: string): { size: TabbySize; styleId: TabbyStyleId } | null {
  const match =
    /^tabby-shoulder-bag-(20|26|33|36)-(classic|soft|quilted|pillow-quilted|signature-canvas|twisted|loved-leather|chain)$/.exec(
      slug,
    );

  if (!match) {
    return null;
  }

  return {
    size: Number(match[1]) as TabbySize,
    styleId: match[2] as TabbyStyleId,
  };
}

export function getTabbyStyle(styleId: TabbyStyleId): TabbyStyle {
  return TABBY_STYLES.find((style) => style.id === styleId) ?? TABBY_STYLES[0]!;
}

export function getTabbyStyleGroups(): Array<{
  group: TabbyStyleGroup;
  styles: TabbyStyle[];
}> {
  return TABBY_STYLE_GROUPS.map((group) => ({
    group,
    styles: group.styleIds.map((id) => getTabbyStyle(id)),
  }));
}

export function getTabbySku(size: TabbySize, styleId: TabbyStyleId): TabbySku {
  return {
    slug: buildTabbySlug(size, styleId),
    styleId,
    size,
    price: SIZE_PRICES[size],
  };
}

export function getTabbyProductTitle(size: TabbySize): string {
  return `Tabby Shoulder Bag ${size}`;
}

export function tabbyProductPath(slug: string, colorId?: string): string {
  const base = `/products/${slug}`;
  return colorId ? `${base}?color=${encodeURIComponent(colorId)}` : base;
}

/** Update shareable URL without Next navigation — keeps hero video playing. */
export function replaceTabbyBrowserUrl(slug: string, colorId?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(window.history.state, "", tabbyProductPath(slug, colorId));
}
