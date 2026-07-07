import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const offices = [
  {
    key: "corporate-office",
    title: "Corporate Office",
    address:
      "House# 05, Flat# C-4 & C-5, Road# 21, Gulshan-1, Dhaka-1212, Bangladesh",
    phone: "Tel: +88-02-226600699",
    email: "realcapita89@gmail.com",
    mapUrl: "",
    sortOrder: 1,
    isActive: true,
  },
  {
    key: "sales-office",
    title: "Sales Office",
    address:
      "Level-19, Nafi Tower, 53, Gulshan-Avenue, Gulshan-1, Dhaka-1212, Bangladesh",
    phone: "Tel: +88-02-8833232",
    email: "realcapita54@gmail.com",
    mapUrl: "",
    sortOrder: 2,
    isActive: true,
  },
];

async function main() {
  for (const office of offices) {
    await prisma.officeSetting.upsert({
      where: { key: office.key },
      update: office,
      create: office,
    });
  }

  console.log("Office settings seeded successfully.");
}

main()
  .catch((error) => {
    console.error("OFFICE_SETTINGS_SEED_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });