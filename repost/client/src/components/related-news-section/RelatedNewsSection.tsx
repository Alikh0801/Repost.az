import { useState } from "react";
import { useI18n } from "../../i18n";
import { useRelatedNews } from "../../shared/hooks/use-related-news";
import { NewsCard } from "../news-card/NewsCard";
import "./related-news-section.css";

type RelatedNewsSectionProps = {
  articleSlug: string;
  limit?: number;
};

export function RelatedNewsSection({
  articleSlug,
  limit = 6,
}: RelatedNewsSectionProps) {
  const { t } = useI18n();
  const [now] = useState(() => new Date());
  const { articles: related, loading } = useRelatedNews(articleSlug, limit);

  if (loading || related.length === 0) return null;

  return (
    <section
      className="related-news-section"
      aria-labelledby="related-news-section-heading"
    >
      <h2 id="related-news-section-heading" className="related-news-section__heading">
        {t("article.relatedTitle")}
      </h2>
      <p className="related-news-section__hint">{t("article.relatedHint")}</p>
      <ul className="related-news-section__list">
        {related.map((item) => (
          <li key={item.id} className="related-news-section__item">
            <NewsCard article={item} now={now} />
          </li>
        ))}
      </ul>
    </section>
  );
}
