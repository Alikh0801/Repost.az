import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/auth-context";
import "./admin-layout.css";

export function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__brand">
          <span className="admin-shell__brand-title">RePost.az</span>
          <span className="admin-shell__brand-sub">Admin panel</span>
        </div>
        <nav className="admin-shell__nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `admin-shell__link${isActive ? " admin-shell__link--active" : ""}`
            }
          >
            İdarəetmə paneli
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `admin-shell__link${isActive ? " admin-shell__link--active" : ""}`
            }
          >
            Xəbərlər
          </NavLink>
        </nav>
        <button type="button" className="admin-shell__logout" onClick={logout}>
          Çıxış
        </button>
      </aside>
      <main className="admin-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
