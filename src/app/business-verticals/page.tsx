import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getEnterpriseItems() {
  try {
    return await prisma.enterprise.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        location: true,
        description: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    console.error("ENTERPRISE_LIST_PAGE_ERROR", error);
    return [];
  }
}

export default async function EnterprisePage() {
  const items = await getEnterpriseItems();

  return (
    <section className="rcgEnterprisePage"><style>{`
        .rcgEnterprisePage {
          min-height: 100vh;
          padding: 76px 20px 96px;
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 32%),
            linear-gradient(180deg, #f4fbfd 0%, #edf8fb 45%, #f8fafc 100%);
        }

        .rcgEnterpriseWrap {
          max-width: 1220px;
          margin: 0 auto;
        }

        .rcgEnterpriseHead {
          max-width: 760px;
          margin: 0 auto 46px;
          text-align: center;
        }

        .rcgEnterpriseHead span {
          display: inline-flex;
          margin-bottom: 14px;
          border-radius: 999px;
          padding: 9px 16px;
          background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%);
          border: 1px solid rgba(22, 163, 74, 0.16);
          color: #15803d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .rcgEnterpriseHead h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(44px, 6vw, 76px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.06em;
          text-transform: uppercase;
        }

        .rcgEnterpriseHead p {
          margin: 18px auto 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
          font-weight: 600;
        }

        .rcgEnterpriseGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        .rcgEnterpriseCard {
          min-width: 0;
          overflow: hidden;
          border-radius: 28px;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 18px 46px rgba(15, 23, 42, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border-color 0.28s ease;
        }

        .rcgEnterpriseCard:hover {
          transform: translateY(-8px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow:
            0 28px 70px rgba(15, 23, 42, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .rcgImageBox {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #e2e8f0;
        }

        .rcgEnterpriseImage {
          object-fit: cover;
          transition: transform 0.38s ease;
        }

        .rcgEnterpriseCard:hover .rcgEnterpriseImage {
          transform: scale(1.07);
        }

        .rcgImageOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(15, 23, 42, 0.36) 100%);
        }

        .rcgCardBody {
          padding: 24px;
        }

        .rcgCardBody h2 {
          margin: 0;
          color: #0f172a;
          font-size: 25px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.04em;
        }

        .rcgLocation {
          margin: 8px 0 0;
          color: #15803d;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.5;
        }

        .rcgDesc {
          margin: 18px 0 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.75;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rcgCardAction {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.85);
          color: #15803d;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .rcgCardAction b {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          color: #ffffff;
          transition: transform 0.25s ease;
        }

        .rcgEnterpriseCard:hover .rcgCardAction b {
          transform: translateX(4px);
        }

        .rcgEmptyBox {
          max-width: 620px;
          margin: 0 auto;
          text-align: center;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 42px 28px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.10);
        }

        .rcgEmptyBox h2 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 30px;
          font-weight: 900;
        }

        .rcgEmptyBox p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }

        @media (max-width: 980px) {
          .rcgEnterpriseGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .rcgEnterprisePage {
            padding: 52px 14px 76px;
          }

          .rcgEnterpriseGrid {
            grid-template-columns: 1fr;
          }

          .rcgCardBody h2 {
            font-size: 22px;
          }
        }
      `}</style>
      <div className="rcgEnterpriseWrap">
        <div className="rcgEnterpriseHead">
          <span>Our Concern</span>
          <h1>Enterprise</h1>
          <p>
            Explore Real Capita Group concerns, business initiatives, and
            development portfolios.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rcgEmptyBox">
            <h2>No enterprise available</h2>
            <p>Enterprise information will appear here once published.</p>
          </div>
        ) : (
          <div className="rcgEnterpriseGrid">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/business-verticals/${item.slug}`}
                className="rcgEnterpriseCard"
              >
                <div className="rcgImageBox">
                  <Image
                    src={item.imageUrl || "/images/enterprises/enterprise-1.jpg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rcgEnterpriseImage"
                  />
                  <div className="rcgImageOverlay" />
                </div>

                <div className="rcgCardBody">
                  <div>
                    <h2>{item.name}</h2>
                    {item.location ? <p className="rcgLocation">{item.location}</p> : null}
                  </div>

                  <p className="rcgDesc">
                    {item.description ||
                      "Explore this concern under Real Capita Group."}
                  </p>

                  <div className="rcgCardAction">
                    <span>View Details</span>
                    <b>→</b>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      
    </section>
  );
}