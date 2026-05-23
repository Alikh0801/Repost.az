import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchFeaturedNews } from "../api/articles";
import { pickFeaturedItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import type { FeaturedNewsItem } from "../types/featured-news-item";

export function useFeaturedNews() {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFeaturedNews()
      .then((data) => {
        if (!cancelled) setRaw(data);
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
  }, []);

  const items = useMemo<FeaturedNewsItem[]>(
    () => raw.map((item) => pickFeaturedItem(item, locale)),
    [raw, locale],
  );

  return { items, loading, error };
}
