import { Link } from "react-router-dom";
import { useCatalog } from "../../app/context/catalog-context";
import { useI18n } from "../../i18n";
import { useSocialLinks } from "../../shared/hooks/use-social-links";
import { HOME_VIEW_ID } from "../../shared/types/catalog";
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

/** İşıq mövzusu — sadə günəş (kiçik ölçüdə aydın) */
function LightModeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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
  const { setActiveView } = useCatalog();
  const { links: socialLinks } = useSocialLinks();
  const isDark = theme === "dark";

  const hasSocialLinks =
    Boolean(socialLinks.instagramUrl) ||
    Boolean(socialLinks.facebookUrl) ||
    Boolean(socialLinks.telegramUrl);

  const goHome = () => {
    setActiveView(HOME_VIEW_ID);
  };

  return (
    <aside className="site-sidebar" aria-label={t("sidebar.ariaNav")}>
      <header className="site-sidebar__brand">
        <Link
          to="/"
          className="site-sidebar__brand-link"
          aria-label={t("nav.home")}
          onClick={() => {
            goHome();
          }}
        >
          <span className="site-sidebar__brand-title">
            <span className="site-sidebar__logo-full">
              <span className="site-sidebar__logo">RePost</span>
              <span className="site-sidebar__logo-dot">.Az</span>
            </span>
            <span className="site-sidebar__logo-short" aria-hidden>
              R
            </span>
          </span>
        </Link>
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
                  <span className="site-sidebar__theme-switch-layer site-sidebar__theme-switch-layer--light">
                    <LightModeIcon className="site-sidebar__theme-switch-svg site-sidebar__theme-switch-svg--stroke" />
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

      <div className="site-sidebar__tools">
      <section className="site-sidebar__block site-sidebar__block--lang">
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
            <span className="site-sidebar__pill-text">AZ</span>
          </button>
          <button
            type="button"
            className="site-sidebar__pill"
            data-active={locale === "ru"}
            onClick={() => setLocale("ru")}
            aria-pressed={locale === "ru"}
          >
            <FlagRuIcon className="site-sidebar__pill-flag" />
            <span className="site-sidebar__pill-text">RU</span>
          </button>
        </div>
      </section>
      </div>

      <div className="site-sidebar__bottom">
      {hasSocialLinks ? (
        <section className="site-sidebar__block site-sidebar__block--social">
          <nav className="site-sidebar__social" aria-label={t("sidebar.social")}>
            {socialLinks.instagramUrl ? (
              <a
                className="site-sidebar__social-link"
                href={socialLinks.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("sidebar.socialInstagram")}
                title={t("sidebar.socialInstagram")}
              >
                <InstagramIcon />
                <span className="site-sidebar__social-text">
                  {t("sidebar.socialInstagram")}
                </span>
              </a>
            ) : null}
            {socialLinks.facebookUrl ? (
              <a
                className="site-sidebar__social-link"
                href={socialLinks.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("sidebar.socialFacebook")}
                title={t("sidebar.socialFacebook")}
              >
                <FacebookIcon />
                <span className="site-sidebar__social-text">
                  {t("sidebar.socialFacebook")}
                </span>
              </a>
            ) : null}
            {socialLinks.telegramUrl ? (
              <a
                className="site-sidebar__social-link"
                href={socialLinks.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("sidebar.socialTelegram")}
                title={t("sidebar.socialTelegram")}
              >
                <TelegramIcon />
                <span className="site-sidebar__social-text">
                  {t("sidebar.socialTelegram")}
                </span>
              </a>
            ) : null}
          </nav>
        </section>
      ) : null}

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
      </div>
    </aside>
  );
}
