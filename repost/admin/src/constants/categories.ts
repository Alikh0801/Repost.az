import type { CategoryId } from "../types/article";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "politics", label: "Siyasət" },
  { id: "economy", label: "İqtisadiyyat" },
  { id: "society", label: "Sosial" },
  { id: "sports", label: "İdman" },
  { id: "incidents", label: "Hadisə" },
  { id: "world", label: "Dünya" },
];

export const CATEGORY_LABEL: Record<CategoryId, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
) as Record<CategoryId, string>;
