import { apiRequest } from "./client";

export type CategoryRecord = {
  slug: string;
  labelAz: string;
  labelRu: string;
  sortOrder: number;
  articleCount: number;
};

export type CreateCategoryPayload = {
  slug?: string;
  labelAz: string;
  labelRu: string;
  sortOrder?: number;
};

export type UpdateCategoryPayload = {
  labelAz?: string;
  labelRu?: string;
  sortOrder?: number;
};

export function fetchCategories() {
  return apiRequest<CategoryRecord[]>("/admin/categories");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiRequest<CategoryRecord>("/admin/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(slug: string, payload: UpdateCategoryPayload) {
  return apiRequest<CategoryRecord>(`/admin/categories/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(slug: string) {
  return apiRequest<{ deleted: boolean }>(
    `/admin/categories/${encodeURIComponent(slug)}`,
    { method: "DELETE" },
  );
}
