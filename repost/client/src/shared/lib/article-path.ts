export function articlePath(article: { slug: string } | string): string {
  const slug = typeof article === "string" ? article : article.slug;
  return `/article/${encodeURIComponent(slug)}`;
}
