-- Mövcud article_translations cədvəli varsa: Supabase SQL Editor-də işlədin.

ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "content" JSONB;

UPDATE "articles" a
SET "content" = COALESCE(
  (
    SELECT jsonb_object_agg(
      t."locale"::text,
      jsonb_build_object(
        'title', t."title",
        'summary', t."summary",
        'body', t."body",
        'imageAlt', t."image_alt"
      )
    )
    FROM "article_translations" t
    WHERE t."article_id" = a."id"
  ),
  '{"az":{"title":"","summary":"","body":[],"imageAlt":""},"ru":{"title":"","summary":"","body":[],"imageAlt":""}}'::jsonb
)
WHERE a."content" IS NULL;

ALTER TABLE "articles" ALTER COLUMN "content" SET NOT NULL;

DROP TABLE IF EXISTS "article_translations";

DROP TYPE IF EXISTS "Locale";
