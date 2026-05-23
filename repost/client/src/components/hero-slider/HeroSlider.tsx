import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { AppMessagePath } from "../../i18n/paths";
import { getFeaturedNews } from "../../shared/data/featured-news";
import type { FeaturedNewsCategory } from "../../shared/data/featured-news";
import { articleLinkProps, articlePath } from "../../shared/lib/article-path";
import { formatArticleDate } from "../../shared/lib/format-article-date";
import "./hero-slider.css";

const AUTOPLAY_MS = 7000;

const CATEGORY_PATH: Record<FeaturedNewsCategory, AppMessagePath> = {
  politics: "nav.politics",
  economy: "nav.economy",
  society: "nav.society",
  sports: "nav.sports",
  incidents: "nav.incidents",
  world: "nav.world",
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="hero-slider__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function HeroSlider() {
  const { locale, t } = useI18n();
  const slides = useMemo(() => getFeaturedNews(locale), [locale]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      const next = ((index % slideCount) + slideCount) % slideCount;
      setActiveIndex(next);
    },
    [slideCount],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    setActiveIndex(0);
  }, [locale]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, slideCount]);

  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  if (slideCount === 0) return null;

  return (
    <section
      ref={regionRef}
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label={t("hero.ariaRegion")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="hero-slider__viewport">
        <div
          className="hero-slider__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className="hero-slider__slide"
              aria-hidden={index !== activeIndex}
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slideCount}`}
            >
              <img
                className="hero-slider__image"
                src={slide.imageUrl}
                alt={slide.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="hero-slider__overlay" aria-hidden />
              <div className="hero-slider__content">
                <span className="hero-slider__category">
                  {t(CATEGORY_PATH[slide.category])}
                </span>
                <time
                  className="hero-slider__date"
                  dateTime={slide.publishedAt}
                >
                  {formatArticleDate(slide.publishedAt, locale)}
                </time>
                <h2 className="hero-slider__title">
                  <Link
                    className="hero-slider__title-link"
                    to={articlePath(slide.id)}
                    {...articleLinkProps}
                  >
                    {slide.title}
                  </Link>
                </h2>
                <p className="hero-slider__summary">{slide.summary}</p>
                <Link
                  className="hero-slider__cta"
                  to={articlePath(slide.id)}
                  {...articleLinkProps}
                >
                  {t("hero.readMore")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {slideCount > 1 && (
        <>
          <div className="hero-slider__controls">
            <button
              type="button"
              className="hero-slider__arrow"
              onClick={goPrev}
              aria-label={t("hero.prevSlide")}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              className="hero-slider__arrow"
              onClick={goNext}
              aria-label={t("hero.nextSlide")}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          <div
            className="hero-slider__dots"
            role="tablist"
            aria-label={t("hero.slideList")}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className="hero-slider__dot"
                aria-selected={index === activeIndex}
                aria-label={`${t("hero.goToSlide")} ${index + 1}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
