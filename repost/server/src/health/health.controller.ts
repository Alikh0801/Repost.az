import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const database = await this.prisma.ping();

    return {
      ok: true,
      database,
      hint: database
        ? null
        : "PC cannot reach Supabase on port 5432/6543. DB is OK in Supabase web UI; use mobile hotspot or deploy API to cloud.",
    };
  }
}
