import type { PdpColorAvailability } from "../pdp-data";
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
  chromeSample?: string;
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

function representativeColor(
  styleId: TabbyStyleId,
  size: TabbySize,
  selectedColorId: string,
): TabbyColorOption | undefined {
  const offeredAtSize = getAvailableSizesForStyle(styleId).includes(size);
  const repSize = offeredAtSize ? size : getAvailableSizesForStyle(styleId)[0];
  if (repSize === undefined) {
    return undefined;
  }

  const options = getTabbyColorOptionsForStyleSize(styleId, repSize);
  return options.find((option) => option.id === selectedColorId) ?? options[0];
}

function representativeSwatch(
  styleId: TabbyStyleId,
  size: TabbySize,
  selectedColorId: string,
): string | undefined {
  return representativeColor(styleId, size, selectedColorId)?.swatch;
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
      chromeSample: representativeColor(styleId, size, selectedColorId)
        ?.chromeSample,
      status,
    };
  });
}

/**
 * v4 demo (Paper r5 `J2K-0`). Mirrors `V3_DEMO_MATERIAL_STATUSES` for Popular
 * Colors: the frozen catalog keeps popular colorways broadly in stock, so the
 * drawer never surfaces the sold-out + Notify me affordance the feedback asked
 * for. We pin the first *non-selected* color to "sold out" (frozen `notify`) so
 * the collapsed list demos the affordance once — never repeating one color across
 * states, and never stacking on top of catalog notify rows. v4 only; v1/v2/v3 keep
 * the raw catalog statuses.
 */
const V3_DEMO_POPULAR_STATUSES: PdpColorAvailability[] = ["notify"];

function buildPopularColors(
  tabby: TabbyVariantContextValue,
  demoStates: boolean,
): TabbyColorOption[] {
  if (!demoStates) {
    return tabby.colorOptions;
  }

  let demoIndex = 0;
  return tabby.colorOptions.map((color) => {
    if (color.id === tabby.selectedColorId) {
      return color;
    }
    const demo = V3_DEMO_POPULAR_STATUSES[demoIndex];
    if (!demo) {
      if (color.availability === "notify") {
        return { ...color, availability: "in_stock" };
      }
      return color;
    }
    demoIndex += 1;
    return { ...color, availability: demo };
  });
}

export type V3ColorSheetSections = {
  popularColors: TabbyColorOption[];
  materials: V3MaterialEntry[];
  sizes: TabbyVariantContextValue["sizeOptions"];
};

export function getV3ColorSheetSections(
  tabby: TabbyVariantContextValue,
  options: { demoPopularColorStates?: boolean } = {},
): V3ColorSheetSections {
  return {
    popularColors: buildPopularColors(
      tabby,
      options.demoPopularColorStates ?? false,
    ),
    materials: buildMaterials(tabby.styleId, tabby.size, tabby.selectedColorId),
    sizes: tabby.sizeOptions,
  };
}
