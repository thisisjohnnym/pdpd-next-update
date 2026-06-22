import { getAvailableSizesForStyle } from "./pdp-tabby-catalog";
import {
  getTabbyColorsForSku,
  type TabbyColorOption,
} from "./pdp-tabby-colors";
import {
  getTabbyProductTitle,
  getTabbySku,
  getTabbyStyle,
  type TabbySize,
  type TabbyStyleId,
} from "./pdp-tabby-variants";
import type { PdpColor } from "./pdp-data";

export type TabbyColorSheetGroup = {
  size: TabbySize;
  label: string;
  /** Full section heading in the color sheet */
  heading: string;
  isCurrent: boolean;
  colors: PdpColor[];
};

function getTabbyColorSheetGroupHeading(
  styleId: TabbyStyleId,
  size: TabbySize,
  isCurrent: boolean,
): string {
  if (styleId === "quilted") {
    if (isCurrent) {
      return `Tabby Shoulder Bag ${size} - Quilted Leather`;
    }

    if (size === 20) {
      return "Tabby 26 - With Quilting";
    }

    if (size === 33) {
      return "Tabby Shoulder Bag 26 - With Crystal Beaded Fringe";
    }

    return `Tabby ${size} - With Quilting`;
  }

  const material = getTabbyStyle(styleId).materialLabel;
  return `${getTabbyProductTitle(size)} · ${material}`;
}

/** Color sheet sections — current size first, then other sizes in this style */
export function getTabbyColorSheetGroups(
  styleId: TabbyStyleId,
  currentSize: TabbySize,
): TabbyColorSheetGroup[] {
  const sizes = getAvailableSizesForStyle(styleId);

  return [...sizes]
    .sort((left, right) => {
      if (left === currentSize) {
        return -1;
      }

      if (right === currentSize) {
        return 1;
      }

      return left - right;
    })
    .map((size) => {
      const isCurrent = size === currentSize;

      return {
        size,
        label: getTabbyProductTitle(size),
        heading: getTabbyColorSheetGroupHeading(styleId, size, isCurrent),
        isCurrent,
        colors: getTabbyColorsForSku(getTabbySku(size, styleId)),
      };
    })
    .filter((group) => group.colors.length > 0);
}

/** Flat list fallback — all style colors with size availability flags */
function flattenTabbyColorSheetGroups(
  groups: TabbyColorSheetGroup[],
  currentSize: TabbySize,
): TabbyColorOption[] {
  const selectableIds = new Set(
    groups.find((group) => group.size === currentSize)?.colors.map((color) => color.id) ??
      [],
  );

  const seedById = new Map<string, TabbyColorOption>();

  for (const group of groups) {
    for (const color of group.colors) {
      if (!seedById.has(color.id)) {
        seedById.set(color.id, {
          ...color,
          combinationAvailable: selectableIds.has(color.id),
        });
      }
    }
  }

  return [...seedById.values()];
}
