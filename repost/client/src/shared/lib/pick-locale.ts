import type { AppLocale } from "../../i18n/types";
import { resolveMediaUrl } from "./resolve-media-url";
import type { NewsArticle } from "../types/article";
import type { CategoryNewsItem } from "../types/category-news-item";
import type { FeaturedNewsItem } from "../types/featured-news-item";
import type {
  ArticleDetailLocales,
  ArticleLocales,
  BilingualArticleDto,
  BilingualListItemDto,
} from "../types/bilingual";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";

function pick<T extends ArticleLocales | ArticleDetailLocales>(
  locales: T,
  locale: AppLocale,
): T[AppLocale] {
  const slice = locales[locale];
  if (slice?.title?.trim()) {
    return slice;
  }
  return locales.az;
}

export function pickListItem(
  dto: BilingualListItemDto,
  locale: AppLocale,
): CategoryNewsItem {
  const text = pick(dto.locales, locale);
  return {
    id: dto.id,
    slug: dto.slug,
    category: dto.category,
    title: text.title,
    summary: text.summary,
    imageUrl: resolveMediaUrl(dto.imageUrl) || PLACEHOLDER_IMAGE,
    imageAlt: text.imageAlt,
    publishedAt: dto.publishedAt,
    viewCount: dto.viewCount,
  };
}

export function pickFeaturedItem(
  dto: BilingualListItemDto,
  locale: AppLocale,
): FeaturedNewsItem {
  const text = pick(dto.locales, locale);
  return {
    id: dto.id,
    slug: dto.slug,
    category: dto.category,
    title: text.title,
    summary: text.summary,
    imageUrl: resolveMediaUrl(dto.imageUrl) || PLACEHOLDER_IMAGE,
    imageAlt: text.imageAlt,
    publishedAt: dto.publishedAt,
  };
}

export function pickArticleDetail(
  dto: BilingualArticleDto,
  locale: AppLocale,
): NewsArticle {
  const text = pick(dto.locales, locale);
  return {
    id: dto.id,
    slug: dto.slug,
    category: dto.category,
    title: text.title,
    summary: text.summary,
    body: text.body,
    imageUrl: resolveMediaUrl(dto.imageUrl) || PLACEHOLDER_IMAGE,
    imageAlt: text.imageAlt,
    publishedAt: dto.publishedAt,
    viewCount: dto.viewCount,
  };
}
