import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchRecentNews } from "../api/articles";
import { pickListItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import { HOME_VIEW_ID, type CatalogId, type NavViewId } from "../types/catalog";
import type { CategoryNewsItem } from "../types/category-news-item";

const HOME_FEED_LIMIT = 100;
const CATEGORY_FEED_LIMIT = 50;

export function useNewsFeed(view: NavViewId) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const isHome = view === HOME_VIEW_ID;
    const category = isHome ? undefined : (view as CatalogId);
    const limit = isHome ? HOME_FEED_LIMIT : CATEGORY_FEED_LIMIT;

    fetchRecentNews(limit, category)
      .then((page) => {
        if (!cancelled) setRaw(page.items);
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

  const articles = useMemo<CategoryNewsItem[]>(
    () => raw.map((item) => pickListItem(item, locale)),
    [raw, locale],
  );

  return { articles, loading, error };
}
