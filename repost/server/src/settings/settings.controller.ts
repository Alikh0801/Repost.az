import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles, RolesGuard } from "../auth/guards/roles.guard";
import { HttpCache } from "../common/http-cache.decorator";
import { UpdateSocialLinksDto } from "./dto/update-social-links.dto";
import { SettingsService } from "./settings.service";

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("social")
  @HttpCache(300, 600)
  getSocialLinks() {
    return this.settingsService.getSocialLinks();
  }
}

@ApiTags("admin-settings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.editor)
@Controller("admin/settings")
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("social")
  getSocialLinks() {
    return this.settingsService.getSocialLinks();
  }

  @Patch("social")
  updateSocialLinks(@Body() dto: UpdateSocialLinksDto) {
    return this.settingsService.updateSocialLinks(dto);
  }
}
