import { Article } from "@prisma/client";
import { normalizeStoredMediaUrl } from "../common/media-url";
import type { AppLocale } from "../common/locale";
import {
  type ArticleContent,
  contentToTranslations,
  parseArticleContent,
} from "./article-content";

type ArticleRow = Article;

function publicImageUrl(coverImageUrl: string | null): string {
  return normalizeStoredMediaUrl(coverImageUrl) ?? "";
}

function localeSlice(content: ArticleContent, locale: AppLocale) {
  return content[locale];
}

export function toArticleListItem(article: ArticleRow) {
  const content = parseArticleContent(article.content);

  return {
    id: article.id,
    slug: article.slug,
    category: article.categorySlug,
    imageUrl: publicImageUrl(article.coverImageUrl),
    publishedAt:
      article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    viewCount: article.viewCount,
    isFeatured: article.isFeatured,
    locales: {
      az: {
        title: content.az.title,
        summary: content.az.summary,
        imageAlt: content.az.imageAlt,
      },
      ru: {
        title: content.ru.title,
        summary: content.ru.summary,
        imageAlt: content.ru.imageAlt,
      },
    },
  };
}

export function toArticleDetail(article: ArticleRow) {
  const content = parseArticleContent(article.content);

  return {
    id: article.id,
    slug: article.slug,
    category: article.categorySlug,
    imageUrl: publicImageUrl(article.coverImageUrl),
    publishedAt:
      article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    viewCount: article.viewCount,
    isFeatured: article.isFeatured,
    locales: {
      az: localeSlice(content, "az"),
      ru: localeSlice(content, "ru"),
    },
  };
}

export function toAdminArticle(article: ArticleRow) {
  const content = parseArticleContent(article.content);

  return {
    id: article.id,
    slug: article.slug,
    category: article.categorySlug,
    status: article.status,
    isFeatured: article.isFeatured,
    featuredOrder: article.featuredOrder,
    coverImageUrl: publicImageUrl(article.coverImageUrl) || null,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    viewCount: article.viewCount,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    translations: contentToTranslations(content),
  };
}

/** Köhnə API uyğunluğu — locale seçimi client-də edilir */
export function pickLocaleFields<T extends { title: string; summary: string; imageAlt: string }>(
  locales: { az: T; ru: T },
  locale: AppLocale,
): T {
  return locales[locale];
}
