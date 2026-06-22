import type { TabbySize, TabbyStyleId } from "./pdp-tabby-variants";
import { getTabbyStyle, TABBY_SIZES } from "./pdp-tabby-variants";

/** Valid style → size → colorIds combination */
type TabbyFamilySizeEntry = {
  size: TabbySize;
  colorIds: string[];
};

type TabbyFamilyStyleEntry = {
  styleId: TabbyStyleId;
  sizes: TabbyFamilySizeEntry[];
};

export type TabbySizeAvailability = {
  size: TabbySize;
  available: boolean;
};

export type TabbySelectionAdjustment = {
  kind: "size" | "color";
  message: string;
};

export type ResolvedTabbySelection = {
  styleId: TabbyStyleId;
  size: TabbySize;
  colorId: string;
  slug: string;
  adjustments: TabbySelectionAdjustment[];
};

/**
 * Tabby product family — valid combinations only.
 * Style is primary; sizes and colors depend on prior selections.
 */
const TABBY_FAMILY_CATALOG: TabbyFamilyStyleEntry[] = [
  {
    styleId: "classic",
    sizes: [
      {
        size: 20,
        colorIds: [
          "brass-black",
          "brass-chalk",
          "brass-maple",
          "brass-biscuit",
        ],
      },
      {
        size: 26,
        colorIds: [
          "brass-black",
          "brass-chalk",
          "brass-maple",
          "brass-moss",
          "brass-biscuit",
          "silver-dragonfruit",
          "silver-flower-pink",
        ],
      },
      {
        size: 33,
        colorIds: ["brass-black", "brass-chalk", "brass-maple", "brass-biscuit"],
      },
      {
        size: 36,
        colorIds: ["brass-black", "brass-maple", "brass-biscuit"],
      },
    ],
  },
  {
    styleId: "soft",
    sizes: [
      {
        size: 20,
        colorIds: ["brass-black", "brass-maple", "brass-biscuit"],
      },
      {
        size: 26,
        colorIds: [
          "brass-black",
          "brass-maple",
          "brass-biscuit",
          "brass-moss",
          "silver-dragonfruit",
        ],
      },
      {
        size: 33,
        colorIds: ["brass-black", "brass-maple", "brass-biscuit"],
      },
    ],
  },
  {
    styleId: "quilted",
    sizes: [
      {
        size: 20,
        colorIds: [
          "brass-black",
          "silver-black",
          "brass-chalk",
          "brass-maple",
          "brass-biscuit",
        ],
      },
      {
        size: 26,
        colorIds: [
          "brass-black",
          "silver-black",
          "brass-chalk",
          "silver-soft-purple",
          "brass-indigo",
          "brass-maple",
          "brass-biscuit",
          "brass-black-multi",
        ],
      },
      {
        size: 33,
        colorIds: ["brass-black"],
      },
      {
        size: 36,
        colorIds: ["brass-black", "brass-maple"],
      },
    ],
  },
  {
    styleId: "pillow-quilted",
    sizes: [
      {
        size: 20,
        colorIds: ["brass-black", "brass-chalk", "silver-soft-purple"],
      },
      {
        size: 26,
        colorIds: [
          "brass-black",
          "brass-chalk",
          "brass-maple",
          "silver-soft-purple",
        ],
      },
    ],
  },
  {
    styleId: "signature-canvas",
    sizes: [
      {
        size: 26,
        colorIds: ["brass-black-multi", "brass-black", "brass-chalk"],
      },
      {
        size: 33,
        colorIds: ["brass-black-multi", "brass-black"],
      },
    ],
  },
  {
    styleId: "twisted",
    sizes: [
      {
        size: 26,
        colorIds: ["brass-black", "brass-maple", "silver-black", "brass-biscuit"],
      },
    ],
  },
  {
    styleId: "loved-leather",
    sizes: [
      {
        size: 26,
        colorIds: [
          "brass-black",
          "brass-maple",
          "silver-soft-purple",
          "silver-black",
        ],
      },
      {
        size: 33,
        colorIds: ["brass-black", "brass-maple", "silver-black"],
      },
    ],
  },
  {
    styleId: "chain",
    sizes: [
      {
        size: 26,
        colorIds: [
          "brass-black",
          "silver-black",
          "brass-maple",
          "silver-soft-purple",
        ],
      },
      {
        size: 33,
        colorIds: ["brass-black", "silver-black", "brass-maple"],
      },
      {
        size: 36,
        colorIds: ["brass-black", "brass-maple"],
      },
    ],
  },
];

const CATALOG_BY_STYLE = new Map<TabbyStyleId, TabbyFamilyStyleEntry>(
  TABBY_FAMILY_CATALOG.map((entry) => [entry.styleId, entry]),
);

function getTabbyFamilyStyleEntry(
  styleId: TabbyStyleId,
): TabbyFamilyStyleEntry | undefined {
  return CATALOG_BY_STYLE.get(styleId);
}

