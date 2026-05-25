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

function ruHasAnyInput(bodyDraft: Record<Locale, string>, t: ArticleTranslation): boolean {
  return (
    t.title.trim().length > 0 ||
    t.summary.trim().length > 0 ||
    textToBody(bodyDraft.ru).length > 0
  );
}

/** Yalnız AZ mütləq; RU istəyə görə. */
export function validateArticleForm(
  form: ArticleFormPayload,
  bodyDraft: Record<Locale, string>,
): string | null {
  const az = getTranslation(form, "az");
  const azTitle = az.title.trim();
  const azSummary = az.summary.trim();
  const azBody = textToBody(bodyDraft.az);

  if (azTitle.length < 3) {
    return "Azərbaycan: başlıq ən azı 3 simvol olmalıdır";
  }
  if (azSummary.length < 10) {
    return "Azərbaycan: xülasə ən azı 10 simvol olmalıdır";
  }
  if (azBody.length < 1) {
    return "Azərbaycan: mətn boş ola bilməz";
  }

  const ru = getTranslation(form, "ru");
  if (!ruHasAnyInput(bodyDraft, ru)) {
    return null;
  }

  if (ru.title.trim().length < 3) {
    return "Rus: başlıq doldurulubsa, ən azı 3 simvol olmalıdır";
  }
  if (ru.summary.trim().length < 10) {
    return "Rus: xülasə doldurulubsa, ən azı 10 simvol olmalıdır";
  }
  if (textToBody(bodyDraft.ru).length < 1) {
    return "Rus: mətn doldurulubsa, boş ola bilməz";
  }

  return null;
}

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
