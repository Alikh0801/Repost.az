import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArticleStatus, Category } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ArticleTranslationDto } from "./article-translation.dto";

export class CreateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  slug?: string;

  @ApiProperty({ enum: Category })
  @IsEnum(Category)
  category!: Category;

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
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ type: [ArticleTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ArticleTranslationDto)
  translations!: ArticleTranslationDto[];
}
