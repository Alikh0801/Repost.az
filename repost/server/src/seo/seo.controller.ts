import { Controller, Get, Header } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { SeoService } from "./seo.service";

@ApiExcludeController()
@Controller()
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get("robots.txt")
  @Header("Content-Type", "text/plain; charset=utf-8")
  robots() {
    return this.seoService.buildRobotsTxt();
  }

  @Get("sitemap.xml")
  @Header("Content-Type", "application/xml; charset=utf-8")
  async sitemap() {
    return this.seoService.buildSitemapXml();
  }
}