export function getAvailableSizesForStyle(styleId: TabbyStyleId): TabbySize[] {
  return getTabbyFamilyStyleEntry(styleId)?.sizes.map((entry) => entry.size) ?? [];
}

function isSizeAvailableForStyle(
  styleId: TabbyStyleId,
  size: TabbySize,
): boolean {
  return getAvailableSizesForStyle(styleId).includes(size);
}

export function getSizeAvailabilityForStyle(
  styleId: TabbyStyleId,
): TabbySizeAvailability[] {
  const available = new Set(getAvailableSizesForStyle(styleId));

  return TABBY_SIZES.map((size) => ({
    size,
    available: available.has(size),
  }));
}

export function getColorIdsForStyleSize(
  styleId: TabbyStyleId,
  size: TabbySize,
): string[] {
  const styleEntry = getTabbyFamilyStyleEntry(styleId);
  const sizeEntry = styleEntry?.sizes.find((entry) => entry.size === size);
  return sizeEntry?.colorIds ?? [];
}

/** All color IDs offered anywhere in this style — for showing disabled swatches */
export function getColorIdsForStyle(styleId: TabbyStyleId): string[] {
  const styleEntry = getTabbyFamilyStyleEntry(styleId);
  if (!styleEntry) {
    return [];
  }

  const ids = new Set<string>();
  for (const sizeEntry of styleEntry.sizes) {
    for (const colorId of sizeEntry.colorIds) {
      ids.add(colorId);
    }
  }

  return [...ids];
}

export function isColorAvailableForStyleSize(
  styleId: TabbyStyleId,
  size: TabbySize,
  colorId: string,
): boolean {
  return getColorIdsForStyleSize(styleId, size).includes(colorId);
}

export function getNearestAvailableSize(
  styleId: TabbyStyleId,
  preferred: TabbySize,
): TabbySize {
  const available = getAvailableSizesForStyle(styleId);
  if (available.length === 0) {
    return preferred;
  }

  if (available.includes(preferred)) {
    return preferred;
  }

  return available.reduce((nearest, candidate) =>
    Math.abs(candidate - preferred) < Math.abs(nearest - preferred)
      ? candidate
      : nearest,
  );
}

export function getDefaultColorIdForStyleSize(
  styleId: TabbyStyleId,
  size: TabbySize,
): string {
  return getColorIdsForStyleSize(styleId, size)[0] ?? "brass-black";
}

function buildSizeAdjustmentMessage(
  previousSize: TabbySize,
  styleId: TabbyStyleId,
): string {
  const styleLabel = getTabbyStyle(styleId).label;
  return `Size updated because ${previousSize} is not available in ${styleLabel}.`;
}

function buildColorAdjustmentMessage(
  colorName: string,
  context: "style" | "size",
): string {
  if (context === "style") {
    return `Color updated because ${colorName} is not available in this style.`;
  }

  return `Color updated because ${colorName} is not available in this size.`;
}

export type TabbySelectionInput = {
  styleId: TabbyStyleId;
  size: TabbySize;
  colorId: string;
  /** When true, emit adjustment messages for auto-corrections */
  trackAdjustments?: boolean;
  colorNameLookup?: (colorId: string) => string;
};

/** Resolve style → size → color with cascade rules */
export function resolveTabbySelection({
  styleId,
  size,
  colorId,
  trackAdjustments = false,
  colorNameLookup,
}: TabbySelectionInput): ResolvedTabbySelection {
  const adjustments: TabbySelectionAdjustment[] = [];
  let resolvedSize = size;
  let resolvedColorId = colorId;

  if (!isSizeAvailableForStyle(styleId, resolvedSize)) {
    const previousSize = resolvedSize;
    resolvedSize = getNearestAvailableSize(styleId, resolvedSize);

    if (trackAdjustments && previousSize !== resolvedSize) {
      adjustments.push({
        kind: "size",
        message: buildSizeAdjustmentMessage(previousSize, styleId),
      });
    }
  }

  const colorsForSize = getColorIdsForStyleSize(styleId, resolvedSize);
  const colorInStyle = getColorIdsForStyle(styleId).includes(resolvedColorId);

  if (!colorsForSize.includes(resolvedColorId)) {
    const previousColorId = resolvedColorId;
    resolvedColorId = getDefaultColorIdForStyleSize(styleId, resolvedSize);

    if (trackAdjustments && previousColorId !== resolvedColorId) {
      const colorName =
        colorNameLookup?.(previousColorId) ?? previousColorId;
      adjustments.push({
        kind: "color",
        message: buildColorAdjustmentMessage(
          colorName,
          colorInStyle ? "size" : "style",
        ),
      });
    }
  }

  const slug = `tabby-shoulder-bag-${resolvedSize}-${styleId}`;

  return {
    styleId,
    size: resolvedSize,
    colorId: resolvedColorId,
    slug,
    adjustments,
  };
}
