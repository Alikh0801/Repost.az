import type { AppLocale } from "../../i18n/types";

function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const value = n / 1_000_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
  }
  if (n >= 10_000) {
    const value = n / 1_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`;
  }
  if (n >= 1_000) {
    return new Intl.NumberFormat("en-US", { notation: "compact" })
      .format(n)
      .replace(".0", "");
  }
  return String(n);
}

export function formatViewCount(count: number, locale: AppLocale): string {
  if (locale === "ru") {
    return new Intl.NumberFormat("ru-RU").format(count);
  }
  if (count >= 1_000) {
    return formatCompact(count).replace(",", " ");
  }
  return new Intl.NumberFormat("az-Latn-AZ").format(count);
}
