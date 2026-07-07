"use client";

import { useEffect, useMemo, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string | null;
  category?: string | null;
  sourceType?: "youtube" | "raw";
  createdAt: string;
};

const filters = ["All", "Office", "Event", "Community", "Projects", "Directors"];

function getYoutubeId(url: string) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function getYoutubeEmbedUrl(url: string) {
  const id = getYoutubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`;
}

function getYoutubeThumbnail(url: string) {
  const id = getYoutubeId(url);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function MediaVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/videos");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load videos.");
        }

        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeFilter === "All") return videos;

    return videos.filter(
      (video) =>
        (video.category || "").trim().toLowerCase() === activeFilter.toLowerCase()
    );
  }, [videos, activeFilter]);

  const renderPreview = (video: VideoItem) => {
    const thumbnail =
      video.thumbnail?.trim() ||
      (video.sourceType === "youtube" ? getYoutubeThumbnail(video.videoUrl) : "");

    if (thumbnail) {
      return (
        <img
          src={thumbnail}
          alt={video.title}
          className="preview-media"
        />
      );
    }

    if (video.sourceType === "raw") {
      return (
        <video
          src={video.videoUrl}
          className="preview-media"
          muted
          playsInline
          preload="metadata"
        />
      );
    }

    return (
      <div className="preview-fallback">
        <span>No Preview</span>
      </div>
    );
  };

  return (
    <><style jsx>{`
        .videos-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(54, 122, 214, 0.08), transparent 28%),
            linear-gradient(180deg, #eef7fb 0%, #dff0f8 100%);
          padding: 42px 20px 72px;
        }

        .videos-shell {
          max-width: 1320px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          background: rgba(255, 255, 255, 0.58);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 18px 40px rgba(18, 37, 55, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 42px 28px 32px;
          margin-bottom: 28px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(20, 145, 90, 0.1);
          color: #1b8d5a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

     .hero-title {
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-size: clamp(44px, 7vw, 78px);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #2d59c4;
}

        .hero-subtitle {
          max-width: 760px;
          margin: 16px auto 0;
          font-size: 16px;
          line-height: 1.75;
          color: #45607c;
        }

        .filter-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .filter-pill {
          border: 1px solid rgba(24, 35, 55, 0.08);
          background: rgba(255, 255, 255, 0.92);
          color: #172236;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.22s ease;
          box-shadow: 0 8px 18px rgba(16, 24, 40, 0.05);
        }

        .filter-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 22px rgba(16, 24, 40, 0.09);
        }

        .filter-pill.active {
          color: #ffffff;
          border-color: transparent;
          background: linear-gradient(135deg, #1f9b65 0%, #4186e7 100%);
          box-shadow: 0 14px 28px rgba(43, 111, 201, 0.24);
        }

        .content-section {
          margin-top: 10px;
        }

        .status-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          padding: 30px 24px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #23344d;
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
        }

        .status-card.error {
          color: #c0392b;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 26px;
          align-items: stretch;
        }

        .video-card {
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.1);
          transition: transform 0.24s ease, box-shadow 0.24s ease;
        }

        .video-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 46px rgba(15, 23, 42, 0.15);
        }

        .card-media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #0f172a;
        }

        .preview-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #0f172a;
        }

        .preview-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: rgba(255, 255, 255, 0.85);
          font-size: 18px;
          font-weight: 700;
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            to bottom,
            rgba(15, 23, 42, 0.12),
            rgba(15, 23, 42, 0.18)
          );
        }

        .play-button {
          width: 74px;
          height: 74px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
          transition: transform 0.2s ease;
        }

        .video-card:hover .play-button {
          transform: scale(1.06);
        }

        .play-triangle {
          width: 0;
          height: 0;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-left: 18px solid #ef4444;
          margin-left: 4px;
        }

        .card-body {
          padding: 18px 18px 20px;
        }

        .card-title {
          margin: 0 0 8px;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 800;
          color: #16243a;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          min-height: 50px;
        }

        .card-category {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #5b6f8b;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8, 15, 28, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          width: min(960px, 100%);
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 22px 18px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .modal-label {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2b8f61;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: #132238;
        }

        .close-btn {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 999px;
          background: #f2f5f8;
          color: #12233a;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .modal-player {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000000;
        }

        .modal-video,
        .modal-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          background: #000000;
        }

        @media (max-width: 1200px) {
          .video-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .videos-page {
            padding: 30px 16px 56px;
          }

          .hero-section {
            padding: 32px 18px 24px;
            border-radius: 22px;
          }

      
          .video-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 52px;
          }

          .filter-pill {
            padding: 10px 18px;
            font-size: 14px;
          }

          .video-grid {
            grid-template-columns: 1fr;
          }

          .card-title {
            min-height: auto;
          }

          .play-button {
            width: 64px;
            height: 64px;
          }

          .modal-header {
            padding: 16px;
          }

          .modal-title {
            font-size: 20px;
          }
        }
      `}</style>
      <div className="videos-page">
        <div className="videos-shell">
         <section className="hero-section">
  <div className="hero-badge">MEDIA GALLERY</div>
  <h1 className="hero-title">Videos</h1>

  <div className="filter-row">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          <section className="content-section">
            {loading ? (
              <div className="status-card">Loading videos...</div>
            ) : error ? (
              <div className="status-card error">{error}</div>
            ) : filteredVideos.length === 0 ? (
              <div className="status-card">No videos found.</div>
            ) : (
              <div className="video-grid">
                {filteredVideos.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    className="video-card"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="card-media-wrap">
                      {renderPreview(video)}

                      <div className="play-overlay">
                        <div className="play-button">
                          <span className="play-triangle" />
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">{video.title}</h3>
                      <p className="card-category">
                        {video.category || "Uncategorized"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedVideo && (
        <div className="modal-backdrop" onClick={() => setSelectedVideo(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="modal-label">{selectedVideo.category || "Video"}</p>
                <h3 className="modal-title">{selectedVideo.title}</h3>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedVideo(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-player">
              {selectedVideo.sourceType === "raw" ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="modal-video"
                />
              ) : (
                <iframe
                  src={getYoutubeEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  className="modal-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}