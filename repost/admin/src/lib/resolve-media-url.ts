import { API_BASE } from "../api/config";

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path?.trim()) return "";

  const value = path.trim();
  if (/^https?:\/\//i.test(value)) {
    return rewriteLegacyUploadUrl(value);
  }

  if (value.startsWith("/api/v1/")) {
    const origin = API_BASE.replace(/\/api\/v1\/?$/, "");
    return `${origin}${value}`;
  }

  return value;
}

function rewriteLegacyUploadUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/uploads\/([^/]+)$/i);
    if (!match) return url;
    const origin = API_BASE.replace(/\/api\/v1\/?$/, "");
    return `${origin}/api/v1/media/file/${match[1]}`;
  } catch {
    return url;
  }
}
