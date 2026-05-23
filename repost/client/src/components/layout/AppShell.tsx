import { Outlet } from "react-router-dom";
import { CatalogProvider } from "../../app/context/catalog-context";
import { SiteSidebar } from "../site-sidebar/SiteSidebar";
import "./app-shell.css";

export function AppShell() {
  return (
    <div className="app-shell">
      <SiteSidebar />
      <CatalogProvider>
        <div className="app-shell__content">
          <Outlet />
        </div>
      </CatalogProvider>
    </div>
  );
}
