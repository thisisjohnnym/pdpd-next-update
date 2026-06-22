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
import {
  getSizeAvailabilityForStyle,
  resolveTabbySelection,
  type TabbySelectionAdjustment,
} from "./pdp-tabby-catalog";
import {
  getDefaultColorIdForSku,
  getTabbyColorName,
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

type TabbySizeOptionAvailability = {
  option: ReturnType<typeof getTabbySizeOption>;
  available: boolean;
};

type TabbyVariantContextValue = {
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
  navigateToStyle: (styleId: TabbyStyleId) => void;
  navigateToSize: (size: TabbySize) => void;
  adjustment: TabbySelectionAdjustment | null;
  dismissAdjustment: () => void;
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
  const [slug, setSlug] = useState(() => resolveInitialSlug(initialSlug));
  const [adjustment, setAdjustment] = useState<TabbySelectionAdjustment | null>(
    null,
  );

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
  }, [selectedColorId, slug]);

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

  const dismissAdjustment = useCallback(() => {
    setAdjustment(null);
  }, []);

  const applySelection = useCallback(
    (
      nextStyleId: TabbyStyleId,
      nextSize: TabbySize,
      preferredColorId: string,
      trackAdjustments: boolean,
    ) => {
      const resolved = resolveTabbySelection({
        styleId: nextStyleId,
        size: nextSize,
        colorId: preferredColorId,
        trackAdjustments,
        colorNameLookup: (colorId) => getTabbyColorName(nextStyleId, colorId),
      });

      setSlug(resolved.slug);
      setSelectedColorIdState(resolved.colorId);
      replaceTabbyBrowserUrl(resolved.slug, resolved.colorId);

      const nextAdjustment =
        resolved.adjustments[resolved.adjustments.length - 1] ?? null;
      setAdjustment(nextAdjustment);
    },
    [],
  );

  const setSelectedColorId = useCallback(
    (colorId: string) => {
      const color = colors.find((entry) => entry.id === colorId);
      if (!color || !pdpColorIsSelectable(color.availability)) {
        return;
      }

      setSelectedColorIdState(colorId);
      setAdjustment(null);
      replaceTabbyBrowserUrl(slug, colorId);
    },
    [colors, slug],
  );

  const navigateToStyle = useCallback(
    (nextStyleId: TabbyStyleId) => {
      if (nextStyleId === styleId) {
        return;
      }

      applySelection(nextStyleId, size, selectedColorId, true);
    },
    [applySelection, selectedColorId, size, styleId],
  );

  const navigateToSize = useCallback(
    (nextSize: TabbySize) => {
      const sizeEntry = sizeOptions.find((entry) => entry.option.size === nextSize);
      if (!sizeEntry?.available || nextSize === size) {
        return;
      }

      applySelection(styleId, nextSize, selectedColorId, true);
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
      navigateToStyle,
      navigateToSize,
      adjustment,
      dismissAdjustment,
      summary: {
        name: getTabbyProductTitle(size),
        subtitle: style.materialLabel,
        price: sku.price,
      },
      isTabbyFamily: true,
    }),
    [
      adjustment,
      colorOptions,
      colors,
      dismissAdjustment,
      navigateToSize,
      navigateToStyle,
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

export function useOptionalTabbyVariant(): TabbyVariantContextValue | null {
  return useContext(TabbyVariantContext);
}
