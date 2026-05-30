import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import slugify from "slugify";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

export type CategoryDto = {
  slug: string;
  labelAz: string;
  labelRu: string;
  sortOrder: number;
  articleCount: number;
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  toDto(
    row: {
      slug: string;
      labelAz: string;
      labelRu: string;
      sortOrder: number;
      _count?: { articles: number };
    },
  ): CategoryDto {
    return {
      slug: row.slug,
      labelAz: row.labelAz,
      labelRu: row.labelRu,
      sortOrder: row.sortOrder,
      articleCount: row._count?.articles ?? 0,
    };
  }

  async listPublic() {
    const rows = await this.prisma.categoryRecord.findMany({
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    });
    return rows.map((row) => this.toDto(row));
  }

  async listAdmin() {
    const rows = await this.prisma.categoryRecord.findMany({
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      include: { _count: { select: { articles: true } } },
    });
    return rows.map((row) => this.toDto(row));
  }

  async create(dto: CreateCategoryDto) {
    const slug =
      dto.slug?.trim() ||
      slugify(dto.labelAz, { lower: true, strict: true, locale: "az" });

    if (!slug || slug.length < 2) {
      throw new BadRequestException("Slug yaradıla bilmədi");
    }

    const existing = await this.prisma.categoryRecord.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException("Bu slug artıq mövcuddur");
    }

    const maxOrder = await this.prisma.categoryRecord.aggregate({
      _max: { sortOrder: true },
    });

    const row = await this.prisma.categoryRecord.create({
      data: {
        slug,
        labelAz: dto.labelAz.trim(),
        labelRu: dto.labelRu.trim(),
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
      },
      include: { _count: { select: { articles: true } } },
    });

    return this.toDto(row);
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    await this.ensureExists(slug);

    const row = await this.prisma.categoryRecord.update({
      where: { slug },
      data: {
        ...(dto.labelAz !== undefined ? { labelAz: dto.labelAz.trim() } : {}),
        ...(dto.labelRu !== undefined ? { labelRu: dto.labelRu.trim() } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      include: { _count: { select: { articles: true } } },
    });

    return this.toDto(row);
  }

  async remove(slug: string) {
    const row = await this.prisma.categoryRecord.findUnique({
      where: { slug },
      include: { _count: { select: { articles: true } } },
    });

    if (!row) {
      throw new NotFoundException("Kateqoriya tapılmadı");
    }

    if (row._count.articles > 0) {
      throw new BadRequestException(
        "Bu kateqoriyada xəbər var. Əvvəl xəbərləri başqa kateqoriyaya köçürün.",
      );
    }

    await this.prisma.categoryRecord.delete({ where: { slug } });
    return { deleted: true };
  }

  async ensureExists(slug: string) {
    const row = await this.prisma.categoryRecord.findUnique({ where: { slug } });
    if (!row) {
      throw new BadRequestException("Kateqoriya tapılmadı");
    }
    return row;
  }
}
