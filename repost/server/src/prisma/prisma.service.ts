import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

const RETRYABLE_CODES = new Set(["P1001", "P1017"]);

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

  /** Supabase pooler bəzən bağlantını kəsir (P1017) — avtomatik yenidən cəhd */
  async withRetry<T>(operation: () => Promise<T>, maxAttempts = 4): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        this.connected = true;
        return result;
      } catch (error) {
        lastError = error;
        if (!this.isRetryable(error) || attempt >= maxAttempts) {
          throw error;
        }

        this.logger.warn(
          `DB connection lost (${this.errorCode(error)}), retry ${attempt}/${maxAttempts - 1}...`,
        );
        await this.reconnect();
        await this.sleep(250 * attempt);
      }
    }

    throw lastError;
  }

  async ping(): Promise<boolean> {
    try {
      await this.withRetry(() => this.$queryRaw`SELECT 1`);
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

  private isRetryable(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      RETRYABLE_CODES.has(error.code)
    );
  }

  private errorCode(error: unknown): string {
    if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code;
    return "unknown";
  }

  private async reconnect() {
    try {
      await this.$disconnect();
    } catch {
      /* ignore */
    }
    await this.$connect();
    this.connected = true;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
