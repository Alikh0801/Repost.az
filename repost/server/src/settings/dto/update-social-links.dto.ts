import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, IsUrl } from "class-validator";

function emptyToUndefined({ value }: { value: unknown }) {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export class UpdateSocialLinksDto {
  @ApiPropertyOptional({ example: "https://instagram.com/repost.az" })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @IsUrl({ require_protocol: true }, { message: "Instagram URL düzgün deyil" })
  instagramUrl?: string;

  @ApiPropertyOptional({ example: "https://facebook.com/repost.az" })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @IsUrl({ require_protocol: true }, { message: "Facebook URL düzgün deyil" })
  facebookUrl?: string;

  @ApiPropertyOptional({ example: "https://t.me/repostaz" })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @IsUrl({ require_protocol: true }, { message: "Telegram URL düzgün deyil" })
  telegramUrl?: string;
}
