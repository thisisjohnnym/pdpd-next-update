import {
  getAvailableSizesForStyle,
  isColorAvailableForStyleSize,
} from "../pdp-tabby-catalog";
import {
  getTabbyColorOptionsForStyleSize,
  type TabbyColorOption,
} from "../pdp-tabby-colors";
import type { TabbyVariantContextValue } from "../pdp-tabby-variant-context";
import {
  getTabbyStyle,
  type TabbySize,
  type TabbyStyleId,
} from "../pdp-tabby-variants";

/**
 * v3 color drawer data mapping (Paper r4 `EU5-0` / `EIE-0`).
 *
 * Reshapes the frozen Tabby catalog into the three drawer sections without
 * touching the size-grouped `getTabbyColorSheetGroups`:
 *   - Popular colors — every colorway of the current material (current size)
 *   - Explore materials — the other Tabby materials, with status vs the current
 *     size + selected color
 *   - Bag size — the size cards for the current material
 */

export type V3MaterialStatus =
  | "current"
  | "in-stock"
  | "out-of-stock"
  | "unavailable-in-color";

export type V3MaterialEntry = {
  styleId: TabbyStyleId;
  label: string;
  swatch?: string;
  status: V3MaterialStatus;
};

/** Materials shown in the drawer, current material first. */
const V3_MATERIAL_ORDER: TabbyStyleId[] = [
  "classic",
  "soft",
  "quilted",
  "pillow-quilted",
  "signature-canvas",
  "twisted",
  "loved-leather",
  "chain",
];

function representativeSwatch(
  styleId: TabbyStyleId,
  size: TabbySize,
  selectedColorId: string,
): string | undefined {
  const offeredAtSize = getAvailableSizesForStyle(styleId).includes(size);
  const repSize = offeredAtSize ? size : getAvailableSizesForStyle(styleId)[0];
  if (repSize === undefined) {
    return undefined;
  }

  const options = getTabbyColorOptionsForStyleSize(styleId, repSize);
  const match =
    options.find((option) => option.id === selectedColorId) ?? options[0];
  return match?.swatch;
}

function materialStatus(
  styleId: TabbyStyleId,
  currentStyleId: TabbyStyleId,
  size: TabbySize,
  selectedColorId: string,
): V3MaterialStatus {
  if (styleId === currentStyleId) {
    return "current";
  }

  if (!getAvailableSizesForStyle(styleId).includes(size)) {
    return "out-of-stock";
  }

  return isColorAvailableForStyleSize(styleId, size, selectedColorId)
    ? "in-stock"
    : "unavailable-in-color";
}

/**
 * Intentional stakeholder demo (Paper r4 `EU5-0`). The frozen Tabby catalog
 * keeps the popular sizes broadly in stock, so a purely data-driven materials
 * list would never surface the availability states the pivot wants to show.
 * We pin the first three non-current materials to the states from the Paper
 * mock — in stock, out of stock (Notify me), not available in the selected
 * color — so the collapsed list always demos all four states. Any remaining
 * materials keep their real catalog status.
 */
const V3_DEMO_MATERIAL_STATUSES: V3MaterialStatus[] = [
  "in-stock",
  "out-of-stock",
  "unavailable-in-color",
];

function buildMaterials(
  currentStyleId: TabbyStyleId,
  size: TabbySize,
  selectedColorId: string,
): V3MaterialEntry[] {
  // Current material leads the list (matches Paper), the rest follow in order.
  const ordered: TabbyStyleId[] = [
    currentStyleId,
    ...V3_MATERIAL_ORDER.filter((styleId) => styleId !== currentStyleId),
  ];

  let demoIndex = 0;
  return ordered.map((styleId) => {
    let status = materialStatus(styleId, currentStyleId, size, selectedColorId);
    if (status !== "current") {
      status = V3_DEMO_MATERIAL_STATUSES[demoIndex] ?? status;
      demoIndex += 1;
    }
    return {
      styleId,
      label: getTabbyStyle(styleId).materialLabel,
      swatch: representativeSwatch(styleId, size, selectedColorId),
      status,
    };
  });
}

export type V3ColorSheetSections = {
  popularColors: TabbyColorOption[];
  materials: V3MaterialEntry[];
  sizes: TabbyVariantContextValue["sizeOptions"];
};

export function getV3ColorSheetSections(
  tabby: TabbyVariantContextValue,
): V3ColorSheetSections {
  return {
    popularColors: tabby.colorOptions,
    materials: buildMaterials(tabby.styleId, tabby.size, tabby.selectedColorId),
    sizes: tabby.sizeOptions,
  };
}
