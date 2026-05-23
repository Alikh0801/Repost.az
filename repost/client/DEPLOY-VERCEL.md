# Vercel — https://repost-az.vercel.app

## Repo tənzimləməsi

| Parametr | Dəyər |
|----------|--------|
| **Root Directory** | `repost/client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

## Environment Variables (Vercel panel)

| Dəyişən | Dəyər |
|---------|--------|
| `VITE_SITE_URL` | `https://repost-az.vercel.app` |
| `VITE_API_URL` | *(boş buraxa bilərsiniz)* — default `/api/v1` (Vercel → Render proxy) |

`VITE_API_URL` təyin etməsəniz, production build `/api/v1` istifadə edir (`vercel.json` Render-ə yönləndirir).

Hər dəyişiklikdən sonra **Redeploy** edin.

## Necə işləyir

```
Brauzer → repost-az.vercel.app/api/v1/... 
       → Vercel proxy (vercel.json)
       → repost-api.onrender.com/api/v1/...
```

Render deploy olunana qədər API sorğuları **502** verə bilər — bu normaldır. Render hazır olandan sonra xəbərlər görünəcək.

## Render deploy

`repost/server/DEPLOY-RENDER.md` faylına baxın.

## Yoxlama

1. Render işləyəndə: `https://repost-api.onrender.com/api/v1/articles/featured` → JSON
2. Vercel: `https://repost-az.vercel.app/api/v1/articles/featured` → eyni JSON
3. Sayt: hero və kartlar dolu olmalıdır
