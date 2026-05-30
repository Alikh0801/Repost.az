import { apiGet } from "./client";

export type SocialLinks = {
  instagramUrl: string | null;
  facebookUrl: string | null;
  telegramUrl: string | null;
};

export function fetchSocialLinks() {
  return apiGet<SocialLinks>("/settings/social");
}
