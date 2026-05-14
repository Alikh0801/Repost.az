import { SiteNavbar } from "../site-navbar/SiteNavbar";
import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";
import { useI18n } from "../../i18n";

export function AppShell() {
  const { t } = useI18n();

  return (
    <div className="app-shell">
      <SiteSidebar />
      <div className="app-shell__content">
        <SiteNavbar />
        <main className="app-shell__main">
          <p className="app-shell__placeholder">{t("layout.mainPlaceholder")}</p>
        </main>
      </div>
    </div>
  );
}
