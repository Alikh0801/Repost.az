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

export function fetchRecentNews(limit = 50, category?: CatalogId) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set("category", category);
  return apiGet<ArticlesPageDto>(`/articles?${params}`);
}

export function fetchCategoryNews(category: CatalogId, limit = 50) {
  return fetchRecentNews(limit, category);
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
