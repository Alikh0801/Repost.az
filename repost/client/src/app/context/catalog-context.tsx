import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_NAV_VIEW,
  type NavViewId,
} from "../../shared/types/catalog";

type CatalogContextValue = {
  activeView: NavViewId;
  setActiveView: (id: NavViewId) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<NavViewId>(DEFAULT_NAV_VIEW);

  const value = useMemo(
    () => ({ activeView, setActiveView }),
    [activeView],
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
