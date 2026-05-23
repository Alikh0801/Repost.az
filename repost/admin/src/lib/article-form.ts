import type {
  AdminArticle,
  ArticleFormPayload,
  ArticleTranslation,
  Locale,
} from "../types/article";

export const LOCALES: Locale[] = ["az", "ru"];

export const LOCALE_LABEL: Record<Locale, string> = {
  az: "Azərbaycan",
  ru: "Rus",
};

export function emptyTranslation(locale: Locale): ArticleTranslation {
  return {
    locale,
    title: "",
    summary: "",
    body: [],
    imageAlt: "",
  };
}

export function emptyArticleForm(): ArticleFormPayload {
  return {
    category: "politics",
    status: "draft",
    isFeatured: false,
    translations: LOCALES.map(emptyTranslation),
  };
}

export function articleToForm(article: AdminArticle): ArticleFormPayload {
  const byLocale = new Map(article.translations.map((t) => [t.locale, t]));

  return {
    slug: article.slug,
    category: article.category,
    status: article.status,
    isFeatured: article.isFeatured,
    featuredOrder: article.featuredOrder ?? undefined,
    coverImageUrl: article.coverImageUrl ?? undefined,
    publishedAt: article.publishedAt ?? undefined,
    translations: LOCALES.map(
      (locale) => byLocale.get(locale) ?? emptyTranslation(locale),
    ),
  };
}

export function emptyBodyDraft(): Record<Locale, string> {
  return { az: "", ru: "" };
}

export function bodyToText(body: string[]): string {
  return body.join("\n");
}

export function textToBody(text: string): string[] {
  return text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export function bodyDraftFromForm(form: ArticleFormPayload): Record<Locale, string> {
  return {
    az: bodyToText(getTranslation(form, "az").body),
    ru: bodyToText(getTranslation(form, "ru").body),
  };
}

export function getTranslation(
  form: ArticleFormPayload,
  locale: Locale,
): ArticleTranslation {
  return form.translations.find((t) => t.locale === locale) ?? emptyTranslation(locale);
}

export function updateTranslation(
  form: ArticleFormPayload,
  locale: Locale,
  patch: Partial<ArticleTranslation>,
): ArticleFormPayload {
  return {
    ...form,
    translations: form.translations.map((t) =>
      t.locale === locale ? { ...t, ...patch } : t,
    ),
  };
}

export function validateArticleForm(
  form: ArticleFormPayload,
  bodyDraft: Record<Locale, string>,
): string | null {
  for (const locale of LOCALES) {
    const t = getTranslation(form, locale);
    const title = t.title.trim();
    const summary = t.summary.trim();
    const body = textToBody(bodyDraft[locale]);
    const label = LOCALE_LABEL[locale];

    if (title.length < 3) {
      return `${label}: başlıq ən azı 3 simvol olmalıdır`;
    }
    if (summary.length < 10) {
      return `${label}: xülasə ən azı 10 simvol olmalıdır`;
    }
    if (body.length < 1) {
      return `${label}: mətn boş ola bilməz`;
    }
  }
  return null;
}

/** API-yə göndərməzdən əvvəl — hər iki dil mütləq */
export function normalizeArticlePayload(
  form: ArticleFormPayload,
): ArticleFormPayload {
  const slug = form.slug?.trim();
  const coverImageUrl = form.coverImageUrl?.trim();

  return {
    category: form.category,
    status: form.status,
    isFeatured: form.isFeatured,
    ...(slug ? { slug } : {}),
    ...(coverImageUrl ? { coverImageUrl } : {}),
    ...(form.featuredOrder != null ? { featuredOrder: form.featuredOrder } : {}),
    ...(form.publishedAt ? { publishedAt: form.publishedAt } : {}),
    translations: LOCALES.map((locale) => {
      const t = getTranslation(form, locale);
      const title = t.title.trim();
      return {
        locale,
        title,
        summary: t.summary.trim(),
        imageAlt: title,
        body: t.body.map((p) => p.trim()).filter(Boolean),
      };
    }),
  };
}
