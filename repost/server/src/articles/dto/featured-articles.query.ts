import { ApiPropertyOptional } from "@nestjs/swagger";
import { Category } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class FeaturedArticlesQuery {
  @ApiPropertyOptional({ enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}

