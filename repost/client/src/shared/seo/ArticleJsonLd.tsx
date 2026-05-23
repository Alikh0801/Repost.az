import { useEffect } from "react";
import type { AppLocale } from "../../i18n/types";
import type { NewsArticle } from "../types/article";
import { absoluteUrl, SITE_NAME, SITE_URL } from "./site-config";
import { articlePath } from "../lib/article-path";

const JSON_LD_ATTR = "data-repost-jsonld";

type ArticleJsonLdProps = {
  article: NewsArticle;
  locale: AppLocale;
};

export function ArticleJsonLd({ article, locale }: ArticleJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(JSON_LD_ATTR, "");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.summary,
      image: [absoluteUrl(article.imageUrl)],
      datePublished: article.publishedAt,
      inLanguage: locale === "ru" ? "ru" : "az",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": absoluteUrl(articlePath(article)),
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head
        .querySelectorAll(`script[${JSON_LD_ATTR}]`)
        .forEach((node) => node.remove());
    };
  }, [article, locale]);

  return null;
}
