import type { AppLocale } from "../../i18n/types";

export type CatalogId = string;

/** Navbar: ana səhifə və ya rubrika */
export type NavViewId = CatalogId | "home";

export const HOME_VIEW_ID = "home" as const;

export const DEFAULT_NAV_VIEW: NavViewId = HOME_VIEW_ID;

export const FALLBACK_CATALOG: readonly {
  id: CatalogId;
  labelAz: string;
  labelRu: string;
}[] = [
  { id: "politics", labelAz: "Siyasət", labelRu: "Политика" },
  { id: "economy", labelAz: "İqtisadiyyat", labelRu: "Экономика" },
  { id: "society", labelAz: "Sosial", labelRu: "Общество" },
  { id: "sports", labelAz: "İdman", labelRu: "Спорт" },
  { id: "incidents", labelAz: "Hadisə", labelRu: "Происшествия" },
  { id: "world", labelAz: "Dünya", labelRu: "Мир" },
] as const;

export function categoryLabelForLocale(
  categories: readonly { id: CatalogId; labelAz: string; labelRu: string }[],
  slug: CatalogId,
  locale: AppLocale,
): string {
  const row = categories.find((c) => c.id === slug);
  if (!row) return slug;
  return locale === "ru" ? row.labelRu : row.labelAz;
}
