import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug } from "@/lib/blogs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string | Date | null) {
  if (!date) return "Recently published";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function splitContent(content: string) {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublishedBlogBySlug(slug);

    if (!post) {
      return {};
    }

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.imageUrl ? [post.imageUrl] : undefined,
        type: "article",
      },
      twitter: {
        card: post.imageUrl ? "summary_large_image" : "summary",
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.imageUrl ? [post.imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("BLOG_METADATA_ERROR", error);
    return {};
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPublishedBlogBySlug>> = null;

  try {
    post = await getPublishedBlogBySlug(slug);
  } catch (error) {
    console.error("BLOG_DETAIL_PAGE_ERROR", error);
  }

  if (!post) {
    notFound();
  }

  const paragraphs = splitContent(post.content);

  return (
    <section className="blog-detail-page">
      <style>{`
        .blog-detail-page {
          padding: 64px 18px 88px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.06), transparent 32%),
            radial-gradient(circle at top right, rgba(22, 163, 74, 0.08), transparent 28%),
            linear-gradient(180deg, #eef9fc 0%, #eff9fd 40%, #f7fbff 100%);
        }

        .blog-detail-container {
          max-width: 980px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 30px;
          overflow: hidden;
          box-shadow:
            0 18px 50px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .blog-detail-inner {
          padding: 34px 38px 58px;
        }

        .top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .blog-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 8px 14px;
          color: #166534;
          background: linear-gradient(135deg, #e8fff1 0%, #eef8ff 100%);
          border: 1px solid rgba(22, 163, 74, 0.14);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .blog-date {
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }

        .blog-title {
          margin: 0;
          color: #071125;
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.045em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .blog-excerpt {
          margin: 18px 0 0;
          color: #475569;
          font-size: 18px;
          line-height: 1.75;
          font-weight: 600;
        }

        .accent-line {
          width: 100%;
          height: 5px;
          border-radius: 999px;
          margin-top: 20px;
          background: linear-gradient(90deg, #064e3b 0%, #0ea5a4 48%, #1d4ed8 100%);
        }

        .hero-image-frame {
          position: relative;
          width: 100%;
          height: 430px;
          margin-top: 28px;
          overflow: hidden;
          border-radius: 2px;
          background: #e2e8f0;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.10);
        }

        .hero-image {
          object-fit: cover;
        }

        .blog-content {
          margin-top: 34px;
          padding-top: 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
        }

        .blog-content p {
          margin: 0 0 22px;
          color: #4b5563;
          font-size: 18px;
          line-height: 1.9;
          font-weight: 400;
          font-family: Georgia, "Times New Roman", serif;
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .blog-detail-page {
            padding: 42px 14px 72px;
          }

          .blog-detail-inner {
            padding: 24px;
          }

          .hero-image-frame {
            height: 260px;
          }
        }
      `}</style>

      <article className="blog-detail-container">
        <div className="blog-detail-inner">
          <div className="top-meta">
            <span className="blog-badge">{post.category || "Blog"}</span>
            <span className="blog-date">
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>

          <h1 className="blog-title">{post.title}</h1>
          <p className="blog-excerpt">{post.excerpt}</p>
          <div className="accent-line" />

          {post.imageUrl ? (
            <div className="hero-image-frame">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 940px"
                className="hero-image"
              />
            </div>
          ) : null}

          <div className="blog-content">
            {(paragraphs.length > 0 ? paragraphs : [post.content]).map(
              (paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
              )
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
