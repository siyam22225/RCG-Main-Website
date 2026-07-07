export type EnterpriseItem = {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  website: string;
};

export const enterpriseItems: EnterpriseItem[] = [
  {
    id: 1,
    slug: "land-rpcdl",
    name: "RC Property",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/enterprises/enterprise-1.jpg",
    shortDescription: "A modern enterprise project with strong location value.",
    fullDescription: [
      "Land RPCDL is one of the notable enterprise projects under Real Capita Group.",
      "The project focuses on location strength, planning quality, and long-term development value.",
      "It reflects the company’s broader commitment to organized and dependable project development."
    ],
    website: "https://example.com"
  },
  {
    id: 2,
    slug: "apartment-rchl",
    name: " RC Holdings ",
    location: "Rupgonj, Narayangonj",
    image: "/images/enterprises/enterprise-2.jpg",
    shortDescription: "A promising enterprise development in a strategic area.",
    fullDescription: [
      "Apartment RCHL is positioned as a long-term development opportunity.",
      "The project emphasizes accessibility, planning, and future value.",
      "It contributes to the growing enterprise portfolio of Real Capita Group."
    ],
    website: "https://example.com"
  },
  {
    id: 3,
    slug: "hotel-rc-bay",
    name: " RC-BAY",
    location: "Sreenagar, Munshiganj",
    image: "/images/enterprises/enterprise-3.jpg",
    shortDescription: "A location-focused enterprise with future growth potential.",
    fullDescription: [
      "Hotel RC-BAY is designed with a clear focus on project identity and development promise.",
      "The enterprise supports the company’s wider strategy of quality project expansion.",
      "It is planned to create practical and long-term value."
    ],
    website: "https://example.com"
  },
  {
    id: 4,
    slug: "resda",
    name: "RESDA",
    location: "Dhaka Region",
    image: "/images/enterprises/enterprise-4.jpg",
    shortDescription: "An organized development initiative with strong appeal.",
    fullDescription: [
      "RC Swapnil City represents a structured enterprise initiative.",
      "The project highlights better planning, customer confidence, and growth opportunity.",
      "It remains an important part of the enterprise ecosystem of the group."
    ],
    website: "https://example.com"
  },
  {
    id: 5,
    slug: "afsen-group",
    name: "AFSEN Construction",
    location: "Kuakata, Patuakhali",
    image: "/images/enterprises/enterprise-5.jpg",
    shortDescription: "A distinctive enterprise with a strong location-driven identity.",
    fullDescription: [
      "AFSEN Group is a location-based enterprise project under Real Capita Group.",
      "The project focuses on positioning, project value, and brand distinction.",
      "It adds diversity and range to the company’s development portfolio."
    ],
    website: "https://example.com"
  },
  {
    id: 6,
    slug: "abdf",
    name: "ABD Foundation",
    location: "Abdullahpur, Keranigonj, Dhaka",
    image: "/images/enterprises/enterprise-6.jpg",
    shortDescription: "A planned enterprise project focused on practical value.",
    fullDescription: [
      "ABDF reflects a structured and planned development direction.",
      "The enterprise is designed to support dependable project growth and customer trust.",
      "It aligns with the group’s long-term development goals."
    ],
    website: "https://example.com"
  }
];