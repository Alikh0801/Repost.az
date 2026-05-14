import { useEffect, useMemo, useState } from "react";
import { useI18n, type AppMessagePath } from "../../i18n";
import { formatNavbarDate } from "../../shared/lib/format-navbar-date";
import "./site-navbar.css";

const NAVBAR_DATE_TICK_MS = 60_000;

export type CatalogId =
  | "politics"
  | "economy"
  | "society"
  | "sports"
  | "incidents"
  | "world";

const CATALOG: readonly { id: CatalogId; labelKey: AppMessagePath }[] = [
  { id: "politics", labelKey: "nav.politics" },
  { id: "economy", labelKey: "nav.economy" },
  { id: "society", labelKey: "nav.society" },
  { id: "sports", labelKey: "nav.sports" },
  { id: "incidents", labelKey: "nav.incidents" },
  { id: "world", labelKey: "nav.world" },
] as const;

export function SiteNavbar() {
  const { locale, t } = useI18n();
  const [activeCatalog, setActiveCatalog] = useState<CatalogId>("politics");
  const [now, setNow] = useState(() => new Date());

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
                  onClick={() => setActiveCatalog(id)}
                >
                  {t(labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
