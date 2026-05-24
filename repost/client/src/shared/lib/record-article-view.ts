import { incrementArticleViews } from "../api/articles";
import { STORAGE_KEYS } from "../config/storage-keys";

/** Sessiya ərzində eyni məqaləyə bir dəfə oxunuş yazır (DB yükünü azaldır). */
export function recordArticleViewOnce(slug: string) {
  if (!slug || typeof sessionStorage === "undefined") return;

  const key = `${STORAGE_KEYS.viewedArticles}:${slug}`;
  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, "1");
  incrementArticleViews(slug);
}
