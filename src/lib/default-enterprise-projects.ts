import { rcPropertyProjects } from "@/data/rcPropertyProjects";
import { rcHoldingsProjects } from "@/data/rcHoldingsProjects";

export const DEFAULT_ENTERPRISE_PROJECT_KEYS = [
  ...rcPropertyProjects.map((project) => `land-rpcdl:${project.slug}`),
  ...rcHoldingsProjects.map((project) => `apartment-rchl:${project.slug}`),
];

export function isDefaultEnterpriseProject(
  enterpriseSlug: string,
  projectSlug: string
) {
  return DEFAULT_ENTERPRISE_PROJECT_KEYS.includes(`${enterpriseSlug}:${projectSlug}`);
}
