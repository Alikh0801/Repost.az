import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CATALOG_ID,
  type CatalogId,
} from "../../shared/types/catalog";

type CatalogContextValue = {
  activeCatalog: CatalogId;
  setActiveCatalog: (id: CatalogId) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [activeCatalog, setActiveCatalog] =
    useState<CatalogId>(DEFAULT_CATALOG_ID);

  const value = useMemo(
    () => ({ activeCatalog, setActiveCatalog }),
    [activeCatalog],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}
