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

    const intervalMs = Number(
      this.config.get<string>("VIEW_BOOST_INTERVAL_MS", "300000"),
    );

    void this.boostRecentArticles();
    this.timer = setInterval(() => void this.boostRecentArticles(), intervalMs);

    this.logger.log(
      `Süni oxunuş artımı aktiv: hər ${intervalMs / 60_000} dəq, son ${this.windowHours()} saatlıq xəbərlər`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private windowHours(): number {
    return Number(this.config.get<string>("VIEW_BOOST_WINDOW_HOURS", "6"));
  }

  private randomBump(): number {
    const min = Number(this.config.get<string>("VIEW_BOOST_MIN", "10"));
    const max = Number(this.config.get<string>("VIEW_BOOST_MAX", "20"));
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  async boostRecentArticles(): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      const since = new Date(Date.now() - this.windowHours() * 60 * 60 * 1000);

      const articles = await this.prisma.article.findMany({
        where: {
          status: ArticleStatus.published,
          OR: [
            { publishedAt: { gte: since } },
            { publishedAt: null, createdAt: { gte: since } },
          ],
        },
        select: { id: true, slug: true },
      });

      if (articles.length === 0) return;

      let totalAdded = 0;
      for (const article of articles) {
        const bump = this.randomBump();
        await this.prisma.article.update({
          where: { id: article.id },
          data: { viewCount: { increment: bump } },
        });
        totalAdded += bump;
      }

      this.logger.debug(
        `${articles.length} xəbərə cəmi +${totalAdded} oxunuş əlavə olundu`,
      );
    } catch (error) {
      this.logger.warn(
        `Oxunuş artımı uğursuz: ${error instanceof Error ? error.message : error}`,
      );
    } finally {
      this.running = false;
    }
  }
}
