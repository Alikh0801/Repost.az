import {
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { ListArticlesQuery } from "./dto/list-articles.query";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  list(@Query() query: ListArticlesQuery) {
    return this.articlesService.listPublic(
      query.category,
      query.page,
      query.limit,
    );
  }

  @Get("featured")
  featured() {
    return this.articlesService.listFeatured();
  }

  @Get(":slug/related")
  related(@Param("slug") slug: string) {
    return this.articlesService.getRelated(slug);
  }

  @Post(":slug/views")
  incrementViews(@Param("slug") slug: string) {
    return this.articlesService.incrementViews(slug);
  }

  @Get(":slug")
  getOne(@Param("slug") slug: string) {
    return this.articlesService.getBySlugPublic(slug);
  }
}
