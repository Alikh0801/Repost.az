import type { AdminArticle, ArticleFormPayload } from "../types/article";
import { apiRequest } from "./client";

export function fetchArticles() {
  return apiRequest<AdminArticle[]>("/admin/articles");
}

export function fetchArticle(id: string) {
  return apiRequest<AdminArticle>(`/admin/articles/${id}`);
}

export function createArticle(payload: ArticleFormPayload) {
  return apiRequest<AdminArticle>("/admin/articles", {
    method: "POST",
    body: payload,
  });
}

export function updateArticle(id: string, payload: ArticleFormPayload) {
  return apiRequest<AdminArticle>(`/admin/articles/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteArticle(id: string) {
  return apiRequest<{ deleted: boolean }>(`/admin/articles/${id}`, {
    method: "DELETE",
  });
}
