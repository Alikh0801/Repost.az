import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";
import { useI18n } from "../../i18n";

export function AppShell() {
  const { t } = useI18n();

  return (
    <div className="app-shell">
      <SiteSidebar />
      <main className="app-shell__main">
        <p className="app-shell__placeholder">{t("layout.mainPlaceholder")}</p>
      </main>
    </div>
  );
}
