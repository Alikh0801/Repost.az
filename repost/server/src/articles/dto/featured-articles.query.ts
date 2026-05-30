import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class FeaturedArticlesQuery {
  @ApiPropertyOptional({ example: "politics" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;
}
