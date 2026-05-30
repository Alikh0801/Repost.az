import { apiGet } from "./client";

export type PublicCategory = {
  slug: string;
  labelAz: string;
  labelRu: string;
  sortOrder: number;
};

export function fetchPublicCategories() {
  return apiGet<PublicCategory[]>("/categories");
}
