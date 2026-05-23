import type { AppLocale } from "../../i18n/types";
import type { NewsArticle } from "../types/article";
import {
  buildArticleBody,
  buildLeadSummary,
} from "../lib/build-article-body";
import type { CategoryNewsItem } from "./category-news";
import { getCategoryNews } from "./category-news";
import { getFeaturedNews } from "./featured-news";

export function getArticleById(
  articleId: string,
  locale: AppLocale,
): NewsArticle | null {
  const featured = getFeaturedNews(locale).find((item) => item.id === articleId);
  if (featured) {
    return {
      id: featured.id,
      category: featured.category,
      title: featured.title,
      summary: featured.summary,
      body: buildArticleBody(featured.summary, featured.title, locale),
      imageUrl: featured.imageUrl,
      imageAlt: featured.imageAlt,
      publishedAt: featured.publishedAt,
      viewCount: Number(featured.id) * 9_500 + 12_000,
    };
  }

  const category = getCategoryNews(locale).find((item) => item.id === articleId);
  if (!category) return null;

  const summary =
    category.summary ?? buildLeadSummary(category.title, locale);

  return {
    id: category.id,
    category: category.category,
    title: category.title,
    summary,
    body: buildArticleBody(summary, category.title, locale),
    imageUrl: category.imageUrl,
    imageAlt: category.imageAlt,
    publishedAt: category.publishedAt,
    viewCount: category.viewCount,
  };
}

const RELATED_DEFAULT_LIMIT = 6;

export function getRelatedArticles(
  articleId: string,
  locale: AppLocale,
  limit = RELATED_DEFAULT_LIMIT,
): CategoryNewsItem[] {
  const current = getArticleById(articleId, locale);
  if (!current) return [];

  const candidates = getCategoryNews(locale).filter((item) => item.id !== articleId);

  const sameCategory = candidates
    .filter((item) => item.category === current.category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const otherCategories = candidates
    .filter((item) => item.category !== current.category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}
