import type { AppMessagePath } from "../../i18n/paths";

export type CatalogId =
  | "politics"
  | "economy"
  | "society"
  | "sports"
  | "incidents"
  | "world";

/** Navbar: ana səhifə və ya rubrika */
export type NavViewId = CatalogId | "home";

export const HOME_VIEW_ID = "home" as const;

export const CATALOG: readonly { id: CatalogId; labelKey: AppMessagePath }[] = [
  { id: "politics", labelKey: "nav.politics" },
  { id: "economy", labelKey: "nav.economy" },
  { id: "society", labelKey: "nav.society" },
  { id: "sports", labelKey: "nav.sports" },
  { id: "incidents", labelKey: "nav.incidents" },
  { id: "world", labelKey: "nav.world" },
] as const;

export const DEFAULT_NAV_VIEW: NavViewId = HOME_VIEW_ID;
