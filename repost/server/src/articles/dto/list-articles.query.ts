import { ApiPropertyOptional } from "@nestjs/swagger";
import { Category } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { APP_LOCALES } from "../../common/locale";

export class ListArticlesQuery {
  @ApiPropertyOptional({ enum: APP_LOCALES, default: "az" })
  @IsOptional()
  @IsIn(APP_LOCALES)
  locale = "az" as const;

  @ApiPropertyOptional({ enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}

export class LocaleQuery {
  @ApiPropertyOptional({ enum: APP_LOCALES, default: "az" })
  @IsOptional()
  @IsIn(APP_LOCALES)
  locale = "az" as const;
}

export class SlugParam {
  @IsString()
  slug!: string;
}
