import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMediaGallery from "@/components/enterprise/ProjectMediaGallery";
import { enterpriseItems } from "@/data/enterprises";
import { prisma } from "@/lib/prisma";
import { getEnterpriseProject } from "@/lib/enterprise-projects";
import VirtualTour360 from "@/components/enterprise/VirtualTour360";
type Props = {
  params: Promise<{
    slug: string;
    projectSlug: string;
  }>;
};

type ProjectEnterprise = {
  slug: string;
  name: string;
  website: string;
};

async function getProjectEnterprise(slug: string): Promise<ProjectEnterprise | null> {
  try {
    const businessVerticalItem = await prisma.businessVerticalItem.findFirst({
      where: {
        enterpriseSlug: slug,
        isActive: true,
      },
      select: {
        enterpriseSlug: true,
        label: true,
        websiteUrl: true,
      },
    });

    if (businessVerticalItem?.enterpriseSlug) {
      return {
        slug: businessVerticalItem.enterpriseSlug,
        name: businessVerticalItem.label,
        website: businessVerticalItem.websiteUrl || "#",
      };
    }
  } catch (error) {
    console.error("PROJECT_BUSINESS_VERTICAL_ITEM_LOAD_ERROR", error);
  }

  try {
    const dbEnterprise = await prisma.enterprise.findFirst({
      where: { slug, isActive: true },
      select: {
        slug: true,
        name: true,
        buttonHref: true,
      },
    });

    if (dbEnterprise) {
      return {
        slug: dbEnterprise.slug,
        name: dbEnterprise.name,
        website: dbEnterprise.buttonHref || "#",
      };
    }
  } catch (error) {
    console.error("PROJECT_ENTERPRISE_LOAD_ERROR", error);
  }

  const fallback = enterpriseItems.find((item) => item.slug === slug);

  if (!fallback) return null;

  return {
    slug: fallback.slug,
    name: fallback.name,
    website: fallback.website,
  };
}

