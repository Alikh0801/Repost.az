import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ArticlePage } from "../pages/article/ArticlePage";
import { HomePage } from "../pages/home/HomePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="article/:articleId" element={<ArticlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
