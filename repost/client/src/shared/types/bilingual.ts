import type { AppLocale } from "../../i18n/types";
import type { CatalogId } from "./catalog";

export type LocaleText = {
  title: string;
  summary: string;
  imageAlt: string;
};

export type LocaleDetailText = LocaleText & {
  body: string[];
};

export type ArticleLocales = Record<AppLocale, LocaleText>;
export type ArticleDetailLocales = Record<AppLocale, LocaleDetailText>;

export type BilingualListItemDto = {
  id: string;
  slug: string;
  category: CatalogId;
  imageUrl: string;
  publishedAt: string;
  viewCount: number;
  isFeatured?: boolean;
  locales: ArticleLocales;
};

export type BilingualArticleDto = {
  id: string;
  slug: string;
  category: CatalogId;
  imageUrl: string;
  publishedAt: string;
  viewCount: number;
  isFeatured?: boolean;
  locales: ArticleDetailLocales;
};
