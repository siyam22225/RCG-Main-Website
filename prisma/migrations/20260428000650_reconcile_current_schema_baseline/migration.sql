-- Reconcile current Prisma schema with the historical migration chain.
-- This migration is intentionally idempotent:
-- - safe/no-op on databases that already match prisma/schema.prisma
-- - sufficient for fresh database replay after the older migrations
-- Do not drop or rename legacy columns here.

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isProtected" BOOLEAN NOT NULL DEFAULT false,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "isHiddenFromAdminPanel" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SocialLink" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "iconUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HomeSlide" (
  "id" TEXT NOT NULL,
  "title" TEXT,
  "subtitle" TEXT,
  "imageUrl" TEXT NOT NULL,
  "buttonText" TEXT,
  "buttonHref" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HomeSlide_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OfficeSetting" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "mapUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OfficeSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClientLoginSetting" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "buttonText" TEXT NOT NULL DEFAULT 'Client Login',
  "buttonUrl" TEXT NOT NULL DEFAULT '',
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "openInNewTab" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientLoginSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CareerVacancy" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "jobType" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "salaryRange" TEXT,
  "deadline" TIMESTAMP(3),
  "shortDescription" TEXT NOT NULL,
  "responsibilities" TEXT,
  "requirements" TEXT,
  "experience" TEXT,
  "numberOfVacancies" INTEGER,
  "maxCvSizeMb" INTEGER NOT NULL DEFAULT 5,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CareerVacancy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CareerApplication" (
  "id" TEXT NOT NULL,
  "vacancyId" TEXT,
  "position" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "experience" TEXT,
  "expectedSalary" TEXT,
  "message" TEXT,
  "cvUrl" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Notice" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "shortDescription" TEXT NOT NULL,
  "details" TEXT,
  "pdfUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessVerticalCategory" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessVerticalCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessVerticalItem" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "enterpriseSlug" TEXT,
  "targetUrl" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "imageUrl" TEXT,
  "description" TEXT,
  "location" TEXT,
  "websiteUrl" TEXT,
  CONSTRAINT "BusinessVerticalItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FormerChairmanMessage" (
  "id" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "name" TEXT NOT NULL DEFAULT 'Former Chairman',
  "designation" TEXT,
  "image" TEXT,
  "title" TEXT NOT NULL DEFAULT 'Former Chairman Message',
  "messageBody" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "eyebrow" TEXT,
  "introLead" TEXT,
  "articleLabel" TEXT,
  "articleHeading" TEXT,
  "profileItems" TEXT,
  CONSTRAINT "FormerChairmanMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CareerPageSetting" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "sectionTag" TEXT NOT NULL DEFAULT 'Career',
  "headline" TEXT NOT NULL DEFAULT 'Join Real Capita Group',
  "introText" TEXT NOT NULL DEFAULT '',
  "point1" TEXT NOT NULL DEFAULT '',
  "point2" TEXT NOT NULL DEFAULT '',
  "point3" TEXT NOT NULL DEFAULT '',
  "point4" TEXT NOT NULL DEFAULT '',
  "currentOpenTitle" TEXT NOT NULL DEFAULT 'Current Open Positions',
  "noVacancyText" TEXT NOT NULL DEFAULT '',
  "applyTag" TEXT NOT NULL DEFAULT 'Apply Now',
  "applyTitle" TEXT NOT NULL DEFAULT 'Submit Your CV',
  "applyIntro" TEXT NOT NULL DEFAULT '',
  "openApplicationLabel" TEXT NOT NULL DEFAULT 'Open Application / Future Opportunity',
  "preferredPositionLabel" TEXT NOT NULL DEFAULT 'Preferred Position',
  "preferredPositionPlaceholder" TEXT NOT NULL DEFAULT '',
  "customPositions" TEXT NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CareerPageSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "NoticeCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NoticeCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "propertyType" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "sizeSqft" INTEGER NOT NULL,
  "bedrooms" INTEGER,
  "bathrooms" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'available',
  "shortDescription" TEXT,
  "imageUrl" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "bookingAmount" INTEGER,
  "downPayment" INTEGER,
  "monthlyInstallment" INTEGER,
  "installmentMonths" INTEGER,
  "handoverPayment" INTEGER,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyBooking" (
  "id" TEXT NOT NULL,
  "bookingCode" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "address" TEXT,
  "bookingAmount" INTEGER NOT NULL,
  "paymentMethod" TEXT,
  "paymentReference" TEXT,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PropertyBooking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyVisitRequest" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT NOT NULL,
  "visitorName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "preferredDate" TIMESTAMP(3),
  "preferredTime" TEXT,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PropertyVisitRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SitePopupSetting" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "title" TEXT NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT,
  "buttonText" TEXT,
  "buttonHref" TEXT,
  "showOncePerSession" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isTitleActive" BOOLEAN NOT NULL DEFAULT true,
  "isMessageActive" BOOLEAN NOT NULL DEFAULT true,
  "isButtonActive" BOOLEAN NOT NULL DEFAULT true,
  "autoCloseSeconds" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "SitePopupSetting_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;
ALTER TABLE "Video" ADD COLUMN IF NOT EXISTS "sourceType" TEXT NOT NULL DEFAULT 'youtube';
ALTER TABLE "Video" ALTER COLUMN "youtubeUrl" DROP NOT NULL;

ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "buttonHref" TEXT;
ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "buttonText" TEXT;
ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "profileUrl" TEXT;
ALTER TABLE "Enterprise" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "adminNote" TEXT;
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "followUpStatus" TEXT NOT NULL DEFAULT 'new';
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "lastFollowUpAt" TIMESTAMP(3);

ALTER TABLE "BoardDirector" ADD COLUMN IF NOT EXISTS "messageBody" TEXT;
ALTER TABLE "BoardDirector" ADD COLUMN IF NOT EXISTS "messageTitle" TEXT;
ALTER TABLE "BoardDirector" ADD COLUMN IF NOT EXISTS "profileDetails" TEXT;
ALTER TABLE "BoardDirector" ADD COLUMN IF NOT EXISTS "showMessage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "BoardDirector" ADD COLUMN IF NOT EXISTS "website" TEXT;

ALTER TABLE "EnterpriseProject" ADD COLUMN IF NOT EXISTS "layoutPdf" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Enterprise_slug_key" ON "Enterprise"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "SocialLink_label_key" ON "SocialLink"("label");
CREATE UNIQUE INDEX IF NOT EXISTS "OfficeSetting_key_key" ON "OfficeSetting"("key");
CREATE UNIQUE INDEX IF NOT EXISTS "BoardDirector_slug_key" ON "BoardDirector"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "EnterpriseProject_enterpriseSlug_slug_key" ON "EnterpriseProject"("enterpriseSlug", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "AboutPageContent_pageKey_key" ON "AboutPageContent"("pageKey");
CREATE UNIQUE INDEX IF NOT EXISTS "CareerVacancy_slug_key" ON "CareerVacancy"("slug");
CREATE INDEX IF NOT EXISTS "CareerVacancy_status_idx" ON "CareerVacancy"("status");
CREATE INDEX IF NOT EXISTS "CareerVacancy_department_idx" ON "CareerVacancy"("department");
CREATE INDEX IF NOT EXISTS "CareerVacancy_createdAt_idx" ON "CareerVacancy"("createdAt");
CREATE INDEX IF NOT EXISTS "CareerApplication_vacancyId_idx" ON "CareerApplication"("vacancyId");
CREATE INDEX IF NOT EXISTS "CareerApplication_status_idx" ON "CareerApplication"("status");
CREATE INDEX IF NOT EXISTS "CareerApplication_createdAt_idx" ON "CareerApplication"("createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Notice_slug_key" ON "Notice"("slug");
CREATE INDEX IF NOT EXISTS "Notice_status_idx" ON "Notice"("status");
CREATE INDEX IF NOT EXISTS "Notice_category_idx" ON "Notice"("category");
CREATE INDEX IF NOT EXISTS "Notice_publishDate_idx" ON "Notice"("publishDate");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessVerticalCategory_slug_key" ON "BusinessVerticalCategory"("slug");
CREATE INDEX IF NOT EXISTS "BusinessVerticalCategory_isActive_idx" ON "BusinessVerticalCategory"("isActive");
CREATE INDEX IF NOT EXISTS "BusinessVerticalCategory_displayOrder_idx" ON "BusinessVerticalCategory"("displayOrder");
CREATE INDEX IF NOT EXISTS "BusinessVerticalItem_categoryId_idx" ON "BusinessVerticalItem"("categoryId");
CREATE INDEX IF NOT EXISTS "BusinessVerticalItem_displayOrder_idx" ON "BusinessVerticalItem"("displayOrder");
CREATE INDEX IF NOT EXISTS "BusinessVerticalItem_isActive_idx" ON "BusinessVerticalItem"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "NoticeCategory_name_key" ON "NoticeCategory"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "NoticeCategory_slug_key" ON "NoticeCategory"("slug");
CREATE INDEX IF NOT EXISTS "NoticeCategory_displayOrder_idx" ON "NoticeCategory"("displayOrder");
CREATE INDEX IF NOT EXISTS "NoticeCategory_isActive_idx" ON "NoticeCategory"("isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "Property_slug_key" ON "Property"("slug");
CREATE INDEX IF NOT EXISTS "Property_isActive_idx" ON "Property"("isActive");
CREATE INDEX IF NOT EXISTS "Property_location_idx" ON "Property"("location");
CREATE INDEX IF NOT EXISTS "Property_price_idx" ON "Property"("price");
CREATE INDEX IF NOT EXISTS "Property_propertyType_idx" ON "Property"("propertyType");
CREATE UNIQUE INDEX IF NOT EXISTS "PropertyBooking_bookingCode_key" ON "PropertyBooking"("bookingCode");
CREATE INDEX IF NOT EXISTS "PropertyBooking_bookingCode_idx" ON "PropertyBooking"("bookingCode");
CREATE INDEX IF NOT EXISTS "PropertyBooking_createdAt_idx" ON "PropertyBooking"("createdAt");
CREATE INDEX IF NOT EXISTS "PropertyBooking_propertyId_idx" ON "PropertyBooking"("propertyId");
CREATE INDEX IF NOT EXISTS "PropertyBooking_status_idx" ON "PropertyBooking"("status");
CREATE INDEX IF NOT EXISTS "PropertyVisitRequest_createdAt_idx" ON "PropertyVisitRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "PropertyVisitRequest_propertyId_idx" ON "PropertyVisitRequest"("propertyId");
CREATE INDEX IF NOT EXISTS "PropertyVisitRequest_status_idx" ON "PropertyVisitRequest"("status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'CareerApplication_vacancyId_fkey'
  ) THEN
    ALTER TABLE "CareerApplication"
      ADD CONSTRAINT "CareerApplication_vacancyId_fkey"
      FOREIGN KEY ("vacancyId") REFERENCES "CareerVacancy"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'BusinessVerticalItem_categoryId_fkey'
  ) THEN
    ALTER TABLE "BusinessVerticalItem"
      ADD CONSTRAINT "BusinessVerticalItem_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "BusinessVerticalCategory"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
