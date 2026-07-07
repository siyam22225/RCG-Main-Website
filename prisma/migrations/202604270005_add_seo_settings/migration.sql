CREATE TABLE IF NOT EXISTS "SeoSetting" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "siteTitle" TEXT NOT NULL DEFAULT 'Real Capita Group',
  "metaDescription" TEXT NOT NULL DEFAULT '',
  "metaKeywords" TEXT NOT NULL DEFAULT '',
  "ogTitle" TEXT NOT NULL DEFAULT '',
  "ogDescription" TEXT NOT NULL DEFAULT '',
  "ogImage" TEXT NOT NULL DEFAULT '',
  "googleVerificationCode" TEXT NOT NULL DEFAULT '',
  "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SeoSetting_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SeoSetting"
  ("id", "siteTitle", "metaDescription", "metaKeywords", "ogTitle", "ogDescription", "ogImage", "googleVerificationCode", "allowIndexing")
VALUES
  ('main', 'Real Capita Group', 'Real Capita Group official corporate website.', 'real estate, property, land, apartment, Bangladesh', 'Real Capita Group', 'Real Capita Group official corporate website.', '', '', true)
ON CONFLICT ("id") DO NOTHING;
