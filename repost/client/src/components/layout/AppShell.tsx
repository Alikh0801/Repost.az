import { CatalogProvider } from "../../app/context/catalog-context";
import { HomePage } from "../../pages/home/HomePage";
import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";

export function AppShell() {
  return (
    <div className="app-shell">
      <SiteSidebar />
      <CatalogProvider>
        <div className="app-shell__content">
          <HomePage />
        </div>
      </CatalogProvider>
    </div>
  );
}
