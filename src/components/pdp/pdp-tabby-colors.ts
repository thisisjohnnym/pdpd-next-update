import type { PdpColor, PdpColorAvailability } from "./pdp-data";
import {
  getColorIdsForStyle,
  getColorIdsForStyleSize,
  getDefaultColorIdForStyleSize,
} from "./pdp-tabby-catalog";
import type { TabbySize, TabbySku, TabbyStyleId } from "./pdp-tabby-variants";

type TabbyColorSeed = {
  id: string;
  /** Coach.com color label — e.g. "Brass/Black" */
  name: string;
  swatch: string;
  /** Studio product hero — when set, replaces the default lifestyle hero */
  hero?: string;
  chromeSample?: string;
  availability: PdpColorAvailability;
};

function toPdpColor(
  seed: TabbyColorSeed,
  styleLabel: string,
  size: TabbySize,
): PdpColor {
  return {
    id: seed.id,
    name: seed.name,
    swatch: seed.swatch,
    hero: seed.hero ?? seed.swatch,
    heroAlt: `Tabby Shoulder Bag ${size} in ${seed.name} — ${styleLabel}`,
    chromeSample: seed.chromeSample ?? "#1a1a1a",
    availability: seed.availability,
  };
}

/** Legacy ?color= query values from the prototype catalog */
const LEGACY_COLOR_ID_MAP: Record<string, string> = {
  black: "brass-black",
  canyon: "brass-maple",
  oxblood: "silver-soft-purple",
  "black-charm": "silver-black",
  beaded: "brass-black-multi",
  "tan-fringe": "brass-biscuit",
  "black-fringe": "silver-midnight-navy",
  olive: "brass-indigo",
  mustard: "silver-dragonfruit",
};

/** coach.com $desktopSwatchImage$ — Brass/Black, Chalk, Maple, etc. */
const COACH_SWATCH = {
  "brass-black": "/images/colors/tabby/brass-black.jpg",
  "silver-black": "/images/colors/tabby/silver-black.jpg",
  "brass-chalk": "/images/colors/tabby/brass-chalk.jpg",
  "brass-maple": "/images/colors/tabby/brass-maple.jpg",
  "brass-biscuit": "/images/colors/tabby/brass-biscuit.jpg",
  "brass-moss": "/images/colors/tabby/brass-moss.jpg",
  "brass-indigo": "/images/colors/tabby/brass-indigo.jpg",
  "brass-black-multi": "/images/colors/tabby/brass-black-multi.png",
  "silver-soft-purple": "/images/colors/tabby/silver-soft-purple.jpg",
  "silver-midnight-navy": "/images/colors/tabby/silver-midnight-navy.jpg",
  "silver-dragonfruit": "/images/colors/tabby/silver-dragonfruit.jpg",
  "silver-flower-pink": "/images/colors/tabby/silver-flower-pink.jpg",
} as const satisfies Record<string, string>;

/** Lifestyle hero swaps — replace default video hero when selected */
const COACH_HERO = {
  "silver-soft-purple":
    "/images/colors/tabby/silver-soft-purple-on-model-bomber.png",
} as const satisfies Partial<Record<keyof typeof COACH_SWATCH, string>>;

type CoachColorId = keyof typeof COACH_SWATCH;

function coachSwatch(id: CoachColorId): string {
  return COACH_SWATCH[id];
}

function coachHero(id: CoachColorId): string | undefined {
  return COACH_HERO[id as keyof typeof COACH_HERO];
}