export default async function EnterpriseProjectDetailsPage({ params }: Props) {
  const { slug, projectSlug } = await params;

  const enterprise = await getProjectEnterprise(slug);

  if (!enterprise) {
    notFound();
  }

  const isRcProperty = enterprise.slug === "land-rpcdl";
  const isRcHoldings = enterprise.slug === "apartment-rchl";

const project = await getEnterpriseProject(enterprise.slug, projectSlug);

  if (!project) {
    notFound();
  }

  const backLabel = `Back to ${enterprise.name}`;

  const backHref = `/business-verticals/${enterprise.slug}`;

  const metaItems = [
    ["Business Vertical", enterprise.name],
    ["Location", project.location],
    ["Project Type", "Real Estate Development"],
  ];

  return (
    <section className="rcgProjectDetailPage"><style>{`
        .rcgProjectDetailPage {
          min-height: 100vh;
          padding: 70px 0 95px;
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.10), transparent 32%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 34%),
            linear-gradient(180deg, #f4f8fb 0%, #eef6fa 100%);
        }

        .rcgProjectDetailContainer {
          width: min(100% - 48px, 1120px);
          margin: 0 auto;
        }

        .rcgProjectBackRow {
          margin-bottom: 24px;
        }

        .rcgProjectBackLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #166534;
          text-decoration: none;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.01em;
          transition: transform 0.22s ease, color 0.22s ease;
        }

        .rcgProjectBackLink:hover {
          color: #14532d;
          transform: translateX(-3px);
        }

        .rcgProjectArticle {
          overflow: hidden;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .rcgGalleryWrap {
          background: #e2e8f0;
        }

        .rcgProjectContent {
          padding: 44px 46px 50px;
        }

        .rcgAccentLine {
          width: 84px;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #16a34a, #2563eb);
          margin-bottom: 22px;
        }

        .rcgProjectHeadingBlock {
          margin-bottom: 18px;
        }

        .rcgProjectBadge {
          display: inline-flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 14px;
          border-radius: 999px;
          color: #15803d;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.16);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .rcgProjectHeadingBlock h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(34px, 5vw, 48px);
          font-weight: 900;
          letter-spacing: -0.055em;
          line-height: 1.05;
        }

        .rcgShortDescription {
          margin: 0 0 26px;
          color: #334155;
          font-size: 18px;
          line-height: 1.85;
          font-weight: 600;
        }

        .rcgFullDescription {
          color: #475569;
          font-size: 17px;
          line-height: 1.9;
          max-width: 940px;
        }

        .rcgFullDescription p {
          margin: 0 0 18px;
        }

        .rcgProjectActions {
          margin-top: 34px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
        }

        .rcgPrimaryAction,
        .rcgSecondaryAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 32px;
          border-radius: 999px;
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            filter 0.24s ease;
        }

        .rcgPrimaryAction {
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          box-shadow: 0 16px 32px rgba(37, 99, 235, 0.24);
        }

        .rcgSecondaryAction {
          background: #0f172a;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.24);
        }

        .rcgPrimaryAction:hover,
        .rcgSecondaryAction:hover {
          transform: translateY(-3px);
          filter: saturate(1.08);
        }

        .rcgProjectMetaGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .rcgProjectMetaCard {
          min-width: 0;
          border-radius: 22px;
          background:
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          padding: 22px;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .rcgProjectMetaCard span {
          display: block;
          margin-bottom: 10px;
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .rcgProjectMetaCard strong {
          display: block;
          min-width: 0;
          max-width: 100%;
          color: #0f172a;
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 900;
          line-height: 1.35;
          overflow-wrap: anywhere;
          word-break: normal;
          white-space: normal;
        }

        @media (max-width: 900px) {
          .rcgProjectDetailPage {
            padding: 46px 0 72px;
          }

          .rcgProjectDetailContainer {
            width: min(100% - 28px, 1120px);
          }

          .rcgProjectArticle {
            border-radius: 26px;
          }

          .rcgProjectContent {
            padding: 34px 28px 38px;
          }

          .rcgProjectMetaGrid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .rcgProjectMetaCard {
            padding: 20px;
          }
        }

        @media (max-width: 560px) {
          .rcgProjectDetailPage {
            padding: 32px 0 62px;
          }

          .rcgProjectDetailContainer {
            width: min(100% - 20px, 1120px);
          }

          .rcgProjectBackRow {
            margin-bottom: 16px;
          }

          .rcgProjectArticle {
            border-radius: 22px;
          }

          .rcgProjectContent {
            padding: 26px 18px 30px;
          }

          .rcgAccentLine {
            width: 68px;
            height: 4px;
            margin-bottom: 18px;
          }

          .rcgProjectHeadingBlock h2 {
            font-size: 32px;
            letter-spacing: -0.045em;
          }

          .rcgShortDescription {
            font-size: 16px;
            line-height: 1.75;
          }

          .rcgFullDescription {
            font-size: 16px;
            line-height: 1.78;
          }

          .rcgProjectActions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .rcgPrimaryAction,
          .rcgSecondaryAction {
            width: 100%;
            min-height: 52px;
            padding: 0 18px;
            font-size: 12px;
            letter-spacing: 0.1em;
          }

          .rcgProjectMetaCard {
            border-radius: 18px;
            padding: 18px;
          }

          .rcgProjectMetaCard span {
            font-size: 11px;
            letter-spacing: 0.12em;
          }

          .rcgProjectMetaCard strong {
            font-size: 19px;
            line-height: 1.35;
          }
        }
      `}</style>
      <div className="rcgProjectDetailContainer">
        <div className="rcgProjectBackRow">
          <Link href={backHref} className="rcgProjectBackLink">
            ← {backLabel}
          </Link>
        </div>

        <article className="rcgProjectArticle">
          <div className="rcgGalleryWrap">
            <ProjectMediaGallery
              projectName={project.name}
              projectLocation={project.location}
              media={project.media}
            />
          </div>

          <div className="rcgProjectContent">
            <div className="rcgAccentLine" />

            <div className="rcgProjectHeadingBlock">
              <span className="rcgProjectBadge">Project Details</span>
              <h2>Project Overview</h2>
            </div>

            <p className="rcgShortDescription">{project.shortDescription}</p>

            <div className="rcgFullDescription">
            {project.fullDescription.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="rcgProjectActions">
              <a
                href={enterprise.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rcgPrimaryAction"
              >
                Visit Website
              </a>

              <a
                href={project.profilePdf}
                download
                className="rcgSecondaryAction"
              >
                Download Profile
              </a>
              {project.layoutPdf ? (
                <a
                  href={project.layoutPdf}
                  download
                  className="rcgSecondaryAction"
                >
                  Download Layout
                </a>
              ) : (
                <span
                  className="rcgSecondaryAction"
                  aria-disabled="true"
                  title="Layout PDF not added yet"
                  style={{
                    opacity: 0.58,
                    cursor: "not-allowed",
                    pointerEvents: "none",
                  }}
                >
                  Download Layout
                </span>
              )}
            </div>
            <VirtualTour360
  imageUrl={project.tour360Image}
  title={`${project.name} 360° Virtual Tour`}
  description="Drag, zoom, and explore the project view interactively."
/>
            

            <div className="rcgProjectMetaGrid">
              {metaItems.map(([label, value]) => (
                <div key={label} className="rcgProjectMetaCard">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      
    </section>
  );
}