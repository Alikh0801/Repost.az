import type { CatalogId } from "./catalog";

export type NewsArticle = {
  id: string;
  slug: string;
  category: CatalogId;
  title: string;
  summary: string;
  body: string[];
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  viewCount: number;
};
