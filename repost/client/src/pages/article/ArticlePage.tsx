import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArticleBody } from "../../components/article-body/ArticleBody";
import { PageContainer } from "../../components/page-container/PageContainer";
import { RelatedNewsSection } from "../../components/related-news-section/RelatedNewsSection";
import { SiteNavbar } from "../../components/site-navbar/SiteNavbar";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { useArticle } from "../../shared/hooks/use-article";
import { articlePath } from "../../shared/lib/article-path";
import { formatNewsPublished } from "../../shared/lib/format-news-published";
import { formatViewCount } from "../../shared/lib/format-view-count";
import { ArticleJsonLd } from "../../shared/seo/ArticleJsonLd";
import { PageMeta } from "../../shared/seo/PageMeta";
import { SITE_NAME } from "../../shared/seo/site-config";
import { truncateMetaDescription } from "../../shared/seo/set-page-meta";
import "./article-page.css";

export function ArticlePage() {
  const { articleId: articleSlug } = useParams<{ articleId: string }>();
  const { locale, t } = useI18n();
  const { categoryLabel } = useCatalog();
  const { article, loading, error } = useArticle(articleSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleSlug]);

  if (loading) {
    return (
      <>
        <PageMeta
          title={t("seo.homeTitle")}
          description={t("seo.homeDescription")}
          canonicalPath="/"
          locale={locale}
        />
        <SiteNavbar />
        <PageContainer as="main" className="article-page">
          <p className="article-page__loading">{t("common.loading")}</p>
        </PageContainer>
      </>
    );
  }

  if (!article || error) {
    return (
      <>
        <PageMeta
          title={t("seo.articleNotFoundTitle")}
          description={t("seo.articleNotFoundDescription")}
          canonicalPath="/"
          locale={locale}
          noIndex
        />
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

  const now = new Date();
  const publishedLabel = formatNewsPublished(
    article.publishedAt,
    locale,
    t("news.today"),
    now,
  );
  const viewsLabel = formatViewCount(article.viewCount, locale);

  const metaTitle = `${article.title} | ${SITE_NAME}`;
  const metaDescription = truncateMetaDescription(article.summary);

  return (
    <>
      <PageMeta
        title={metaTitle}
        description={metaDescription}
        canonicalPath={articlePath(article)}
        imageUrl={article.imageUrl}
        locale={locale}
        type="article"
      />
      <ArticleJsonLd article={article} locale={locale} />
      <SiteNavbar />
      <PageContainer as="main" className="article-page">
        <Link className="article-page__back" to="/">
          ← {t("article.backToHome")}
        </Link>

        <article className="article-detail">
          <header className="article-detail__header">
            <span className="article-detail__category">
              {categoryLabel(article.category)}
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

          <ArticleBody body={article.body} />
        </article>

        <RelatedNewsSection articleSlug={article.slug} />
      </PageContainer>
    </>
  );
}
