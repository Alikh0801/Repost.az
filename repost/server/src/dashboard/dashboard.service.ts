import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const DAY_LABELS = ["B.e", "Ç.a", "Çər", "C.a", "Cüm", "Şnb", "Baz"] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatViews(value: number): number {
  return value;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = addDays(today, -1);
    const weekStart = addDays(today, -((today.getDay() + 6) % 7));
    const lastWeekStart = addDays(weekStart, -7);

    const [
      totalArticles,
      totalViewsAgg,
      todayStat,
      yesterdayStat,
      thisWeekArticles,
      lastWeekArticles,
      dailyStats,
    ] = await Promise.all([
      this.prisma.article.count({ where: { status: "published" } }),
      this.prisma.article.aggregate({ _sum: { viewCount: true } }),
      this.prisma.dailyViewStat.findUnique({ where: { date: today } }),
      this.prisma.dailyViewStat.findUnique({ where: { date: yesterday } }),
      this.prisma.article.count({
        where: {
          status: "published",
          publishedAt: { gte: weekStart, lte: now },
        },
      }),
      this.prisma.article.count({
        where: {
          status: "published",
          publishedAt: { gte: lastWeekStart, lt: weekStart },
        },
      }),
      this.prisma.dailyViewStat.findMany({
        where: {
          date: { gte: lastWeekStart, lte: addDays(weekStart, 6) },
        },
        orderBy: { date: "asc" },
      }),
    ]);

    const statMap = new Map(
      dailyStats.map((row) => [startOfDay(row.date).getTime(), row.views]),
    );

    const thisWeekViews: number[] = [];
    const lastWeekViews: number[] = [];

    for (let i = 0; i < 7; i++) {
      const thisDay = addDays(weekStart, i);
      const lastDay = addDays(lastWeekStart, i);
      thisWeekViews.push(statMap.get(thisDay.getTime()) ?? 0);
      lastWeekViews.push(statMap.get(lastDay.getTime()) ?? 0);
    }

    const todayViews = todayStat?.views ?? 0;
    const yesterdayViews = yesterdayStat?.views ?? 0;

    return {
      totalArticles,
      totalViews: totalViewsAgg._sum.viewCount ?? 0,
      todayViews,
      totalArticlesChangePct: pctChange(thisWeekArticles, lastWeekArticles),
      todayViewsChangePct: pctChange(todayViews, yesterdayViews),
      weeklyViews: {
        labels: [...DAY_LABELS],
        thisWeek: thisWeekViews,
        lastWeek: lastWeekViews,
      },
      formatted: {
        totalViews: formatViews(totalViewsAgg._sum.viewCount ?? 0),
        todayViews: formatViews(todayViews),
      },
    };
  }
}
