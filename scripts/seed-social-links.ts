import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    iconUrl: "/images/social/facebook.svg",
    sortOrder: 1,
    isActive: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    iconUrl: "/images/social/instagram.svg",
    sortOrder: 2,
    isActive: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    iconUrl: "/images/social/youtube.svg",
    sortOrder: 3,
    isActive: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    iconUrl: "/images/social/linkedin.svg",
    sortOrder: 4,
    isActive: true,
  },
  {
    label: "Twitter",
    href: "https://x.com/",
    iconUrl: "/images/social/twitter.svg",
    sortOrder: 5,
    isActive: true,
  },
];

async function main() {
  for (const item of socialLinks) {
    await prisma.socialLink.upsert({
      where: { label: item.label },
      update: item,
      create: item,
    });
  }

  console.log("Social links seeded successfully.");
}

main()
  .catch((error) => {
    console.error("SOCIAL_LINKS_SEED_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });