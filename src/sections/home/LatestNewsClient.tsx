"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string | Date;
};

type Props = {
  items: NewsItem[];
};

export default function LatestNewsClient({ items }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      setCardsPerPage(width < 640 ? 2 : 3);
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const pages = useMemo(() => {
    const chunks: NewsItem[][] = [];
    for (let i = 0; i < items.length; i += cardsPerPage) {
      chunks.push(items.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [items, cardsPerPage]);

  useEffect(() => {
    if (currentPage >= pages.length) {
      setCurrentPage(0);
    }
  }, [pages.length, currentPage]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [pages.length]);

  const goPrev = () => {
    if (pages.length <= 1) return;
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const goNext = () => {
    if (pages.length <= 1) return;
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  if (!items.length) return null;

  return (
    <section className="latest-news-section"><style jsx global>{`
        .latest-news-section {
          padding: 56px 0 72px;
          background: transparent;
        }

        .latest-news-container {
          max-width: 1200px;
        }

        .latest-news-title {
          margin: 0 0 34px 0;
          text-align: center;
          color: #64748b;
          font-size: clamp(40px, 5vw, 58px);
          font-weight: 300;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .latest-news-slider {
          position: relative;
        }

        .latest-news-window {
          overflow: hidden;
          padding: 4px 2px 10px;
        }

        .latest-news-track {
          display: flex;
          transition: transform 0.65s ease;
        }

        .latest-news-page {
          min-width: 100%;
          display: grid;
          gap: 24px;
          align-items: stretch;
        }

        .latest-news-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          background: #ffffff;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border-color 0.28s ease,
            background 0.28s ease;
        }

        .latest-news-card:hover {
          transform: translateY(-8px);
          border-color: rgba(22, 163, 74, 0.45);
          background: #f8fafc;
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.18);
        }

        .latest-news-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #e5e7eb;
          overflow: hidden;
        }

        .latest-news-image {
          object-fit: cover;
          filter: grayscale(0%);
          transform: scale(1);
          transition:
            transform 0.45s ease,
            filter 0.45s ease,
            opacity 0.45s ease;
        }

        .latest-news-card:hover .latest-news-image {
          filter: grayscale(100%) contrast(1.04);
          transform: scale(1.07);
          opacity: 0.94;
        }

        .latest-news-card-body {
          padding: 18px 16px 20px;
          background: #ffffff;
          min-height: 190px;
          transition: background 0.28s ease;
        }

        .latest-news-card:hover .latest-news-card-body {
          background: #f8fafc;
        }

        .latest-news-card-title {
          margin: 0 0 10px 0;
          color: #0f172a;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.35;
          transition: color 0.25s ease;
        }

        .latest-news-card:hover .latest-news-card-title {
          color: #166534;
        }

        .latest-news-card-date {
          margin: 0 0 10px 0;
          color: #ef4444;
          font-size: 14px;
          font-weight: 800;
        }

        .latest-news-card-excerpt {
          margin: 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.72;
        }

        .latest-news-arrow {
          position: absolute;
          top: 34%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.96);
          color: #475569;
          font-size: 29px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
          z-index: 5;
          transition:
            transform 0.22s ease,
            background 0.22s ease,
            color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .latest-news-arrow:hover {
          background: #0f172a;
          color: #ffffff;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.24);
        }

        .latest-news-arrow-left {
          left: -18px;
        }

        .latest-news-arrow-right {
          right: -18px;
        }

        .latest-news-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
        }

        .latest-news-dot {
          width: 10px;
          height: 10px;
          border: none;
          border-radius: 999px;
          background: #cbd5e1;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            width 0.2s ease;
        }

        .latest-news-dot.active {
          width: 22px;
          background: #ef4444;
          transform: scale(1.05);
        }

        .latest-news-btn-wrap {
          text-align: center;
          margin-top: 28px;
        }

        .latest-news-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 999px;
          padding: 14px 34px;
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.24);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .latest-news-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: -80%;
          width: 55%;
          height: 100%;
          background: rgba(255, 255, 255, 0.32);
          transform: skewX(-22deg);
          transition: left 0.45s ease;
        }

        .latest-news-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 38px rgba(37, 99, 235, 0.34);
        }

        .latest-news-btn:hover::after {
          left: 130%;
        }

        @media (max-width: 1100px) {
          .latest-news-arrow-left {
            left: -10px;
          }

          .latest-news-arrow-right {
            right: -10px;
          }
        }

        @media (max-width: 640px) {
          .latest-news-title {
            margin-bottom: 24px;
          }

          .latest-news-page {
            gap: 18px;
          }

          .latest-news-arrow {
            width: 36px;
            height: 36px;
            font-size: 24px;
            top: 28%;
          }

          .latest-news-arrow-left {
            left: 4px;
          }

          .latest-news-arrow-right {
            right: 4px;
          }

          .latest-news-card {
            border-radius: 14px;
          }

          .latest-news-card-title {
            font-size: 17px;
          }

          .latest-news-card-excerpt {
            font-size: 14px;
          }

          .latest-news-card-body {
            min-height: auto;
            padding: 16px;
          }
        }
      `}</style>
      <div className="container latest-news-container">
        <h2 className="latest-news-title">LATEST NEWS</h2>

        <div className="latest-news-slider">
          {pages.length > 1 && (
            <button
              type="button"
              className="latest-news-arrow latest-news-arrow-left"
              onClick={goPrev}
              aria-label="Previous news"
            >
              ‹
            </button>
          )}

          <div className="latest-news-window">
            <div
              className="latest-news-track"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >
              {pages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="latest-news-page"
                  style={{
                    gridTemplateColumns: `repeat(${cardsPerPage}, minmax(0, 1fr))`,
                  }}
                >
                  {page.map((item) => (
                    <Link
                      key={item.id}
                      href={`/media/${item.slug}`}
                      className="latest-news-card"
                    >
                      <div className="latest-news-image-wrap">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="latest-news-image"
                          sizes="(max-width: 640px) 50vw, 33vw"
                          loading="lazy"
                        />
                      </div>

                      <div className="latest-news-card-body">
                        <h3 className="latest-news-card-title">{item.title}</h3>

                        <p className="latest-news-card-date">
                          {new Date(item.publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>

                        <p className="latest-news-card-excerpt">{item.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {pages.length > 1 && (
            <button
              type="button"
              className="latest-news-arrow latest-news-arrow-right"
              onClick={goNext}
              aria-label="Next news"
            >
              ›
            </button>
          )}
        </div>

        {pages.length > 1 && (
          <div className="latest-news-dots">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`latest-news-dot ${currentPage === index ? "active" : ""}`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="latest-news-btn-wrap">
          <Link href="/media/news" className="latest-news-btn">
            Read All News
          </Link>
        </div>
      </div>

   
    </section>
  );
}
