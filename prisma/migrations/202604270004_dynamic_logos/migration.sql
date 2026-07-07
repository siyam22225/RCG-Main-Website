CREATE TABLE IF NOT EXISTS "WebsiteLogoSetting" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "logoUrl" TEXT NOT NULL DEFAULT '/images/logos/Asset 14.png',
  "altText" TEXT NOT NULL DEFAULT 'Real Capita Group',
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WebsiteLogoSetting_pkey" PRIMARY KEY ("id")
);

INSERT INTO "WebsiteLogoSetting" ("id", "logoUrl", "altText", "isEnabled")
VALUES ('main', '/images/logos/Asset 14.png', 'Real Capita Group', true)
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "BrandLogo" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "linkUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BrandLogo_pkey" PRIMARY KEY ("id")
);

INSERT INTO "BrandLogo" ("id", "name", "imageUrl", "linkUrl", "isActive", "sortOrder")
VALUES
  ('default-logo-1', 'Logo 01', '/images/logos/logo-1.png', NULL, true, 1),
  ('default-logo-2', 'Logo 02', '/images/logos/logo-2.png', NULL, true, 2),
  ('default-logo-3', 'Logo 03', '/images/logos/logo-3.png', NULL, true, 3),
  ('default-logo-4', 'Logo 04', '/images/logos/logo-4.png', NULL, true, 4)
ON CONFLICT ("id") DO NOTHING;
