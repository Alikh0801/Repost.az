import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { CATALOG, type CatalogId } from "../../shared/types/catalog";
import { formatNavbarDate } from "../../shared/lib/format-navbar-date";
import { PageContainer } from "../page-container/PageContainer";
import "./site-navbar.css";

const NAVBAR_DATE_TICK_MS = 60_000;

export function SiteNavbar() {
  const { locale, t } = useI18n();
  const { activeCatalog, setActiveCatalog } = useCatalog();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [now, setNow] = useState(() => new Date());

  const selectCatalog = (id: CatalogId) => {
    setActiveCatalog(id);
    if (pathname !== "/") {
      navigate("/");
    }
  };

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, NAVBAR_DATE_TICK_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const dateLabel = useMemo(() => formatNavbarDate(now, locale), [now, locale]);

  return (
    <header className="site-navbar">
      <PageContainer className="site-navbar__container">
      <div className="site-navbar__inner">
        <time className="site-navbar__date" dateTime={dateLabel.iso}>
          {dateLabel.label}
        </time>
        <nav className="site-navbar__nav" aria-label={t("nav.ariaLabel")}>
          <ul className="site-nav__list">
            {CATALOG.map(({ id, labelKey }) => (
              <li key={id} className="site-nav__item">
                <button
                  type="button"
                  className="site-nav__tab"
                  data-active={activeCatalog === id}
                  aria-pressed={activeCatalog === id}
                  onClick={() => selectCatalog(id)}
                >
                  {t(labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </PageContainer>
    </header>
  );
}
