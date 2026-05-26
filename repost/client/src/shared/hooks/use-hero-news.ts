import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchFeaturedNewsByCategory } from "../api/articles";
import { pickFeaturedItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import { HOME_VIEW_ID, type CatalogId, type NavViewId } from "../types/catalog";
import type { FeaturedNewsItem } from "../types/featured-news-item";

/** Üst hissə: yalnız admin-də seçilmiş “Hero” xəbərləri. */
export function useHeroNews(view: NavViewId) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const category =
      view === HOME_VIEW_ID ? undefined : (view as CatalogId);

    fetchFeaturedNewsByCategory(category)
      .then((items) => {
        if (!cancelled) setRaw(items);
      })
      .catch((err) => {
        if (!cancelled) {
          setRaw([]);
          setError(err instanceof Error ? err.message : "Xəta");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view]);

  const items = useMemo<FeaturedNewsItem[]>(
    () => raw.map((item) => pickFeaturedItem(item, locale)),
    [raw, locale],
  );

  return { items, loading, error };
}
