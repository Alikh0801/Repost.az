import { useMemo } from "react";
import { useI18n } from "../../i18n";
import type { CategoryNewsItem } from "../../shared/data/category-news";
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

  const publishedLabel = useMemo(
    () => formatNewsPublished(article.publishedAt, locale, t("news.today"), now),
    [article.publishedAt, locale, now, t],
  );

  const viewsLabel = useMemo(
    () => formatViewCount(article.viewCount, locale),
    [article.viewCount, locale],
  );

  return (
    <article className="news-card">
      <a className="news-card__media" href="#" tabIndex={-1} aria-hidden>
        <img
          className="news-card__image"
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="lazy"
          decoding="async"
        />
      </a>
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
          <a className="news-card__title-link" href="#">
            {article.title}
          </a>
        </h3>
      </div>
    </article>
  );
}
