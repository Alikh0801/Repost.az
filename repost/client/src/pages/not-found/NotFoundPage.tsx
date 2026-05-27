import { Link } from "react-router-dom";
import { PageContainer } from "../../components/page-container/PageContainer";
import { SiteNavbar } from "../../components/site-navbar/SiteNavbar";
import { useI18n } from "../../i18n";
import { PageMeta } from "../../shared/seo/PageMeta";
import "../article/article-page.css";

export function NotFoundPage() {
  const { locale, t } = useI18n();

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
