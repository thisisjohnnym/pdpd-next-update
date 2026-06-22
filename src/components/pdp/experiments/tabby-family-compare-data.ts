import {
  getAvailableSizesForStyle,
  getNearestAvailableSize,
  isColorAvailableForStyleSize,
  resolveTabbySelection,
} from "../pdp-tabby-catalog";
import {
  getTabbyProductTitle,
  getTabbySizeOption,
  getTabbySku,
  getTabbyStyle,
  TABBY_SIZES,
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";

/** Core Tabby silhouettes surfaced in the family compare picker */
const TABBY_COMPARE_STYLE_IDS: TabbyStyleId[] = [
  "classic",
  "soft",
  "quilted",
  "pillow-quilted",
  "twisted",
  "chain",
];

type TabbyCompareProduct = {
  styleId: TabbyStyleId;
  size: TabbySize;
  slug: string;
  colorId: string;
  name: string;
  subtitle: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  shortLabel: string;
  unavailable?: boolean;
};

type TabbyCompareAttributeRow = {
  id: string;
  label: string;
  value: string;
};

type TabbyCompareColumnRow = {
  id: string;
  label: string;
  currentValue: string;
  comparisonValue: string;
};

const STYLE_TRAITS: Record<
  TabbyStyleId,
  {
    /** One-line personality shown on the family rail card */
    tagline: string;
    /** Plain-language "why you'd pick this one over the others" */
    reason: string;
    /** Short positioning line for the family explorer hero */
    positioning: string;
    structure: string;
    strapOptions: string;
    fits: string;
    bestFor: string;
  }
> = {
  classic: {
    tagline: "Structured & polished",
    reason: "Keeps its shape — looks polished even half-empty.",
    positioning: "Structured, polished, iconic.",
    structure: "More structured",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Everyday carry",
  },
  soft: {
    tagline: "Relaxed & slouchy",
    reason: "Slouches and molds to you — easy to tuck under your arm.",
    positioning: "Relaxed, slouchy, effortless.",
    structure: "Softer/slouchier",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, essentials",
    bestFor: "Relaxed everyday",
  },
  quilted: {
    tagline: "Diamond-quilted shine",
    reason: "Quilting adds texture and shine — dresses up or down.",
    positioning: "Quilted texture with a little shine.",
    structure: "Diamond-quilted",
    strapOptions: "Chain or leather",
    fits: "Phone, wallet, keys",
    bestFor: "Day-to-night",
  },
  "pillow-quilted": {
    tagline: "Puffy & padded",
    reason: "Pillowy and lightweight — comfortable for all-day wear.",
    positioning: "Pillowy, padded, featherlight.",
    structure: "Puffy, padded",
    strapOptions: "Chain & leather",
    fits: "Phone, wallet, small items",
    bestFor: "Weekends & travel",
  },
  "signature-canvas": {
    tagline: "Logo-forward",
    reason: "Signature print and a lighter price than leather.",
    positioning: "Logo-forward and lighter on price.",
    structure: "Signature canvas",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Logo-forward looks",
  },
  twisted: {
    tagline: "Sculptural statement",
    reason: "Sculptural twist detail — a quiet statement piece.",
    positioning: "Sculptural twist, quietly bold.",
    structure: "Sculptural twist detail",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Statement evenings",
  },
  "loved-leather": {
    tagline: "Vintage character",
    reason: "Broken-in, vintage look with character from day one.",
    positioning: "Broken-in character from day one.",
    structure: "Vintage-worn leather",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Character-rich carry",
  },
  chain: {
    tagline: "Chain-forward, dressy",
    reason: "Chain strap reads dressy — made for evenings out.",
    positioning: "Chain-forward and dressed up.",
    structure: "Chain-forward styling",
    strapOptions: "Integrated chain strap",
    fits: "Phone, wallet, keys",
    bestFor: "Dressy occasions",
  },
};

const SIZE_CAPACITY_INDEX: Record<TabbySize, number> = {
  20: 0.32,
  26: 0.5,
  33: 0.74,
  36: 0.88,
};

const SIZE_WEIGHT_INDEX: Record<TabbySize, number> = {
  20: 0.34,
  26: 0.5,
  33: 0.72,
  36: 0.86,
};

function parseWidthInches(dimensions: string): number {
  const match = /([\d.]+)/.exec(dimensions);
  return match ? Number.parseFloat(match[1]) : 0;
}

export function formatTabbyCompareAvailableSizes(
  sizes: TabbySize[],
): string {
  if (sizes.length === 0) {
    return "Currently unavailable";
  }

  return `Available in ${sizes.join(", ")}`;
}

function buildTabbyCompareProduct(
  styleId: TabbyStyleId,
  size: TabbySize,
  preferredColorId: string,
): TabbyCompareProduct {
  const availableSizes = getAvailableSizesForStyle(styleId);
  const unavailable = availableSizes.length === 0;
  const resolvedSize = unavailable
    ? size
    : getNearestAvailableSize(styleId, size);

  const resolved = resolveTabbySelection({
    styleId,
    size: resolvedSize,
    colorId: preferredColorId,
  });

  const style = getTabbyStyle(resolved.styleId);
  const sku = getTabbySku(resolved.size, resolved.styleId);

  return {
    styleId: resolved.styleId,
    size: resolved.size,
    slug: resolved.slug,
    colorId: resolved.colorId,
    name: getTabbyProductTitle(resolved.size, resolved.styleId),
    subtitle: style.materialLabel,
    price: sku.price,
    imageSrc: style.thumbnail,
    imageAlt: style.thumbnailAlt,
    shortLabel: `${style.label} · ${resolved.size}`,
    unavailable,
  };
}

/** Default comparison — different silhouette at the shopper's current size when possible */
function getDefaultComparisonTarget(
  currentStyleId: TabbyStyleId,
  currentSize: TabbySize,
  preferredColorId: string,
): TabbyCompareProduct {
  const alternateStyle =
    TABBY_COMPARE_STYLE_IDS.find((id) => id !== currentStyleId) ??
    TABBY_COMPARE_STYLE_IDS[0]!;

  const size = getNearestAvailableSize(alternateStyle, currentSize);

  return buildTabbyCompareProduct(alternateStyle, size, preferredColorId);
}

function canAddExactCompareProduct(
  product: TabbyCompareProduct,
  preferredColorId: string,
): boolean {
  if (product.unavailable) {
    return false;
  }

  return isColorAvailableForStyleSize(
    product.styleId,
    product.size,
    preferredColorId,
  );
}

function compareSizeLabel(current: TabbySize, alternative: TabbySize): string {
  if (current === alternative) {
    return "Same footprint";
  }

  const currentWidth = parseWidthInches(getTabbySizeOption(current).dimensions);
  const altWidth = parseWidthInches(getTabbySizeOption(alternative).dimensions);
  const delta = altWidth - currentWidth;

  if (Math.abs(delta) < 0.05) {
    return "Same footprint";
  }

  if (Math.abs(delta - 0.5) < 0.15) {
    return delta > 0 ? '½" larger' : '½" smaller';
  }

  return alternative > current ? "Larger silhouette" : "Smaller silhouette";
}

function compareCapacityLabel(current: TabbySize, alternative: TabbySize): string {
  const currentIndex = SIZE_CAPACITY_INDEX[current];
  const altIndex = SIZE_CAPACITY_INDEX[alternative];
  const diff = altIndex - currentIndex;

  if (Math.abs(diff) < 0.04) {
    return "Similar room";
  }

  if (diff > 0.12 && diff <= 0.28) {
    return "~20% roomier";
  }

  if (diff > 0.28) {
    return "Much roomier";
  }

  if (diff < -0.12 && diff >= -0.28) {
    return "~20% more compact";
  }

  return diff > 0 ? "More room" : "Less room";
}

function compareWeightLabel(current: TabbySize, alternative: TabbySize): string {
  const diff = SIZE_WEIGHT_INDEX[alternative] - SIZE_WEIGHT_INDEX[current];

  if (Math.abs(diff) < 0.04) {
    return "Similar weight";
  }

  if (diff <= -0.12) {
    return "≈4 oz lighter";
  }

  if (diff >= 0.12) {
    return "≈4 oz heavier";
  }

  return diff > 0 ? "Slightly heavier" : "Slightly lighter";
}

function compareStructureLabel(
  currentStyleId: TabbyStyleId,
  alternativeStyleId: TabbyStyleId,
): string {
  if (currentStyleId === alternativeStyleId) {
    return STYLE_TRAITS[currentStyleId].structure;
  }

  return STYLE_TRAITS[alternativeStyleId].structure;
}

/** Absolute, plain-language size label per product */
function absoluteSizeLabel(size: TabbySize): string {
  return getTabbySizeOption(size).dimensions;
}

/** Absolute capacity descriptor from the size index */
function absoluteCapacityLabel(size: TabbySize): string {
  const index = SIZE_CAPACITY_INDEX[size];
  if (index < 0.4) {
    return "Compact";
  }
  if (index < 0.62) {
    return "Everyday room";
  }
  if (index < 0.8) {
    return "Roomy";
  }
  return "Spacious";
}

/** Absolute weight descriptor from the size index */
function absoluteWeightLabel(size: TabbySize): string {
  const index = SIZE_WEIGHT_INDEX[size];
  if (index < 0.4) {
    return "Lightest";
  }
  if (index < 0.62) {
    return "Light";
  }
  if (index < 0.8) {
    return "Medium";
  }
  return "Heaviest";
}

/** Two-column comparison rows — absolute values for current and comparison */
function buildTabbyCompareColumnRows(
  current: TabbyCompareProduct,
  comparison: TabbyCompareProduct,
): TabbyCompareColumnRow[] {
  const currentTraits = STYLE_TRAITS[current.styleId];
  const comparisonTraits = STYLE_TRAITS[comparison.styleId];

  return [
    {
      id: "size",
      label: "Size",
      currentValue: absoluteSizeLabel(current.size),
      comparisonValue: absoluteSizeLabel(comparison.size),
    },
    {
      id: "capacity",
      label: "Capacity",
      currentValue: absoluteCapacityLabel(current.size),
      comparisonValue: absoluteCapacityLabel(comparison.size),
    },
    {
      id: "weight",
      label: "Weight",
      currentValue: absoluteWeightLabel(current.size),
      comparisonValue: absoluteWeightLabel(comparison.size),
    },
    {
      id: "strap-options",
      label: "Strap options",
      currentValue: currentTraits.strapOptions,
      comparisonValue: comparisonTraits.strapOptions,
    },
    {
      id: "structure",
      label: "Structure",
      currentValue: currentTraits.structure,
      comparisonValue: comparisonTraits.structure,
    },
    {
      id: "fits",
      label: "Fits",
      currentValue: currentTraits.fits,
      comparisonValue: comparisonTraits.fits,
    },
    {
      id: "best-for",
      label: "Best for",
      currentValue: currentTraits.bestFor,
      comparisonValue: comparisonTraits.bestFor,
    },
  ];
}

/** A silhouette in the family rail — the qualitative axis */
type TabbyFamilyMember = {
  styleId: TabbyStyleId;
  label: string;
  tagline: string;
  material: string;
  imageSrc: string;
  imageAlt: string;
  /** Lowest price available across this style's sizes */
  priceFrom: string;
  isCurrent: boolean;
  available: boolean;
};

/** One stop on the size scale — the quantitative axis */
type TabbySizeStop = {
  size: TabbySize;
  dimensions: string;
  capacity: string;
  weight: string;
  fits: string;
  price: string;
  available: boolean;
  /** Real width in inches — used to draw a proportional footprint */
  widthIn: number;
  /** Real height in inches — used to draw a proportional footprint */
  heightIn: number;
};

/** The defining traits of a single family member (no comparison framing) */
type TabbyFamilyTrait = {
  id: string;
  label: string;
  value: string;
};

function styleLowestPrice(styleId: TabbyStyleId): string {
  const sizes = getAvailableSizesForStyle(styleId);
  if (sizes.length === 0) {
    return getTabbySku(26, styleId).price;
  }

  const cheapest = sizes
    .map((size) => ({ size, value: priceToNumber(getTabbySku(size, styleId).price) }))
    .sort((a, b) => a.value - b.value)[0]!;

  return getTabbySku(cheapest.size, styleId).price;
}

function priceToNumber(price: string): number {
  return Number.parseFloat(price.replace(/[^\d.]/g, "")) || 0;
}

/** A single Tabby style as a featured slide in the Apple-style family explorer */
export type TabbyFamilyExplorerMember = {
  styleId: TabbyStyleId;
  /** Family name, e.g. "Classic Tabby" */
  name: string;
  /** Short positioning line, e.g. "Structured, polished, iconic." */
  positioning: string;
  imageSrc: string;
  imageAlt: string;
  isCurrent: boolean;
};

/** Family explorer slides — keeps the catalog order, flags the current style */
export function buildTabbyFamilyExplorer(
  currentStyleId: TabbyStyleId,
): TabbyFamilyExplorerMember[] {
  return TABBY_COMPARE_STYLE_IDS.map((styleId) => {
    const style = getTabbyStyle(styleId);
    const traits = STYLE_TRAITS[styleId];

    return {
      styleId,
      name: `${style.label} Tabby`,
      positioning: traits.positioning,
      imageSrc: style.thumbnail,
      imageAlt: style.thumbnailAlt,
      isCurrent: styleId === currentStyleId,
    } satisfies TabbyFamilyExplorerMember;
  });
}

/** The shape family as rail cards — current member flagged, ordered current-first */
function buildTabbyFamilyMembers(
  currentStyleId: TabbyStyleId,
): TabbyFamilyMember[] {
  const members = TABBY_COMPARE_STYLE_IDS.map((styleId) => {
    const style = getTabbyStyle(styleId);
    const traits = STYLE_TRAITS[styleId];

    return {
      styleId,
      label: style.label,
      tagline: traits.tagline,
      material: style.materialLabel,
      imageSrc: style.thumbnail,
      imageAlt: style.thumbnailAlt,
      priceFrom: styleLowestPrice(styleId),
      isCurrent: styleId === currentStyleId,
      available: getAvailableSizesForStyle(styleId).length > 0,
    } satisfies TabbyFamilyMember;
  });

  return members.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}

function parseDimensionInches(dimensions: string): { widthIn: number; heightIn: number } {
  const numbers = dimensions.match(/[\d.]+/g)?.map(Number) ?? [];
  return {
    widthIn: numbers[0] ?? 0,
    heightIn: numbers[1] ?? 0,
  };
}

/** Size scale for a style — every size, marked available or not */
function buildTabbySizeScale(styleId: TabbyStyleId): TabbySizeStop[] {
  const available = new Set(getAvailableSizesForStyle(styleId));
  const fits = STYLE_TRAITS[styleId].fits;

  return TABBY_SIZES.map((size) => {
    const dimensions = absoluteSizeLabel(size);

    return {
      size,
      dimensions,
      capacity: absoluteCapacityLabel(size),
      weight: absoluteWeightLabel(size),
      fits,
      price: getTabbySku(size, styleId).price,
      available: available.has(size),
      ...parseDimensionInches(dimensions),
    };
  });
}

/** Why a shopper would choose this silhouette over the others */
function getTabbyStyleReason(styleId: TabbyStyleId): string {
  return STYLE_TRAITS[styleId].reason;
}

/** The traits that define a member — used for the focused-member identity list */
function buildTabbyFamilyTraits(styleId: TabbyStyleId): TabbyFamilyTrait[] {
  const style = getTabbyStyle(styleId);
  const traits = STYLE_TRAITS[styleId];

  return [
    { id: "material", label: "Material", value: style.materialLabel },
    { id: "structure", label: "Structure", value: traits.structure },
    { id: "strap", label: "Strap", value: traits.strapOptions },
    { id: "best-for", label: "Best for", value: traits.bestFor },
  ];
}

/**
 * One plain-language line describing how a focused member differs from the
 * shopper's current style. Returns null when it is the current style.
 */
function describeFamilyDifference(
  currentStyleId: TabbyStyleId,
  focusedStyleId: TabbyStyleId,
): string | null {
  if (currentStyleId === focusedStyleId) {
    return null;
  }

  const current = STYLE_TRAITS[currentStyleId];
  const focused = STYLE_TRAITS[focusedStyleId];
  const currentMaterial = getTabbyStyle(currentStyleId).materialLabel;
  const focusedMaterial = getTabbyStyle(focusedStyleId).materialLabel;

  const phrases: string[] = [];

  if (focusedMaterial !== currentMaterial) {
    phrases.push(focusedMaterial);
  }
  if (focused.structure !== current.structure) {
    phrases.push(focused.structure);
  }
  if (focused.strapOptions !== current.strapOptions) {
    phrases.push(focused.strapOptions);
  }

  if (phrases.length === 0) {
    phrases.push(focused.bestFor);
  }

  return phrases.slice(0, 2).join(" · ");
}

/** Customer-friendly comparison rows for the selected pair */
function buildTabbyCompareAttributeRows(
  current: TabbyCompareProduct,
  alternative: TabbyCompareProduct,
): TabbyCompareAttributeRow[] {
  const alternativeTraits = STYLE_TRAITS[alternative.styleId];

  return [
    {
      id: "size",
      label: "Size",
      value: compareSizeLabel(current.size, alternative.size),
    },
    {
      id: "capacity",
      label: "Capacity",
      value: compareCapacityLabel(current.size, alternative.size),
    },
    {
      id: "weight",
      label: "Weight",
      value: compareWeightLabel(current.size, alternative.size),
    },
    {
      id: "strap-options",
      label: "Strap options",
      value: alternativeTraits.strapOptions,
    },
    {
      id: "structure",
      label: "Structure",
      value: compareStructureLabel(current.styleId, alternative.styleId),
    },
    {
      id: "fits",
      label: "Fits",
      value: alternativeTraits.fits,
    },
    {
      id: "best-for",
      label: "Best for",
      value: alternativeTraits.bestFor,
    },
  ];
}
