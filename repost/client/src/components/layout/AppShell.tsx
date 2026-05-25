import { Outlet } from "react-router-dom";
import { CatalogProvider } from "../../app/context/catalog-context";
import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";

export function AppShell() {
  return (
    <CatalogProvider>
      <div className="app-shell">
        <SiteSidebar />
        <div className="app-shell__content">
          <Outlet />
        </div>
      </div>
    </CatalogProvider>
  );
}
