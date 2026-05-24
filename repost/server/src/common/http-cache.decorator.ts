import { applyDecorators, Header } from "@nestjs/common";

/** Public GET — CDN/brauzer qısa müddət cache edə bilər (DB yükünü azaldır). */
export function HttpCache(maxAgeSec = 60, sharedMaxAgeSec = maxAgeSec * 2) {
  return applyDecorators(
    Header(
      "Cache-Control",
      `public, max-age=${maxAgeSec}, s-maxage=${sharedMaxAgeSec}, stale-while-revalidate=${maxAgeSec}`,
    ),
    Header("Vary", "Accept-Encoding"),
  );
}

export function NoStore() {
  return applyDecorators(Header("Cache-Control", "no-store"));
}
