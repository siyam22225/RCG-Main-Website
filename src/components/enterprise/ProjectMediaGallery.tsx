"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { RcPropertyProjectMedia } from "@/data/rcPropertyProjects";

type Props = {
  projectName: string;
  projectLocation: string;
  media: RcPropertyProjectMedia[];
};

export default function ProjectMediaGallery({
  projectName,
  projectLocation,
  media,
}: Props) {
  const safeMedia = useMemo(() => media.filter(Boolean), [media]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!safeMedia.length) return null;

  const activeMedia = safeMedia[activeIndex];

  const goPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? safeMedia.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === safeMedia.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="project-media-gallery"><style jsx>{`
        .project-media-gallery {
          background: #ffffff;
        }

        .project-media-main {
          position: relative;
          width: 100%;
          height: 470px;
          overflow: hidden;
          background: #e5e7eb;
        }

        .project-media-image {
          object-fit: cover;
        }

        .project-media-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #000000;
        }

        .project-media-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.06) 0%,
            rgba(15, 23, 42, 0.32) 45%,
            rgba(15, 23, 42, 0.78) 100%
          );
        }

        .project-media-arrow {
          position: absolute;
          top: 50%;
          z-index: 5;
          width: 46px;
          height: 46px;
          transform: translateY(-50%);
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          color: #0f172a;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
          transition:
            transform 0.22s ease,
            background 0.22s ease,
            color 0.22s ease;
        }

        .project-media-arrow:hover {
          transform: translateY(-50%) scale(1.08);
          background: #0f172a;
          color: #ffffff;
        }

        .project-media-arrow-left {
          left: 22px;
        }

        .project-media-arrow-right {
          right: 22px;
        }

        .project-media-title {
          position: absolute;
          left: 42px;
          right: 42px;
          bottom: 38px;
          z-index: 4;
          color: #ffffff;
          pointer-events: none;
        }

        .project-media-title span {
          display: inline-flex;
          margin-bottom: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          padding: 8px 15px;
          color: #166534;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .project-media-title h1 {
          margin: 0 0 8px;
          font-size: clamp(38px, 5vw, 58px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .project-media-title p {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          font-weight: 600;
        }

        .project-media-thumbnails {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 16px 22px 20px;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.95);
        }

        .project-media-thumb {
          position: relative;
          flex: 0 0 96px;
          height: 68px;
          overflow: hidden;
          border: 3px solid transparent;
          border-radius: 12px;
          background: #e5e7eb;
          cursor: pointer;
          opacity: 0.72;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .project-media-thumb:hover,
        .project-media-thumb.active {
          opacity: 1;
          transform: translateY(-2px);
          border-color: #16a34a;
        }

        .project-media-thumb-image,
        .project-media-thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .project-media-video-badge {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(15, 23, 42, 0.35);
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
        }

        @media (max-width: 768px) {
          .project-media-main {
            height: 340px;
          }

          .project-media-title {
            left: 24px;
            right: 24px;
            bottom: 28px;
          }

          .project-media-arrow {
            width: 38px;
            height: 38px;
            font-size: 28px;
          }

          .project-media-arrow-left {
            left: 12px;
          }

          .project-media-arrow-right {
            right: 12px;
          }

          .project-media-thumb {
            flex-basis: 82px;
            height: 58px;
          }
        }
      `}</style>
      <div className="project-media-main">
        {activeMedia.type === "image" ? (
          <Image
            src={activeMedia.src}
            alt={activeMedia.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1100px"
            className="project-media-image"
          />
        ) : (
          <video
            key={activeMedia.src}
            src={activeMedia.src}
            poster={activeMedia.thumbnail}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="project-media-video"
            controlsList="nodownload"
onContextMenu={(event) => event.preventDefault()}
          />
        )}

        <div className="project-media-overlay" />

        <button
          type="button"
          className="project-media-arrow project-media-arrow-left"
          onClick={goPrevious}
          aria-label="Previous media"
        >
          ‹
        </button>

        <button
          type="button"
          className="project-media-arrow project-media-arrow-right"
          onClick={goNext}
          aria-label="Next media"
        >
          ›
        </button>

        <div className="project-media-title">
          <span>RC Property Project</span>
          <h1>{projectName}</h1>
          <p>{projectLocation}</p>
        </div>
      </div>

      <div className="project-media-thumbnails">
        {safeMedia.map((item, index) => (
          <button
            key={`${item.id}-${item.src}`}
            type="button"
            className={`project-media-thumb ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View media ${index + 1}`}
          >
            {item.type === "image" ? (
              <Image
                src={item.thumbnail || item.src}
                alt={item.alt}
                fill
                sizes="120px"
                className="project-media-thumb-image"
              />
            ) : (
              <video
                src={item.src}
                poster={item.thumbnail}
                muted
                playsInline
                preload="metadata"
                className="project-media-thumb-video"
              />
            )}

            {item.type === "video" && (
              <span className="project-media-video-badge">▶</span>
            )}
          </button>
        ))}
      </div>

      
    </div>
  );
}