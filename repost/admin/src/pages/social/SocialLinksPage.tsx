import { useEffect, useState, type FormEvent } from "react";
import {
  fetchSocialLinks,
  updateSocialLinks,
  type SocialLinks,
} from "../../api/settings";
import { ApiError } from "../../api/client";
import "../articles/articles.css";
import "./social-links.css";

const EMPTY: SocialLinks = {
  instagramUrl: null,
  facebookUrl: null,
  telegramUrl: null,
};

function toFormValues(links: SocialLinks) {
  return {
    instagramUrl: links.instagramUrl ?? "",
    facebookUrl: links.facebookUrl ?? "",
    telegramUrl: links.telegramUrl ?? "",
  };
}

export function SocialLinksPage() {
  const [form, setForm] = useState(toFormValues(EMPTY));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSocialLinks()
      .then((data) => {
        if (!cancelled) setForm(toFormValues(data));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Yüklənmədi");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await updateSocialLinks({
        instagramUrl: form.instagramUrl.trim(),
        facebookUrl: form.facebookUrl.trim(),
        telegramUrl: form.telegramUrl.trim(),
      });
      setForm(toFormValues(saved));
      setSuccess("Sosial linklər yadda saxlanıldı.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Yadda saxlanılmadı");
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
          <h1 className="admin-page__title">Sosial şəbəkələr</h1>
          <p className="admin-muted">
            Saytın sol panelində görünən Instagram, Facebook və Telegram linkləri
          </p>
        </div>
      </header>

      {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}
      {success ? (
        <p className="admin-alert admin-alert--success">{success}</p>
      ) : null}

      <form className="social-links-form" onSubmit={handleSubmit}>
        <section className="article-form__section">
          <h2 className="article-form__heading">Linklər</h2>
          <p className="social-links-form__hint">
            Boş buraxsanız, həmin sosial şəbəkə saytda göstərilməyəcək.
          </p>

          <div className="article-form__grid article-form__grid--single">
            <label className="field">
              <span>Instagram URL</span>
              <input
                type="url"
                placeholder="https://instagram.com/repost.az"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Facebook URL</span>
              <input
                type="url"
                placeholder="https://facebook.com/repost.az"
                value={form.facebookUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, facebookUrl: e.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Telegram URL</span>
              <input
                type="url"
                placeholder="https://t.me/repostaz"
                value={form.telegramUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, telegramUrl: e.target.value }))
                }
              />
            </label>
          </div>
        </section>

        <div className="article-form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saxlanılır..." : "Yadda saxla"}
          </button>
        </div>
      </form>
    </div>
  );
}
