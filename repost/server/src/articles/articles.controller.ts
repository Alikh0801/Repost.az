import {
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { ListArticlesQuery, LocaleQuery } from "./dto/list-articles.query";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  list(@Query() query: ListArticlesQuery) {
    return this.articlesService.listPublic(
      query.locale,
      query.category,
      query.page,
      query.limit,
    );
  }

  @Get("featured")
  featured(@Query() query: LocaleQuery) {
    return this.articlesService.listFeatured(query.locale);
  }

  @Get(":slug/related")
  related(@Param("slug") slug: string, @Query() query: LocaleQuery) {
    return this.articlesService.getRelated(slug, query.locale);
  }

  @Post(":slug/views")
  incrementViews(@Param("slug") slug: string) {
    return this.articlesService.incrementViews(slug);
  }

  @Get(":slug")
  getOne(@Param("slug") slug: string, @Query() query: LocaleQuery) {
    return this.articlesService.getBySlugPublic(slug, query.locale);
  }
}
