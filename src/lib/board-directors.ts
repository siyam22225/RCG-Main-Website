import { prisma } from "@/lib/prisma";
import { directors as fallbackDirectors } from "@/data/directors";

export const CORE_DIRECTOR_SLUGS = [
  "mohammad-arifuzzaman",
  "manzur-ahammad-sohan",
  "ishtiak-al-mamoon",
  "palash-hendry-sen",
  "md-ali-haider",
  "rabaya-akhter",
  "tania-tanjia",
  "sushmita-islam",
];

export type BoardDirectorCard = {
  slug: string;
  profileEnabled: boolean;
  name: string;
  role: string;
  education: string;
  shortMessage: string;
  profileDetails: string;
  messageTitle: string;
  messageBody: string;
  showMessage: boolean;
  image: string;
  facebook: string;
  whatsapp: string;
};

function normalizeDirector(director: any): BoardDirectorCard {
  return {
    slug: director.slug,
    profileEnabled: Boolean(director.profileEnabled),
    name: director.name,
    role: director.role,
    education: director.education ?? "",
    shortMessage: director.shortMessage ?? "",
    profileDetails: director.profileDetails ?? "",
    messageTitle: director.messageTitle ?? "",
    messageBody: director.messageBody ?? "",
    showMessage: director.showMessage !== false,
    image: director.image ?? "/images/message/director-1.jpg",
    facebook: director.facebook ?? "#",
    whatsapp: director.whatsapp ?? "#",
  };
}

function isDirectorCard(director: BoardDirectorCard | null): director is BoardDirectorCard {
  return director !== null;
}

export async function getBoardDirectorCards(): Promise<BoardDirectorCard[]> {
  try {
    const boardDirectorModel = (prisma as any).boardDirector;

    if (!boardDirectorModel?.findMany) {
      return fallbackDirectors.map(normalizeDirector);
    }

    const dbRows = await boardDirectorModel.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });

    const dbBySlug = new Map(dbRows.map((director: any) => [director.slug, director]));
    const fallbackSlugs = new Set(fallbackDirectors.map((director) => director.slug));

    const baseDirectors = fallbackDirectors
      .map((fallbackDirector) => {
        const dbDirector = dbBySlug.get(fallbackDirector.slug);

        if ((dbDirector as any)?.isActive === false) return null;

        return normalizeDirector({
          ...fallbackDirector,
          ...((dbDirector as any) || {}),
        });
      })
      .filter(isDirectorCard);

    const extraDirectors = dbRows
      .filter((director: any) => !fallbackSlugs.has(director.slug))
      .filter((director: any) => director.isActive)
      .map((director: any) => normalizeDirector(director));

    return [...baseDirectors, ...extraDirectors];
  } catch {
    return fallbackDirectors.map(normalizeDirector);
  }
}