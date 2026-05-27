import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ArticlePage } from "../pages/article/ArticlePage";
import { HomePage } from "../pages/home/HomePage";
import { LegacyArticleDateRedirect } from "../pages/legacy/LegacyArticleDateRedirect";
import { LegacyCategoryRedirect } from "../pages/legacy/LegacyCategoryRedirect";
import { LegacyNewsRedirect } from "../pages/legacy/LegacyNewsRedirect";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="article/:articleId" element={<ArticlePage />} />
          <Route
            path="category/:legacyId/pg/:page"
            element={<LegacyCategoryRedirect />}
          />
          <Route
            path="category/:legacyId"
            element={<LegacyCategoryRedirect />}
          />
          <Route path="news/:legacyPostId" element={<LegacyNewsRedirect />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route
            path=":year/:month/:day/:slug"
            element={<LegacyArticleDateRedirect />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
