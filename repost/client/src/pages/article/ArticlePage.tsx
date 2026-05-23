import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../../components/page-container/PageContainer";
import { RelatedNewsSection } from "../../components/related-news-section/RelatedNewsSection";
import { SiteNavbar } from "../../components/site-navbar/SiteNavbar";
import { useI18n } from "../../i18n";
import type { AppMessagePath } from "../../i18n/paths";
import { getArticleById } from "../../shared/data/article-repository";
import type { CatalogId } from "../../shared/types/catalog";
import { formatNewsPublished } from "../../shared/lib/format-news-published";
import { formatViewCount } from "../../shared/lib/format-view-count";
import "./article-page.css";

const CATEGORY_PATH: Record<CatalogId, AppMessagePath> = {
  politics: "nav.politics",
  economy: "nav.economy",
  society: "nav.society",
  sports: "nav.sports",
  incidents: "nav.incidents",
  world: "nav.world",
};

export function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const { locale, t } = useI18n();
  const [now] = useState(() => new Date());

  const article = useMemo(() => {
    if (!articleId) return null;
    return getArticleById(decodeURIComponent(articleId), locale);
  }, [articleId, locale]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  if (!article) {
    return (
      <>
        <SiteNavbar />
        <PageContainer as="main" className="article-page">
          <div className="article-page__not-found">
            <h1 className="article-page__not-found-title">
              {t("article.notFoundTitle")}
            </h1>
            <p className="article-page__not-found-text">
              {t("article.notFoundText")}
            </p>
            <Link className="article-page__back" to="/">
              {t("article.backToHome")}
            </Link>
          </div>
        </PageContainer>
      </>
    );
  }

  const publishedLabel = formatNewsPublished(
    article.publishedAt,
    locale,
    t("news.today"),
    now,
  );
  const viewsLabel = formatViewCount(article.viewCount, locale);

  return (
    <>
      <SiteNavbar />
      <PageContainer as="main" className="article-page">
        <Link className="article-page__back" to="/">
          ← {t("article.backToHome")}
        </Link>

        <article className="article-detail">
          <header className="article-detail__header">
            <span className="article-detail__category">
              {t(CATEGORY_PATH[article.category])}
            </span>
            <h1 className="article-detail__title">{article.title}</h1>
            <p className="article-detail__meta">
              <span className="article-detail__views">
                {viewsLabel} {t("news.views")}
              </span>
              <span className="article-detail__meta-sep" aria-hidden>
                ·
              </span>
              <time dateTime={article.publishedAt}>{publishedLabel}</time>
            </p>
          </header>

          <figure className="article-detail__figure">
            <img
              className="article-detail__image"
              src={article.imageUrl}
              alt={article.imageAlt}
            />
          </figure>

          <p className="article-detail__lead">{article.summary}</p>

          <div className="article-detail__body">
            {article.body.map((paragraph, index) => (
              <p key={`${article.id}-p-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <RelatedNewsSection articleId={article.id} />
      </PageContainer>
    </>
  );
}
