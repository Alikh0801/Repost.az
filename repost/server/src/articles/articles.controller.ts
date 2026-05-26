import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { HttpCache, NoStore } from "../common/http-cache.decorator";
import { ArticlesService } from "./articles.service";
import { FeaturedArticlesQuery } from "./dto/featured-articles.query";
import { ListArticlesQuery } from "./dto/list-articles.query";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @HttpCache(30, 60)
  list(@Query() query: ListArticlesQuery) {
    return this.articlesService.listPublic(
      query.category,
      query.page,
      query.limit,
    );
  }

  @Get("featured")
  @HttpCache(30, 60)
  featured(@Query() query: FeaturedArticlesQuery) {
    return this.articlesService.listFeatured(query.category);
  }

  @Get(":slug/related")
  @HttpCache(60, 120)
  related(@Param("slug") slug: string) {
    return this.articlesService.getRelated(slug);
  }

  @Post(":slug/views")
  @NoStore()
  incrementViews(@Param("slug") slug: string, @Req() req: Request) {
    const clientKey =
      (typeof req.ip === "string" && req.ip) ||
      req.socket.remoteAddress ||
      "unknown";
    return this.articlesService.incrementViews(slug, clientKey);
  }

  @Get(":slug")
  @HttpCache(45, 90)
  getOne(@Param("slug") slug: string) {
    return this.articlesService.getBySlugPublic(slug);
  }
}
