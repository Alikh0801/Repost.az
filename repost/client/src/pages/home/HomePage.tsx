import { AdBanner } from "../../components/ad-banner/AdBanner";
import { CategoryNewsGrid } from "../../components/category-news-grid/CategoryNewsGrid";
import { HeroSlider } from "../../components/hero-slider/HeroSlider";
import { PageContainer } from "../../components/page-container/PageContainer";
import { SiteNavbar } from "../../components/site-navbar/SiteNavbar";
import { useI18n } from "../../i18n";
import { PageMeta } from "../../shared/seo/PageMeta";
import "./home-page.css";

export function HomePage() {
  const { locale, t } = useI18n();

  return (
    <>
      <PageMeta
        title={t("seo.homeTitle")}
        description={t("seo.homeDescription")}
        canonicalPath="/"
        locale={locale}
        type="website"
      />
      <SiteNavbar />
      <PageContainer as="main" className="home-page">
        <div className="home-page__layout">
          <div className="home-page__hero">
            <HeroSlider />
          </div>
          <div className="home-page__hero-ad">
            <AdBanner variant="hero-side" />
          </div>
          <div className="home-page__news">
            <CategoryNewsGrid />
          </div>
          <aside
            className="home-page__news-ad"
            aria-label={t("ad.ariaLabel")}
          >
            <AdBanner variant="news-side" />
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
