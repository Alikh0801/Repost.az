import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @ApiPropertyOptional({ example: "culture" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  slug?: string;

  @ApiProperty({ example: "Mədəniyyət" })
  @IsString()
  @MinLength(2)
  labelAz!: string;

  @ApiProperty({ example: "Культура" })
  @IsString()
  @MinLength(2)
  labelRu!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
