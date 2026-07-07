import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const enterprises = [
  {
    sortOrder: 1,
    slug: "land-rpcdl",
    name: "RC Property",
    location: "Abdullahpur, Keranigonj, Dhaka",
    imageUrl: "/images/enterprises/enterprise-1.jpg",
    description: [
      "Land RPCDL is one of the notable enterprise projects under Real Capita Group.",
      "The project focuses on location strength, planning quality, and long-term development value.",
      "It reflects the company’s broader commitment to organized and dependable project development.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
  {
    sortOrder: 2,
    slug: "apartment-rchl",
    name: "RC Holdings",
    location: "Rupgonj, Narayangonj",
    imageUrl: "/images/enterprises/enterprise-2.jpg",
    description: [
      "Apartment RCHL is positioned as a long-term development opportunity.",
      "The project emphasizes accessibility, planning, and future value.",
      "It contributes to the growing enterprise portfolio of Real Capita Group.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
  {
    sortOrder: 3,
    slug: "hotel-rc-bay",
    name: "RC-BAY",
    location: "Sreenagar, Munshiganj",
    imageUrl: "/images/enterprises/enterprise-3.jpg",
    description: [
      "Hotel RC-BAY is designed with a clear focus on project identity and development promise.",
      "The enterprise supports the company’s wider strategy of quality project expansion.",
      "It is planned to create practical and long-term value.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
  {
    sortOrder: 4,
    slug: "resda",
    name: "RESDA",
    location: "Dhaka Region",
    imageUrl: "/images/enterprises/enterprise-4.jpg",
    description: [
      "RC Swapnil City represents a structured enterprise initiative.",
      "The project highlights better planning, customer confidence, and growth opportunity.",
      "It remains an important part of the enterprise ecosystem of the group.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
  {
    sortOrder: 5,
    slug: "afsen-group",
    name: "AFSEN Construction",
    location: "Kuakata, Patuakhali",
    imageUrl: "/images/enterprises/enterprise-5.jpg",
    description: [
      "AFSEN Group is a location-based enterprise project under Real Capita Group.",
      "The project focuses on positioning, project value, and brand distinction.",
      "It adds diversity and range to the company’s development portfolio.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
  {
    sortOrder: 6,
    slug: "abdf",
    name: "ABD Foundation",
    location: "Abdullahpur, Keranigonj, Dhaka",
    imageUrl: "/images/enterprises/enterprise-6.jpg",
    description: [
      "ABDF reflects a structured and planned development direction.",
      "The enterprise is designed to support dependable project growth and customer trust.",
      "It aligns with the group’s long-term development goals.",
    ].join("\n\n"),
    buttonText: "Visit Website",
    buttonHref: "https://example.com",
    profileUrl: "",
    isActive: true,
  },
];

async function main() {
  for (const enterprise of enterprises) {
    await prisma.enterprise.upsert({
      where: { slug: enterprise.slug },
      update: enterprise,
      create: enterprise,
    });
  }

  console.log("Enterprise concerns seeded successfully.");
}

main()
  .catch((error) => {
    console.error("ENTERPRISE_SEED_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });