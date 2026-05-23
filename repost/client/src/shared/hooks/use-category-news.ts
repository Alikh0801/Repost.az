import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchCategoryNews } from "../api/articles";
import { pickListItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import type { CatalogId } from "../types/catalog";
import type { CategoryNewsItem } from "../types/category-news-item";

export function useCategoryNews(category: CatalogId) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryNews(category)
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
  }, [category]);

  const articles = useMemo<CategoryNewsItem[]>(
    () => raw.map((item) => pickListItem(item, locale)),
    [raw, locale],
  );

  return { articles, loading, error };
}
