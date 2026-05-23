import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3000);
  const corsOrigins = config
    .get<string>("CORS_ORIGINS", "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: corsOrigins, credentials: true });
  app.setGlobalPrefix("api/v1", {
    exclude: [
      { path: "sitemap.xml", method: RequestMethod.GET },
      { path: "robots.txt", method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RePost.az API")
    .setDescription("Public and admin endpoints for RePost.az")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api/v1`);
  console.log(`Health:  http://localhost:${port}/api/v1/health`);
  console.log(`Swagger: http://localhost:${port}/docs`);
  console.log(`Sitemap: http://localhost:${port}/sitemap.xml`);
}

void bootstrap();
