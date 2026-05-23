import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsIn, IsString, MinLength } from "class-validator";
import { APP_LOCALES } from "../../common/locale";

export class ArticleTranslationDto {
  @ApiProperty({ enum: APP_LOCALES })
  @IsIn(APP_LOCALES)
  locale!: (typeof APP_LOCALES)[number];

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
