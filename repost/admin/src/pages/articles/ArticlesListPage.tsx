import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteArticle, fetchArticles } from "../../api/articles";
import { ApiError } from "../../api/client";
import { CATEGORY_LABEL } from "../../constants/categories";
import type { AdminArticle } from "../../types/article";
import "./articles.css";

const STATUS_LABEL: Record<AdminArticle["status"], string> = {
  draft: "Qaralama",
  published: "Dərc",
  archived: "Arxiv",
};

export function ArticlesListPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setArticles(await fetchArticles());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xəbərlər yüklənmədi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" silinsin?`)) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Silinmədi");
    }
  }

  function titleFor(article: AdminArticle) {
    return (
      article.translations.find((t) => t.locale === "az")?.title ??
      article.translations[0]?.title ??
      article.slug
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Xəbərlər</h1>
          <p className="admin-page__subtitle">Bütün materialların siyahısı</p>
        </div>
        <Link to="/articles/new" className="btn btn--primary">
          + Yeni xəbər
        </Link>
      </header>

      {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}
      {loading ? <p className="admin-muted">Yüklənir...</p> : null}

      {!loading && articles.length === 0 ? (
        <p className="admin-muted">Hələ xəbər yoxdur.</p>
      ) : null}

      {!loading && articles.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlıq (AZ)</th>
                <th>Kateqoriya</th>
                <th>Status</th>
                <th>Hero</th>
                <th>Oxunuş</th>
                <th aria-label="Əməliyyatlar" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <span className="admin-table__title">{titleFor(article)}</span>
                    <span className="admin-table__slug">{article.slug}</span>
                  </td>
                  <td>{CATEGORY_LABEL[article.category]}</td>
                  <td>
                    <span
                      className={`status-pill status-pill--${article.status}`}
                    >
                      {STATUS_LABEL[article.status]}
                    </span>
                  </td>
                  <td>{article.isFeatured ? "Bəli" : "—"}</td>
                  <td>{article.viewCount.toLocaleString("az-AZ")}</td>
                  <td className="admin-table__actions">
                    <Link to={`/articles/${article.id}`} className="btn btn--ghost">
                      Redaktə
                    </Link>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => void handleDelete(article.id, titleFor(article))}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
