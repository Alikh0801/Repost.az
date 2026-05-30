import { useEffect, useMemo, useRef, useState } from "react";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { useNewsFeed } from "../../shared/hooks/use-news-feed";
import { HOME_VIEW_ID } from "../../shared/types/catalog";
import { NewsCard } from "../news-card/NewsCard";
import "./category-news-grid.css";

const CLOCK_TICK_MS = 60_000;

export function CategoryNewsGrid() {
  const { t } = useI18n();
  const { activeView, categoryLabel } = useCatalog();
  const [now, setNow] = useState(() => new Date());
  const sectionRef = useRef<HTMLElement>(null);
  const skipScrollRef = useRef(true);
  const {
    articles,
    loading,
    error,
    page,
    totalPages,
    setPage,
  } = useNewsFeed(activeView);
  const isHome = activeView === HOME_VIEW_ID;

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, CLOCK_TICK_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, activeView]);

  const sectionLabel = useMemo(() => {
    if (isHome) return t("news.latestSectionTitle");
    return categoryLabel(activeView);
  }, [activeView, categoryLabel, isHome, t]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section
      ref={sectionRef}
      className="category-news-grid"
      aria-labelledby="category-news-grid-heading"
    >
      <h2 id="category-news-grid-heading" className="category-news-grid__heading">
        {sectionLabel}
      </h2>

      {loading ? (
        <p className="category-news-grid__status">{t("common.loading")}</p>
      ) : null}

      {error ? (
        <p className="category-news-grid__status category-news-grid__status--error">
          {t("common.error")}
        </p>
      ) : null}

      {!loading && !error && articles.length === 0 ? (
        <p className="category-news-grid__status">
          {isHome ? t("common.emptyHome") : t("common.emptyCategory")}
        </p>
      ) : null}

      {!loading && articles.length > 0 ? (
        <ul className="category-news-grid__list">
          {articles.map((article) => (
            <li key={article.id} className="category-news-grid__item">
              <NewsCard article={article} now={now} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && totalPages > 1 ? (
        <nav
          className="category-news-grid__pagination"
          aria-label={t("news.paginationAria")}
        >
          <button
            type="button"
            className="category-news-grid__page-btn"
            disabled={!canGoPrev}
            onClick={() => setPage(page - 1)}
          >
            ← {t("news.paginationPrev")}
          </button>
          <span className="category-news-grid__page-status">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="category-news-grid__page-btn"
            disabled={!canGoNext}
            onClick={() => setPage(page + 1)}
          >
            {t("news.paginationNext")} →
          </button>
        </nav>
      ) : null}
    </section>
  );
}
