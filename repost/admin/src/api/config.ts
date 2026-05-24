/** Vercel: VITE_API_URL təyin edin. Lokal: localhost API. */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD
    ? "https://repost-api-cv3y.onrender.com/api/v1"
    : "http://localhost:3000/api/v1");

export const TOKEN_KEY = "repost_admin_token";
