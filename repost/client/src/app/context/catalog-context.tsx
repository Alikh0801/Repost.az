import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useI18n } from "../../i18n";
import { fetchPublicCategories } from "../../shared/api/categories";
import {
  DEFAULT_NAV_VIEW,
  FALLBACK_CATALOG,
  categoryLabelForLocale,
  type CatalogId,
  type NavViewId,
} from "../../shared/types/catalog";

type CatalogContextValue = {
  activeView: NavViewId;
  setActiveView: (id: NavViewId) => void;
  catalog: readonly { id: CatalogId; labelAz: string; labelRu: string }[];
  categoryLabel: (slug: CatalogId) => string;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const [activeView, setActiveView] = useState<NavViewId>(DEFAULT_NAV_VIEW);
  const [catalog, setCatalog] = useState(FALLBACK_CATALOG);

  useEffect(() => {
    let cancelled = false;
    fetchPublicCategories()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setCatalog(
          rows.map((row) => ({
            id: row.slug,
            labelAz: row.labelAz,
            labelRu: row.labelRu,
          })),
        );
      })
      .catch(() => {
        /* fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      activeView,
      setActiveView,
      catalog,
      categoryLabel: (slug: CatalogId) =>
        categoryLabelForLocale(catalog, slug, locale),
    }),
    [activeView, catalog, locale],
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
