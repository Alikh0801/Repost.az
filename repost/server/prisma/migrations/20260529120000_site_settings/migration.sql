CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "telegram_url" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_settings" ("id") VALUES ('default');
