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

CREATE TYPE "Locale" AS ENUM ('az', 'ru');

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

CREATE TABLE "article_translations" (
  "id" TEXT NOT NULL,
  "article_id" TEXT NOT NULL,
  "locale" "Locale" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "body" JSONB NOT NULL,
  "image_alt" TEXT NOT NULL,
  CONSTRAINT "article_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "article_translations_article_id_locale_key"
  ON "article_translations"("article_id", "locale");

ALTER TABLE "article_translations"
  ADD CONSTRAINT "article_translations_article_id_fkey"
  FOREIGN KEY ("article_id") REFERENCES "articles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

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

-- Nümunə xəbər
INSERT INTO "articles" (
  "id", "slug", "category", "status", "is_featured", "featured_order",
  "cover_image_url", "published_at", "view_count", "created_at", "updated_at"
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
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "article_translations" ("id", "article_id", "locale", "title", "summary", "body", "image_alt")
SELECT
  gen_random_uuid()::text,
  a.id,
  v.locale::"Locale",
  v.title,
  v.summary,
  v.body::jsonb,
  v.image_alt
FROM "articles" a
CROSS JOIN (
  VALUES
    (
      'az',
      'Parlamentdə büdcə müzakirələri davam edir',
      'Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.',
      '["Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.","Müzakirələrdə sosial xərclərin artırılması və infrastruktur investisiyaları əsas mövzulardandır.","Komitə sədrləri növbəti oxunuşun tarixini açıqlayacaqlarını bildirdilər."]',
      'Parlament binası'
    ),
    (
      'ru',
      'В парламенте продолжаются обсуждения бюджета',
      'Депутаты обсуждают проект государственного бюджета на следующий год.',
      '["Депутаты обсуждают проект государственного бюджета на следующий год.","Ключевые темы — рост социальных расходов и инвестиции в инфраструктуру.","Председатели комитетов сообщили, что объявят дату следующего чтения."]',
      'Здание парламента'
    )
) AS v(locale, title, summary, body, image_alt)
WHERE a.slug = 'parlamentde-budce-muzakireleri'
  AND NOT EXISTS (
    SELECT 1 FROM "article_translations" t
    WHERE t.article_id = a.id AND t.locale = v.locale::"Locale"
  );
