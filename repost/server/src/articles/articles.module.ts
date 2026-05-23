import { Module } from "@nestjs/common";
import { AdminArticlesController } from "./admin-articles.controller";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ViewBoostService } from "./view-boost.service";

@Module({
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService, ViewBoostService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
