import type {
  AdminArticle,
  ArticleFormPayload,
  ArticleTranslation,
  Locale,
} from "../types/article";

export const LOCALES: Locale[] = ["az", "ru"];

export const LOCALE_LABEL: Record<Locale, string> = {
  az: "Azərbaycanca",
  ru: "Rusca",
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
    publishNow: false,
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
    publishNow: false,
    translations: LOCALES.map(
      (locale) => byLocale.get(locale) ?? emptyTranslation(locale),
    ),
  };
}

export function emptyBodyDraft(): Record<Locale, string> {
  return { az: "", ru: "" };
}

export function bodyToText(body: string[]): string {
  return bodyToHtml(body);
}

export function textToBody(text: string): string[] {
  return htmlToBody(text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/** DB-dəki body massivini redaktor HTML-inə çevirir. */
export function bodyToHtml(body: string[]): string {
  if (body.length === 0) return "";

  if (body.length === 1 && looksLikeHtml(body[0] ?? "")) {
    return body[0] ?? "";
  }

  if (body.some((block) => looksLikeHtml(block))) {
    return body
      .map((block) =>
        looksLikeHtml(block) ? block : `<p>${escapeHtml(block)}</p>`,
      )
      .join("");
  }

  return body.map((block) => `<p>${escapeHtml(block)}</p>`).join("");
}

/** Redaktor HTML-ini DB body massivinə çevirir. */
export function htmlToBody(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>") return [];
  return [trimmed];
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function bodyDraftFromForm(form: ArticleFormPayload): Record<Locale, string> {
  return {
    az: bodyToHtml(getTranslation(form, "az").body),
    ru: bodyToHtml(getTranslation(form, "ru").body),
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
    htmlToBody(bodyDraft.ru).length > 0
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
  const azBody = htmlToBody(bodyDraft.az);

  if (azTitle.length < 3) {
    return "Azərbaycan: başlıq ən azı 3 simvol olmalıdır";
  }
  if (azSummary.length < 10) {
    return "Azərbaycan: xülasə ən azı 10 simvol olmalıdır";
  }
  if (azBody.length < 1 || htmlToPlainText(bodyDraft.az).length < 1) {
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
  if (textToBody(bodyDraft.ru).length < 1 || htmlToPlainText(bodyDraft.ru).length < 1) {
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
    ...(form.publishNow ? { publishNow: true } : {}),
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
