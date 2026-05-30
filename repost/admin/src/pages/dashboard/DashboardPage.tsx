import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type CategoryRecord,
} from "../../api/categories";
import { fetchDashboardStats, type DashboardStats } from "../../api/dashboard";
import { ApiError } from "../../api/client";
import "./dashboard.css";

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("az-AZ");
}

function pctBadge(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    labelAz: "",
    labelRu: "",
    slug: "",
  });

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [statsData, categoryData] = await Promise.all([
        fetchDashboardStats(),
        fetchCategories(),
      ]);
      setStats(statsData);
      setCategories(categoryData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Məlumat yüklənmədi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const chartMax = useMemo(() => {
    if (!stats) return 1;
    const all = [...stats.weeklyViews.thisWeek, ...stats.weeklyViews.lastWeek];
    return Math.max(1, ...all);
  }, [stats]);

  async function handleSaveCategory(row: CategoryRecord) {
    setSavingSlug(row.slug);
    setError(null);
    try {
      const updated = await updateCategory(row.slug, {
        labelAz: row.labelAz,
        labelRu: row.labelRu,
        sortOrder: row.sortOrder,
      });
      setCategories((prev) =>
        prev.map((c) => (c.slug === row.slug ? updated : c)),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Yadda saxlanılmadı");
    } finally {
      setSavingSlug(null);
    }
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Bu kateqoriyanı silmək istəyirsiniz?")) return;
    setError(null);
    try {
      await deleteCategory(slug);
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Silinmədi");
    }
  }

  async function handleAddCategory(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const created = await createCategory({
        labelAz: newCategory.labelAz.trim(),
        labelRu: newCategory.labelRu.trim(),
        ...(newCategory.slug.trim() ? { slug: newCategory.slug.trim() } : {}),
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setNewCategory({ labelAz: "", labelRu: "", slug: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Əlavə edilmədi");
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
    <div className="admin-page dashboard-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">İdarəetmə paneli</h1>
          <p className="admin-muted">Statistika və kateqoriya idarəetməsi</p>
        </div>
      </header>

      {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}

      {stats ? (
        <>
          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-card__top">
                <span className="dashboard-stat-card__icon dashboard-stat-card__icon--news" aria-hidden>
                  📰
                </span>
                <span className="dashboard-stat-card__badge dashboard-stat-card__badge--up">
                  {pctBadge(stats.totalArticlesChangePct)}
                </span>
              </div>
              <strong className="dashboard-stat-card__value">
                {stats.totalArticles.toLocaleString("az-AZ")}
              </strong>
              <span className="dashboard-stat-card__label">Ümumi xəbər</span>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-card__top">
                <span className="dashboard-stat-card__icon dashboard-stat-card__icon--views" aria-hidden>
                  👁
                </span>
                <span className="dashboard-stat-card__badge dashboard-stat-card__badge--up">
                  {pctBadge(stats.todayViewsChangePct)}
                </span>
              </div>
              <strong className="dashboard-stat-card__value">
                {formatCount(stats.todayViews)}
              </strong>
              <span className="dashboard-stat-card__label">Bu gün baxış</span>
            </article>

            <article className="dashboard-stat-card dashboard-stat-card--wide">
              <div className="dashboard-stat-card__top">
                <span className="dashboard-stat-card__icon dashboard-stat-card__icon--total" aria-hidden>
                  📊
                </span>
              </div>
              <strong className="dashboard-stat-card__value">
                {formatCount(stats.totalViews)}
              </strong>
              <span className="dashboard-stat-card__label">Ümumi baxış</span>
            </article>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h2 className="dashboard-panel__title">Həftəlik baxış statistikası</h2>
              <span className="dashboard-panel__chip">Bu həftə</span>
            </div>

            <div className="dashboard-chart" role="img" aria-label="Həftəlik baxış qrafiki">
              {stats.weeklyViews.labels.map((label, index) => (
                <div key={label} className="dashboard-chart__col">
                  <div className="dashboard-chart__bars">
                    <span
                      className="dashboard-chart__bar dashboard-chart__bar--last"
                      style={{
                        height: `${(stats.weeklyViews.lastWeek[index] / chartMax) * 100}%`,
                      }}
                      title={`Keçən həftə: ${stats.weeklyViews.lastWeek[index]}`}
                    />
                    <span
                      className="dashboard-chart__bar dashboard-chart__bar--this"
                      style={{
                        height: `${(stats.weeklyViews.thisWeek[index] / chartMax) * 100}%`,
                      }}
                      title={`Bu həftə: ${stats.weeklyViews.thisWeek[index]}`}
                    />
                  </div>
                  <span className="dashboard-chart__label">{label}</span>
                </div>
              ))}
            </div>

            <div className="dashboard-chart__legend">
              <span>
                <i className="dashboard-chart__dot dashboard-chart__dot--this" /> Bu həftə
              </span>
              <span>
                <i className="dashboard-chart__dot dashboard-chart__dot--last" /> Keçən həftə
              </span>
            </div>
          </section>
        </>
      ) : null}

      <section className="dashboard-panel">
        <div className="dashboard-panel__header">
          <h2 className="dashboard-panel__title">Kateqoriyalar</h2>
        </div>

        <div className="dashboard-categories">
          {categories.map((row) => (
            <div key={row.slug} className="dashboard-category-row">
              <span className="dashboard-category-row__slug">{row.slug}</span>
              <input
                type="text"
                value={row.labelAz}
                onChange={(e) =>
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.slug === row.slug ? { ...c, labelAz: e.target.value } : c,
                    ),
                  )
                }
                placeholder="AZ ad"
              />
              <input
                type="text"
                value={row.labelRu}
                onChange={(e) =>
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.slug === row.slug ? { ...c, labelRu: e.target.value } : c,
                    ),
                  )
                }
                placeholder="RU ad"
              />
              <input
                type="number"
                className="dashboard-category-row__order"
                value={row.sortOrder}
                onChange={(e) =>
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.slug === row.slug
                        ? { ...c, sortOrder: Number(e.target.value) || 0 }
                        : c,
                    ),
                  )
                }
                aria-label="Sıra"
              />
              <span className="dashboard-category-row__count">{row.articleCount} xəbər</span>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={savingSlug === row.slug}
                onClick={() => void handleSaveCategory(row)}
              >
                {savingSlug === row.slug ? "..." : "Yadda saxla"}
              </button>
              <button
                type="button"
                className="btn btn--danger"
                disabled={row.articleCount > 0}
                onClick={() => void handleDelete(row.slug)}
                title={
                  row.articleCount > 0
                    ? "Xəbər olan kateqoriya silinmir"
                    : "Sil"
                }
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        <form className="dashboard-category-add" onSubmit={handleAddCategory}>
          <h3 className="dashboard-category-add__title">Yeni kateqoriya</h3>
          <div className="dashboard-category-add__grid">
            <input
              type="text"
              placeholder="AZ ad *"
              value={newCategory.labelAz}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, labelAz: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="RU ad *"
              value={newCategory.labelRu}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, labelRu: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="Slug (boş buraxıla bilər)"
              value={newCategory.slug}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
            <button type="submit" className="btn btn--primary">
              Əlavə et
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
