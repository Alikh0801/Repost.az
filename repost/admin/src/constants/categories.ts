import type { CategoryId } from "../types/article";

/** Statik fallback — API yüklənməyənə qədər */
export const FALLBACK_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "politics", label: "Siyasət" },
  { id: "economy", label: "İqtisadiyyat" },
  { id: "society", label: "Sosial" },
  { id: "sports", label: "İdman" },
  { id: "incidents", label: "Hadisə" },
  { id: "world", label: "Dünya" },
];
