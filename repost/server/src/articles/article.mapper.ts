import { Article, ArticleTranslation, Locale } from "@prisma/client";
import { AppLocale } from "../common/locale";

type ArticleWithTranslations = Article & {
  translations: ArticleTranslation[];
};

function pickTranslation(
  article: ArticleWithTranslations,
  locale: AppLocale,
): ArticleTranslation | undefined {
  return (
    article.translations.find((t) => t.locale === locale) ??
    article.translations.find((t) => t.locale === Locale.az)
  );
}

function parseBody(body: unknown): string[] {
  if (!Array.isArray(body)) return [];
  return body.filter((p): p is string => typeof p === "string");
}

export function toArticleListItem(
  article: ArticleWithTranslations,
  locale: AppLocale,
) {
  const translation = pickTranslation(article, locale);
  if (!translation) return null;

  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    title: translation.title,
    summary: translation.summary,
    imageUrl: article.coverImageUrl ?? "",
    imageAlt: translation.imageAlt,
    publishedAt: article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    viewCount: article.viewCount,
    isFeatured: article.isFeatured,
  };
}

export function toArticleDetail(
  article: ArticleWithTranslations,
  locale: AppLocale,
) {
  const translation = pickTranslation(article, locale);
  if (!translation) return null;

  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    title: translation.title,
    summary: translation.summary,
    body: parseBody(translation.body),
    imageUrl: article.coverImageUrl ?? "",
    imageAlt: translation.imageAlt,
    publishedAt: article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
    viewCount: article.viewCount,
    isFeatured: article.isFeatured,
  };
}

export function toAdminArticle(article: ArticleWithTranslations) {
  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    status: article.status,
    isFeatured: article.isFeatured,
    featuredOrder: article.featuredOrder,
    coverImageUrl: article.coverImageUrl,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    viewCount: article.viewCount,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    translations: article.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      summary: t.summary,
      body: parseBody(t.body),
      imageAlt: t.imageAlt,
    })),
  };
}
