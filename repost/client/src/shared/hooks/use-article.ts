import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchArticleBySlug } from "../api/articles";
import { recordArticleViewOnce } from "../lib/record-article-view";
import { pickArticleDetail } from "../lib/pick-locale";
import type { BilingualArticleDto } from "../types/bilingual";
import type { NewsArticle } from "../types/article";

export function useArticle(slug: string | undefined) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualArticleDto | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setRaw(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const decoded = decodeURIComponent(slug);
    setLoading(true);
    setError(null);

    fetchArticleBySlug(decoded)
      .then((data) => {
        if (!cancelled) {
          setRaw(data);
          recordArticleViewOnce(data.slug);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRaw(null);
          setError(err instanceof Error ? err.message : "Xəta");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const article = useMemo<NewsArticle | null>(
    () => (raw ? pickArticleDetail(raw, locale) : null),
    [raw, locale],
  );

  return { article, loading: loading && !raw, error };
}
