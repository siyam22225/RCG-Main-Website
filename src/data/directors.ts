export type DirectorSection = {
  title: string;
  items: string[];
};

export type DirectorProfile = {
  slug: string;
  profileEnabled: boolean;
  name: string;
  role: string;
  education: string;
  shortMessage: string;
  image: string;
  facebook: string;
  whatsapp: string;
  phone?: string;
  emails?: string[];
  socialLabels?: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  overview?: string[];
  messageTitle?: string;
  messageParagraphs?: string[];
  sections?: DirectorSection[];
};

export const directors: DirectorProfile[] = [
  {
    slug: "mohammad-arifuzzaman",
    profileEnabled: true,
    name: "Mohammad Arifuzzaman",
    role: "Managing Director & CEO",
    education: "PhD, Research Fellow; M.S.S (Sociology), MBA (Marketing)",
    shortMessage:
      "We are committed to responsible growth, stronger planning, and better customer service across every initiative.",
    image: "/images/message/director-1.jpg",
    facebook: "#",
    whatsapp: "#",
    phone: "088-02-9898707",
    emails: ["msd.mazaman@gmail.com", "md@rcgcbd.com"],
    socialLabels: {
      facebook: "Mohammad Arifuzzaman",
      linkedin: "Mohammad Arifuzzaman",
      youtube: "Mohammad Arifuzzaman",
    },
    overview: [
      "Throughout my Nineteen (19+) years I have experience in the Banking & Real Estate Sector as well in a Sales & Marketing department in different companies. Through successful management of both internal & external relationships, I have accelerated the achievement of my goals & established myself as a valuable resource in a variety of situations. Now I have taken up a leadership role as the Managing Director & CEO at Real Capita Group of Companies since the year 2017.",
      "At Real Capita Group of Companies, we believe in sustainable housing solutions, smart cities, community products & services. Our commitment to our stakeholders makes us one of the fastest growing companies in Bangladesh & abroad.",
    ],
    messageTitle: "Managing Director’s Message",
    messageParagraphs: [
      "First and foremost, I would like to thank all our shareholders, partners, clients and employees for your continued support, faith and trust in Real Capita Group. We have successfully garnered your support, which has allowed us to grow to where we are now. As Henry Ford once said: “Coming together is a beginning. Keeping together is progress. Working together is success.” With The Almighty by our side, we will continually strive to grow and provide everyone with the very best.",
      "The housing scene in Bangladesh has changed rapidly in the past few years. We have been blessed with a rapidly growing economy, which brings along with it a lot of migration. The greater Dhaka Metropolitan area has faced a huge challenge in meeting the demand for housing which is why we are creating mega satellite cities right outside the outskirts of the city with access to all the amenities allowing people to work in Dhaka and come back to their dream homes. We cater to everyone regardless of their income because we manage not just housing, we manage people’s dreams.",
      "As the Managing Director of Real Capita Group, I have seen this company progress. Our approach to our business is to be customer-centric, pairing the right people with the right properties. This is done by our team members who work hard, are extremely determined and possess the necessary experience and foresight which gives us an edge over our competitors and is what creates the real difference between Real Capita Group and our competitors.",
      "Real Capita Group is in the execution stage of many large-scale, exciting projects. We do not just provide land, we create, in essence, metropolises. We want to be recognized by our pursuit of quality. With proven records in our motherland, Bangladesh, we have expanded our horizons and are moving our operations internationally.",
      "With you, our esteemed shareholders, clients, partners and our beloved staff, Real Capita Group has really taken off. Success we have had; more success we will acquire. With your continued support and with Allah by our side, we will, God willing, make it further.",
      "Thank you to all of you and may we rise to new heights, together.",
    ],
    sections: [
      {
        title: "Education",
        items: [
          "PhD (Research Fellow), Real Estate and Property Management",
          "B.A (Marketing)",
          "S.S (Sociology)",
        ],
      },
      {
        title: "Profession",
        items: ["Business & Consultancy"],
      },
      {
        title: "Achievements",
        items: [
          "The Influential Young Millionaires in Bangladesh (Business American Magazine-2021)",
          "Best Business Social Innovator Award 2019",
          "Mother Terrassa Award achieved in 2016 as a special contributor in the Real Estate Marketing Sector",
          "Ekushei Award achieved in 2017 as a special contributor in the Real Estate Marketing Sector",
          "Peace Ambassador of the Youth Club of Bangladesh",
          "Member of E-Club",
          "Joint Secretary General of DD-REG Fair",
          "FBCCI Standing Committee on Real Estate Housing",
          "REHAB Standing Committee Local & International Fair",
          "Member of DCCI",
        ],
      },
      {
        title: "Social Activities",
        items: [
          "Member of Rotary International, Dist-3281",
          "Member of Manikgonj Zilla Somity",
          "Member of Ghior Somity",
          "Life time Member of Rodevu Foundation 96’98",
          "Founder Member of DEXSA’96",
          "Life time Member of Rondezous Foundation 96’98",
          "SDG Action partner of United Nations",
        ],
      },
      {
        title: "Sponsor",
        items: ["Abul Basher Foundation", "Shomormita Foundation"],
      },
      {
        title: "Business Activities",
        items: [
          "Managing Director & CEO of RC Property Development Limited",
          "RC Holdings Limited",
          "Real Capita Trade International",
          "Afseen Construction",
          "Afseen Agro & Firm",
          "Rural Economy Skill Development Academy (RESDA)",
          "RCG Global Trade LLC",
          "ATG Technical Service",
          "RC TentMartin, a Beach resort at Sant Martin",
        ],
      },
      {
        title: "Foreign Visit",
        items: [
          "India, Bahrain, Malaysia, Singapore, Thailand, Italy, Switzerland, China, Vietnam, UAE, KSA, Nepal, Australia, Qatar, Oman, Turkey, Egypt etc.",
        ],
      },
    ],
  },
 {
  slug: "manzur-ahammad-sohan",
  profileEnabled: true,
  name: "Manzur Ahammad Sohan",
  role: "Deputy Managing Director",
  education: "Hafez (The Holy Quran)",
  shortMessage:
    "Our goal is to strengthen trust, professionalism, and long-term corporate excellence in every business decision.",
  image: "/images/message/director-2.jpg",
  facebook: "#",
  whatsapp: "#",
  phone: "01713858616",
  emails: ["ahammadsohan@gmail.com"],
  socialLabels: {
    facebook: "Manzur Ahammad Sohan",
  },
  overview: [
    "Manzur Ahammad Sohan serves Real Capita Group with a focus on business leadership, organizational growth, and long-term corporate development. His work supports the group’s real estate, trading, consultancy, and hospitality-related business activities.",
  ],
  messageTitle: "Deputy Managing Director’s Message",
  messageParagraphs: [
    "Our goal is to strengthen trust, professionalism, and long-term corporate excellence in every business decision.",
    "Real Capita Group moves forward with a commitment to responsible planning, dependable service, and sustainable business growth.",
  ],
  sections: [
    {
      title: "Education",
      items: ["Hafez (The Holy Quran)"],
    },
    {
      title: "Profession",
      items: ["Businessman"],
    },
    {
      title: "Achievements",
      items: [
        "Member of Dhaka Kagoj Bebshai Bohumukhi Shomobay Somity Ltd. (DKBBS)",
        "Elected General Secretary of Bangladesh Papers Merchant Association",
        "Member of FBCCI",
        "Patron Member of Dhaka Somity",
        "Parents Representative of Sallimullah College",
        "Vice President of Best Boys Club",
        "Member of Rotary International, Dist-3281",
      ],
    },
    {
      title: "Business Activities",
      items: [
        "Deputy Managing Director of RC Property Development Limited",
        "Deputy Managing Director of RC Holdings Limited",
        "Deputy Managing Director of Real Capita Developers Ltd.",
        "Managing Partner of Real Capita Trade International",
        "Managing Partner of AIM Consultancy & Tours",
        "Managing Partner of RC Bihan, a Royal dusai resort at Sajek",
        "Managing Partner of RC TentMartin, a Beach resort at Sant Martin",
      ],
    },
    {
      title: "International Visit",
      items: [
        "India, Malaysia, Singapore, Thailand, Vietnam, Indonesia, Saudi Arabia (KSA), Dubai etc.",
      ],
    },
  ],
},
  {
    slug: "ishtiak-al-mamoon",
    profileEnabled: false,
    name: "Ishtiak Al Mamoon",
    role: "Director (Business Development)",
    education: "Ph.D., SMIEEE, FIEB",
    shortMessage:
      "We focus on innovation, structured expansion, and value-driven opportunities for sustainable progress.",
    image: "/images/message/director-3.jpg",
    facebook: "#",
    whatsapp: "#",
  },
  {
    slug: "palash-hendry-sen",
    profileEnabled: false,
    name: "Palash Hendry Sen",
    role: "Director (Administration)",
    education: "Administration and operational coordination",
    shortMessage:
      "Strong administration, discipline, and service standards are essential for maintaining corporate quality.",
    image: "/images/message/director-4.jpg",
    facebook: "#",
    whatsapp: "#",
  },
  {
    slug: "md-ali-haider",
    profileEnabled: false,
    name: "Md Ali Haider",
    role: "Executive Director",
    education: "Executive leadership and field operations",
    shortMessage:
      "Execution quality and practical decision-making help us deliver projects with reliability and consistency.",
    image: "/images/message/director-5.jpg",
    facebook: "#",
    whatsapp: "#",
  },
  {
    slug: "rabaya-akhter",
    profileEnabled: false,
    name: "Rabaya Akhter",
    role: "Director",
    education: "Corporate leadership and strategic support",
    shortMessage:
      "We believe modern organizations grow best when vision, commitment, and accountability work together.",
    image: "/images/message/director-6.jpg",
    facebook: "#",
    whatsapp: "#",
  },
  {
    slug: "tania-tanjia",
    profileEnabled: false,
    name: "Tania Tanjia",
    role: "Director",
    education: "Business and organizational support",
    shortMessage:
      "Customer confidence, timely service, and long-term care remain central to our values.",
    image: "/images/message/director-7.jpg",
    facebook: "#",
    whatsapp: "#",
  },
  {
    slug: "sushmita-islam",
    profileEnabled: false,
    name: "Sushmita Islam",
    role: "Director",
    education: "Corporate management and communications",
    shortMessage:
      "Our commitment is to maintain a dependable, people-focused, and future-oriented business culture.",
    image: "/images/message/director-8.jpg",
    facebook: "#",
    whatsapp: "#",
  },
];

export function getDirectorBySlug(slug: string) {
  return directors.find((director) => director.slug === slug);
}
