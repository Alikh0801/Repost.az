-- Supabase → SQL Editor → New query → yapışdır → Run
-- PC-dən db:push işləmirsə (P1001) bu yolu istifadə edin.

CREATE TYPE "Category" AS ENUM (
  'politics',
  'economy',
  'society',
  'sports',
  'incidents',
  'world'
);

CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published', 'archived');

CREATE TYPE "UserRole" AS ENUM ('admin', 'editor');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'editor',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE TABLE "articles" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" "Category" NOT NULL,
  "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "featured_order" INTEGER,
  "cover_image_url" TEXT,
  "published_at" TIMESTAMP(3),
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "content" JSONB NOT NULL,
  "created_by_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_category_status_published_at_idx"
  ON "articles"("category", "status", "published_at");
CREATE INDEX "articles_is_featured_featured_order_idx"
  ON "articles"("is_featured", "featured_order");

ALTER TABLE "articles"
  ADD CONSTRAINT "articles_created_by_id_fkey"
  FOREIGN KEY ("created_by_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Admin: admin@repost.az / Admin123! (bcrypt)
INSERT INTO "users" ("id", "email", "password_hash", "role", "created_at", "updated_at")
VALUES (
  gen_random_uuid()::text,
  'admin@repost.az',
  '$2b$12$uHV0W5Vl/02dUdnwurLnnuYYx5kXeIkXwLGDdJKee8fkZme4j9Tma',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "articles" (
  "id", "slug", "category", "status", "is_featured", "featured_order",
  "cover_image_url", "published_at", "view_count", "content", "created_at", "updated_at"
)
VALUES (
  gen_random_uuid()::text,
  'parlamentde-budce-muzakireleri',
  'politics',
  'published',
  true,
  1,
  'https://images.unsplash.com/photo-1541873676-a18131494186?auto=format&fit=crop&w=1200&q=80',
  '2026-05-23 11:20:00',
  18420,
  '{
    "az": {
      "title": "Parlamentdə büdcə müzakirələri davam edir",
      "summary": "Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.",
      "body": [
        "Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.",
        "Müzakirələrdə sosial xərclərin artırılması və infrastruktur investisiyaları əsas mövzulardandır.",
        "Komitə sədrləri növbəti oxunuşun tarixini açıqlayacaqlarını bildirdilər."
      ],
      "imageAlt": "Parlament binası"
    },
    "ru": {
      "title": "В парламенте продолжаются обсуждения бюджета",
      "summary": "Депутаты обсуждают проект государственного бюджета на следующий год.",
      "body": [
        "Депутаты обсуждают проект государственного бюджета на следующий год.",
        "Ключевые темы — рост социальных расходов и инвестиции в инфраструктуру.",
        "Председатели комитетов сообщили, что объявят дату следующего чтения."
      ],
      "imageAlt": "Здание парламента"
    }
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;
