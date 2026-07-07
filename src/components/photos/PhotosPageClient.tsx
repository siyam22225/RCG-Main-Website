"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type PhotoItem = {
  id: string;
  title: string;
  imageUrl: string;
  category: string | null;
};

type Props = {
  initialPhotos?: PhotoItem[];
};

const albums = ["All", "Office", "Event", "Community", "Projects", "Directors"];

export default function PhotosPageClient({ initialPhotos = [] }: Props) {
  const [activeAlbum, setActiveAlbum] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const filteredPhotos = useMemo(() => {
    if (activeAlbum === "All") return initialPhotos;
    return initialPhotos.filter((photo) => photo.category === activeAlbum);
  }, [activeAlbum, initialPhotos]);

  return (
    <section className="photos-page"><style jsx>{`
        .photos-page {
          padding: 52px 20px 76px;
          background: transparent;
        }

        .photos-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .photos-hero {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 34px;
          padding: 34px 24px 30px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(10px);
        }

        .photos-badge {
          margin: 0 0 12px;
          color: #168a4f;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .photos-hero h1 {
          margin: 0 0 24px;
          color: #1f63c8;
          font-size: clamp(44px, 6vw, 68px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .album-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .album-tabs button {
          border: 1px solid rgba(15, 23, 42, 0.08);
          padding: 11px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
          transition: all 0.22s ease;
        }

        .album-tabs button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 26px rgba(15, 23, 42, 0.1);
        }

        .album-tabs button.active {
          border-color: transparent;
          color: #ffffff;
          background: linear-gradient(135deg, #11976f 0%, #2489e8 100%);
          box-shadow: 0 14px 28px rgba(36, 137, 232, 0.22);
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 20px;
        }

        .photo-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.09);
          padding: 0;
          cursor: pointer;
          text-align: left;
          transition: all 0.24s ease;
        }

        .photo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 22px 44px rgba(15, 23, 42, 0.14);
        }

        .photo-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #e8eef5;
          overflow: hidden;
        }

        .photo-image {
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .photo-card:hover .photo-image {
          transform: scale(1.04);
        }

        .photo-info {
          padding: 14px 16px 16px;
        }

        .photo-info h3 {
          margin: 0 0 7px;
          color: #0f172a;
          font-size: 17px;
          line-height: 1.35;
          font-weight: 900;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .photo-info p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
          text-transform: capitalize;
        }

        .empty-state {
          text-align: center;
          color: #64748b;
          font-size: 16px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.78);
          border-radius: 22px;
          padding: 28px;
        }

        .photo-modal {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.82);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-box {
          width: min(100%, 1050px);
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 24px;
          font-weight: 900;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .modal-header button {
          border: none;
          background: #f1f5f9;
          color: #0f172a;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          font-size: 24px;
          cursor: pointer;
          font-weight: 800;
        }

        .modal-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #e5e7eb;
        }

        .modal-image {
          object-fit: contain;
        }

        @media (max-width: 1200px) {
          .photo-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .photo-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .photo-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .photos-page {
            padding: 34px 14px 56px;
          }

          .photos-hero {
            padding: 28px 16px 24px;
          }
        }
      `}</style>
      <div className="photos-container">
        <div className="photos-hero">
          <p className="photos-badge">Media Gallery</p>
          <h1>Photos</h1>

          <div className="album-tabs">
            {albums.map((album) => (
              <button
                key={album}
                type="button"
                onClick={() => setActiveAlbum(album)}
                className={activeAlbum === album ? "active" : ""}
              >
                {album}
              </button>
            ))}
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="empty-state">No photos found in this album.</div>
        ) : (
          <div className="photo-grid">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="photo-card"
              >
                <div className="photo-image-wrap">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="photo-image"
                  />
                </div>

                <div className="photo-info">
                  <h3>{photo.title}</h3>
                  <p>{photo.category || "General"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedPhoto.title}</h2>
                <p>{selectedPhoto.category || "General"}</p>
              </div>

              <button type="button" onClick={() => setSelectedPhoto(null)}>
                ×
              </button>
            </div>

            <div className="modal-image-wrap">
              <Image
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                fill
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}

      
    </section>
  );
}