import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { enterpriseItems } from "@/data/enterprises";
import { getEnterpriseProjects } from "@/lib/enterprise-projects";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

type EnterpriseDetails = {
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  website: string;
  buttonText: string;
  profileUrl?: string | null;
};

type ProjectItem = {
  slug: string;
  name: string;
  location: string;
  image: string;
};

function splitDescription(description: string) {
  return description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

async function getEnterprise(slug: string): Promise<EnterpriseDetails | null> {
  try {
    const businessVerticalItem = await prisma.businessVerticalItem.findFirst({
      where: {
        enterpriseSlug: slug,
        isActive: true,
      },
      select: {
        enterpriseSlug: true,
        label: true,
        description: true,
        imageUrl: true,
        location: true,
        websiteUrl: true,
      },
    });

    if (businessVerticalItem?.enterpriseSlug) {
      const description =
        businessVerticalItem.description?.trim() ||
        `${businessVerticalItem.label} is a business vertical of Real Capita Group.`;

      const paragraphs = splitDescription(description);

      return {
        slug: businessVerticalItem.enterpriseSlug,
        name: businessVerticalItem.label,
        location: businessVerticalItem.location || "",
        image:
          businessVerticalItem.imageUrl ||
          "/images/enterprises/enterprise-1.jpg",
        shortDescription: paragraphs[0] || description,
        fullDescription: paragraphs.length > 0 ? paragraphs : [description],
        website: businessVerticalItem.websiteUrl || "#",
        buttonText: "Visit Website",
        profileUrl: null,
      };
    }
  } catch (error) {
    console.error("BUSINESS_VERTICAL_ITEM_DETAIL_DYNAMIC_ERROR", error);
  }

  try {
    const item = await prisma.enterprise.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        slug: true,
        name: true,
        description: true,
        imageUrl: true,
        location: true,
        buttonText: true,
        buttonHref: true,
        profileUrl: true,
      },
    });

    if (item) {
      const paragraphs = splitDescription(item.description);

      return {
        slug: item.slug,
        name: item.name,
        location: item.location || "",
        image: item.imageUrl || "/images/enterprises/enterprise-1.jpg",
        shortDescription: paragraphs[0] || item.description,
        fullDescription: paragraphs.length > 0 ? paragraphs : [item.description],
        website: item.buttonHref || "#",
        buttonText: item.buttonText || "Visit Website",
        profileUrl: item.profileUrl,
      };
    }
  } catch (error) {
    console.error("ENTERPRISE_DETAIL_DYNAMIC_ERROR", error);
  }

  const fallback = enterpriseItems.find((item) => item.slug === slug);

  if (!fallback) return null;

  return {
    slug: fallback.slug,
    name: fallback.name,
    location: fallback.location,
    image: fallback.image,
    shortDescription: fallback.shortDescription,
    fullDescription: fallback.fullDescription,
    website: fallback.website,
    buttonText: "Visit Website",
    profileUrl: null,
  };
}

