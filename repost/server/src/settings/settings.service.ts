import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateSocialLinksDto } from "./dto/update-social-links.dto";

export type SocialLinksDto = {
  instagramUrl: string | null;
  facebookUrl: string | null;
  telegramUrl: string | null;
};

const SETTINGS_ID = "default";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeUrl(value: string | undefined | null): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private toDto(row: {
    instagramUrl: string | null;
    facebookUrl: string | null;
    telegramUrl: string | null;
  }): SocialLinksDto {
    return {
      instagramUrl: row.instagramUrl,
      facebookUrl: row.facebookUrl,
      telegramUrl: row.telegramUrl,
    };
  }

  private async getOrCreate() {
    return this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID },
      update: {},
    });
  }

  async getSocialLinks(): Promise<SocialLinksDto> {
    const row = await this.getOrCreate();
    return this.toDto(row);
  }

  async updateSocialLinks(dto: UpdateSocialLinksDto): Promise<SocialLinksDto> {
    const row = await this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        id: SETTINGS_ID,
        instagramUrl: this.normalizeUrl(dto.instagramUrl),
        facebookUrl: this.normalizeUrl(dto.facebookUrl),
        telegramUrl: this.normalizeUrl(dto.telegramUrl),
      },
      update: {
        instagramUrl: this.normalizeUrl(dto.instagramUrl),
        facebookUrl: this.normalizeUrl(dto.facebookUrl),
        telegramUrl: this.normalizeUrl(dto.telegramUrl),
      },
    });
    return this.toDto(row);
  }
}
