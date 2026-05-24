import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArticleStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type BoostProgress = { goal: number; added: number };

@Injectable()
export class ViewBoostService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ViewBoostService.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  /** Son 6 saatlıq pəncərə üçün hər məqaləyə təyin olunmuş hədəf (30–40) */
  private readonly progress = new Map<string, BoostProgress>();

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
      `Süni oxunuş artımı aktiv: hər ${intervalMs / 60_000} dəq, son ${this.windowHours()} saatlıq xəbərlərə məqalə başına +${min}–${max} (paylanmış)`,
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
    const min = Number(this.config.get<string>("VIEW_BOOST_MIN", "30"));
    const max = Number(this.config.get<string>("VIEW_BOOST_MAX", "40"));
    return { min: Math.min(min, max), max: Math.max(min, max) };
  }

  private randomGoal(): number {
    const { min, max } = this.goalRange();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private windowEndMs(publishedAt: Date | null, createdAt: Date): number {
    const ref = publishedAt ?? createdAt;
    return ref.getTime() + this.windowHours() * 60 * 60 * 1000;
  }

  private bumpForArticle(
    articleId: string,
    publishedAt: Date | null,
    createdAt: Date,
  ): number {
    const windowEnd = this.windowEndMs(publishedAt, createdAt);
    const now = Date.now();
    if (now >= windowEnd) {
      this.progress.delete(articleId);
      return 0;
    }

    let entry = this.progress.get(articleId);
    if (!entry) {
      entry = { goal: this.randomGoal(), added: 0 };
      this.progress.set(articleId, entry);
    }

    const remaining = entry.goal - entry.added;
    if (remaining <= 0) return 0;

    const ticksLeft = Math.max(
      1,
      Math.ceil((windowEnd - now) / this.intervalMs()),
    );
    const bump = Math.min(remaining, Math.ceil(remaining / ticksLeft));

    entry.added += bump;
    return bump;
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
        select: { id: true, slug: true, publishedAt: true, createdAt: true },
      });

      const activeIds = new Set(articles.map((a) => a.id));
      for (const id of this.progress.keys()) {
        if (!activeIds.has(id)) this.progress.delete(id);
      }

      if (articles.length === 0) return;

      let totalAdded = 0;
      for (const article of articles) {
        const bump = this.bumpForArticle(
          article.id,
          article.publishedAt,
          article.createdAt,
        );
        if (bump <= 0) continue;

        await this.prisma.article.update({
          where: { id: article.id },
          data: { viewCount: { increment: bump } },
        });
        totalAdded += bump;
      }

      if (totalAdded > 0) {
        this.logger.debug(
          `${articles.length} xəbərə cəmi +${totalAdded} oxunuş əlavə olundu`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Oxunuş artımı uğursuz: ${error instanceof Error ? error.message : error}`,
      );
    } finally {
      this.running = false;
    }
  }
}
