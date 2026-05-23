import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log("Database connected");
    } catch (error) {
      this.connected = false;
      const message =
        error instanceof Error ? error.message : "Unknown database error";
      this.logger.warn(
        `Database not reachable at startup (${message}). API will start; fix DATABASE_URL or network (port 5432/6543).`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      this.connected = true;
      return true;
    } catch {
      this.connected = false;
      return false;
    }
  }

  isConnected() {
    return this.connected;
  }
}
