export function articlePath(articleId: string): string {
  return `/article/${encodeURIComponent(articleId)}`;
}

/** Xəbər linkləri yeni tabda açılır */
export const articleLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
