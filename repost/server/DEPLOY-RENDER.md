# API — Render deploy

Client: [https://repost-az.vercel.app](https://repost-az.vercel.app)  
API (gözlənilən): `https://repost-api.onrender.com`

## 1. Render.com

1. [render.com](https://render.com) → **New +** → **Web Service**
2. GitHub repo bağlayın
3. **Root Directory:** `repost/server`
4. **Name:** `repost-api` (URL: `https://repost-api.onrender.com` — `vercel.json` ilə uyğun olmalıdır)
5. **Runtime:** Node
6. **Build Command:**
   ```bash
   npm install && npx prisma generate && npm run build
   ```
7. **Start Command:**
   ```bash
   npm run start:prod
   ```

## 2. Environment Variables (Render panel)

Supabase-dən kopyalayın (`repost/server/.env`-dən):

| Key | Nümunə |
|-----|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://...` |
| `DIRECT_URL` | `postgresql://...` |
| `JWT_SECRET` | uzun təsadüfi sətir |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGINS` | `https://repost-az.vercel.app,http://localhost:5173,http://localhost:5174` |
| `PUBLIC_BASE_URL` | `https://repost-api.onrender.com` |
| `SITE_URL` | `https://repost-az.vercel.app` |
| `VIEW_BOOST_ENABLED` | `true` |

## 3. Deploy sonrası

Brauzerdə yoxlayın:

- `https://repost-api.onrender.com/api/v1/health` (əgər health var)
- `https://repost-api.onrender.com/api/v1/articles/featured`

Sonra Vercel:

- `https://repost-az.vercel.app/api/v1/articles/featured`

## 4. Vercel Redeploy

Render URL fərqlidirsə (`repost-api` deyil), `repost/client/vercel.json`-də `repost-api.onrender.com`-u dəyişin və Vercel-də yenidən deploy edin.

## Qeydlər

- **Pulsuz Render** planı ~15 dəq idle-dan sonra yuxlayır; ilk sorğu 30–60 saniyə çəkə bilər.
- Şəkil upload: `uploads/` Render-də müvəqqətidir; uzunmüddət üçün Supabase Storage tövsiyə olunur.
