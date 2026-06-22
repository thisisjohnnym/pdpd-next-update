"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_PRODUCT_ID,
  getPdpProduct,
  type PdpProductConfig,
  type PdpProductId,
} from "./pdp-products";

type PdpActiveProductValue = {
  productId: PdpProductId;
  product: PdpProductConfig;
  setProductId: (id: PdpProductId) => void;
};

const PdpActiveProductContext = createContext<PdpActiveProductValue | null>(null);

/** Holds which product the PDP is currently rendering — drives layout + copy */
export function PdpActiveProductProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<PdpProductId>(DEFAULT_PRODUCT_ID);

  const value = useMemo<PdpActiveProductValue>(
    () => ({
      productId,
      product: getPdpProduct(productId),
      setProductId,
    }),
    [productId],
  );

  return (
    <PdpActiveProductContext.Provider value={value}>
      {children}
    </PdpActiveProductContext.Provider>
  );
}

export function useActiveProduct(): PdpActiveProductValue {
  const context = useContext(PdpActiveProductContext);

  if (!context) {
    throw new Error(
      "useActiveProduct must be used within PdpActiveProductProvider",
    );
  }

  return context;
}
