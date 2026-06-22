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
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";

/** Core Tabby silhouettes surfaced in the family compare picker */
export const TABBY_COMPARE_STYLE_IDS: TabbyStyleId[] = [
  "classic",
  "soft",
  "quilted",
  "pillow-quilted",
  "twisted",
  "chain",
];

export type TabbyCompareProduct = {
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
  adjustmentMessage?: string;
};

export type TabbyCompareAttributeRow = {
  id: string;
  label: string;
  value: string;
};

const STYLE_TRAITS: Record<
  TabbyStyleId,
  {
    structure: string;
    strapOptions: string;
    fits: string;
    bestFor: string;
  }
> = {
  classic: {
    structure: "More structured",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Everyday carry",
  },
  soft: {
    structure: "Softer/slouchier",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, essentials",
    bestFor: "Relaxed everyday",
  },
  quilted: {
    structure: "Diamond-quilted",
    strapOptions: "Chain or leather",
    fits: "Phone, wallet, keys",
    bestFor: "Day-to-night",
  },
  "pillow-quilted": {
    structure: "Puffy, padded",
    strapOptions: "Chain & leather",
    fits: "Phone, wallet, small items",
    bestFor: "Weekends & travel",
  },
  "signature-canvas": {
    structure: "Signature canvas",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Logo-forward looks",
  },
  twisted: {
    structure: "Sculptural twist detail",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Statement evenings",
  },
  "loved-leather": {
    structure: "Vintage-worn leather",
    strapOptions: "Detachable leather",
    fits: "Phone, wallet, keys",
    bestFor: "Character-rich carry",
  },
  chain: {
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

export function buildTabbyCompareProduct(
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
    trackAdjustments: true,
  });

  const style = getTabbyStyle(resolved.styleId);
  const sku = getTabbySku(resolved.size, resolved.styleId);
  const adjustmentMessage = resolved.adjustments[0]?.message;

  return {
    styleId: resolved.styleId,
    size: resolved.size,
    slug: resolved.slug,
    colorId: resolved.colorId,
    name: getTabbyProductTitle(resolved.size),
    subtitle: style.materialLabel,
    price: sku.price,
    imageSrc: style.thumbnail,
    imageAlt: style.thumbnailAlt,
    shortLabel: `${style.label} · ${resolved.size}`,
    unavailable,
    adjustmentMessage,
  };
}

/** Default comparison — different silhouette at the shopper's current size when possible */
export function getDefaultComparisonTarget(
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

export function canAddExactCompareProduct(
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

/** Customer-friendly comparison rows for the selected pair */
export function buildTabbyCompareAttributeRows(
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
