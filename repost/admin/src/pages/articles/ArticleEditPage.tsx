import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createArticle,
  fetchArticle,
  updateArticle,
} from "../../api/articles";
import { ApiError } from "../../api/client";
import { uploadImage } from "../../api/media";
import { CATEGORIES } from "../../constants/categories";
import {
  articleToForm,
  bodyDraftFromForm,
  emptyArticleForm,
  emptyBodyDraft,
  getTranslation,
  LOCALES,
  LOCALE_LABEL,
  normalizeArticlePayload,
  textToBody,
  updateTranslation,
  validateArticleForm,
} from "../../lib/article-form";
import { formatApiError } from "../../lib/format-api-error";
import { resolveMediaUrl } from "../../lib/resolve-media-url";
import type { ArticleFormPayload, ArticleStatus, Locale } from "../../types/article";
import "./articles.css";

const STATUS_OPTIONS: { value: ArticleStatus; label: string }[] = [
  { value: "draft", label: "Qaralama" },
  { value: "published", label: "Dərc olunub" },
  { value: "archived", label: "Arxiv" },
];

export function ArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<ArticleFormPayload>(emptyArticleForm);
  const [activeLocale, setActiveLocale] = useState<Locale>("az");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bodyDraft, setBodyDraft] = useState(emptyBodyDraft);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const article = await fetchArticle(id!);
        if (!cancelled) {
          const nextForm = articleToForm(article);
          setForm(nextForm);
          setBodyDraft(bodyDraftFromForm(nextForm));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Xəbər tapılmadı");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  const translation = getTranslation(form, activeLocale);
  const localeRequired = activeLocale === "az";

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, coverImageUrl: url }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Şəkil yüklənmədi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const formWithBodies = {
      ...form,
      translations: form.translations.map((t) => ({
        ...t,
        body: textToBody(bodyDraft[t.locale]),
      })),
    };

    const validationError = validateArticleForm(formWithBodies, bodyDraft);
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    const payload = normalizeArticlePayload(formWithBodies);

    try {
      if (isNew) {
        await createArticle(payload);
        navigate("/articles", { replace: true });
        return;
      }
      await updateArticle(id!, payload);
      navigate("/articles", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? formatApiError(err.message)
          : "Yadda saxlanılmadı",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <Link to="/articles" className="admin-back">
            ← Siyahı
          </Link>
          <h1 className="admin-page__title">
            {isNew ? "Yeni xəbər" : "Xəbəri redaktə et"}
          </h1>
          <p className="admin-muted">
            Azərbaycan dili mütləqdir. Rus dili istəyə görədir. Dərc vaxtı avtomatik
            təyin olunur.
          </p>
        </div>
      </header>

      {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}

      <form className="article-form" onSubmit={handleSubmit}>
        <section className="article-form__section">
          <h2 className="article-form__heading">Ümumi</h2>
          <div className="article-form__grid">
            <label className="field">
              <span>Kateqoriya</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as ArticleFormPayload["category"],
                  }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Status</span>
              <select
                value={form.status ?? "draft"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as ArticleStatus,
                  }))
                }
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Slug (boş buraxıla bilər)</span>
              <input
                type="text"
                value={form.slug ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="parlamentde-budce-muzakireleri"
              />
            </label>

            <label className="field field--checkbox">
              <input
                type="checkbox"
                checked={form.isFeatured ?? false}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                }
              />
              <span>Hero (əsas slayder)</span>
            </label>

            <label className="field">
              <span>Hero sırası</span>
              <input
                type="number"
                min={1}
                value={form.featuredOrder ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    featuredOrder: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </label>
          </div>

          <label className="field">
            <span>Üz şəkli (fayl yüklə)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={(e) => void handleImageUpload(e.target.files?.[0] ?? null)}
            />
            {uploading ? <span className="admin-muted">Yüklənir...</span> : null}
          </label>

          {form.coverImageUrl ? (
            <img
              className="article-form__preview"
              src={resolveMediaUrl(form.coverImageUrl)}
              alt="Önizləmə"
            />
          ) : null}
        </section>

        <section className="article-form__section">
          <div className="locale-tabs">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                className={`locale-tabs__btn${activeLocale === locale ? " locale-tabs__btn--active" : ""}`}
                onClick={() => setActiveLocale(locale)}
              >
                {LOCALE_LABEL[locale]}
              </button>
            ))}
          </div>

          <div className="article-form__grid article-form__grid--single">
            <label className="field">
              <span>
                Başlıq ({LOCALE_LABEL[activeLocale]}
                {localeRequired ? " *" : ", istəyə görə"})
              </span>
              <input
                type="text"
                value={translation.title}
                onChange={(e) =>
                  setForm((prev) =>
                    updateTranslation(prev, activeLocale, { title: e.target.value }),
                  )
                }
                required={localeRequired}
              />
            </label>

            <label className="field">
              <span>
                Lead / xülasə
                {localeRequired ? " (min. 10 simvol) *" : " (istəyə görə)"}
              </span>
              <textarea
                rows={3}
                minLength={localeRequired ? 10 : undefined}
                value={translation.summary}
                onChange={(e) =>
                  setForm((prev) =>
                    updateTranslation(prev, activeLocale, {
                      summary: e.target.value,
                    }),
                  )
                }
                required={localeRequired}
              />
            </label>

            <label className="field">
              <span>
                Mətn (Enter — yeni sətir / abzas)
                {localeRequired ? " *" : ", istəyə görə"}
              </span>
              <textarea
                rows={12}
                value={bodyDraft[activeLocale]}
                onChange={(e) =>
                  setBodyDraft((prev) => ({
                    ...prev,
                    [activeLocale]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.stopPropagation();
                }}
                required={localeRequired}
              />
            </label>
          </div>
        </section>

        <div className="article-form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saxlanılır..." : "Yadda saxla"}
          </button>
          <Link to="/articles" className="btn btn--ghost">
            Ləğv et
          </Link>
        </div>
      </form>
    </div>
  );
}
