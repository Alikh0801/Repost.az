import { CatalogProvider } from "../../app/context/catalog-context";
import { CategoryNewsSection } from "../category-news-section/CategoryNewsSection";
import { HomeHeroRow } from "../home-hero-row/HomeHeroRow";
import { SiteNavbar } from "../site-navbar/SiteNavbar";
import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";

export function AppShell() {
  return (
    <div className="app-shell">
      <SiteSidebar />
      <CatalogProvider>
        <div className="app-shell__content">
          <SiteNavbar />
          <main className="app-shell__main">
            <HomeHeroRow />
            <CategoryNewsSection />
          </main>
        </div>
      </CatalogProvider>
    </div>
  );
}
