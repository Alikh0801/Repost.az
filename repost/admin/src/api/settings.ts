import { apiRequest } from "./client";

export type SocialLinks = {
  instagramUrl: string | null;
  facebookUrl: string | null;
  telegramUrl: string | null;
};

export type UpdateSocialLinksPayload = {
  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;
};

export function fetchSocialLinks() {
  return apiRequest<SocialLinks>("/admin/settings/social");
}

export function updateSocialLinks(payload: UpdateSocialLinksPayload) {
  return apiRequest<SocialLinks>("/admin/settings/social", {
    method: "PATCH",
    body: payload,
  });
}
