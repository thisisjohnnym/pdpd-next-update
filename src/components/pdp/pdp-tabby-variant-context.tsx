"use client";

import { useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { pdpColorIsSelectable } from "./pdp-data";
import { useActiveProduct } from "./pdp-active-product-context";
import { replaceTabbyBrowserUrl } from "./pdp-product-routes";
import {
  getSizeAvailabilityForStyle,
  resolveTabbySelection,
} from "./pdp-tabby-catalog";
import { resolveTabbySelection as resolveTabbySelectionV7 } from "./pdp-tabby-catalog-v7";
import {
  getDefaultColorIdForSku,
  getTabbyColorOptionsForStyleSize,
  getTabbyColorsForSku,
  resolveTabbyColorId,
  type TabbyColorOption,
} from "./pdp-tabby-colors";
import {
  getDefaultColorIdForSku as getDefaultColorIdForSkuV7,
  getTabbyColorOptionsForStyleSize as getTabbyColorOptionsForStyleSizeV7,
  getTabbyColorsForSku as getTabbyColorsForSkuV7,
  resolveTabbyColorId as resolveTabbyColorIdV7,
} from "./pdp-tabby-colors-v7";
import {
  DEFAULT_TABBY_SIZE,
  DEFAULT_TABBY_SLUG,
  DEFAULT_TABBY_STYLE_ID,
  getTabbyProductTitle,
  getTabbySizeOption,
  getTabbySku,
  getTabbyStyle,
  parseTabbySlug,
  type TabbySize,
  type TabbySku,
  type TabbyStyle,
  type TabbyStyleId,
} from "./pdp-tabby-variants";
import { usePdpVersion } from "./version/pdp-version-context";
import { getPdpVersionConfig } from "./version/pdp-version-config";

type TabbySizeOptionAvailability = {
  option: ReturnType<typeof getTabbySizeOption>;
  available: boolean;
};

export type TabbyVariantContextValue = {
  slug: string;
  sku: TabbySku;
  style: TabbyStyle;
  size: TabbySize;
  styleId: TabbyStyleId;
  /** Selectable colors for the current style + size */
  colors: ReturnType<typeof getTabbyColorsForSku>;
  /** All colors in this style — unavailable ones marked for current size */
  colorOptions: TabbyColorOption[];
  sizeOptions: TabbySizeOptionAvailability[];
  selectedColorId: string;
  setSelectedColorId: (colorId: string) => void;
  /** Jump to another size in the current style and select a color */
  selectColorAtSize: (colorId: string, size: TabbySize) => void;
  /** Jump to another style and select a preferred color in one action. */
  selectColorInStyle: (styleId: TabbyStyleId, colorId: string) => void;
  navigateToStyle: (styleId: TabbyStyleId) => void;
  navigateToSize: (size: TabbySize) => void;
  /** Jump to a style + size in one selection (Find your Tabby Shop CTA). */
  navigateToStyleSize: (styleId: TabbyStyleId, size: TabbySize) => void;
  summary: {
    name: string;
    subtitle: string;
    price: string;
  };
  isTabbyFamily: boolean;
};

const TabbyVariantContext = createContext<TabbyVariantContextValue | null>(null);

function resolveInitialSlug(initialSlug?: string): string {
  if (!initialSlug) {
    return DEFAULT_TABBY_SLUG;
  }

  const parsed = parseTabbySlug(initialSlug);
  if (!parsed) {
    return DEFAULT_TABBY_SLUG;
  }

  const resolved = resolveTabbySelection({
    styleId: parsed.styleId,
    size: parsed.size,
    colorId: getDefaultColorIdForSku(getTabbySku(parsed.size, parsed.styleId)),
  });

  return resolved.slug;
}

/** Style → Size → Color configurator for the Tabby product family */
// fallow-ignore-next-line complexity
export function TabbyVariantProvider({
  slug: initialSlug,
  children,
}: {
  slug?: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const { productId: activeProductId } = useActiveProduct();
  const version = usePdpVersion();
  const { useFullBagColorSwatches } = getPdpVersionConfig(version);
  const resolveSelection = useFullBagColorSwatches
    ? resolveTabbySelectionV7
    : resolveTabbySelection;
  const getColorsForSku = useFullBagColorSwatches
    ? getTabbyColorsForSkuV7
    : getTabbyColorsForSku;
  const getColorOptions = useFullBagColorSwatches
    ? getTabbyColorOptionsForStyleSizeV7
    : getTabbyColorOptionsForStyleSize;
  const getDefaultColor = useFullBagColorSwatches
    ? getDefaultColorIdForSkuV7
    : getDefaultColorIdForSku;
  const resolveColorId = useFullBagColorSwatches
    ? resolveTabbyColorIdV7
    : resolveTabbyColorId;

  const [slug, setSlug] = useState(() => resolveInitialSlug(initialSlug));

  const parsed = parseTabbySlug(slug);
  const styleId = parsed?.styleId ?? DEFAULT_TABBY_STYLE_ID;
  const size = parsed?.size ?? DEFAULT_TABBY_SIZE;
  const sku = useMemo(() => getTabbySku(size, styleId), [size, styleId]);
  const style = useMemo(() => getTabbyStyle(styleId), [styleId]);
  const colors = useMemo(() => getColorsForSku(sku), [getColorsForSku, sku]);
  const colorOptions = useMemo(
    () => getColorOptions(styleId, size),
    [getColorOptions, size, styleId],
  );
  const sizeOptions = useMemo(() => {
    return getSizeAvailabilityForStyle(styleId).map(({ size: entrySize, available }) => ({
      option: getTabbySizeOption(entrySize),
      available,
    }));
  }, [styleId]);

  const [selectedColorId, setSelectedColorIdState] = useState(() =>
    getDefaultColor(sku),
  );

  useEffect(() => {
    setSlug(resolveInitialSlug(initialSlug));
  }, [initialSlug]);

  useEffect(() => {
    if (activeProductId !== "tabby") {
      return;
    }

    const parsedSlug = parseTabbySlug(slug);
    if (!parsedSlug) {
      return;
    }

    const resolved = resolveSelection({
      styleId: parsedSlug.styleId,
      size: parsedSlug.size,
      colorId: selectedColorId,
    });

    if (resolved.slug !== slug) {
      setSlug(resolved.slug);
      replaceTabbyBrowserUrl(version, resolved.slug, resolved.colorId);
    }
  }, [activeProductId, selectedColorId, slug, version]);

  const paramColor = searchParams.get("color");

  useEffect(() => {
    const resolved = resolveColorId(styleId, size, paramColor);

    if (
      paramColor &&
      colors.some(
        (color) =>
          color.id === resolved && pdpColorIsSelectable(color.availability),
      )
    ) {
      setSelectedColorIdState(resolved);
      return;
    }

    setSelectedColorIdState((current) => {
      const resolvedCurrent = resolveColorId(styleId, size, current);
      if (colors.some((color) => color.id === resolvedCurrent)) {
        return resolvedCurrent;
      }
      return getDefaultColor(sku);
    });
  }, [colors, paramColor, size, sku, styleId]);

  const applySelection = useCallback(
    (
      nextStyleId: TabbyStyleId,
      nextSize: TabbySize,
      preferredColorId: string,
    ) => {
      const resolved = resolveSelection({
        styleId: nextStyleId,
        size: nextSize,
        colorId: preferredColorId,
      });

      setSlug(resolved.slug);
      setSelectedColorIdState(resolved.colorId);
      if (activeProductId === "tabby") {
        replaceTabbyBrowserUrl(version, resolved.slug, resolved.colorId);
      }
    },
    [activeProductId, version],
  );

  const setSelectedColorId = useCallback(
    (colorId: string) => {
      const option = colorOptions.find((entry) => entry.id === colorId);
      if (!option?.combinationAvailable) {
        return;
      }

      setSelectedColorIdState(colorId);
      if (activeProductId === "tabby") {
        replaceTabbyBrowserUrl(version, slug, colorId);
      }
    },
    [activeProductId, colorOptions, slug, version],
  );

  const selectColorAtSize = useCallback(
    (colorId: string, nextSize: TabbySize) => {
      const nextColors = getColorsForSku(getTabbySku(nextSize, styleId));
      const color = nextColors.find((entry) => entry.id === colorId);

      if (!color || !pdpColorIsSelectable(color.availability)) {
        return;
      }

      applySelection(styleId, nextSize, colorId);
    },
    [applySelection, styleId],
  );

  const selectColorInStyle = useCallback(
    (nextStyleId: TabbyStyleId, colorId: string) => {
      applySelection(nextStyleId, size, colorId);
    },
    [applySelection, size],
  );

  const navigateToStyle = useCallback(
    (nextStyleId: TabbyStyleId) => {
      if (nextStyleId === styleId) {
        return;
      }

      applySelection(nextStyleId, size, selectedColorId);
    },
    [applySelection, selectedColorId, size, styleId],
  );

  const navigateToSize = useCallback(
    (nextSize: TabbySize) => {
      const sizeEntry = sizeOptions.find((entry) => entry.option.size === nextSize);
      if (!sizeEntry?.available || nextSize === size) {
        return;
      }

      applySelection(styleId, nextSize, selectedColorId);
    },
    [applySelection, selectedColorId, size, sizeOptions, styleId],
  );

  const navigateToStyleSize = useCallback(
    (nextStyleId: TabbyStyleId, nextSize: TabbySize) => {
      if (nextStyleId === styleId && nextSize === size) {
        return;
      }

      applySelection(nextStyleId, nextSize, selectedColorId);
    },
    [applySelection, selectedColorId, size, styleId],
  );

  const value = useMemo<TabbyVariantContextValue>(
    () => ({
      slug,
      sku,
      style,
      size,
      styleId,
      colors,
      colorOptions,
      sizeOptions,
      selectedColorId,
      setSelectedColorId,
      selectColorAtSize,
      selectColorInStyle,
      navigateToStyle,
      navigateToSize,
      navigateToStyleSize,
      summary: {
        name: getTabbyProductTitle(size, styleId),
        subtitle: style.materialLabel,
        price: sku.price,
      },
      isTabbyFamily: true,
    }),
    [
      colorOptions,
      colors,
      navigateToSize,
      navigateToStyle,
      navigateToStyleSize,
      selectColorInStyle,
      selectColorAtSize,
      selectedColorId,
      setSelectedColorId,
      size,
      sizeOptions,
      sku,
      slug,
      style,
      styleId,
    ],
  );

  return (
    <TabbyVariantContext.Provider value={value}>
      {children}
    </TabbyVariantContext.Provider>
  );
}

export function useTabbyVariant(): TabbyVariantContextValue {
  const context = useContext(TabbyVariantContext);

  if (!context) {
    throw new Error("useTabbyVariant must be used within TabbyVariantProvider");
  }

  return context;
}

export function useOptionalTabbyVariant(): TabbyVariantContextValue | null {
  return useContext(TabbyVariantContext);
}
