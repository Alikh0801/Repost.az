import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";
import "./site-sidebar.css";

function InstagramIcon() {
  return (
    <svg className="site-sidebar__social-icon" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient
          id="repost-sidebar-ig-grad"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="22%" stopColor="#e6683c" />
          <stop offset="45%" stopColor="#dc2743" />
          <stop offset="72%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <path
        fill="url(#repost-sidebar-ig-grad)"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="site-sidebar__social-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="site-sidebar__social-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#229ED9"
        d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1.75a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m6.95 3.05a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0M21.25 11a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1m-2.54 7.54a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41M12 19.25a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1m-7.54-2.54a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0M4.75 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m3.05-6.95a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21.64 13a9 9 0 0 1-11.65-11 7 7 0 1 0 11.65 11"
      />
    </svg>
  );
}

/** Azərbaycan bayrağı (3 zolaq) */
function FlagAzIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 12" aria-hidden>
      <rect width="18" height="4" y="0" fill="#0092BC" />
      <rect width="18" height="4" y="4" fill="#E4002B" />
      <rect width="18" height="4" y="8" fill="#00AF66" />
    </svg>
  );
}

/** Rusiya bayrağı (3 üfüqi zolaq) */
function FlagRuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 12" aria-hidden>
      <rect width="18" height="4" y="0" fill="#fff" />
      <rect width="18" height="4" y="4" fill="#0039A6" />
      <rect width="18" height="4" y="8" fill="#D52B1E" />
    </svg>
  );
}

export function SiteSidebar() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="site-sidebar" aria-label={t("sidebar.ariaNav")}>
      <header className="site-sidebar__brand">
        <div className="site-sidebar__brand-title">
          <span className="site-sidebar__logo">Repost</span>
          <span className="site-sidebar__logo-dot">.az</span>
        </div>
        <p className="site-sidebar__tagline">{t("sidebar.brandTagline")}</p>
        <div className="site-sidebar__brand-theme">
          <button
            type="button"
            className="site-sidebar__theme-switch"
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? t("sidebar.lightMode") : t("sidebar.darkMode")}
          >
            <span
              className="site-sidebar__theme-switch-track"
              data-theme={theme}
            >
              <span className="site-sidebar__theme-switch-thumb">
                <span className="site-sidebar__theme-switch-icons" aria-hidden>
                  <span className="site-sidebar__theme-switch-layer site-sidebar__theme-switch-layer--sun">
                    <SunIcon className="site-sidebar__theme-switch-svg" />
                  </span>
                  <span className="site-sidebar__theme-switch-layer site-sidebar__theme-switch-layer--moon">
                    <MoonIcon className="site-sidebar__theme-switch-svg" />
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </header>

      <section className="site-sidebar__block">
        <div
          className="site-sidebar__pills"
          role="group"
          aria-label={t("sidebar.lang")}
        >
          <button
            type="button"
            className="site-sidebar__pill"
            data-active={locale === "az"}
            onClick={() => setLocale("az")}
            aria-pressed={locale === "az"}
          >
            <FlagAzIcon className="site-sidebar__pill-flag" />
            <span>AZ</span>
          </button>
          <button
            type="button"
            className="site-sidebar__pill"
            data-active={locale === "ru"}
            onClick={() => setLocale("ru")}
            aria-pressed={locale === "ru"}
          >
            <FlagRuIcon className="site-sidebar__pill-flag" />
            <span>RU</span>
          </button>
        </div>
      </section>

      <section className="site-sidebar__block">
        <nav className="site-sidebar__social" aria-label={t("sidebar.social")}>
          <a
            className="site-sidebar__social-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            {t("sidebar.socialInstagram")}
          </a>
          <a
            className="site-sidebar__social-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
            {t("sidebar.socialFacebook")}
          </a>
          <a
            className="site-sidebar__social-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TelegramIcon />
            {t("sidebar.socialTelegram")}
          </a>
        </nav>
      </section>

      <footer
        className="site-sidebar__footer site-sidebar__block site-sidebar__block--grow"
        aria-label={t("footer.ariaFooter")}
      >
        <p className="site-sidebar__footer-copy">
          © {new Date().getFullYear()} Repost.az
        </p>
        <p className="site-sidebar__footer-line">{t("footer.rightsLine")}</p>
        <p className="site-sidebar__footer-line site-sidebar__footer-line--muted">
          {t("footer.citationLine")}
        </p>
        <p className="site-sidebar__footer-credit">
          <span>{t("footer.developedBy")} </span>
          <a
            className="site-sidebar__footer-credit-link"
            href="https://alidevs.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            alidevs.me
          </a>
        </p>
      </footer>
    </aside>
  );
}
