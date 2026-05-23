import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchRelatedArticles } from "../api/articles";
import { pickListItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import type { CategoryNewsItem } from "../types/category-news-item";

export function useRelatedNews(slug: string | undefined, limit = 6) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setRaw([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRelatedArticles(decodeURIComponent(slug))
      .then((data) => {
        if (!cancelled) setRaw(data.slice(0, limit));
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
  }, [slug, limit]);

  const articles = useMemo<CategoryNewsItem[]>(
    () => raw.map((item) => pickListItem(item, locale)),
    [raw, locale],
  );

  return { articles, loading: loading && raw.length === 0, error };
}
