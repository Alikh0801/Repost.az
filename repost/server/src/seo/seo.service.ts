import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArticleStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getSiteUrl(): string {
    return (
      this.config.get<string>("SITE_URL") ??
      this.config.get<string>("PUBLIC_BASE_URL") ??
      "http://localhost:5173"
    ).replace(/\/$/, "");
  }

  buildRobotsTxt(): string {
    const siteUrl = this.getSiteUrl();
    return [
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
      "",
    ].join("\n");
  }

  async buildSitemapXml(): Promise<string> {
    const siteUrl = this.getSiteUrl();
    const articles = await this.prisma.article.findMany({
      where: { status: ArticleStatus.published },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    const urls = [
      {
        loc: `${siteUrl}/`,
        lastmod: articles[0]?.updatedAt ?? new Date(),
        changefreq: "hourly",
        priority: "1.0",
      },
      ...articles.map((article) => ({
        loc: `${siteUrl}/article/${encodeURIComponent(article.slug)}`,
        lastmod: article.updatedAt,
        changefreq: "weekly",
        priority: "0.8",
      })),
    ];

    const body = urls
      .map(
        (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod.toISOString()}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
