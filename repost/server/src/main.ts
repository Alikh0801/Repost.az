import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

function assertRequiredEnv() {
  const missing = ["DATABASE_URL", "JWT_SECRET"].filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Add them in Render → Environment.",
    );
    process.exit(1);
  }
}

async function bootstrap() {
  assertRequiredEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const port = Number(process.env.PORT) || config.get<number>("PORT", 3000);
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

  await app.listen(port, "0.0.0.0");
  console.log(`API listening on port ${port}`);
  console.log(`Health: /api/v1/health`);
  console.log(`Swagger: /docs`);
}

void bootstrap();
