import { ApiProperty } from "@nestjs/swagger";
import { Locale } from "@prisma/client";
import { ArrayMinSize, IsArray, IsEnum, IsString, MinLength } from "class-validator";

export class ArticleTranslationDto {
  @ApiProperty({ enum: Locale })
  @IsEnum(Locale)
  locale!: Locale;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  summary!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  body!: string[];

  @ApiProperty()
  @IsString()
  @MinLength(2)
  imageAlt!: string;
}