/** Coach US colorways — Tabby Shoulder Bag 26, refined pebble (CH735 / CH857) */
const CLASSIC_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-chalk",
    name: "Brass/Chalk",
    swatch: coachSwatch("brass-chalk"),
    chromeSample: "#e8e0d4",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "brass-moss",
    name: "Brass/Moss",
    swatch: coachSwatch("brass-moss"),
    chromeSample: "#556847",
    availability: "low_stock",
  },
  {
    id: "silver-dragonfruit",
    name: "Silver/Dragonfruit",
    swatch: coachSwatch("silver-dragonfruit"),
    chromeSample: "#c94b6a",
    availability: "in_stock",
  },
  {
    id: "silver-flower-pink",
    name: "Silver/Flower Pink",
    swatch: coachSwatch("silver-flower-pink"),
    availability: "in_stock",
  },
  {
    id: "brass-black-multi",
    name: "Brass/Black Multi",
    swatch: coachSwatch("brass-black-multi"),
    chromeSample: "#8a7a6a",
    availability: "notify",
  },
  {
    id: "brass-biscuit",
    name: "Brass/Biscuit",
    swatch: coachSwatch("brass-biscuit"),
    chromeSample: "#c4a06a",
    availability: "in_stock",
  },
];

/** Coach US — Tabby 26 with quilting, nappa / goat leather (CP150 / CCW83) */
const QUILTED_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "silver-black",
    name: "Silver/Black",
    swatch: coachSwatch("silver-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-chalk",
    name: "Brass/Chalk",
    swatch: coachSwatch("brass-chalk"),
    chromeSample: "#e8e0d4",
    availability: "in_stock",
  },
  {
    id: "silver-soft-purple",
    name: "Silver/Soft Purple",
    swatch: coachSwatch("silver-soft-purple"),
    hero: coachHero("silver-soft-purple"),
    chromeSample: "#7a5c8a",
    availability: "low_stock",
  },
  {
    id: "brass-indigo",
    name: "Brass/Indigo",
    swatch: coachSwatch("brass-indigo"),
    chromeSample: "#3d4a6a",
    availability: "notify",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "brass-biscuit",
    name: "Brass/Biscuit",
    swatch: coachSwatch("brass-biscuit"),
    chromeSample: "#c4a06a",
    availability: "in_stock",
  },
  {
    id: "brass-black-multi",
    name: "Brass/Black Multi",
    swatch: coachSwatch("brass-black-multi"),
    chromeSample: "#8a7a6a",
    availability: "notify",
  },
  {
    id: "silver-midnight-navy",
    name: "Silver/Midnight Navy",
    swatch: coachSwatch("silver-midnight-navy"),
    chromeSample: "#1a2438",
    availability: "low_stock",
  },
];

/** Coach US — Tabby 26 with pillow quilting (CP150 pillow) */
const PILLOW_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-chalk",
    name: "Brass/Chalk",
    swatch: coachSwatch("brass-chalk"),
    chromeSample: "#e8e0d4",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "silver-soft-purple",
    name: "Silver/Soft Purple",
    swatch: coachSwatch("silver-soft-purple"),
    hero: coachHero("silver-soft-purple"),
    chromeSample: "#7a5c8a",
    availability: "in_stock",
  },
];

/** Soft Tabby — velvety / slouchy leather colorways */
const SOFT_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "brass-biscuit",
    name: "Brass/Biscuit",
    swatch: coachSwatch("brass-biscuit"),
    chromeSample: "#c4a06a",
    availability: "in_stock",
  },
  {
    id: "brass-moss",
    name: "Brass/Moss",
    swatch: coachSwatch("brass-moss"),
    chromeSample: "#556847",
    availability: "low_stock",
  },
  {
    id: "silver-dragonfruit",
    name: "Silver/Dragonfruit",
    swatch: coachSwatch("silver-dragonfruit"),
    chromeSample: "#c94b6a",
    availability: "notify",
  },
];

/** Signature canvas / jacquard Tabby colorways */
const SIGNATURE_26: TabbyColorSeed[] = [
  {
    id: "brass-black-multi",
    name: "Brass/Black Multi",
    swatch: coachSwatch("brass-black-multi"),
    chromeSample: "#8a7a6a",
    availability: "in_stock",
  },
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-chalk",
    name: "Brass/Chalk",
    swatch: coachSwatch("brass-chalk"),
    chromeSample: "#e8e0d4",
    availability: "in_stock",
  },
];

