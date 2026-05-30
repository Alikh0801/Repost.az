import { Module } from "@nestjs/common";
import { CategoriesModule } from "../categories/categories.module";
import { AdminArticlesController } from "./admin-articles.controller";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ViewBoostService } from "./view-boost.service";

@Module({
  imports: [CategoriesModule],
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService, ViewBoostService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
