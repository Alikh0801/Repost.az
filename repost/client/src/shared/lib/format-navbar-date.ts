import type { AppLocale } from "../../i18n/types";

/** `Date.getDay()` — 0 = bazar */
const AZ_WEEKDAYS = [
  "Bazar",
  "Bazar ertəsi",
  "Çərşənbə axşamı",
  "Çərşənbə",
  "Cümə axşamı",
  "Cümə",
  "Şənbə",
] as const;

/** `Date.getMonth()` — 0 = yanvar */
const AZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
] as const;

function localISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatNavbarDateAz(date: Date): string {
  const w = AZ_WEEKDAYS[date.getDay()];
  const m = AZ_MONTHS[date.getMonth()];
  return `${w}, ${date.getDate()} ${m} ${date.getFullYear()}`;
}

function formatNavbarDateRu(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatNavbarDate(
  date: Date,
  locale: AppLocale,
): { iso: string; label: string } {
  const iso = localISODate(date);
  if (locale === "az") {
    return { iso, label: formatNavbarDateAz(date) };
  }
  return { iso, label: formatNavbarDateRu(date) };
}
