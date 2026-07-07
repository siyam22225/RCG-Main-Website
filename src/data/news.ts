export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  href: string;
  fullContent: string[];
};


export const newsItems: NewsItem[] = [
  {
    id: 1,
    slug: "project-and-customer-service-updates",
    title: "Project and customer service updates published",
    description:
      "Latest updates highlight progress, service improvement, and better communication with clients.",
    date: "March 5, 2026",
    image: "/images/news/news-1.jpg",
    href: "/media/project-and-customer-service-updates",
    fullContent: [
      "Real Capita Group has published new updates focused on project progress, customer communication, and service quality improvement.",
      "The latest communication highlights stronger coordination, better response handling, and a renewed focus on customer satisfaction.",
      "This initiative reflects the company’s effort to maintain trust, transparency, and a better long-term service experience.",
    ],
  },
  {
    id: 2,
    slug: "corporate-office-seasonal-campaign",
    title: "Corporate office announces seasonal campaign",
    description:
      "A new campaign has been introduced to improve brand visibility and customer engagement across channels.",
    date: "March 3, 2026",
    image: "/images/news/news-2.jpg",
    href: "/media/corporate-office-seasonal-campaign",
    fullContent: [
      "Real Capita Group has announced a new seasonal campaign to strengthen public engagement and brand communication.",
      "The campaign is designed to improve visibility, highlight key activities, and create stronger customer interaction.",
      "Officials said the initiative will support both awareness and long-term brand positioning across multiple channels.",
    ],
  },
  {
    id: 3,
    slug: "updated-service-commitments",
    title: "Real Capita shares updated service commitments",
    description:
      "The company published a fresh communication on service standards, transparency, and customer support.",
    date: "March 1, 2026",
    image: "/images/news/news-3.jpg",
    href: "/media/updated-service-commitments",
    fullContent: [
      "Real Capita Group has shared updated service commitments focused on support quality, transparency, and responsiveness.",
      "The new communication outlines a clearer approach to customer care and operational accountability.",
      "The group stated that better service consistency remains a priority for future growth and trust building.",
    ],
  },
  {
    id: 4,
    slug: "new-residential-initiative",
    title: "Real Capita launches a new residential initiative",
    description:
      "A new development update focused on premium living, better planning, and long-term value for customers.",
    date: "March 12, 2026",
    image: "/images/news/news-4.jpg",
    href: "/media/new-residential-initiative",
    fullContent: [
      "Real Capita Group has launched a new residential initiative aimed at premium living and improved community planning.",
      "The development emphasizes design quality, long-term value, and a better lifestyle environment for future residents.",
      "The company said this initiative reflects its broader commitment to quality urban development and modern housing standards.",
    ],
  },
  {
    id: 5,
    slug: "community-support-program",
    title: "Community support and social responsibility program",
    description:
      "Real Capita continues its community-focused initiatives through responsible corporate engagement.",
    date: "March 10, 2026",
    image: "/images/news/news-5.jpg",
    href: "/media/community-support-program",
    fullContent: [
      "Real Capita Group continues its community support initiatives through responsible social engagement and public welfare activities.",
      "The program is focused on meaningful impact, better outreach, and stronger social responsibility.",
      "Company representatives said such efforts remain an important part of the group’s long-term values.",
    ],
  },
  {
    id: 6,
    slug: "enterprise-milestone-announced",
    title: "New enterprise milestone announced",
    description:
      "The group expands its vision with a stronger enterprise strategy and improved business coordination.",
    date: "March 8, 2026",
    image: "/images/news/news-6.jpg",
    href: "/media/enterprise-milestone-announced",
    fullContent: [
      "Real Capita Group has announced a new enterprise milestone as part of its broader business growth strategy.",
      "The update reflects stronger coordination, expansion planning, and improved alignment across key operations.",
      "The company described the milestone as a positive step toward sustainable long-term growth.",
    ],
  },
];