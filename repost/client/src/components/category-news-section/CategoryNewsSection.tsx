import { AdBanner } from "../ad-banner/AdBanner";
import { CategoryNewsGrid } from "../category-news-grid/CategoryNewsGrid";
import "./category-news-section.css";

export function CategoryNewsSection() {
  return (
    <div className="category-news-section">
      <div className="category-news-section__main">
        <CategoryNewsGrid />
      </div>
      <div className="category-news-section__ad">
        <AdBanner variant="news-side" />
      </div>
    </div>
  );
}
