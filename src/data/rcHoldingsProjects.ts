export type RcHoldingsProjectMedia = {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  alt: string;
};

export type RcHoldingsProject = {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  media: RcHoldingsProjectMedia[];
  profilePdf: string;
  tour360Image?: string;
};

export const rcHoldingsProjects: RcHoldingsProject[] = [
  {
    id: 1,
    slug: "rc-maya-kanon-eco-village",
    name: "RC Maya Kanon Eco Village",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/enterprises/enterprise-6.jpg",
    shortDescription:
      "A planned apartment project focused on organized living, location value, and long-term residential comfort.",
    fullDescription: [
      "RC Maya Kanon Eco Village is a featured project under RC Holdings.",
      "The project focuses on modern residential planning, accessible location value, and dependable apartment development.",
      "It reflects Real Capita Group’s commitment to structured housing solutions and customer confidence.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/enterprises/enterprise-6.jpg",
        alt: "RC Maya Kanon Eco Village main image",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-4.jpg",
        alt: "RC Maya Kanon Eco Village gallery image",
      },
      {
        id: 3,
        type: "video",
        src: "/uploads/videos/1776976517322-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/enterprises/enterprise-6.jpg",
        alt: "RC Maya Kanon Eco Village project video",
      },
    ],
    profilePdf: "/voucher/lake-view-apartment-dhaka.pdf",
  },
  {
    id: 2,
    slug: "rc-priyojan-grihayan-prokolpo",
    name: "RC Priyojan Grihayan Prokolpo",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/enterprises/enterprise-6.jpg",
    shortDescription:
      "A residential housing project designed around practical planning, customer need, and sustainable growth.",
    fullDescription: [
      "RC Priyojan Grihayan Prokolpo is developed as a housing-focused initiative under RC Holdings.",
      "The project emphasizes planned residential facilities, dependable project structure, and long-term value.",
      "It supports the group’s broader goal of delivering practical and trustworthy housing opportunities.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/enterprises/enterprise-6.jpg",
        alt: "RC Priyojan Grihayan Prokolpo main image",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-2.jpg",
        alt: "RC Priyojan Grihayan Prokolpo gallery image",
      },
      {
        id: 3,
        type: "video",
        src: "/uploads/videos/1776970730823-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/enterprises/enterprise-6.jpg",
        alt: "RC Priyojan Grihayan Prokolpo project video",
      },
    ],
    profilePdf: "/voucher/commercial-space-gulshan.pdf",
  },
  {
    id: 3,
    slug: "rc-santi-kutir",
    name: "RC Santi Kutir",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/enterprises/enterprise-2.jpg",
    shortDescription:
      "A compact apartment development focused on peaceful residential living and reliable project planning.",
    fullDescription: [
      "RC Santi Kutir is a residential apartment project under RC Holdings.",
      "The project highlights peaceful living, location convenience, and organized apartment development.",
      "It adds value to the RC Holdings portfolio through practical design and dependable planning.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/enterprises/enterprise-2.jpg",
        alt: "RC Santi Kutir main image",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-1.jpg",
        alt: "RC Santi Kutir gallery image",
      },
      {
        id: 3,
        type: "video",
        src: "/uploads/videos/1776970769714-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/enterprises/enterprise-2.jpg",
        alt: "RC Santi Kutir project video",
      },
    ],
    profilePdf: "/voucher/family-apartment-mirpur.pdf",
  },
];