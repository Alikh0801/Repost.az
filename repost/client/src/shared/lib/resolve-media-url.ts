import { API_BASE } from "../api/config";

/** API-dən gələn şəkil yolunu brauzer üçün tam URL-ə çevirir. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path?.trim()) return "";

  const value = path.trim();
  if (/^https?:\/\//i.test(value)) {
    return rewriteLegacyUploadUrl(value);
  }

  if (value.startsWith("/api/v1/")) {
    if (import.meta.env.PROD && API_BASE.startsWith("/")) {
      return value;
    }
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

    const apiPath = `/api/v1/media/file/${match[1]}`;
    if (import.meta.env.PROD && API_BASE.startsWith("/")) {
      return apiPath;
    }
    const origin = API_BASE.replace(/\/api\/v1\/?$/, "");
    return `${origin}${apiPath}`;
  } catch {
    return url;
  }
}
