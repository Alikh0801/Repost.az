import { AdBanner } from "../ad-banner/AdBanner";
import { HeroSlider } from "../hero-slider/HeroSlider";
import "./home-hero-row.css";

export function HomeHeroRow() {
  return (
    <div className="home-hero-row">
      <div className="home-hero-row__hero">
        <HeroSlider />
      </div>
      <div className="home-hero-row__ad">
        <AdBanner variant="hero-side" />
      </div>
    </div>
  );
}
