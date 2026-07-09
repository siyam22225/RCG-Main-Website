import { prisma } from "@/lib/prisma";

export const defaultFormerChairmanProfileItems = [
  "Position | Chairman",
  "Education | B.Com (Hons), Management",
  "Profession | Businessman & Contractor",
  "Achievements | Recognized for leadership, dedication, and development vision.",
  "Business Activities | First Class Contractor in LGED & Roads & Highways department all over Dhaka City Corporation. (1981-2006)",
  "Legacy | A lasting contribution to structured growth and corporate trust.",
  "Personal Qualities | Known for integrity, vision, and commitment to excellence.",
  "Foreign Visit | India & KSA",
].join("\n");

export const defaultFormerChairmanMessageData = {
  isActive: true,
  name: "Former Chairman",
  designation: "",
  image: "/images/message/former-chairman.jpg",
  title: "Former Chairman Message",
  eyebrow: "Who We Are",
  introLead:
    "A vision for planned development, responsible growth, and reliable living opportunities for future generations.",
  articleLabel: "Message",
  articleHeading: "Building with vision, trust, and long-term responsibility.",
  messageBody: "",
  profileItems: defaultFormerChairmanProfileItems,
};

export function nonEmpty(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : undefined;
}

export function getEffectiveFormerChairmanMessage() {
  return prisma.formerChairmanMessage.findFirst({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getOrCreateEffectiveFormerChairmanMessage() {
  const existing = await getEffectiveFormerChairmanMessage();

  if (existing) return existing;

  return prisma.formerChairmanMessage.create({
    data: defaultFormerChairmanMessageData,
  });
}
