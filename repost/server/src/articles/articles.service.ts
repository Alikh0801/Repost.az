import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ArticleStatus, Category, Prisma } from "@prisma/client";
import slugify from "slugify";
import { PrismaService } from "../prisma/prisma.service";
import {
  assertBothLocales,
  contentToPrismaJson,
  translationsToContent,
} from "./article-content";
import {
  toAdminArticle,
  toArticleDetail,
  toArticleListItem,
} from "./article.mapper";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(category?: string, page = 1, limit = 20) {
    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.published,
      ...(category ? { category: category as Category } : {}),
    };

    const [total, articles] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: articles.map(toArticleListItem),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async listFeatured() {
    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.published,
        isFeatured: true,
      },
      orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: 10,
    });

    return articles.map(toArticleListItem);
  }

  async getBySlugPublic(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, status: ArticleStatus.published },
    });

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    return toArticleDetail(article);
  }

  async getRelated(slug: string, limit = 6) {
    const current = await this.prisma.article.findFirst({
      where: { slug, status: ArticleStatus.published },
    });

    if (!current) {
      throw new NotFoundException("Article not found");
    }

    const candidates = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.published,
        id: { not: current.id },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    const sameCategory = candidates.filter((a) => a.category === current.category);
    const otherCategories = candidates.filter(
      (a) => a.category !== current.category,
    );

    const ordered = [...sameCategory, ...otherCategories].slice(0, limit);

    return ordered.map(toArticleListItem);
  }

  async incrementViews(slug: string) {
    const result = await this.prisma.article.updateMany({
      where: { slug, status: ArticleStatus.published },
      data: { viewCount: { increment: 1 } },
    });

    if (result.count === 0) {
      throw new NotFoundException("Article not found");
    }

    const article = await this.prisma.article.findUnique({
      where: { slug },
      select: { viewCount: true },
    });

    return { viewCount: article?.viewCount ?? 0 };
  }

  async listAdmin() {
    const articles = await this.prisma.withRetry(() =>
      this.prisma.article.findMany({
        orderBy: [{ updatedAt: "desc" }],
      }),
    );

    return articles.map(toAdminArticle);
  }

  async getAdmin(id: string) {
    const article = await this.prisma.withRetry(() =>
      this.prisma.article.findUnique({ where: { id } }),
    );

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    return toAdminArticle(article);
  }

  async create(dto: CreateArticleDto, userId: string) {
    assertBothLocales(dto.translations);
    const baseSlug =
      this.buildSlug(
        dto.slug?.trim() || dto.translations[0]?.title || "article",
      ) || "article";

    for (let attempt = 0; attempt < 15; attempt++) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

      try {
        return await this.prisma.withRetry(() =>
          this.persistNewArticle(slug, dto, userId),
        );
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }
        throw error;
      }
    }

    throw new ConflictException("Slug already exists");
  }

  private async persistNewArticle(
    slug: string,
    dto: CreateArticleDto,
    userId: string,
  ) {
    const status = dto.status ?? ArticleStatus.draft;
    const publishedAt = this.resolvePublishedAt(status, dto.publishedAt);
    const content = translationsToContent(dto.translations);

    const article = await this.prisma.article.create({
      data: {
        slug,
        category: dto.category,
        status,
        isFeatured: dto.isFeatured ?? false,
        featuredOrder: dto.featuredOrder,
        coverImageUrl: dto.coverImageUrl,
        publishedAt,
        createdById: userId,
        content: contentToPrismaJson(content),
      },
    });

    return this.getAdmin(article.id);
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException("Article not found");
    }

    const slug =
      dto.slug !== undefined
        ? this.buildSlug(dto.slug.trim()) || existing.slug
        : undefined;

    const status = dto.status ?? existing.status;
    const publishedAt =
      dto.publishedAt !== undefined
        ? this.resolvePublishedAt(status, dto.publishedAt)
        : status === ArticleStatus.published && !existing.publishedAt
          ? new Date()
          : existing.publishedAt;

    let contentUpdate: Prisma.InputJsonValue | undefined;
    if (dto.translations?.length) {
      assertBothLocales(dto.translations);
      contentUpdate = contentToPrismaJson(translationsToContent(dto.translations));
    }

    try {
      await this.prisma.withRetry(async () => {
        await this.prisma.article.update({
          where: { id },
          data: {
            ...(slug !== undefined ? { slug } : {}),
            ...(dto.category !== undefined ? { category: dto.category } : {}),
            ...(dto.status !== undefined ? { status: dto.status } : {}),
            ...(dto.isFeatured !== undefined
              ? { isFeatured: dto.isFeatured }
              : {}),
            ...(dto.featuredOrder !== undefined
              ? { featuredOrder: dto.featuredOrder }
              : {}),
            ...(dto.coverImageUrl !== undefined
              ? { coverImageUrl: dto.coverImageUrl }
              : {}),
            ...(contentUpdate !== undefined ? { content: contentUpdate } : {}),
            publishedAt,
          },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Slug already exists");
      }
      throw error;
    }

    return this.getAdmin(id);
  }

  async remove(id: string) {
    await this.getAdmin(id);
    await this.prisma.article.delete({ where: { id } });
    return { deleted: true };
  }

  private resolvePublishedAt(
    status: ArticleStatus,
    publishedAt?: string,
  ): Date | null {
    if (status !== ArticleStatus.published) {
      return publishedAt ? new Date(publishedAt) : null;
    }
    return publishedAt ? new Date(publishedAt) : new Date();
  }

  private buildSlug(source: string): string {
    return slugify(source, { lower: true, strict: true, locale: "az" });
  }
}
