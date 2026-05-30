import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArticleStatus } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ArticleTranslationDto } from "./article-translation.dto";

export class CreateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  )
  @IsString()
  @MinLength(3)
  slug?: string;

  @ApiProperty({ example: "politics" })
  @IsString()
  @MinLength(2)
  category!: string;

  @ApiPropertyOptional({ enum: ArticleStatus, default: ArticleStatus.draft })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  featuredOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  )
  @IsString()
  coverImageUrl?: string;

  /** Yalnız update üçün: true olarsa dərc vaxtını indi et. */
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  publishNow?: boolean;

  @ApiProperty({ type: [ArticleTranslationDto], minItems: 1, maxItems: 2 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ArticleTranslationDto)
  translations!: ArticleTranslationDto[];
}
