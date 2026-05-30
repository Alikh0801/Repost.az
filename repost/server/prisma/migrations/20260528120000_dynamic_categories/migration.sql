-- Kateqoriyalar cədvəli
CREATE TABLE "categories" (
    "slug" TEXT NOT NULL,
    "label_az" TEXT NOT NULL,
    "label_ru" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("slug")
);

INSERT INTO "categories" ("slug", "label_az", "label_ru", "sort_order") VALUES
('politics', 'Siyasət', 'Политика', 1),
('economy', 'İqtisadiyyat', 'Экономика', 2),
('society', 'Sosial', 'Общество', 3),
('sports', 'İdman', 'Спорт', 4),
('incidents', 'Hadisə', 'Происшествия', 5),
('world', 'Dünya', 'Мир', 6);

-- Gündəlik baxış statistikası
CREATE TABLE "daily_view_stats" (
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "daily_view_stats_pkey" PRIMARY KEY ("date")
);

-- Article: enum → slug FK
ALTER TABLE "articles" ADD COLUMN "category_slug" TEXT;
UPDATE "articles" SET "category_slug" = "category"::text;
ALTER TABLE "articles" ALTER COLUMN "category_slug" SET NOT NULL;

ALTER TABLE "articles" ADD CONSTRAINT "articles_category_slug_fkey"
    FOREIGN KEY ("category_slug") REFERENCES "categories"("slug")
    ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "articles_category_status_published_at_idx";
CREATE INDEX "articles_category_slug_status_published_at_idx"
    ON "articles"("category_slug", "status", "published_at");

ALTER TABLE "articles" DROP COLUMN "category";
DROP TYPE "Category";
