import type { CatalogId } from "../types/catalog";
import type { BilingualArticleDto, BilingualListItemDto } from "../types/bilingual";
import { apiGet, apiPost } from "./client";

type ArticlesPageDto = {
  items: BilingualListItemDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function fetchFeaturedNews() {
  return apiGet<BilingualListItemDto[]>("/articles/featured");
}

export function fetchCategoryNews(category: CatalogId, limit = 50) {
  const params = new URLSearchParams({
    category,
    limit: String(limit),
  });
  return apiGet<ArticlesPageDto>(`/articles?${params}`);
}

export function fetchArticleBySlug(slug: string) {
  const encoded = encodeURIComponent(slug);
  return apiGet<BilingualArticleDto>(`/articles/${encoded}`);
}

export function fetchRelatedArticles(slug: string) {
  const encoded = encodeURIComponent(slug);
  return apiGet<BilingualListItemDto[]>(`/articles/${encoded}/related`);
}

export function incrementArticleViews(slug: string) {
  apiPost(`/articles/${encodeURIComponent(slug)}/views`);
}
