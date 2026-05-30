import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { fetchRecentNews } from "../api/articles";
import { pickListItem } from "../lib/pick-locale";
import type { BilingualListItemDto } from "../types/bilingual";
import { HOME_VIEW_ID, type CatalogId, type NavViewId } from "../types/catalog";
import type { CategoryNewsItem } from "../types/category-news-item";

export const NEWS_FEED_PAGE_SIZE = 24;

type FeedPageState = {
  view: NavViewId;
  page: number;
};

export function useNewsFeed(view: NavViewId) {
  const { locale } = useI18n();
  const [raw, setRaw] = useState<BilingualListItemDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedPage, setFeedPage] = useState<FeedPageState>({ view, page: 1 });

  useEffect(() => {
    if (feedPage.view !== view) {
      setFeedPage({ view, page: 1 });
    }
  }, [view, feedPage.view]);

  useEffect(() => {
    if (feedPage.view !== view) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const isHome = view === HOME_VIEW_ID;
    const category = isHome ? undefined : (view as CatalogId);

    fetchRecentNews(NEWS_FEED_PAGE_SIZE, category, feedPage.page)
      .then((result) => {
        if (!cancelled) {
          setRaw(result.items);
          setTotalPages(result.totalPages);
          setTotal(result.total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRaw([]);
          setTotalPages(1);
          setTotal(0);
          setError(err instanceof Error ? err.message : "Xəta");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view, feedPage]);

  const articles = useMemo<CategoryNewsItem[]>(
    () => raw.map((item) => pickListItem(item, locale)),
    [raw, locale],
  );

  const setPage = (page: number) => {
    setFeedPage((prev) => ({ ...prev, page }));
  };

  return {
    articles,
    loading,
    error,
    page: feedPage.page,
    totalPages,
    total,
    setPage,
  };
}