export default async function EnterpriseDetailsPage({ params }: Props) {
  const { slug } = await params;
  console.log("BV_DEBUG slug:", slug);
  const enterprise = await getEnterprise(slug);
  console.log("BV_DEBUG enterprise result:", enterprise ? enterprise.slug : null);

  if (!enterprise) {
    console.log("BV_DEBUG notFound triggered for slug:", slug);
    notFound();
  }

  const projectItems: ProjectItem[] = await getEnterpriseProjects(enterprise.slug);
  const projectSectionTitle = `${enterprise.name} Projects`;
  const projectSectionDescription = `Explore selected ${enterprise.name} projects, featured developments, and active business initiatives.`;
  const hasWebsite = Boolean(enterprise.website && enterprise.website !== "#");
  const hasProfile = Boolean(enterprise.profileUrl);

  return (
    <section className="enterpriseDetailPage"><style>{`
        .enterpriseDetailPage {
          min-height: 100vh;
          padding: 64px 0 96px;
          color: #0f172a;
          background:
            radial-gradient(circle at 10% 0%, rgba(14, 165, 233, 0.16), transparent 30%),
            radial-gradient(circle at 92% 20%, rgba(34, 197, 94, 0.14), transparent 32%),
            linear-gradient(180deg, #f8fbfd 0%, #eef8fb 50%, #ecfff5 100%);
        }

        .enterpriseShell {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 10px 14px;
          border-radius: 999px;
          color: #15803d;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(22, 163, 74, 0.14);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
        }

        .enterpriseHero {
          overflow: hidden;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.14);
          backdrop-filter: blur(14px);
        }

        .heroImageWrap {
          position: relative;
          height: 430px;
          overflow: hidden;
          background: #dbeafe;
        }

        .heroImage {
          object-fit: cover;
          transform: scale(1.01);
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.48)),
            linear-gradient(90deg, rgba(2, 6, 23, 0.42), transparent 58%);
        }

        .heroBadgeRow {
          position: absolute;
          left: 30px;
          right: 30px;
          bottom: 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #ffffff;
        }

        .heroBadgeRow span,
        .heroBadgeRow strong {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 15px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.24);
          backdrop-filter: blur(12px);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .heroContent {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 34px;
          padding: 44px;
        }

        .eyebrow {
          display: inline-flex;
          margin-bottom: 12px;
          color: #16a34a;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .heroText h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(42px, 6vw, 70px);
          line-height: 0.95;
          letter-spacing: -0.075em;
          font-weight: 950;
        }

        .locationLine {
          margin: 16px 0 0;
          color: #075c9d;
          font-size: 15px;
          font-weight: 900;
        }

        .leadText {
          max-width: 820px;
          margin: 26px 0 0;
          color: #334155;
          font-size: 19px;
          line-height: 1.85;
          font-weight: 700;
        }

        .descriptionStack {
          max-width: 820px;
          margin-top: 20px;
          display: grid;
          gap: 14px;
        }

        .descriptionStack p {
          margin: 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.9;
          font-weight: 550;
        }

        .actionRow {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .primaryAction,
        .secondaryAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 26px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .primaryAction {
          color: #ffffff;
          background: linear-gradient(135deg, #075c9d, #16a34a);
          box-shadow: 0 16px 34px rgba(7, 92, 157, 0.22);
        }

        .secondaryAction {
          color: #0f172a;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.12);
        }

        .infoPanel {
          display: grid;
          gap: 12px;
          align-content: start;
        }

        .infoCard {
          padding: 18px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(248, 251, 255, 0.95), rgba(236, 253, 245, 0.82));
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .infoCard span {
          display: block;
          margin-bottom: 7px;
          color: #64748b;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .infoCard strong {
          display: block;
          color: #0f172a;
          font-size: 19px;
          line-height: 1.32;
          font-weight: 950;
        }

        .projectsSection,
        .emptyProjects {
          margin-top: 42px;
          padding: 38px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.22);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.10);
        }

        .sectionHeader {
          max-width: 760px;
          margin-bottom: 28px;
        }

        .sectionHeader span,
        .emptyProjects span {
          color: #16a34a;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .sectionHeader h2,
        .emptyProjects h2 {
          margin: 10px 0 0;
          color: #0f172a;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .sectionHeader p,
        .emptyProjects p {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.75;
          font-weight: 650;
        }

        .projectGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .projectCard {
          overflow: hidden;
          border-radius: 26px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.10);
          text-decoration: none;
          color: inherit;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .projectCard:hover {
          transform: translateY(-6px);
          border-color: rgba(7, 92, 157, 0.22);
          box-shadow: 0 28px 66px rgba(15, 23, 42, 0.16);
        }

        .projectImageWrap {
          position: relative;
          height: 230px;
          overflow: hidden;
          background: #0f172a;
        }

        .projectImage {
          object-fit: cover;
          transition: transform 0.32s ease;
        }

        .projectCard:hover .projectImage {
          transform: scale(1.06);
        }

        .projectShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.30));
        }

        .projectNumber {
          position: absolute;
          top: 16px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 15px;
          color: #ffffff;
          background: rgba(15, 23, 42, 0.46);
          border: 1px solid rgba(255, 255, 255, 0.18);
          font-size: 13px;
          font-weight: 950;
          backdrop-filter: blur(10px);
        }

        .projectContent {
          padding: 22px;
        }

        .projectStatus {
          display: inline-flex;
          margin-bottom: 12px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #166534;
          background: #dcfce7;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .projectContent h3 {
          margin: 0;
          color: #0f172a;
          font-size: 23px;
          line-height: 1.16;
          letter-spacing: -0.035em;
          font-weight: 950;
        }

        .projectContent p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 750;
        }

        .projectFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .projectFooter span {
          color: #075c9d;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .projectFooter strong {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(135deg, #075c9d, #16a34a);
        }

        @media (max-width: 1060px) {
          .heroContent {
            grid-template-columns: 1fr;
          }

          .infoPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .projectGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .enterpriseDetailPage {
            padding: 42px 0 70px;
          }

          .enterpriseShell {
            width: min(100% - 28px, 1180px);
          }

          .heroImageWrap {
            height: 300px;
          }

          .heroBadgeRow {
            align-items: flex-start;
            flex-direction: column;
            left: 18px;
            right: 18px;
            bottom: 18px;
          }

          .heroContent,
          .projectsSection,
          .emptyProjects {
            padding: 24px;
          }

          .infoPanel,
          .projectGrid {
            grid-template-columns: 1fr;
          }

          .projectImageWrap {
            height: 220px;
          }

          .leadText {
            font-size: 17px;
          }
        }
      `}</style>
      <div className="enterpriseShell">
        <Link href="/business-verticals" className="backLink">
          ← Back to Business Vertical
        </Link>

        <article className="enterpriseHero">
          <div className="heroImageWrap">
            <Image
              src={enterprise.image}
              alt={enterprise.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1120px"
              className="heroImage"
            />
            <div className="heroOverlay" />

            <div className="heroBadgeRow">
              <span>Real Capita Group Concern</span>
              {enterprise.location ? <strong>{enterprise.location}</strong> : null}
            </div>
          </div>

          <div className="heroContent">
            <div className="heroText">
              <span className="eyebrow">Enterprise Profile</span>
              <h1>{enterprise.name}</h1>

              {enterprise.location ? (
                <p className="locationLine">{enterprise.location}</p>
              ) : null}

              <p className="leadText">{enterprise.shortDescription}</p>

              <div className="descriptionStack">
                {enterprise.fullDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="actionRow">
                {hasWebsite ? (
                  <a
                    href={enterprise.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primaryAction"
                  >
                    {enterprise.buttonText || "Visit Website"} →
                  </a>
                ) : null}

                {hasProfile ? (
                  <a
                    href={enterprise.profileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="secondaryAction"
                  >
                    View Profile
                  </a>
                ) : null}
              </div>
            </div>

            <aside className="infoPanel">
              <div className="infoCard">
                <span>Concern</span>
                <strong>{enterprise.name}</strong>
              </div>
              <div className="infoCard">
                <span>Location</span>
                <strong>{enterprise.location || "Not specified"}</strong>
              </div>
              <div className="infoCard">
                <span>Projects</span>
                <strong>{projectItems.length}</strong>
              </div>
              <div className="infoCard">
                <span>Status</span>
                <strong>Active</strong>
              </div>
            </aside>
          </div>
        </article>

        {projectItems.length > 0 ? (
          <section className="projectsSection">
            <div className="sectionHeader">
              <span>{projectSectionTitle}</span>
              <h2>Featured Projects</h2>
              <p>{projectSectionDescription}</p>
            </div>

            <div className="projectGrid">
              {projectItems.map((project, index) => (
                <Link
                  key={project.slug}
                  href={`/business-verticals/${enterprise.slug}/${project.slug}`}
                  className="projectCard"
                >
                  <div className="projectImageWrap">
                    {project.image?.trim() ? (
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        sizes="(max-width: 780px) 100vw, 360px"
                        className="projectImage"
                      />
                    ) : null}
                    <div className="projectShade" />
                    <span className="projectNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="projectContent">
                    <span className="projectStatus">Featured Project</span>
                    <h3>{project.name}</h3>
                    <p>{project.location}</p>

                    <div className="projectFooter">
                      <span>View Details</span>
                      <strong>&rarr;</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="emptyProjects">
            <span>Projects</span>
            <h2>No active projects published yet</h2>
            <p>
              Project information can be added later from the admin panel when
              official company data is ready.
            </p>
          </section>
        )}
      </div>

      
    </section>
  );
}



