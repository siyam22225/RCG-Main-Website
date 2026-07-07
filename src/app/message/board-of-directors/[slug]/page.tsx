import Link from "next/link";
import { notFound } from "next/navigation";
import { directors as fallbackDirectors, getDirectorBySlug } from "@/data/directors";
import { getBoardDirectorCards } from "@/lib/board-directors";

type Props = {
  params: Promise<{ slug: string }>;
};

function splitParagraphs(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateStaticParams() {
  try {
    const directors = await getBoardDirectorCards();

    return directors
      .filter((director) => director.profileEnabled)
      .map((director) => ({ slug: director.slug }));
  } catch {
    return fallbackDirectors
      .filter((director) => director.profileEnabled)
      .map((director) => ({ slug: director.slug }));
  }
}

export default async function DirectorProfilePage({ params }: Props) {
  const { slug } = await params;

  const dbDirectors = await getBoardDirectorCards();
  const director = dbDirectors.find((item) => item.slug === slug);
  const fallbackDirector = getDirectorBySlug(slug);

  if (!director || !director.profileEnabled) {
    notFound();
  }

  const overviewParagraphs =
    director.profileDetails.trim().length > 0
      ? splitParagraphs(director.profileDetails)
      : fallbackDirector?.overview?.length
        ? fallbackDirector.overview
        : director.shortMessage
          ? [director.shortMessage]
          : [];

  const messageParagraphs =
    director.messageBody.trim().length > 0
      ? splitParagraphs(director.messageBody)
      : fallbackDirector?.messageParagraphs || [];

  const messageTitle =
    director.messageTitle.trim() ||
    fallbackDirector?.messageTitle ||
    "Leadership Message";

  const shouldShowMessage =
    director.showMessage !== false && messageParagraphs.length > 0;

  return (
    <><style>{`
        .profile-page {
          background: linear-gradient(180deg, #f6fbff 0%, #eef7fb 100%);
          color: #0f172a;
        }

        .profile-container {
          width: min(100% - 48px, 1380px);
          margin: 0 auto;
        }

        .profile-hero {
          padding: 52px 0 92px;
          color: #ffffff;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.2), transparent 28%),
            linear-gradient(135deg, #075c9d 0%, #0b8bd3 48%, #12b7a7 100%);
        }

        .back-link {
          display: inline-flex;
          margin-bottom: 26px;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: rgba(255,255,255,0.82);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .profile-hero h1 {
          margin: 0;
          max-width: 1100px;
          font-size: clamp(44px, 7vw, 84px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .role-line {
          margin: 18px 0 0;
          font-size: clamp(20px, 2.4vw, 30px);
          font-weight: 850;
          color: rgba(255,255,255,0.92);
        }

        .profile-body {
          margin-top: -58px;
          padding-bottom: 72px;
        }

        .profile-panel {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          gap: 28px;
          padding: 24px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 30px;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.1);
        }

        .photo-box {
          border-radius: 24px;
          overflow: hidden;
          background: #eef4f9;
        }

        .photo-box img {
          width: 100%;
          height: 100%;
          min-height: 390px;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .profile-summary {
          align-self: center;
        }

        .profile-summary h2,
        .details-sheet h2 {
          margin: 0 0 16px;
          color: #075c9d;
          font-size: clamp(26px, 3vw, 36px);
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .profile-summary p {
          margin: 0 0 16px;
          color: #334155;
          font-size: 16px;
          line-height: 1.85;
          text-align: justify;
        }

        .contact-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .contact-strip div {
          min-width: 0;
          padding: 14px 16px;
          border-radius: 16px;
          background: #f3f8fc;
          border: 1px solid #e1edf5;
        }

        .contact-strip strong {
          display: block;
          margin-bottom: 5px;
          color: #0f172a;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.13em;
        }

        .contact-strip span {
          color: #475569;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .details-sheet {
          margin-top: 24px;
          padding: 32px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 30px;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
        }

        .details-columns {
          columns: 3;
          column-gap: 34px;
        }

        .detail-block {
          break-inside: avoid;
          margin: 0 0 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e5edf4;
        }

        .detail-block h3 {
          margin: 0 0 10px;
          color: #075c9d;
          font-size: 21px;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }

        .detail-block ul {
          margin: 0;
          padding-left: 20px;
          color: #334155;
          font-size: 15.5px;
          line-height: 1.75;
        }

        .detail-block li {
          margin-bottom: 6px;
        }

        .message-section {
          margin-top: 24px;
          padding: 40px 44px;
          border-radius: 30px;
          color: #ffffff;
          overflow: hidden;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.14);
          background:
            radial-gradient(circle at 8% 10%, rgba(255,255,255,0.15), transparent 26%),
            radial-gradient(circle at 90% 18%, rgba(20,184,166,0.28), transparent 30%),
            linear-gradient(135deg, #075c9d 0%, #0b78b8 55%, #0f9fbc 100%);
        }

        .message-heading {
          text-align: center;
          margin-bottom: 26px;
        }

        .message-heading p {
          margin: 0 0 8px;
          color: rgba(255,255,255,0.76);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .message-heading h2 {
          margin: 0;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.02;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .message-text {
          columns: 2;
          column-gap: 44px;
        }

        .message-text p {
          break-inside: avoid;
          margin: 0 0 20px;
          color: rgba(255,255,255,0.96);
          font-size: 16px;
          line-height: 1.85;
          text-align: justify;
        }

        @media (max-width: 1180px) {
          .profile-panel {
            grid-template-columns: 300px 1fr;
          }

          .contact-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .details-columns {
            columns: 2;
          }
        }

        @media (max-width: 820px) {
          .profile-container {
            width: min(100% - 32px, 1380px);
          }

          .profile-hero {
            padding: 40px 0 78px;
          }

          .profile-panel {
            grid-template-columns: 1fr;
            padding: 18px;
            border-radius: 24px;
          }

          .photo-box img {
            min-height: 320px;
            height: 340px;
          }

          .contact-strip {
            grid-template-columns: 1fr;
          }

          .details-sheet,
          .message-section {
            padding: 24px;
            border-radius: 24px;
          }

          .details-columns,
          .message-text {
            columns: 1;
          }
        }
      `}</style>
      <main className="profile-page">
        <section className="profile-hero">
          <div className="profile-container">
            <Link href="/message/board-of-directors" className="back-link">
              {"\u2190"} Back to Board of Directors
            </Link>

            <p className="eyebrow">Leadership Profile</p>
            <h1>{director.name}</h1>
            <p className="role-line">{director.role}</p>
          </div>
        </section>

        <section className="profile-body">
          <div className="profile-container">
            <div className="profile-panel">
              <div className="photo-box">
                <img src={director.image} alt={director.name} />
              </div>

              <div className="profile-summary">
                <h2>Professional Overview</h2>

                {overviewParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="contact-strip">
                  {fallbackDirector?.phone ? (
                    <div>
                      <strong>Phone</strong>
                      <span>{fallbackDirector.phone}</span>
                    </div>
                  ) : null}

                  {fallbackDirector?.emails?.map((email: string) => (
                    <div key={email}>
                      <strong>Email</strong>
                      <span>{email}</span>
                    </div>
                  ))}

                  {director.facebook && director.facebook !== "#" ? (
                    <div>
                      <strong>Facebook</strong>
                      <span>{director.facebook}</span>
                    </div>
                  ) : fallbackDirector?.socialLabels?.facebook ? (
                    <div>
                      <strong>Facebook</strong>
                      <span>{fallbackDirector.socialLabels.facebook}</span>
                    </div>
                  ) : null}

                  {director.whatsapp && director.whatsapp !== "#" ? (
                    <div>
                      <strong>WhatsApp</strong>
                      <span>{director.whatsapp}</span>
                    </div>
                  ) : null}

                  {fallbackDirector?.socialLabels?.linkedin ? (
                    <div>
                      <strong>LinkedIn</strong>
                      <span>{fallbackDirector.socialLabels.linkedin}</span>
                    </div>
                  ) : null}

                  {fallbackDirector?.socialLabels?.youtube ? (
                    <div>
                      <strong>YouTube</strong>
                      <span>{fallbackDirector.socialLabels.youtube}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {fallbackDirector?.sections?.length ? (
              <div className="details-sheet">
                <h2>Profile Details</h2>

                <div className="details-columns">
                  {fallbackDirector.sections.map((section) => (
                    <div className="detail-block" key={section.title}>
                      <h3>{section.title}</h3>
                      <ul>
                        {section.items.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {shouldShowMessage ? (
              <section className="message-section">
                <div className="message-heading">
                  <p>Message</p>
                  <h2>{messageTitle}</h2>
                </div>

                <div className="message-text">
                  {messageParagraphs.map((paragraph: string) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </main>

      
    </>
  );
}
