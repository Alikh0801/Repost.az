# RePost.az Admin

Redaktor paneli — xəbər idarəetməsi.

## İşə salma

1. API işləməlidir (`repost/server` → `npm run start:dev`, port **3000**).
2. Admin:

```bash
cd repost/admin
npm install
npm run dev
```

Brauzer: [http://localhost:5174](http://localhost:5174)

## Giriş

Supabase seed / `.env` seed ilə yaradılmış admin:

- E-poçt: `admin@repost.az`
- Parol: `SEED_ADMIN_PASSWORD` (server `.env`-də, default `Admin123!`)

## Funksiyalar

- Giriş / çıxış (JWT)
- Xəbər siyahısı, silmə
- Yeni xəbər / redaktə (AZ + RU tab)
- Kateqoriya, status, hero, slug, dərc tarixi
- Şəkil yükləmə (`/admin/media/upload`)

## Konfiqurasiya

`VITE_API_URL` — API əsas ünvanı (default: `http://localhost:3000/api/v1`).

Server `CORS_ORIGINS`-də `http://localhost:5174` olmalıdır.
