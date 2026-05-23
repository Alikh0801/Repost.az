# RePost.az API (`server`)

Node.js backend: **NestJS**, **PostgreSQL**, **Prisma**, JWT auth.

## Prerequisites

- Node.js 20+ (layihəni işə salmaq üçün)
- PostgreSQL: **buludda** (Supabase / Neon) — PC-yə Docker və ya DB quraşdırmaq lazım deyil

**Bulud-only təlimat:** [`SETUP-CLOUD.md`](./SETUP-CLOUD.md)

## Quick start (bulud DB)

```bash
cd repost/server
cp .env.example .env
# .env → Supabase DATABASE_URL yapışdırın (SETUP-CLOUD.md)
npm install
npm run db:push
npm run db:seed
npm run start:dev
```

### Optional: local PostgreSQL via Docker

Yalnız istəsəniz: `docker compose up -d` və `.env`-də local `DATABASE_URL`.

API base: `http://localhost:3000/api/v1`  
Swagger: `http://localhost:3000/docs`

### Seed admin

Default (from `.env.example`):

- Email: `admin@repost.az`
- Password: `Admin123!`

Change these in `.env` before `npm run db:seed`.

## Main endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/login` | — |
| GET | `/api/v1/articles?locale=az&category=politics` | — |
| GET | `/api/v1/articles/featured?locale=az` | — |
| GET | `/api/v1/articles/:slug?locale=az` | — |
| GET | `/api/v1/articles/:slug/related?locale=az` | — |
| POST | `/api/v1/articles/:slug/views` | — |
| GET/POST/PATCH/DELETE | `/api/v1/admin/articles` | Bearer JWT |
| POST | `/api/v1/admin/media/upload` | Bearer JWT (`multipart/form-data`, field `file`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with watch |
| `npm run db:push` | Apply Prisma schema to DB |
| `npm run db:migrate` | Create migration (production) |
| `npm run db:seed` | Admin user + sample article |
| `npm run db:studio` | Prisma Studio |

## Next steps

- Connect `client` to this API instead of mock data
- Add `admin` frontend app
- Production: S3/R2 for uploads, strong `JWT_SECRET`, migrations via CI