/** Twisted Tabby — leather twist detail */
const TWISTED_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "silver-black",
    name: "Silver/Black",
    swatch: coachSwatch("silver-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-biscuit",
    name: "Brass/Biscuit",
    swatch: coachSwatch("brass-biscuit"),
    chromeSample: "#c4a06a",
    availability: "low_stock",
  },
];

/** Loved leather — vintage / distressed treatment */
const LOVED_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "silver-soft-purple",
    name: "Silver/Soft Purple",
    swatch: coachSwatch("silver-soft-purple"),
    hero: coachHero("silver-soft-purple"),
    chromeSample: "#7a5c8a",
    availability: "low_stock",
  },
  {
    id: "silver-black",
    name: "Silver/Black",
    swatch: coachSwatch("silver-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
];

/** Chain Tabby — chain-focused construction */
const CHAIN_26: TabbyColorSeed[] = [
  {
    id: "brass-black",
    name: "Brass/Black",
    swatch: coachSwatch("brass-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "silver-black",
    name: "Silver/Black",
    swatch: coachSwatch("silver-black"),
    chromeSample: "#1a1a1a",
    availability: "in_stock",
  },
  {
    id: "brass-maple",
    name: "Brass/Maple",
    swatch: coachSwatch("brass-maple"),
    availability: "in_stock",
  },
  {
    id: "silver-soft-purple",
    name: "Silver/Soft Purple",
    swatch: coachSwatch("silver-soft-purple"),
    hero: coachHero("silver-soft-purple"),
    chromeSample: "#7a5c8a",
    availability: "low_stock",
  },
];

const STYLE_SIZE_CATALOG: Partial<
  Record<TabbyStyleId, Partial<Record<TabbySize, TabbyColorSeed[]>>>
> = {
  classic: {
    20: CLASSIC_26,
    26: CLASSIC_26,
    33: CLASSIC_26,
    36: CLASSIC_26,
  },
  soft: {
    20: SOFT_26,
    26: SOFT_26,
    33: SOFT_26,
  },
  quilted: {
    20: QUILTED_26.filter((seed) => seed.id === "brass-black"),
    26: QUILTED_26,
    33: QUILTED_26.filter((seed) => seed.id === "brass-black"),
    36: QUILTED_26.filter((seed) =>
      ["brass-black", "brass-maple"].includes(seed.id),
    ),
  },
  "pillow-quilted": {
    20: PILLOW_26,
    26: PILLOW_26,
  },
  "signature-canvas": {
    26: SIGNATURE_26,
    33: SIGNATURE_26.filter((seed) =>
      ["brass-black-multi", "brass-black"].includes(seed.id),
    ),
  },
  twisted: {
    26: TWISTED_26,
  },
  "loved-leather": {
    26: LOVED_26,
    33: LOVED_26.filter((seed) =>
      ["brass-black", "brass-maple", "silver-black"].includes(seed.id),
    ),
  },
  chain: {
    26: CHAIN_26,
    33: CHAIN_26.filter((seed) =>
      ["brass-black", "silver-black", "brass-maple"].includes(seed.id),
    ),
    36: CHAIN_26.filter((seed) =>
      ["brass-black", "brass-maple"].includes(seed.id),
    ),
  },
};

const STYLE_LABEL: Record<TabbyStyleId, string> = {
  classic: "Classic Tabby",
  soft: "Soft Tabby",
  quilted: "Quilted Tabby",
  "pillow-quilted": "Pillow Tabby",
  "signature-canvas": "Signature Tabby",
  twisted: "Twisted Tabby",
  "loved-leather": "Loved Leather Tabby",
  chain: "Chain Tabby",
};

function getColorSeeds(styleId: TabbyStyleId, size: TabbySize): TabbyColorSeed[] {
  const bySize = STYLE_SIZE_CATALOG[styleId];
  const catalogIds = getColorIdsForStyleSize(styleId, size);

  if (catalogIds.length > 0) {
    const seeds = bySize?.[size] ?? bySize?.[26] ?? CLASSIC_26;
    const seedById = new Map(seeds.map((seed) => [seed.id, seed]));
    return catalogIds
      .map((id) => seedById.get(id))
      .filter((seed): seed is TabbyColorSeed => Boolean(seed));
  }

  return bySize?.[size] ?? bySize?.[26] ?? CLASSIC_26;
}

export type TabbyColorOption = PdpColor & {
  /** Offered in this style but not for the current size */
  combinationAvailable: boolean;
};

function getAllColorSeedsForStyle(styleId: TabbyStyleId): TabbyColorSeed[] {
  const bySize = STYLE_SIZE_CATALOG[styleId];
  if (!bySize) {
    return CLASSIC_26;
  }

  const seedById = new Map<string, TabbyColorSeed>();
  for (const seeds of Object.values(bySize)) {
    if (!seeds) {
      continue;
    }

    for (const seed of seeds) {
      seedById.set(seed.id, seed);
    }
  }

  const styleColorIds = getColorIdsForStyle(styleId);
  return styleColorIds
    .map((id) => seedById.get(id))
    .filter((seed): seed is TabbyColorSeed => Boolean(seed));
}

export function getTabbyColorOptionsForStyleSize(
  styleId: TabbyStyleId,
  size: TabbySize,
): TabbyColorOption[] {
  const styleLabel = STYLE_LABEL[styleId];
  const selectableIds = new Set(getColorIdsForStyleSize(styleId, size));

  return getAllColorSeedsForStyle(styleId).map((seed) => ({
    ...toPdpColor(seed, styleLabel, size),
    combinationAvailable: selectableIds.has(seed.id),
  }));
}

export function getTabbyColorsForSku(sku: TabbySku): PdpColor[] {
  const styleLabel = STYLE_LABEL[sku.styleId];
  return getColorSeeds(sku.styleId, sku.size).map((seed) =>
    toPdpColor(seed, styleLabel, sku.size),
  );
}

export function getDefaultColorIdForSku(sku: TabbySku): string {
  return (
    getDefaultColorIdForStyleSize(sku.styleId, sku.size) ??
    getColorSeeds(sku.styleId, sku.size)[0]?.id ??
    "brass-black"
  );
}

export function resolveTabbyColorId(
  styleId: TabbyStyleId,
  size: TabbySize,
  colorId: string | null | undefined,
): string {
  const seeds = getColorSeeds(styleId, size);
  const normalized = colorId ? LEGACY_COLOR_ID_MAP[colorId] ?? colorId : null;

  if (normalized && seeds.some((seed) => seed.id === normalized)) {
    return normalized;
  }

  return getDefaultColorIdForStyleSize(styleId, size);
}

/** Display name for adjustment copy */
function getTabbyColorName(
  styleId: TabbyStyleId,
  colorId: string,
): string {
  const seeds = getAllColorSeedsForStyle(styleId);
  return seeds.find((seed) => seed.id === colorId)?.name ?? colorId;
}

/** Dedicated studio hero — distinct from the swatch thumbnail; renders as static 4:5 hero */
export function hasTabbyColorHeroOverride(color: PdpColor): boolean {
  return color.hero !== color.swatch;
}

/** Coach "Hardware/Shade" — compact bar shows shade; sheet keeps full name */
export function splitCoachColorName(name: string): {
  hardware: string;
  shade: string;
  full: string;
} {
  const slash = name.indexOf("/");

  if (slash === -1) {
    return { hardware: "", shade: name, full: name };
  }

  return {
    hardware: name.slice(0, slash),
    shade: name.slice(slash + 1),
    full: name,
  };
}
