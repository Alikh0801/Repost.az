import type { AppLocale } from "../../i18n/types";

const AZ_MONTHS_SHORT = [
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

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatPastDateAz(date: Date): string {
  const day = date.getDate();
  const month = AZ_MONTHS_SHORT[date.getMonth()];
  return `${day} ${month}`;
}

function formatPastDateRu(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatNewsPublished(
  iso: string,
  locale: AppLocale,
  todayLabel: string,
  now: Date = new Date(),
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const time = formatTime(date);

  if (isSameCalendarDay(date, now)) {
    return `${todayLabel}, ${time}`;
  }

  const datePart =
    locale === "az" ? formatPastDateAz(date) : formatPastDateRu(date);
  return `${datePart}, ${time}`;
}
