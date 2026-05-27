import type { CatalogId } from "../types/catalog";

/**
 * Köhnə WordPress `/category/{id}` ID-lərinin yeni rubrikalarla uyğunluğu.
 * Naməlum ID-lər ana səhifəyə yönləndirilir.
 */
const LEGACY_WP_CATEGORY: Readonly<Record<string, CatalogId>> = {
  // Məlum nümunələr (köhnə repost.az indeksindən); lazım olduqca genişləndirin.
  "14": "society",
  "22": "incidents",
};

export function mapLegacyWordPressCategoryId(
  legacyId: string | undefined,
): CatalogId | undefined {
  if (!legacyId) return undefined;
  return LEGACY_WP_CATEGORY[legacyId];
}
