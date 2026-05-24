import { Controller, Get, Header } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { HttpCache } from "../common/http-cache.decorator";
import { SeoService } from "./seo.service";

@ApiExcludeController()
@Controller()
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get("robots.txt")
  @HttpCache(3600, 86400)
  @Header("Content-Type", "text/plain; charset=utf-8")
  robots() {
    return this.seoService.buildRobotsTxt();
  }

  @Get("sitemap.xml")
  @HttpCache(300, 600)
  @Header("Content-Type", "application/xml; charset=utf-8")
  async sitemap() {
    return this.seoService.buildSitemapXml();
  }
}
