import { prisma } from "@/lib/prisma";

export type AboutPageContent = {
  title: string;
  imageUrl: string;
  paragraphs: string[];
};

const fallbackContent: Record<string, AboutPageContent> = {
  "corporate-profile": {
    title: "Corporate Profile",
    imageUrl: "/images/corporate-profile.jpg",
    paragraphs: [
      "Real Capita Group is a diversified corporate organization built on a vision of responsible growth, dependable service, and long-term business value. The group brings together carefully developed ventures across real estate, hospitality, information technology, supply chain, and other strategic sectors under one professional platform.",
      "Real Capita Group brings together disciplined planning, dependable execution, and a forward-looking corporate vision under one growing business platform.",
      "With a strong focus on planning, quality, and customer confidence, Real Capita Group works to deliver projects and services that respond to practical market needs. Each concern operates with its own purpose while contributing to the wider strength, reputation, and future direction of the group.",
      "The organization emphasizes transparency, commitment, and continuous improvement in every area of its operation. By combining business discipline with a forward-looking mindset, Real Capita Group aims to build lasting relationships with customers, partners, and the communities it serves.",
    ],
  },
  "mission-vision-values": {
    title: "Mission Vision & Values",
    imageUrl: "/images/mission-vision-values.jpg",
    paragraphs: [
      "Our mission is to develop trusted projects and business initiatives that create practical value for customers, partners, and communities. We work with a focus on service quality, long-term planning, and responsible growth.",
      "Our vision is to become a respected and dependable corporate group known for professional excellence, customer confidence, and sustainable progress.",
      "Our values are built on integrity, commitment, accountability, innovation, and continuous improvement.",
    ],
  },
};

function normalizeParagraphs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function getAboutPageContent(
  pageKey: "corporate-profile" | "mission-vision-values"
): Promise<AboutPageContent> {
  try {
    const rows = await prisma.$queryRaw<
      {
        title: string;
        imageUrl: string;
        paragraphs: unknown;
        isActive: boolean;
      }[]
    >`
      SELECT "title", "imageUrl", "paragraphs", "isActive"
      FROM "AboutPageContent"
      WHERE "pageKey" = ${pageKey}
      LIMIT 1
    `;

    const row = rows[0];

    if (!row || row.isActive === false) return fallbackContent[pageKey];

    const paragraphs = normalizeParagraphs(row.paragraphs);

    return {
      title: row.title || fallbackContent[pageKey].title,
      imageUrl: row.imageUrl || fallbackContent[pageKey].imageUrl,
      paragraphs: paragraphs.length ? paragraphs : fallbackContent[pageKey].paragraphs,
    };
  } catch (error) {
    console.error("ABOUT_PAGE_CONTENT_ERROR", error);
    return fallbackContent[pageKey];
  }
}
