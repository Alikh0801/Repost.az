import { Navigate, useParams } from "react-router-dom";

/** Köhnə WordPress `/%year%/%month%/%day%/%postname%/` */
export function LegacyArticleDateRedirect() {
  const { year, slug } = useParams<{ year: string; slug: string }>();
  if (!slug || !year || !/^\d{4}$/.test(year)) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/article/${encodeURIComponent(slug)}`} replace />;
}
