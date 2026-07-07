import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const directors = [
  {
    slug: "mohammad-arifuzzaman",
    name: "Mohammad Arifuzzaman",
    role: "Managing Director & CEO",
    education: "PhD, Research Fellow; M.S.S (Sociology), MBA (Marketing)",
    shortMessage: "We are committed to responsible growth, stronger planning, and better customer service across every initiative.",
    image: "/images/message/director-1.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: true,
    displayOrder: 1,
  },
  {
    slug: "manzur-ahammad-sohan",
    name: "Manzur Ahammad Sohan",
    role: "Deputy Managing Director",
    education: "Hafez (The Holy Quran)",
    shortMessage: "Our goal is to strengthen trust, professionalism, and long-term corporate excellence in every business decision.",
    image: "/images/message/director-2.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: true,
    displayOrder: 2,
  },
  {
    slug: "ishtiak-al-mamoon",
    name: "Ishtiak Al Mamoon",
    role: "Director (Business Development)",
    education: "Ph.D., SMIEEE, FIEB",
    shortMessage: "We focus on innovation, structured expansion, and value-driven opportunities for sustainable progress.",
    image: "/images/message/director-3.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 3,
  },
  {
    slug: "palash-hendry-sen",
    name: "Palash Hendry Sen",
    role: "Director (Administration)",
    education: "Administration and operational coordination",
    shortMessage: "Strong administration, discipline, and service standards are essential for maintaining corporate quality.",
    image: "/images/message/director-4.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 4,
  },
  {
    slug: "md-ali-haider",
    name: "Md Ali Haider",
    role: "Executive Director",
    education: "Executive leadership and field operations",
    shortMessage: "Execution quality and practical decision-making help us deliver projects with reliability and consistency.",
    image: "/images/message/director-5.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 5,
  },
  {
    slug: "rabaya-akhter",
    name: "Rabaya Akhter",
    role: "Director",
    education: "Corporate leadership and strategic support",
    shortMessage: "We believe modern organizations grow best when vision, commitment, and accountability work together.",
    image: "/images/message/director-6.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 6,
  },
  {
    slug: "tania-tanjia",
    name: "Tania Tanjia",
    role: "Director",
    education: "Business and organizational support",
    shortMessage: "Customer confidence, timely service, and long-term care remain central to our values.",
    image: "/images/message/director-7.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 7,
  },
  {
    slug: "sushmita-islam",
    name: "Sushmita Islam",
    role: "Director",
    education: "Corporate management and communications",
    shortMessage: "Our commitment is to maintain a dependable, people-focused, and future-oriented business culture.",
    image: "/images/message/director-8.jpg",
    facebook: "#",
    whatsapp: "#",
    profileEnabled: false,
    displayOrder: 8,
  },
];

for (const director of directors) {
  await prisma.boardDirector.upsert({
    where: { slug: director.slug },
    update: director,
    create: director,
  });
}

console.log("Board directors seeded successfully.");
await prisma.$disconnect();
