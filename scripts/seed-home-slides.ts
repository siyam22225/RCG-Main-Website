import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const homeSlides = [
  {
    title: "Real Capita Group",
    subtitle: "Reliable real estate and enterprise development.",
    imageUrl: "/images/hero/slide-1.jpg",
    buttonText: "Explore More",
    buttonHref: "/enterprise",
    sortOrder: 1,
    isActive: true,
  },
  {
    title: "RC Property",
    subtitle: "Planned property development with long-term value.",
    imageUrl: "/images/hero/slide-2.jpg",
    buttonText: "View Details",
    buttonHref: "/enterprise/land-rpcdl",
    sortOrder: 2,
    isActive: true,
  },
  {
    title: "RC Holdings",
    subtitle: "Residential and apartment-focused development.",
    imageUrl: "/images/hero/slide-3.jpg",
    buttonText: "View Details",
    buttonHref: "/enterprise/apartment-rchl",
    sortOrder: 3,
    isActive: true,
  },
  {
    title: "Real Capita Concerns",
    subtitle: "Explore our growing portfolio of business initiatives.",
    imageUrl: "/images/hero/slide-4.jpg",
    buttonText: "Our Concern",
    buttonHref: "/enterprise",
    sortOrder: 4,
    isActive: true,
  },
];

async function main() {
  const existingCount = await prisma.homeSlide.count();

  if (existingCount > 0) {
    console.log(`Home slides already exist. Count: ${existingCount}`);
    return;
  }

  await prisma.homeSlide.createMany({
    data: homeSlides,
  });

  console.log("Home slides seeded successfully.");
}

main()
  .catch((error) => {
    console.error("HOME_SLIDES_SEED_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });