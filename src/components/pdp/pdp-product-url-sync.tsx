"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useActiveProduct } from "./pdp-active-product-context";
import type { PdpProductId } from "./pdp-products";
import { getPdpColors } from "./pdp-product-colors";
import { productPath, replaceProductBrowserUrl } from "./pdp-product-routes";

/** Keeps ?color= in sync while viewing non-Tabby products */
export function PdpProductUrlSync({
  activeColorId,
}: {
  activeColorId: string;
}) {
  const { productId } = useActiveProduct();

  useEffect(() => {
    if (typeof window === "undefined" || productId !== "kira") {
      return;
    }

    replaceProductBrowserUrl(
      productPath("kira", {
        colorId: activeColorId,
      }),
    );
  }, [activeColorId, productId]);

  return null;
}

/** Reads ?color= for Kira on load / history navigation */
export function useKiraColorFromSearchParam(
  productId: PdpProductId,
  selectedColorId: string,
  onColorSelect: (id: string) => void,
) {
  const searchParams = useSearchParams();
  const paramColor = searchParams.get("color");

  useEffect(() => {
    if (productId !== "kira" || !paramColor) {
      return;
    }

    const colors = getPdpColors("kira");
    if (
      colors.some((color) => color.id === paramColor) &&
      paramColor !== selectedColorId
    ) {
      onColorSelect(paramColor);
    }
  }, [onColorSelect, paramColor, productId, selectedColorId]);
}
