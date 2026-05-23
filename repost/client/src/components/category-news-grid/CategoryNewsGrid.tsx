import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { useCategoryNews } from "../../shared/hooks/use-category-news";
import { CATALOG } from "../../shared/types/catalog";
import { NewsCard } from "../news-card/NewsCard";
import "./category-news-grid.css";

const CLOCK_TICK_MS = 60_000;

export function CategoryNewsGrid() {
  const { t } = useI18n();
  const { activeCatalog } = useCatalog();
  const [now, setNow] = useState(() => new Date());
  const { articles, loading, error } = useCategoryNews(activeCatalog);

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
    const entry = CATALOG.find((item) => item.id === activeCatalog);
    return entry ? t(entry.labelKey) : "";
  }, [activeCatalog, t]);

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
        <p className="category-news-grid__status">{t("common.emptyCategory")}</p>
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
