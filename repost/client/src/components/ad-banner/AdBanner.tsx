import { useI18n } from "../../i18n";
import "./ad-banner.css";

type AdBannerVariant = "hero-side" | "news-side";

type AdBannerProps = {
  variant?: AdBannerVariant;
};

const AD_SIZE_LABEL: Record<AdBannerVariant, string> = {
  "hero-side": "300 × 600",
  "news-side": "170 × 700",
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
        <span className="ad-banner__size">{AD_SIZE_LABEL[variant]}</span>
      </div>
    </aside>
  );
}
