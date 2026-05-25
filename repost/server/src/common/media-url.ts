/** DB və API üçün vahid şəkil yolu: /api/v1/media/file/{filename} */
export const MEDIA_FILE_PREFIX = "/api/v1/media/file/";

export function buildMediaFilePath(filename: string): string {
  return `${MEDIA_FILE_PREFIX}${filename}`;
}

/** Köhnə /uploads və tam URL-ləri yeni formata çevirir. */
export function normalizeStoredMediaUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();

  if (trimmed.startsWith(MEDIA_FILE_PREFIX)) {
    return trimmed;
  }

  const uploadsMatch = trimmed.match(/\/uploads\/([^/?#]+)$/i);
  if (uploadsMatch) {
    return buildMediaFilePath(uploadsMatch[1]);
  }

  const mediaMatch = trimmed.match(/\/api\/v1\/media\/file\/([^/?#]+)$/i);
  if (mediaMatch) {
    return buildMediaFilePath(mediaMatch[1]);
  }

  try {
    const url = new URL(trimmed);
    const fromUploads = url.pathname.match(/\/uploads\/([^/]+)$/i);
    if (fromUploads) return buildMediaFilePath(fromUploads[1]);
    const fromMedia = url.pathname.match(/\/api\/v1\/media\/file\/([^/]+)$/i);
    if (fromMedia) return buildMediaFilePath(fromMedia[1]);
  } catch {
    /* relative path */
  }

  return trimmed;
}
