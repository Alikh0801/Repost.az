# Bulud konfiqurasiyası (PC-yə PostgreSQL / Docker yox)

Bütün infrastruktur **veb panel** üzərindən qurulur. Kompüterə yalnız layihə kodu və **Node.js** (artıq var) qalır — verilənlər bazası və gələcəkdə hostinq buludda olacaq.

## 1. Verilənlər bazası — Supabase (əsas yol)

[https://supabase.com](https://supabase.com) — pulsuz PostgreSQL + veb panel (Table Editor, SQL).

1. **Start your project** → GitHub ilə giriş edə bilərsiniz.
2. **New project**:
   - Organization: özünüzün
   - Name: `repost`
   - Database password: **güclü parol saxlayın** (bir dəfə göstərilir)
   - Region: yaxın (məs. `Central EU`)
3. Project hazır olanda: **Project Settings** (dişli) → **Database**.
4. Layihə home → yaşıl **Connect** → **ORMs** → **Prisma**.
5. Orada **iki** sətir olacaq — **kopyalayın** (əl ilə host yazmayın):
   - `DATABASE_URL` (Transaction pooler, port **6543**, `?pgbouncer=true`)
   - `DIRECT_URL` (Session pooler, port **5432**)
6. `repost/server/.env`-ə yapışdırın; `[YOUR-PASSWORD]`-i real parolla əvəz edin.

> **P1001** (`db.xxx.supabase.co`): bu host çox vaxt yalnız **IPv6** verir; Windows IPv4-də çatmır → **pooler** mütləqdir.  
> **P1013**: parolda `@ / & *` varsa — Supabase **Generate password** (yalnız hərf+rəqəm) və ya URL-encode + dırnaq: `DATABASE_URL="..."`  
> **Tenant not found**: Connect-dən səhv region/host kopyalanıb; yenidən **Connect → Prisma** tam sətri götürün.

6. Lazım olanda terminalda:

```powershell
cd repost\server
npm run db:push
npm run db:seed
```

7. Cədvəllərə baxmaq: Supabase → **Table Editor** (`users`, `articles`, `article_translations`).

### P1001 — PC-dən serverə çatılmır

`Can't reach database server` — adətən **5432 portu** bloklanır (antivirus, provayder, məktəb/iş şəbəkəsi) və ya `db.*` yalnız IPv6-dir.

**Yoxlama (PowerShell):**

```powershell
Test-NetConnection aws-0-ap-northeast-1.pooler.supabase.com -Port 5432
Test-NetConnection aws-0-ap-northeast-1.pooler.supabase.com -Port 6543
```

`TcpTestSucceeded : False` → hotspot sınayın və ya aşağıdakı SQL yolunu.

**Alternativ (terminal olmadan):** Supabase → **SQL Editor** → `prisma/supabase-manual-setup.sql` faylının məzmununu yapışdır → **Run**. Sonra Table Editor-də cədvəlləri yoxlayın.

### Alternativ: Neon

[https://neon.tech](https://neon.tech) — eyni `DATABASE_URL` ideyası; pooled connection kopyalayıb `.env`-ə yazın, sonra `db:push` + `db:seed`.

---

## 2. `.env` — tam nümunə (bulud DB + local API)

Fayl: `repost/server/.env` (git-ə düşmür).

```env
NODE_ENV=development
PORT=3000

# Neon / Supabase-dən kopyalanan link
DATABASE_URL="postgresql://...."

# Təsadüfi uzun sətir (brauzerdə random generator da olar)
JWT_SECRET="buraya-uzun-tesadufi-sir"
JWT_EXPIRES_IN=7d

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

SEED_ADMIN_EMAIL=admin@repost.az
SEED_ADMIN_PASSWORD=OzunuzGucluParol!

PUBLIC_BASE_URL=http://localhost:3000
```

`db:seed`-dən **əvvəl** admin parolunu dəyişin.

---

## 3. API-ni local işə salmaq (DB buludda)

```powershell
cd repost\server
npm run start:dev
```

- API: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

Login test (Swagger və ya Postman):

- `POST /api/v1/auth/login`
- body: `{ "email": "admin@repost.az", "password": "..." }`

---

## 4. Gələcək hostinq (hamısı veb, PC-yə server yox)

| Komponent | Xidmət | Panel |
|-----------|--------|--------|
| **API** (`server`) | [Railway](https://railway.app) və ya [Render](https://render.com) | Repo bağla, env dəyişənləri yapışdır |
| **DB** | Neon / Supabase | Artıq hazırdır |
| **Şəkillər** | [Cloudflare R2](https://dash.cloudflare.com) | Bucket + public URL → `PUBLIC_BASE_URL` |
| **Sayt** (`client`) | [Cloudflare Pages](https://pages.cloudflare.com) və ya Vercel | `VITE_API_URL` build env |

Railway/Render-də eyni `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (prod domain), `PUBLIC_BASE_URL` (API URL) təyin edilir — kod dəyişmədən paneldən.

---

## 5. Nə PC-yə quraşdırılmır

| Quraşdırılmır | Əvəzində |
|---------------|----------|
| Docker | — |
| PostgreSQL | Neon / Supabase |
| pgAdmin | Neon SQL Editor / Supabase Table Editor |

## 6. Nə hələ local qalır

| | Səbəb |
|---|--------|
| **Node.js + npm** | `npm run start:dev`, `db:push` — kod işlətmək üçün (artıq var) |
| **`.env` faylı** | Sirrlər; bulud panelində də eyni dəyərlər təkrarlanacaq |

Tamamilə “heç bir terminal” istəyirsinizsə, növbəti addımda API deploy + GitHub Actions ilə `prisma migrate deploy` da buludda avtomatlaşdırıla bilər — ayrıca mərhələ.

---

## Tez yoxlama

Neon-da cədvəl var? → SQL Editor: `SELECT * FROM articles;`

API işləyir? → Brauzer: `http://localhost:3000/api/v1/articles/featured?locale=az`
