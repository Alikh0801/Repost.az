/** Vercel: /api/v1 proxy (vercel.json). Lokal: localhost API. */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:3000/api/v1");
