"use client";

import { createContext, useContext, type ReactNode } from "react";

export type PdpVersion = "v1" | "v2" | "v3";

const PdpVersionContext = createContext<PdpVersion>("v1");

/** Seeds the PDP version from the route layout — keeps v1 and v2 isolated on the same deploy */
export function PdpVersionProvider({
  version,
  children,
}: {
  version: PdpVersion;
  children: ReactNode;
}) {
  return (
    <PdpVersionContext.Provider value={version}>
      {children}
    </PdpVersionContext.Provider>
  );
}

/** Current PDP version — defaults to "v1" outside a provider (legacy routes) */
export function usePdpVersion(): PdpVersion {
  return useContext(PdpVersionContext);
}
