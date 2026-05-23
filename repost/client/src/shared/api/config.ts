const LOCAL_API = "http://localhost:3000/api/v1";

/** Production-da Vercel proxy: /api/v1 → Render (vercel.json) */
const PRODUCTION_API = "/api/v1";

function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return PRODUCTION_API;
  return LOCAL_API;
}

export const API_BASE = resolveApiBase();
