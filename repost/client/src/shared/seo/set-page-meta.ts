import type { AppLocale } from "../../i18n/types";
import { absoluteUrl } from "./site-config";

export type PageMetaInput = {
  title: string;
  description: string;
  canonicalPath?: string;
  imageUrl?: string;
  type?: "website" | "article";
  locale?: AppLocale;
  noIndex?: boolean;
};

const META_ATTR = "data-repost-seo";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  if (!content) return;
  const selector = `meta[${attribute}="${key}"][${META_ATTR}]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    el.setAttribute(META_ATTR, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  const selector = `link[rel="${rel}"][${META_ATTR}]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(META_ATTR, "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeManagedSeoNodes() {
  document.head
    .querySelectorAll(`[${META_ATTR}]`)
    .forEach((node) => node.remove());
}

export function truncateMetaDescription(text: string, max = 160): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

export function setPageMeta(input: PageMetaInput) {
  document.title = input.title;

  upsertMeta("name", "description", input.description);
  upsertMeta(
    "name",
    "robots",
    input.noIndex ? "noindex, nofollow" : "index, follow",
  );

  const canonical = input.canonicalPath
    ? absoluteUrl(input.canonicalPath)
    : undefined;
  if (canonical) upsertLink("canonical", canonical);

  const ogLocale = input.locale === "ru" ? "ru_RU" : "az_AZ";
  upsertMeta("property", "og:locale", ogLocale);
  upsertMeta("property", "og:type", input.type ?? "website");
  upsertMeta("property", "og:title", input.title);
  upsertMeta("property", "og:description", input.description);
  if (canonical) upsertMeta("property", "og:url", canonical);
  if (input.imageUrl) {
    const image = absoluteUrl(input.imageUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:image", image);
  }

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", input.title);
  upsertMeta("name", "twitter:description", input.description);
}

export function clearPageMeta() {
  removeManagedSeoNodes();
}
