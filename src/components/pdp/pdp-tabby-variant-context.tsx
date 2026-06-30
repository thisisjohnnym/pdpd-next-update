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
import {
  getSizeAvailabilityForStyle,
  resolveTabbySelection,
} from "./pdp-tabby-catalog";
import {
  getDefaultColorIdForSku,
  getTabbyColorOptionsForStyleSize,
  getTabbyColorsForSku,
  resolveTabbyColorId,
  type TabbyColorOption,
} from "./pdp-tabby-colors";
import {
  DEFAULT_TABBY_SIZE,
  DEFAULT_TABBY_SLUG,
  DEFAULT_TABBY_STYLE_ID,
  getTabbyProductTitle,
  getTabbySizeOption,
  getTabbySku,
  getTabbyStyle,
  parseTabbySlug,
  replaceTabbyBrowserUrl,
  type TabbySize,
  type TabbySku,
  type TabbyStyle,
  type TabbyStyleId,
} from "./pdp-tabby-variants";

export type TabbySizeOptionAvailability = {
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
  navigateToStyle: (styleId: TabbyStyleId) => void;
  navigateToSize: (size: TabbySize) => void;
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
export function TabbyVariantProvider({
  slug: initialSlug,
  children,
}: {
  slug?: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const { productId: activeProductId } = useActiveProduct();
  const [slug, setSlug] = useState(() => resolveInitialSlug(initialSlug));

  const parsed = parseTabbySlug(slug);
  const styleId = parsed?.styleId ?? DEFAULT_TABBY_STYLE_ID;
  const size = parsed?.size ?? DEFAULT_TABBY_SIZE;
  const sku = useMemo(() => getTabbySku(size, styleId), [size, styleId]);
  const style = useMemo(() => getTabbyStyle(styleId), [styleId]);
  const colors = useMemo(() => getTabbyColorsForSku(sku), [sku]);
  const colorOptions = useMemo(
    () => getTabbyColorOptionsForStyleSize(styleId, size),
    [size, styleId],
  );
  const sizeOptions = useMemo(() => {
    return getSizeAvailabilityForStyle(styleId).map(({ size: entrySize, available }) => ({
      option: getTabbySizeOption(entrySize),
      available,
    }));
  }, [styleId]);

  const [selectedColorId, setSelectedColorIdState] = useState(() =>
    getDefaultColorIdForSku(sku),
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

    const resolved = resolveTabbySelection({
      styleId: parsedSlug.styleId,
      size: parsedSlug.size,
      colorId: selectedColorId,
    });

    if (resolved.slug !== slug) {
      setSlug(resolved.slug);
      replaceTabbyBrowserUrl(resolved.slug, resolved.colorId);
    }
  }, [activeProductId, selectedColorId, slug]);

  const paramColor = searchParams.get("color");

  useEffect(() => {
    const resolved = resolveTabbyColorId(styleId, size, paramColor);

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
      const resolvedCurrent = resolveTabbyColorId(styleId, size, current);
      if (colors.some((color) => color.id === resolvedCurrent)) {
        return resolvedCurrent;
      }
      return getDefaultColorIdForSku(sku);
    });
  }, [colors, paramColor, size, sku, styleId]);

  const applySelection = useCallback(
    (
      nextStyleId: TabbyStyleId,
      nextSize: TabbySize,
      preferredColorId: string,
    ) => {
      const resolved = resolveTabbySelection({
        styleId: nextStyleId,
        size: nextSize,
        colorId: preferredColorId,
      });

      setSlug(resolved.slug);
      setSelectedColorIdState(resolved.colorId);
      if (activeProductId === "tabby") {
        replaceTabbyBrowserUrl(resolved.slug, resolved.colorId);
      }
    },
    [activeProductId],
  );

  const setSelectedColorId = useCallback(
    (colorId: string) => {
      const color = colors.find((entry) => entry.id === colorId);
      if (!color || !pdpColorIsSelectable(color.availability)) {
        return;
      }

      setSelectedColorIdState(colorId);
      if (activeProductId === "tabby") {
        replaceTabbyBrowserUrl(slug, colorId);
      }
    },
    [activeProductId, colors, slug],
  );

  const selectColorAtSize = useCallback(
    (colorId: string, nextSize: TabbySize) => {
      const nextColors = getTabbyColorsForSku(getTabbySku(nextSize, styleId));
      const color = nextColors.find((entry) => entry.id === colorId);

      if (!color || !pdpColorIsSelectable(color.availability)) {
        return;
      }

      applySelection(styleId, nextSize, colorId);
    },
    [applySelection, styleId],
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
      navigateToStyle,
      navigateToSize,
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
