import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles, RolesGuard } from "../auth/guards/roles.guard";
import { JwtPayload } from "../auth/jwt.strategy";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@ApiTags("admin-articles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.editor)
@Controller("admin/articles")
export class AdminArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  list() {
    return this.articlesService.listAdmin();
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.articlesService.getAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: JwtPayload) {
    return this.articlesService.create(dto, user.sub);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.admin)
  remove(@Param("id") id: string) {
    return this.articlesService.remove(id);
  }
}
