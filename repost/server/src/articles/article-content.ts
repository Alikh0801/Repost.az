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

export function assertAzLocale(translations: ArticleTranslationDto[]): void {
  const az = translations.find((t) => t.locale === "az");
  if (!az) {
    throw new BadRequestException("Azərbaycan tərcüməsi mütləqdir");
  }
  if (az.title.trim().length < 3) {
    throw new BadRequestException(
      "Azərbaycan başlığı ən azı 3 simvol olmalıdır",
    );
  }
  if (az.summary.trim().length < 10) {
    throw new BadRequestException(
      "Azərbaycan xülasəsi ən azı 10 simvol olmalıdır",
    );
  }
  const body = (az.body ?? []).map((p) => p.trim()).filter(Boolean);
  if (body.length < 1) {
    throw new BadRequestException("Azərbaycan mətni boş ola bilməz");
  }
}

function ruHasPartialInput(t: ArticleTranslationDto): boolean {
  const title = t.title?.trim() ?? "";
  const summary = t.summary?.trim() ?? "";
  const body = (t.body ?? []).map((p) => p.trim()).filter(Boolean);
  return title.length > 0 || summary.length > 0 || body.length > 0;
}

function assertRuLocaleIfPartial(t: ArticleTranslationDto): void {
  if (!ruHasPartialInput(t)) return;
  if (t.title.trim().length < 3) {
    throw new BadRequestException(
      "Rus başlığı doldurulubsa, ən azı 3 simvol olmalıdır",
    );
  }
  if (t.summary.trim().length < 10) {
    throw new BadRequestException(
      "Rus xülasəsi doldurulubsa, ən azı 10 simvol olmalıdır",
    );
  }
  const body = t.body.map((p) => p.trim()).filter(Boolean);
  if (body.length < 1) {
    throw new BadRequestException(
      "Rus mətni doldurulubsa, boş ola bilməz",
    );
  }
}

export function translationsToContent(
  translations: ArticleTranslationDto[],
): ArticleContent {
  assertAzLocale(translations);

  const az = translations.find((t) => t.locale === "az")!;
  const ru = translations.find((t) => t.locale === "ru");
  if (ru) assertRuLocaleIfPartial(ru);

  const azTitle = az.title.trim();
  const content: ArticleContent = {
    az: {
      title: azTitle,
      summary: az.summary.trim(),
      body: az.body.map((p) => p.trim()).filter(Boolean),
      imageAlt: (az.imageAlt || azTitle).trim(),
    },
    ru: emptyLocaleContent(),
  };

  if (ru && ruHasPartialInput(ru)) {
    const ruTitle = ru.title.trim();
    content.ru = {
      title: ruTitle,
      summary: ru.summary.trim(),
      body: ru.body.map((p) => p.trim()).filter(Boolean),
      imageAlt: (ru.imageAlt || ruTitle).trim(),
    };
  }

  return content;
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
