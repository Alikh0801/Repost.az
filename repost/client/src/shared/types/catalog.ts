import type { AppMessagePath } from "../../i18n/paths";

export type CatalogId =
  | "politics"
  | "economy"
  | "society"
  | "sports"
  | "incidents"
  | "world";

export const CATALOG: readonly { id: CatalogId; labelKey: AppMessagePath }[] = [
  { id: "politics", labelKey: "nav.politics" },
  { id: "economy", labelKey: "nav.economy" },
  { id: "society", labelKey: "nav.society" },
  { id: "sports", labelKey: "nav.sports" },
  { id: "incidents", labelKey: "nav.incidents" },
  { id: "world", labelKey: "nav.world" },
] as const;

export const DEFAULT_CATALOG_ID: CatalogId = "politics";
