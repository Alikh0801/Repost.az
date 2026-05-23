import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { AppLocale } from "../common/locale";
import type { ArticleTranslationDto } from "./dto/article-translation.dto";

export type LocaleContent = {
  title: string;
  summary: string;
  body: string[];
  imageAlt: string;
};

export type ArticleContent = Record<AppLocale, LocaleContent>;

const LOCALES: AppLocale[] = ["az", "ru"];

export function emptyLocaleContent(): LocaleContent {
  return { title: "", summary: "", body: [], imageAlt: "" };
}

export function emptyArticleContent(): ArticleContent {
  return { az: emptyLocaleContent(), ru: emptyLocaleContent() };
}

export function translationsToContent(
  translations: ArticleTranslationDto[],
): ArticleContent {
  assertBothLocales(translations);
  const content = emptyArticleContent();
  for (const t of translations) {
    content[t.locale] = {
      title: t.title,
      summary: t.summary,
      body: t.body,
      imageAlt: t.imageAlt,
    };
  }
  return content;
}

export function assertBothLocales(translations: ArticleTranslationDto[]): void {
  const locales = new Set(translations.map((t) => t.locale));
  for (const locale of LOCALES) {
    if (!locales.has(locale)) {
      throw new BadRequestException(
        `Hər iki dil mütləqdir: az və ru tərcümələri doldurulmalıdır`,
      );
    }
  }
}

export function parseArticleContent(raw: unknown): ArticleContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyArticleContent();
  }

  const record = raw as Record<string, unknown>;
  const content = emptyArticleContent();

  for (const locale of LOCALES) {
    const entry = record[locale];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row = entry as Record<string, unknown>;
    content[locale] = {
      title: typeof row.title === "string" ? row.title : "",
      summary: typeof row.summary === "string" ? row.summary : "",
      body: parseBody(row.body),
      imageAlt: typeof row.imageAlt === "string" ? row.imageAlt : "",
    };
  }

  return content;
}

function parseBody(body: unknown): string[] {
  if (!Array.isArray(body)) return [];
  return body.filter((p): p is string => typeof p === "string");
}

export function contentToPrismaJson(content: ArticleContent): Prisma.InputJsonValue {
  return content as unknown as Prisma.InputJsonValue;
}

export function contentToTranslations(
  content: ArticleContent,
): ArticleTranslationDto[] {
  return LOCALES.map((locale) => ({
    locale,
    ...content[locale],
  }));
}
