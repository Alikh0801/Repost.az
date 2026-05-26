import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArticleStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ViewBoostService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ViewBoostService.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const enabled =
      this.config.get<string>("VIEW_BOOST_ENABLED", "true") === "true";
    if (!enabled) {
      this.logger.log("Süni oxunuş artımı söndürülüb (VIEW_BOOST_ENABLED)");
      return;
    }

    const intervalMs = this.intervalMs();

    void this.boostRecentArticles();
    this.timer = setInterval(() => void this.boostRecentArticles(), intervalMs);

    const { min, max } = this.goalRange();
    this.logger.log(
      `Süni oxunuş artımı aktiv: hər ${intervalMs / 60_000} dəq, son ${this.windowHours()} saatda əlavə olunan SON xəbərə +${min}–${max}`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private intervalMs(): number {
    return Number(
      this.config.get<string>("VIEW_BOOST_INTERVAL_MS", "300000"),
    );
  }

  private windowHours(): number {
    return Number(this.config.get<string>("VIEW_BOOST_WINDOW_HOURS", "6"));
  }

  private goalRange(): { min: number; max: number } {
    const min = Number(this.config.get<string>("VIEW_BOOST_MIN", "20"));
    const max = Number(this.config.get<string>("VIEW_BOOST_MAX", "40"));
    return { min: Math.min(min, max), max: Math.max(min, max) };
  }

  private randomBump(): number {
    const { min, max } = this.goalRange();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async boostRecentArticles(): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      const since = new Date(Date.now() - this.windowHours() * 60 * 60 * 1000);

      // Son 6 saatda əlavə olunan SON dərc edilmiş xəbər
      const article = await this.prisma.article.findFirst({
        where: {
          status: ArticleStatus.published,
          OR: [
            { publishedAt: { gte: since } },
            { publishedAt: null, createdAt: { gte: since } },
          ],
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        select: { id: true, slug: true },
      });

      if (!article) return;

      const bump = this.randomBump();
      await this.prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: bump } },
      });

      this.logger.debug(`"${article.slug}" xəbərə +${bump} oxunuş əlavə olundu`);
    } catch (error) {
      this.logger.warn(
        `Oxunuş artımı uğursuz: ${error instanceof Error ? error.message : error}`,
      );
    } finally {
      this.running = false;
    }
  }
}
