import Link from "next/link";
import { getBoardDirectorCards } from "@/lib/board-directors";

export const dynamic = "force-dynamic";

type BoardDirectorCard = Awaited<ReturnType<typeof getBoardDirectorCards>>[number];

const directorWebsiteLinks: Record<string, string> = {
  "mohammad-arifuzzaman": "",
  "manzur-ahammad-sohan": "",
  "ishtiak-al-mamoon": "",
  "palash-hendry-sen": "",
  "md-ali-haider": "",
  "rabaya-akhter": "",
  "tania-tanjia": "",
  "sushmita-islam": "",
};

function hasWebsiteLink(value: string | undefined) {
  return Boolean(value && value.trim() && value.trim() !== "#");
}

function SocialLinks({
  facebook,
  whatsapp,
  website,
  slug,
}: {
  facebook: string;
  whatsapp: string;
  website?: string;
  slug: string;
}) {
  const websiteHref = hasWebsiteLink(website)
    ? website
    : `/message/board-of-directors/${slug}`;

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
      <a href={facebook} target="_blank" rel="noopener noreferrer" style={{ color: "#1877f2", lineHeight: 0 }}>
        <svg viewBox="0 0 24 24" width="40" height="40">
          <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.7V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.3v3H10V22h3.5z" />
        </svg>
      </a>

      <a href={whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", lineHeight: 0 }}>
        <svg viewBox="0 0 24 24" width="40" height="40">
          <path fill="currentColor" d="M20.5 11.8c0 4.8-3.9 8.7-8.8 8.7-1.5 0-2.9-.4-4.2-1.1L3 20.7l1.4-4.1c-.8-1.4-1.2-3-1.2-4.7C3.2 7.1 7.1 3.2 12 3.2s8.5 3.8 8.5 8.6z" />
        </svg>
      </a>

      <a
        href={websiteHref}
        target="_blank"
        rel="noopener noreferrer"
        title="Website"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          background: "linear-gradient(135deg, #0ea5e9, #16a34a)",
          boxShadow: "0 8px 18px rgba(14, 165, 233, 0.22)",
          lineHeight: 0,
          textDecoration: "none",
        }}
      >
        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
          <path fill="currentColor" d="M12 2.25A9.75 9.75 0 1 0 12 21.75A9.75 9.75 0 0 0 12 2.25Zm6.92 8.5h-3.1a15.72 15.72 0 0 0-1.18-5.02 8.3 8.3 0 0 1 4.28 5.02ZM12 4.02c.8 1.13 1.55 3.35 1.85 6.73h-3.7C10.45 7.37 11.2 5.15 12 4.02Zm-7.03 8.73h3.28c.08 1.94.42 3.76.98 5.16a8.3 8.3 0 0 1-4.26-5.16Zm3.28-2H4.97a8.3 8.3 0 0 1 4.26-5.16c-.56 1.4-.9 3.22-.98 5.16ZM12 19.98c-.8-1.13-1.55-3.35-1.85-7.23h3.7C13.55 16.63 12.8 18.85 12 19.98Zm2.77-2.07c.56-1.4.9-3.22.98-5.16h3.28a8.3 8.3 0 0 1-4.26 5.16Z" />
        </svg>
      </a>
    </div>
  );
}

function DirectorCard({
  director,
  featured = false,
}: {
  director: BoardDirectorCard;
  featured?: boolean;
}) {
  return (
    <div className={`board-card ${featured ? "board-card-featured" : ""}`}>
      <div className={`board-image-wrap ${featured ? "board-image-wrap-featured" : ""}`}>
        <img src={director.image} alt={director.name} className="board-image" />
      </div>

      <div className={`board-content ${featured ? "board-content-featured" : ""}`}>
        <p className="board-role">{director.role}</p>
        <h3 className="board-name">{director.name}</h3>

        <p className="board-text">
          <strong>Education:</strong> {director.education}
        </p>

        <p className="board-text">
          <strong>Message:</strong> {director.shortMessage}
        </p>

        <div className="board-actions">
          <SocialLinks
            facebook={director.facebook}
            whatsapp={director.whatsapp}
            website={directorWebsiteLinks[director.slug]}
            slug={director.slug}
          />

          {director.profileEnabled ? (
            <Link href={`/message/board-of-directors/${director.slug}`} className="board-profile-btn">
              View Profile
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default async function BoardOfDirectorsPage() {
  const directors = await getBoardDirectorCards();
  const featuredDirectors = directors.slice(0, 2);
  const otherDirectors = directors.slice(2);

  return (
    <><style>{`
        .board-page {
          background: linear-gradient(180deg, #f8fbfd 0%, #edf6fb 100%);
          padding: 48px 0 72px;
        }

        .board-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .board-heading {
          text-align: center;
          margin-bottom: 34px;
        }

        .board-badge {
          margin: 0 0 10px 0;
          color: #16a34a;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .board-title {
          margin: 0;
          color: #145fb3;
          font-size: clamp(42px, 6vw, 66px);
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: -0.04em;
        }

        .board-featured-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .board-others-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .board-card {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .board-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(15, 23, 42, 0.12);
        }

        .board-image-wrap {
          height: 230px;
          background: #e8eef5;
          overflow: hidden;
        }

        .board-image-wrap-featured {
          height: 260px;
        }

        .board-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          background: #eef2f7;
        }

        .board-content {
          padding: 20px 22px 22px;
        }

        .board-content-featured {
          padding: 22px 24px 24px;
        }

        .board-role {
          margin: 0 0 10px 0;
          color: #16a34a;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.5;
        }

        .board-name {
          margin: 0 0 12px 0;
          color: #1d63bd;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.2;
        }

        .board-text {
          margin: 0 0 10px 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.75;
        }

        .board-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
        }

        .board-profile-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #0ea5e9, #16a34a);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 12px 24px rgba(14, 165, 233, 0.25);
          white-space: nowrap;
        }

        @media (max-width: 1100px) {
          .board-others-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .board-page {
            padding: 36px 0 56px;
          }

          .board-container {
            padding: 0 16px;
          }

          .board-featured-grid,
          .board-others-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .board-image-wrap-featured,
          .board-image-wrap {
            height: 220px;
          }

          .board-actions {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
      <section className="board-page">
        <div className="board-container">
          <div className="board-heading">
            <p className="board-badge">Leadership Team</p>
            <h1 className="board-title">Board of Directors</h1>
          </div>

          <div className="board-featured-grid">
            {featuredDirectors.map((director) => (
              <DirectorCard key={director.slug} director={director} featured />
            ))}
          </div>

          <div className="board-others-grid">
            {otherDirectors.map((director) => (
              <DirectorCard key={director.slug} director={director} />
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
}
