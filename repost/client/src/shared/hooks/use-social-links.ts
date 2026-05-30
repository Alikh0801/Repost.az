import { useEffect, useState } from "react";
import { fetchSocialLinks, type SocialLinks } from "../api/settings";

const EMPTY: SocialLinks = {
  instagramUrl: null,
  facebookUrl: null,
  telegramUrl: null,
};

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLinks>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSocialLinks()
      .then((data) => {
        if (!cancelled) setLinks(data);
      })
      .catch(() => {
        /* sidebar fallback: no links */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { links, loading };
}
