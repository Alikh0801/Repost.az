import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { useNewsFeed } from "../../shared/hooks/use-news-feed";
import { CATALOG, HOME_VIEW_ID } from "../../shared/types/catalog";
import { NewsCard } from "../news-card/NewsCard";
import "./category-news-grid.css";

const CLOCK_TICK_MS = 60_000;

export function CategoryNewsGrid() {
  const { t } = useI18n();
  const { activeView } = useCatalog();
  const [now, setNow] = useState(() => new Date());
  const { articles, loading, error } = useNewsFeed(activeView);
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

  const sectionLabel = useMemo(() => {
    if (isHome) return t("news.latestSectionTitle");
    const entry = CATALOG.find((item) => item.id === activeView);
    return entry ? t(entry.labelKey) : "";
  }, [activeView, isHome, t]);

  return (
    <section
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
    </section>
  );
}
