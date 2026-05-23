import type { CatalogId } from "./catalog";

export type FeaturedNewsItem = {
  id: string;
  slug: string;
  category: CatalogId;
  title: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
};
