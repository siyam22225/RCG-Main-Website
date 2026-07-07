CREATE TABLE IF NOT EXISTS "EnterpriseProject" (
  "id" TEXT NOT NULL,
  "enterpriseSlug" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "location" TEXT,
  "image" TEXT,
  "shortDescription" TEXT,
  "fullDescription" JSONB,
  "media" JSONB,
  "profilePdf" TEXT,
  "websiteUrl" TEXT,
  "tour360Image" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EnterpriseProject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EnterpriseProject_enterpriseSlug_slug_key"
ON "EnterpriseProject"("enterpriseSlug", "slug");
