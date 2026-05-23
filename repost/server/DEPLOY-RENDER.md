# API — Render deploy

Client: https://repost-az.vercel.app  
Sizin API URL (nümunə): `https://repost-api-ljuf.onrender.com`  
`repost/client/vercel.json`-də **öz Render URL-iniz** olmalıdır.

## Render Web Service tənzimləri

| Parametr | Dəyər |
|----------|--------|
| **Root Directory** | `repost/server` |
| **Build Command** | `npm ci --include=dev && npx prisma generate && npm run build` |
| **Start Command** | `npm run start:prod` |

### `Cannot find module .../dist/main.js` (start failed)

Build uğurludur, amma fayl `dist/src/main.js`-də qalıbsa — `tsconfig.build.json` ilə `nest build` `dist/main.js` yaradır. Repo-nu push edib yenidən deploy edin.

### Exit 127 (build failed) — ən çox səbəblər

1. **Root Directory boşdur** → `repost/server` yazın  
2. **`NODE_ENV=production` build zamanı** → `nest` və `prisma` quraşdırılmır (devDependencies atlanır)  
   - Build Command mütləq `--include=dev` ilə olsun (yuxarıdakı kimi)  
3. Köhnə build: `npm install` əvəzinə `npm ci --include=dev` istifadə edin

`NODE_ENV=production` Render-də **qala bilər** — build command dev paketləri yükləməlidir.

## Environment Variables

| Key | Qeyd |
|-----|------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Supabase URL (**`production` key YOX**) |
| `DIRECT_URL` | Supabase URL |
| `JWT_SECRET` | uzun sətir |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGINS` | `https://repost-az.vercel.app,http://localhost:5173,http://localhost:5174` |
| `PUBLIC_BASE_URL` | `https://SIZIN-SERVICE.onrender.com` (sonunda `/` yox) |
| `SITE_URL` | `https://repost-az.vercel.app` |
| `VIEW_BOOST_ENABLED` | `true` |

## Brauzerdə sadəcə `Not Found` (plain text)

Response header-da `x-render-routing: no-server` varsa **Nest işləmir** — route səhv deyil.

1. Render → **Logs** (runtime, build yox) — `Missing required environment variables` və ya crash sətri  
2. **Web Service** olmalıdır (Static Site deyil)  
3. Mütləq env: `DATABASE_URL`, `JWT_SECRET` (boş olmamalı)  
4. **Manual Deploy** yenidən  

Uğurlu cavab JSON-dur, məs: `{"ok":true,"database":true,...}`

## Deploy sonrası

1. `https://SIZIN-SERVICE.onrender.com/api/v1/health` → JSON (`ok: true`)  
2. `https://SIZIN-SERVICE.onrender.com/api/v1/articles/featured` → JSON  
3. `vercel.json`-də Render hostunu yeniləyin → Vercel **Redeploy**  
4. `https://repost-az.vercel.app/api/v1/articles/featured` → JSON  

## Vercel proxy

`repost/client/vercel.json` içində `repost-api-ljuf.onrender.com` — Render paneldəki **real URL** ilə eyni olmalıdır.
