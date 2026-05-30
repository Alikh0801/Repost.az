import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import type { CategoryNewsItem } from "../../shared/types/category-news-item";
import { articlePath } from "../../shared/lib/article-path";
import { formatNewsPublished } from "../../shared/lib/format-news-published";
import { formatViewCount } from "../../shared/lib/format-view-count";
import "./news-card.css";

type NewsCardProps = {
  article: CategoryNewsItem;
  now: Date;
};

function EyeIcon() {
  return (
    <svg
      className="news-card__views-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function NewsCard({ article, now }: NewsCardProps) {
  const { locale, t } = useI18n();

  const { categoryLabel } = useCatalog();

  const categoryLabelText = useMemo(
    () => categoryLabel(article.category),
    [article.category, categoryLabel],
  );

  const publishedLabel = useMemo(
    () => formatNewsPublished(article.publishedAt, locale, t("news.today"), now),
    [article.publishedAt, locale, now, t],
  );

  const viewsLabel = useMemo(
    () => formatViewCount(article.viewCount, locale),
    [article.viewCount, locale],
  );

  const detailPath = articlePath(article);

  return (
    <article className="news-card">
      <Link
        className="news-card__media"
        to={detailPath}
        tabIndex={-1}
        aria-hidden
      >
        {categoryLabelText ? (
          <span className="news-card__category-badge">{categoryLabelText}</span>
        ) : null}
        <img
          className="news-card__image"
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="eager"
          decoding="async"
        />
      </Link>
      <div className="news-card__body">
        <p className="news-card__meta">
          <span
            className="news-card__views"
            aria-label={`${viewsLabel} ${t("news.views")}`}
          >
            <EyeIcon />
            <span className="news-card__views-count">{viewsLabel}</span>
          </span>
          <span className="news-card__meta-sep" aria-hidden>
            ·
          </span>
          <time
            className="news-card__date"
            dateTime={article.publishedAt}
          >
            {publishedLabel}
          </time>
        </p>
        <h3 className="news-card__title">
          <Link
            className="news-card__title-link"
            to={detailPath}
            title={article.title}
          >
            {article.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
