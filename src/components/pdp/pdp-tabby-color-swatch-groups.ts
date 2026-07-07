import { getAvailableSizesForStyle } from "./pdp-tabby-catalog";
import {
  getTabbyColorOptionsForStyleSize,
  type TabbyColorOption,
} from "./pdp-tabby-colors";
import type { TabbySize, TabbyStyleId } from "./pdp-tabby-variants";

export type TabbyColorSwatchGroup = {
  id: string;
  label: string;
  size: TabbySize;
  colors: TabbyColorOption[];
};

function tabbyFamilyLabel(size: TabbySize): string {
  return `Tabby ${size}`;
}

/** Size-family tabs — Tabby 26, Tabby 20, … within the current material. */
export function getTabbyColorSwatchGroups(
  styleId: TabbyStyleId,
  currentSize: TabbySize,
): TabbyColorSwatchGroup[] {
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
      const colors = getTabbyColorOptionsForStyleSize(styleId, size).filter(
        (color) => color.combinationAvailable,
      );

      return {
        id: String(size),
        label: tabbyFamilyLabel(size),
        size,
        colors,
      };
    })
    .filter((group) => group.colors.length > 0);
}
