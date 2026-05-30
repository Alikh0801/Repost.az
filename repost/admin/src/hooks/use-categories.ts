import { useEffect, useState } from "react";
import { fetchCategories, type CategoryRecord } from "../api/categories";

const FALLBACK: CategoryRecord[] = [
  { slug: "politics", labelAz: "Siyasət", labelRu: "Политика", sortOrder: 1, articleCount: 0 },
  { slug: "economy", labelAz: "İqtisadiyyat", labelRu: "Экономика", sortOrder: 2, articleCount: 0 },
  { slug: "society", labelAz: "Sosial", labelRu: "Общество", sortOrder: 3, articleCount: 0 },
  { slug: "sports", labelAz: "İdman", labelRu: "Спорт", sortOrder: 4, articleCount: 0 },
  { slug: "incidents", labelAz: "Hadisə", labelRu: "Происшествия", sortOrder: 5, articleCount: 0 },
  { slug: "world", labelAz: "Dünya", labelRu: "Мир", sortOrder: 6, articleCount: 0 },
];

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRecord[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setCategories(rows);
      })
      .catch(() => {
        /* fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, setCategories };
}

export function categoryLabel(
  categories: CategoryRecord[],
  slug: string,
): string {
  return categories.find((c) => c.slug === slug)?.labelAz ?? slug;
}
