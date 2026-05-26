export type CategoryId =
  | "politics"
  | "economy"
  | "society"
  | "sports"
  | "incidents"
  | "world";

export type ArticleStatus = "draft" | "published" | "archived";

export type Locale = "az" | "ru";

export type ArticleTranslation = {
  locale: Locale;
  title: string;
  summary: string;
  body: string[];
  imageAlt: string;
};

export type AdminArticle = {
  id: string;
  slug: string;
  category: CategoryId;
  status: ArticleStatus;
  isFeatured: boolean;
  featuredOrder: number | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslation[];
};

export type ArticleFormPayload = {
  slug?: string;
  category: CategoryId;
  status?: ArticleStatus;
  isFeatured?: boolean;
  featuredOrder?: number;
  coverImageUrl?: string;
  publishNow?: boolean;
  translations: ArticleTranslation[];
};
