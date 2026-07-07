export type RcPropertyProjectMedia = {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  alt: string;
};

export type RcPropertyProject = {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  media: RcPropertyProjectMedia[];
  profilePdf: string;
  tour360Image?: string;
};

export const rcPropertyProjects: RcPropertyProject[] = [
  {
    id: 1,
    slug: "rc-maya-kanon",
    name: "RC Maya Kanon",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/rc-property-projects/rc-maya-kanon.jpg",
    shortDescription:
      "A planned residential land project focused on organized development and long-term location value.",
    fullDescription: [
      "RC Maya Kanon is a selected RC Property project located in Abdullahpur, Keranigonj, Dhaka.",
      "The project is positioned with a focus on planned land development, accessibility, and future residential value.",
      "It reflects Real Capita Group’s commitment to structured project planning, customer confidence, and dependable development.",
    ],
    media: [
      {
       
  id: 1,
  type: "image",
  src: "/images/rc-property-projects/rc-maya-kanon.jpg",
  alt: "RC Maya Kanon main project image",
},
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-1.jpg",
        alt: "RC Maya Kanon project layout image",
      },
      {
        id: 3,
        type: "image",
        src: "/images/enterprises/enterprise-1.jpg",
        alt: "RC Maya Kanon project location image",
      },
      {
        id: 4,
        type: "video",
        src: "/uploads/videos/1776970698427-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/rc-property-projects/rc-maya-kanon.jpg",
        alt: "RC Maya Kanon project video",
      },
    ],
    profilePdf: "/voucher/lake-view-apartment-dhaka.pdf",
    tour360Image: "/images/rc-property-projects/rc-maya-kanon.jpg",
  },
  {
    id: 2,
    slug: "rc-rivery-village",
    name: "RC Rivery Village",
    location: "Rupgonj, Narayangonj",
    image: "/images/rc-property-projects/rc-rivery-village.jpg",
    shortDescription:
      "A location-focused project near the Rupgonj area with practical development potential.",
    fullDescription: [
      "RC Rivery Village is designed as a location-oriented project under the RC Property portfolio.",
      "The project highlights organized planning, environmental appeal, and long-term land value.",
      "It supports the group’s broader aim of creating reliable and practical real estate opportunities.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/rc-property-projects/rc-rivery-village.jpg",
        alt: "RC Rivery Village project view",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-2.jpg",
        alt: "RC Rivery Village project layout image",
      },
      {
        id: 3,
        type: "image",
        src: "/images/enterprises/enterprise-2.jpg",
        alt: "RC Rivery Village project location image",
      },
      {
        id: 4,
        type: "video",
        src: "/uploads/videos/1776970739031-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/rc-property-projects/rc-rivery-village.jpg",
        alt: "RC Rivery Village project video",
      },
    ],
    profilePdf: "/voucher/commercial-space-gulshan.pdf",
  },
  {
    id: 3,
    slug: "rc-south-valley",
    name: "RC South Valley",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/rc-property-projects/rc-south-valley.jpg",
    shortDescription:
      "A planned development project created around accessibility, layout quality, and future growth.",
    fullDescription: [
      "RC South Valley is one of the featured projects under RC Property.",
      "The project focuses on location strength, organized land use, and dependable development planning.",
      "It is presented as part of Real Capita Group’s continuous effort to build structured and value-driven projects.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/rc-property-projects/rc-south-valley.jpg",
        alt: "RC South Valley project view",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-3.jpg",
        alt: "RC South Valley project layout image",
      },
      {
        id: 3,
        type: "image",
        src: "/images/enterprises/enterprise-1.jpg",
        alt: "RC South Valley project location image",
      },
      {
        id: 4,
        type: "video",
        src: "/uploads/videos/1776970794056-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/rc-property-projects/rc-south-valley.jpg",
        alt: "RC South Valley project video",
      },
    ],
    profilePdf: "/voucher/family-apartment-mirpur.pdf",
  },
  {
    id: 4,
    slug: "rc-bondhujon-abashon",
    name: "RC Bondhujon Abashon",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/rc-property-projects/rc-bondhujon-abashon.jpg",
    shortDescription:
      "A residential-focused project built around community, planning, and sustainable growth.",
    fullDescription: [
      "RC Bondhujon Abashon is a residential project under the RC Property concern.",
      "The project emphasizes community-focused planning, practical location value, and customer trust.",
      "It strengthens the company’s real estate portfolio with a focus on responsible and organized development.",
    ],
    media: [
      {
        id: 1,
        type: "image",
        src: "/images/rc-property-projects/rc-bondhujon-abashon.jpg",
        alt: "RC Bondhujon Abashon project view",
      },
      {
        id: 2,
        type: "image",
        src: "/images/hero/slide-4.jpg",
        alt: "RC Bondhujon Abashon project layout image",
      },
      {
        id: 3,
        type: "image",
        src: "/images/enterprises/enterprise-1.jpg",
        alt: "RC Bondhujon Abashon project location image",
      },
      {
        id: 4,
        type: "video",
        src: "/uploads/videos/1776971242477-whatsapp-video-2026-04-24-at-00.56.38.mp4",
        thumbnail: "/images/rc-property-projects/rc-bondhujon-abashon.jpg",
        alt: "RC Bondhujon Abashon project video",
      },
    ],
    profilePdf: "/voucher/green-city-residential-plot.pdf",
  },
];