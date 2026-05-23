import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ArticleStatus, Category, Prisma } from "@prisma/client";
import slugify from "slugify";
import { parseLocale } from "../common/locale";
import { PrismaService } from "../prisma/prisma.service";
import {
  toAdminArticle,
  toArticleDetail,
  toArticleListItem,
} from "./article.mapper";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

const articleInclude = {
  translations: true,
} satisfies Prisma.ArticleInclude;

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(
    localeInput: string,
    category?: string,
    page = 1,
    limit = 20,
  ) {
    const locale = parseLocale(localeInput);
    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.published,
      ...(category ? { category: category as Category } : {}),
    };

    const [total, articles] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const items = articles
      .map((article) => toArticleListItem(article, locale))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async listFeatured(localeInput: string) {
    const locale = parseLocale(localeInput);
    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.published,
        isFeatured: true,
      },
      include: articleInclude,
      orderBy: [{ featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: 10,
    });

    return articles
      .map((article) => toArticleListItem(article, locale))
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  async getBySlugPublic(slug: string, localeInput: string) {
    const locale = parseLocale(localeInput);
    const article = await this.prisma.article.findFirst({
      where: { slug, status: ArticleStatus.published },
      include: articleInclude,
    });

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    const mapped = toArticleDetail(article, locale);
    if (!mapped) {
      throw new NotFoundException("Article translation not found");
    }

    return mapped;
  }

  async getRelated(slug: string, localeInput: string, limit = 6) {
    const locale = parseLocale(localeInput);
    const current = await this.prisma.article.findFirst({
      where: { slug, status: ArticleStatus.published },
      include: articleInclude,
    });

    if (!current) {
      throw new NotFoundException("Article not found");
    }

    const candidates = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.published,
        id: { not: current.id },
      },
      include: articleInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    const sameCategory = candidates.filter((a) => a.category === current.category);
    const otherCategories = candidates.filter(
      (a) => a.category !== current.category,
    );

    const ordered = [...sameCategory, ...otherCategories].slice(0, limit);

    return ordered
      .map((article) => toArticleListItem(article, locale))
      .filter((item): item is NonNullable<typeof item> => item !== null);
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
    const articles = await this.prisma.article.findMany({
      include: articleInclude,
      orderBy: [{ updatedAt: "desc" }],
    });

    return articles.map(toAdminArticle);
  }

  async getAdmin(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    });

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    return toAdminArticle(article);
  }

  async create(dto: CreateArticleDto, userId: string) {
    const slug = await this.resolveUniqueSlug(
      dto.slug,
      dto.translations[0]?.title ?? "article",
    );

    const status = dto.status ?? ArticleStatus.draft;
    const publishedAt = this.resolvePublishedAt(status, dto.publishedAt);

    try {
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
          translations: {
            create: dto.translations.map((t) => ({
              locale: t.locale,
              title: t.title,
              summary: t.summary,
              body: t.body,
              imageAlt: t.imageAlt,
            })),
          },
        },
        include: articleInclude,
      });

      return toAdminArticle(article);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Slug already exists");
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    });

    if (!existing) {
      throw new NotFoundException("Article not found");
    }

    const slug =
      dto.slug !== undefined
        ? await this.resolveUniqueSlug(dto.slug, dto.slug, id)
        : undefined;

    const status = dto.status ?? existing.status;
    const publishedAt =
      dto.publishedAt !== undefined
        ? this.resolvePublishedAt(status, dto.publishedAt)
        : status === ArticleStatus.published && !existing.publishedAt
          ? new Date()
          : existing.publishedAt;

    await this.prisma.$transaction(async (tx) => {
      await tx.article.update({
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
          publishedAt,
        },
      });

      if (dto.translations?.length) {
        for (const translation of dto.translations) {
          await tx.articleTranslation.upsert({
            where: {
              articleId_locale: {
                articleId: id,
                locale: translation.locale,
              },
            },
            create: {
              articleId: id,
              locale: translation.locale,
              title: translation.title,
              summary: translation.summary,
              body: translation.body,
              imageAlt: translation.imageAlt,
            },
            update: {
              title: translation.title,
              summary: translation.summary,
              body: translation.body,
              imageAlt: translation.imageAlt,
            },
          });
        }
      }
    });

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

  private async resolveUniqueSlug(
    slugInput: string | undefined,
    title: string,
    excludeId?: string,
  ): Promise<string> {
    const base = this.buildSlug(slugInput?.trim() || title) || "article";
    let candidate = base;
    let suffix = 1;

    while (await this.slugTaken(candidate, excludeId)) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }

    return candidate;
  }

  private async slugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.prisma.article.findUnique({ where: { slug } });
    if (!existing) return false;
    return excludeId ? existing.id !== excludeId : true;
  }
}
