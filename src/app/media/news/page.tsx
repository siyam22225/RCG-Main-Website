import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/lib/news";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AllNewsPage() {
  let newsItems: Awaited<ReturnType<typeof getAllNews>> = [];

  try {
    newsItems = await getAllNews();
  } catch (error) {
    console.error("MEDIA_NEWS_PAGE_ERROR", error);
  }

  return (
    <section className="all-news-page"><style>{`
        .all-news-page {
          padding: 54px 20px 82px;
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.11), transparent 30%),
            linear-gradient(180deg, #eef9fc 0%, #e8f8fb 48%, #f8fbff 100%);
        }

        .all-news-container {
          max-width: 1120px;
          margin: 0 auto;
        }

        .news-page-header {
          margin: 0 0 30px;
        }

        .news-page-header p {
          margin: 0 0 10px;
          color: #15803d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .news-page-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(36px, 5vw, 54px);
          line-height: 1;
          font-weight: 900;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          align-items: stretch;
        }

        .news-card {
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 16px 42px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border-color 0.28s ease;
        }

        .news-card:hover {
          transform: translateY(-7px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow:
            0 24px 60px rgba(15, 23, 42, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #e2e8f0;
          flex-shrink: 0;
        }

        .news-image {
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .news-card:hover .news-image {
          transform: scale(1.07);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(15, 23, 42, 0.28) 100%);
          pointer-events: none;
        }

        .date-pill {
          position: absolute;
          left: 13px;
          bottom: 13px;
          border-radius: 999px;
          padding: 7px 10px;
          background: rgba(255, 255, 255, 0.94);
          color: #dc2626;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.13);
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 18px 18px 16px;
        }

        .card-body h3 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.22;
          letter-spacing: -0.03em;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .card-body p {
          margin: 0;
          color: #475569;
          font-size: 13.5px;
          line-height: 1.62;
          font-weight: 600;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .read-more {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid rgba(226, 232, 240, 0.85);
          color: #15803d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
        }

        .arrow {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          color: #ffffff;
          transition: transform 0.25s ease;
        }

        .news-card:hover .arrow {
          transform: translateX(4px);
        }

        .empty-card {
          max-width: 620px;
          margin: 0 auto;
          text-align: center;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 42px 28px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.10);
        }

        .empty-card h2 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 30px;
          font-weight: 900;
        }

        .empty-card p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }

        @media (max-width: 1180px) {
          .news-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .news-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .all-news-page {
            padding: 42px 14px 72px;
          }

          .news-grid {
            grid-template-columns: 1fr;
          }

          .card-body h3 {
            font-size: 19px;
          }
        }
      `}</style>
      <div className="all-news-container">
        <div className="news-page-header">
          <p>Media Updates</p>
          <h1>Latest News</h1>
        </div>

        {newsItems.length === 0 ? (
          <div className="empty-card">
            <h2>No news available</h2>
            <p>New media updates will appear here once published.</p>
          </div>
        ) : (
          <div className="news-grid">
            {newsItems.map((item) => (
              <Link key={item.id} href={`/media/${item.slug}`} className="news-card">
                <div className="image-wrap">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 240px"
                    className="news-image"
                    loading="lazy"
                  />
                  <div className="image-overlay" />
                  <span className="date-pill">{formatDate(item.publishedAt)}</span>
                </div>

                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>

                  <div className="read-more">
                    <span>Read Update</span>
                    <span className="arrow">→</span>
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
