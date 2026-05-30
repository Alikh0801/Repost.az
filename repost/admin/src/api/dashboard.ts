import { apiRequest } from "./client";

export type DashboardStats = {
  totalArticles: number;
  totalViews: number;
  todayViews: number;
  totalArticlesChangePct: number;
  todayViewsChangePct: number;
  weeklyViews: {
    labels: string[];
    thisWeek: number[];
    lastWeek: number[];
  };
};

export function fetchDashboardStats() {
  return apiRequest<DashboardStats>("/admin/dashboard/stats");
}
