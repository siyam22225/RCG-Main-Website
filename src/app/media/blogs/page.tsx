import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/blogs";

export const dynamic = "force-dynamic";

function formatDate(date: string | Date | null) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogsPage() {
  let blogPosts: Awaited<ReturnType<typeof getPublishedBlogs>> = [];

  try {
    blogPosts = await getPublishedBlogs();
  } catch (error) {
    console.error("MEDIA_BLOGS_PAGE_ERROR", error);
  }

  return (
    <section className="blogs-page">
      <style>{`
        .blogs-page {
          padding: 54px 20px 82px;
          background:
            radial-gradient(circle at top left, rgba(22, 163, 74, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.11), transparent 30%),
            linear-gradient(180deg, #eef9fc 0%, #e8f8fb 48%, #f8fbff 100%);
        }

        .blogs-container {
          max-width: 1120px;
          margin: 0 auto;
        }

        .blogs-header {
          margin-bottom: 30px;
        }

        .blogs-header p {
          margin: 0 0 10px;
          color: #16a34a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .blogs-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.045em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          align-items: stretch;
        }

        .blog-card {
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

        .blog-card:hover {
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

        .blog-image {
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .blog-card:hover .blog-image {
          transform: scale(1.07);
        }

        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #075c9d;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #e8fff1 0%, #eef8ff 100%);
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 20px 18px;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 6px 10px;
          color: #166534;
          background: #dcfce7;
          font-size: 11px;
          font-weight: 900;
        }

        .card-body h2 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.18;
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
          font-size: 14px;
          line-height: 1.7;
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
          padding-top: 16px;
          color: #15803d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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

        @media (max-width: 980px) {
          .blogs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .blogs-page {
            padding: 42px 14px 72px;
          }

          .blogs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="blogs-container">
        <div className="blogs-header">
          <p>Real Estate Insights</p>
          <h1>Blogs and Property Updates</h1>
        </div>

        {blogPosts.length === 0 ? (
          <div className="empty-card">
            <h2>No blogs available</h2>
            <p>Published blog posts will appear here once they are added.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/media/blogs/${post.slug}`}
                className="blog-card"
              >
                <div className="image-wrap">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 360px"
                      className="blog-image"
                    />
                  ) : (
                    <div className="image-placeholder">Real Capita Blog</div>
                  )}
                </div>

                <div className="card-body">
                  <div className="blog-meta">
                    {post.category ? (
                      <span className="category-pill">{post.category}</span>
                    ) : null}
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>

                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>

                  <div className="read-more">
                    <span>Read Article</span>
                    <span>→</span>
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
