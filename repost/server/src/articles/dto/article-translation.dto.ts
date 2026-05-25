import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsIn, IsOptional, IsString } from "class-validator";
import { APP_LOCALES } from "../../common/locale";

export class ArticleTranslationDto {
  @ApiProperty({ enum: APP_LOCALES })
  @IsIn(APP_LOCALES)
  locale!: (typeof APP_LOCALES)[number];

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  summary!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  body!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageAlt?: string;
}
