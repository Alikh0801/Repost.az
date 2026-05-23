export const APP_LOCALES = ["az", "ru"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export function parseLocale(value: string): AppLocale {
  if (value === "az" || value === "ru") return value;
  return "az";
}
