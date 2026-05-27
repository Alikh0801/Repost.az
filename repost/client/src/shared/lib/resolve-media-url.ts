import { API_BASE } from "../api/config";

const MEDIA_FILE_PREFIX = "/api/v1/media/file/";

/** API-dən gələn şəkil yolunu brauzer üçün tam və ya same-origin URL-ə çevirir. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path?.trim()) return "";

  const mediaPath = extractMediaFilePath(path.trim());
  if (mediaPath) {
    return toBrowserMediaUrl(mediaPath);
  }

  const value = path.trim();
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return value;
}

function extractMediaFilePath(value: string): string | null {
  if (value.startsWith(MEDIA_FILE_PREFIX)) {
    return value;
  }

  const mediaInPath = value.match(/\/api\/v1\/media\/file\/([^/?#]+)/i);
  if (mediaInPath) {
    return `${MEDIA_FILE_PREFIX}${mediaInPath[1]}`;
  }

  const uploadsInPath = value.match(/\/uploads\/([^/?#]+)/i);
  if (uploadsInPath) {
    return `${MEDIA_FILE_PREFIX}${uploadsInPath[1]}`;
  }

  return null;
}

function toBrowserMediaUrl(mediaPath: string): string {
  if (import.meta.env.PROD && API_BASE.startsWith("/")) {
    return mediaPath;
  }
  const origin = API_BASE.replace(/\/api\/v1\/?$/, "");
  return `${origin}${mediaPath}`;
}
