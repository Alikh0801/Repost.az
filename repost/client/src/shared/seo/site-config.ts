/** Saytın ictimai URL-i (sonunda / olmadan). Production-da VITE_SITE_URL təyin edin. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "http://localhost:5173"
).replace(/\/$/, "");

export const SITE_NAME = "Repost.az";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
