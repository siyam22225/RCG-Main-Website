import { prisma } from "@/lib/prisma";
import { rcPropertyProjects } from "@/data/rcPropertyProjects";
import { rcHoldingsProjects } from "@/data/rcHoldingsProjects";

export type EnterpriseProjectCard = {
  id?: number | string;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  media: {
    id: number;
    type: "image" | "video";
    src: string;
    thumbnail?: string;
    alt: string;
  }[];
  profilePdf: string;
  layoutPdf?: string;
  websiteUrl?: string;
  tour360Image?: string;
};

const fallbackProjects: Record<string, EnterpriseProjectCard[]> = {
  "land-rpcdl": rcPropertyProjects,
  "rc-property": rcPropertyProjects,
  "apartment-rchl": rcHoldingsProjects,
  "rc-holdings": rcHoldingsProjects,
};

/*
  Public page slugs and admin Business Vertical sub-category slugs
  are not identical for these two legacy sections:

  Public page:
  - land-rpcdl
  - apartment-rchl

  Admin featured-project save slug:
  - rc-property
  - rc-holdings

  Public project loading must therefore read both accepted sources.
*/
const projectSourceSlugs: Record<string, string[]> = {
  "land-rpcdl": ["land-rpcdl", "rc-property"],
  "rc-property": ["rc-property", "land-rpcdl"],
  "apartment-rchl": ["apartment-rchl", "rc-holdings"],
};

function getProjectSourceSlugs(enterpriseSlug: string) {
  return projectSourceSlugs[enterpriseSlug] ?? [enterpriseSlug];
}

function normalizeProject(project: any): EnterpriseProjectCard {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    location: project.location ?? "",
    image: project.image ?? "",
    shortDescription: project.shortDescription ?? "",
    fullDescription: Array.isArray(project.fullDescription)
      ? project.fullDescription
      : [],
    media: Array.isArray(project.media) ? project.media : [],
    profilePdf: project.profilePdf ?? "",
    layoutPdf: project.layoutPdf ?? "",
    websiteUrl: project.websiteUrl ?? "",
    tour360Image: project.tour360Image ?? "",
  };
}

function buildPreferredProjectMap(rows: any[], preferredEnterpriseSlug: string) {
  const dbBySlug = new Map<string, any>();

  for (const row of rows) {
    const existing = dbBySlug.get(row.slug);

    if (!existing) {
      dbBySlug.set(row.slug, row);
      continue;
    }

    const existingIsPreferred =
      existing.enterpriseSlug === preferredEnterpriseSlug;
    const rowIsPreferred =
      row.enterpriseSlug === preferredEnterpriseSlug;

    if (!existingIsPreferred && rowIsPreferred) {
      dbBySlug.set(row.slug, row);
    }
  }

  return dbBySlug;
}

export async function getEnterpriseProjects(enterpriseSlug: string) {
  const fallback = fallbackProjects[enterpriseSlug] ?? [];
  const sourceSlugs = getProjectSourceSlugs(enterpriseSlug);

  try {
    const rows = await prisma.enterpriseProject.findMany({
      where: {
        enterpriseSlug: {
          in: sourceSlugs,
        },
        isActive: true,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });

    /*
      New/dynamic Business Vertical sub-categories do not have static fallback
      project packs. For them, the public page must render the active DB rows
      directly.
    */
    if (fallback.length === 0) {
      return rows.map(normalizeProject);
    }

    const dbBySlug = buildPreferredProjectMap(rows, enterpriseSlug);
    const fallbackSlugs = new Set(fallback.map((project) => project.slug));

    const baseProjects = fallback
      .map((project) => {
        const dbProject = dbBySlug.get(project.slug);
        if (dbProject?.isActive === false) return null;
        return normalizeProject({ ...project, ...(dbProject || {}) });
      })
      .filter(Boolean) as EnterpriseProjectCard[];

    const extraProjects = Array.from(dbBySlug.values())
      .filter((row) => !fallbackSlugs.has(row.slug))
      .map(normalizeProject);

    return [...baseProjects, ...extraProjects];
  } catch (error) {
    console.error("Enterprise projects DB load failed. Using fallback.", error);
    return fallback;
  }
}

export async function getEnterpriseProject(
  enterpriseSlug: string,
  projectSlug: string
) {
  const projects = await getEnterpriseProjects(enterpriseSlug);
  return projects.find((project) => project.slug === projectSlug) ?? null;
}