import { useI18n } from "../../i18n";
import "./ad-banner.css";

type AdBannerVariant = "hero-side" | "news-side";

type AdBannerProps = {
  variant?: AdBannerVariant;
};

export function AdBanner({ variant = "hero-side" }: AdBannerProps) {
  const { t } = useI18n();

  return (
    <aside
      className={`ad-banner ad-banner--${variant}`}
      aria-label={t("ad.ariaLabel")}
    >
      <div className="ad-banner__frame">
        <span className="ad-banner__label">{t("ad.label")}</span>
        <p className="ad-banner__placeholder">{t("ad.placeholder")}</p>
      </div>
    </aside>
  );
}
