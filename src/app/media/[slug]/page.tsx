import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getOtherNews } from "@/lib/news";

type Props = {
  params: Promise<{ slug: string }>;
};

type OtherNewsList = Awaited<ReturnType<typeof getOtherNews>>;

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function splitContent(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  let otherNews: OtherNewsList = [];

  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  try {
    otherNews = await getOtherNews(slug);
  } catch (error) {
    console.error("MEDIA_NEWS_OTHER_ITEMS_ERROR", error);
    otherNews = [];
  }

  const paragraphs = splitContent(String(news.content || ""));

  return (
    <section className="news-detail-page"><style>{`
        .news-detail-page {
          padding: 64px 18px 88px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.06), transparent 32%),
            radial-gradient(circle at top right, rgba(22, 163, 74, 0.08), transparent 28%),
            linear-gradient(180deg, #eef9fc 0%, #eff9fd 40%, #f7fbff 100%);
        }

        .news-detail-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(320px, 380px);
          gap: 28px;
          align-items: start;
        }

        .main-news-card,
        .sidebar-card {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 18px 50px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
        }

        .main-news-card {
          border-radius: 30px;
          overflow: hidden;
        }

        .main-card-inner {
          padding: 30px 36px 58px;
        }

        .news-header {
          margin-bottom: 14px;
        }

        .top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .news-badge,
        .sidebar-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .news-badge {
          color: #166534;
          background: linear-gradient(135deg, #e8fff1 0%, #eef8ff 100%);
          border: 1px solid rgba(22, 163, 74, 0.14);
        }

        .news-date {
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .news-header h1 {
          margin: 0;
          color: #071125;
          font-size: clamp(30px, 3.4vw, 48px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.045em;
          font-family: Georgia, "Times New Roman", serif;
          text-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
        }

        .accent-line {
          width: 100%;
          height: 5px;
          border-radius: 999px;
          margin-top: 16px;
          background: linear-gradient(90deg, #064e3b 0%, #0ea5a4 48%, #1d4ed8 100%);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.16);
        }

        .hero-image-wrap {
          margin-top: 14px;
          margin-bottom: 34px;
        }

        .hero-image-frame {
          position: relative;
          width: 100%;
          height: 430px;
          border-radius: 2px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.10);
        }

        .hero-image {
          object-fit: contain;
          transition: transform 0.35s ease;
        }

        .hero-image-frame:hover .hero-image {
          transform: scale(1.01);
        }

        .news-content {
          min-height: 260px;
          padding: 22px 8px 12px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
        }

        .news-content p {
          margin: 0 0 24px;
          color: #5f6368;
          font-size: 18px;
          line-height: 1.9;
          font-weight: 400;
          letter-spacing: 0.01em;
          font-family: Georgia, "Times New Roman", serif;
          word-break: break-word;
        }

        .news-content p:first-child::first-letter {
          float: left;
          color: #3f3f46;
          font-size: 72px;
          line-height: 0.86;
          padding: 8px 10px 0 0;
          font-family: Georgia, "Times New Roman", serif;
        }

        .news-sidebar {
          position: sticky;
          top: 100px;
        }

        .sidebar-card {
          border-radius: 26px;
          padding: 22px;
        }

        .sidebar-header {
          margin-bottom: 18px;
        }

        .sidebar-badge {
          color: #dc2626;
          background: linear-gradient(135deg, #fff1f2 0%, #fff7f7 100%);
          border: 1px solid rgba(239, 68, 68, 0.12);
          margin-bottom: 10px;
        }

        .sidebar-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .news-list {
          display: grid;
          gap: 14px;
        }

        .side-news-card {
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          text-decoration: none;
          color: inherit;
          min-width: 0;
          border-radius: 20px;
          padding: 12px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .side-news-card:hover {
          transform: translateY(-3px);
          border-color: rgba(37, 99, 235, 0.24);
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.10);
        }

        .side-image-wrap {
          position: relative;
          width: 84px;
          height: 84px;
          border-radius: 16px;
          overflow: hidden;
          background: #e2e8f0;
          flex-shrink: 0;
        }

        .side-image {
          object-fit: cover;
          transition: transform 0.28s ease;
        }

        .side-news-card:hover .side-image {
          transform: scale(1.06);
        }

        .side-news-content {
          min-width: 0;
          overflow: hidden;
        }

        .side-news-content h3 {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.02em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .side-news-content p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
          font-weight: 500;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .read-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 50px;
          margin-top: 20px;
          border-radius: 999px;
          text-decoration: none;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #0f172a 0%, #0ea5a4 42%, #2563eb 100%);
          box-shadow: 0 16px 32px rgba(37, 99, 235, 0.22);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            filter 0.24s ease;
        }

        .read-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 42px rgba(37, 99, 235, 0.28);
          filter: saturate(1.08);
        }

        @media (max-width: 1100px) {
          .news-detail-container {
            grid-template-columns: 1fr;
          }

          .news-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .news-detail-page {
            padding: 42px 14px 72px;
          }

          .main-card-inner {
            padding: 22px;
          }

          .hero-image-frame {
            height: 260px;
            border-radius: 2px;
          }

          .news-content {
            min-height: 220px;
          }

          .news-content p {
            font-size: 17px;
            line-height: 1.85;
          }
        }

        @media (max-width: 520px) {
          .top-meta {
            align-items: flex-start;
            flex-direction: column;
          }

          .side-news-card {
            grid-template-columns: 76px minmax(0, 1fr);
            padding: 10px;
          }

          .side-image-wrap {
            width: 76px;
            height: 76px;
          }

          .sidebar-card {
            padding: 16px;
          }
        }
      `}</style>
      <div className="news-detail-container">
        <article className="main-news-card">
          <div className="main-card-inner">
            <div className="news-header">
              <div className="top-meta">
                <span className="news-badge">Latest Update</span>
                <span className="news-date">{formatDate(news.publishedAt)}</span>
              </div>

              <h1>{news.title}</h1>

              <div className="accent-line" />
            </div>

            <div className="hero-image-wrap">
              <div className="hero-image-frame">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 760px"
                  className="hero-image"
                />
              </div>
            </div>

            <div className="news-content">
              {(paragraphs.length > 0
                ? paragraphs
                : [String(news.content || "")]
              ).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        <aside className="news-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span className="sidebar-badge">Up Next</span>
              <h2>More News</h2>
            </div>

            <div className="news-list">
              {otherNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/media/${item.slug}`}
                  className="side-news-card"
                >
                  <div className="side-image-wrap">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="88px"
                      className="side-image"
                    />
                  </div>

                  <div className="side-news-content">
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/media/news" className="read-all-btn">
              Read All News
            </Link>
          </div>
        </aside>
      </div>

      
    </section>
  );
}