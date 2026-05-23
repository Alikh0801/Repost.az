# SEO (Repost.az client)

## Lokal inkişaf

1. `client/.env` — `VITE_SITE_URL=http://localhost:5173`
2. `server/.env` — `SITE_URL=http://localhost:5173`
3. Server işləsin (`npm run start:dev`), sonra client (`npm run dev`)
4. Yoxlama:
   - http://localhost:5173/robots.txt
   - http://localhost:5173/sitemap.xml
   - Məqalə səhifəsində brauzer tab başlığı və «View Page Source» → `og:title`, `canonical`

## Production

| Dəyişən | Harada | Nümunə |
|---------|--------|--------|
| `VITE_SITE_URL` | client build | `https://repost.az` |
| `SITE_URL` | server | `https://repost.az` |

Sayt və API **eyni domen**dədirsə, `/sitemap.xml` və `/robots.txt` API-yə proxy edin.

API ayrı hostdadırsa (`api.repost.az`), server `robots.txt`-də tam sitemap URL yazır; client `public/robots.txt` silin və ya yeniləyin.

## Nə əlavə olunub

- Səhifə üzrə `title`, `description`, `canonical`
- Open Graph və Twitter Card
- `NewsArticle` JSON-LD (məqalə səhifəsi)
- Dinamik `sitemap.xml` (dərc olunmuş xəbərlər)
- `robots.txt`
