import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ArticlesModule } from "./articles/articles.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { MediaModule } from "./media/media.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ArticlesModule,
    MediaModule,
  ],
})
export class AppModule {}
