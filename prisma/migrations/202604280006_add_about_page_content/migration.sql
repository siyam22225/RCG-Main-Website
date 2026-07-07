CREATE TABLE IF NOT EXISTS "AboutPageContent" (
  "id" TEXT NOT NULL,
  "pageKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "paragraphs" JSONB NOT NULL DEFAULT '[]',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AboutPageContent_pageKey_key"
ON "AboutPageContent"("pageKey");

INSERT INTO "AboutPageContent"
  ("id", "pageKey", "title", "imageUrl", "paragraphs", "isActive")
VALUES
  (
    'about-corporate-profile',
    'corporate-profile',
    'Corporate Profile',
    '/images/corporate-profile.jpg',
    '[
      "Real Capita Group is a growing corporate organization committed to long-term development, structured planning, and value-driven enterprise expansion. The company focuses on building dependable projects, strengthening customer trust, and maintaining a professional business standard across its activities.",
      "Through its different business initiatives, Real Capita Group aims to create sustainable opportunities, improve service quality, and establish a strong institutional presence in the market. The organization continues to move forward with a vision of reliability, progress, and responsible growth."
    ]'::jsonb,
    true
  ),
  (
    'about-mission-vision-values',
    'mission-vision-values',
    'Mission Vision & Values',
    '/images/mission-vision-values.jpg',
    '[
      "Our mission is to develop trusted projects and business initiatives that create practical value for customers, partners, and communities. We work with a focus on service quality, long-term planning, and responsible growth.",
      "Our vision is to become a respected and dependable corporate group known for professional excellence, customer confidence, and sustainable progress. Our values are built on integrity, commitment, accountability, innovation, and continuous improvement."
    ]'::jsonb,
    true
  )
ON CONFLICT ("pageKey") DO NOTHING;
