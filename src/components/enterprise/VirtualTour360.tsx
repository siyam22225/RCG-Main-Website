"use client";

import { useEffect, useRef, useState } from "react";

type VirtualTour360Props = {
  imageUrl?: string | null;
  title?: string;
  description?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function VirtualTour360({
  imageUrl,
  title = "360° Virtual Tour",
  description = "Drag, zoom, and explore the project view interactively.",
}: VirtualTour360Props) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [zoom, setZoom] = useState(115);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageUrl) return;

    isDraggingRef.current = true;
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current || !imageUrl) return;

    const dx = event.clientX - lastPointRef.current.x;
    const dy = event.clientY - lastPointRef.current.y;

    setXPosition((current) => {
      const next = current - dx * 0.08;
      if (next > 100) return next - 100;
      if (next < 0) return next + 100;
      return next;
    });

    setYPosition((current) => clamp(current - dy * 0.08, 12, 88));

    lastPointRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function zoomIn() {
    setZoom((current) => clamp(current + 12, 100, 190));
  }

  function zoomOut() {
    setZoom((current) => clamp(current - 12, 100, 190));
  }

  async function toggleFullscreen() {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      await viewerRef.current.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  }

  return (
    <section className="tour360-section"><style jsx>{`
        .tour360-section {
          width: min(100%, 1080px);
          margin: 34px auto;
          padding: 26px;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
        }

        .tour360-heading {
          margin-bottom: 18px;
        }

        .tour360-heading span {
          display: inline-flex;
          margin-bottom: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #e8f8ef;
          color: #138a43;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .tour360-heading h2 {
          margin: 0 0 8px;
          color: #0f172a;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.04;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        .tour360-heading p {
          margin: 0;
          max-width: 720px;
          color: #475569;
          font-size: 16px;
          line-height: 1.75;
        }

        .tour360-viewer {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          background: #eaf3f8;
        }

        .tour360-panorama {
          position: relative;
          height: 390px;
          min-height: 320px;
          background-repeat: repeat-x;
          background-color: #dbeaf2;
          cursor: grab;
          user-select: none;
          touch-action: none;
          transition: background-size 0.2s ease;
        }

        .tour360-panorama:active {
          cursor: grabbing;
        }

        .tour360-viewer:fullscreen {
          border-radius: 0;
          background: #000000;
        }

        .tour360-viewer:fullscreen .tour360-panorama {
          height: 100vh;
        }

        .tour360-controls {
          position: absolute;
          top: 14px;
          left: 14px;
          display: grid;
          gap: 8px;
          z-index: 3;
        }

        .tour360-controls button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.94);
          color: #0f172a;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
        }

        .tour360-controls button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .tour360-hint {
          position: absolute;
          left: 18px;
          bottom: 18px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.74);
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          backdrop-filter: blur(10px);
        }

        .tour360-placeholder {
          height: 100%;
          display: grid;
          place-content: center;
          gap: 8px;
          text-align: center;
          color: #334155;
          padding: 24px;
        }

        .tour360-placeholder strong {
          font-size: 24px;
          color: #075c9d;
        }

        .tour360-placeholder span {
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .tour360-section {
            padding: 18px;
            border-radius: 22px;
          }

          .tour360-panorama {
            height: 320px;
          }
        }
      `}</style>
      <div className="tour360-heading">
        <span>Interactive View</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div
        ref={viewerRef}
        className={`tour360-viewer ${imageUrl ? "has-image" : "no-image"}`}
      >
        <div
          className="tour360-panorama"
          role="img"
          aria-label={title}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={
            imageUrl
              ? {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${xPosition}% ${yPosition}%`,
                  backgroundSize: `${zoom}% auto`,
                }
              : undefined
          }
        >
          {!imageUrl ? (
            <div className="tour360-placeholder">
              <strong>360° Tour Coming Soon</strong>
              <span>Add a 360 panorama image from the admin panel later.</span>
            </div>
          ) : (
            <div className="tour360-hint">Drag to rotate · Zoom to explore</div>
          )}
        </div>

        <div className="tour360-controls" aria-label="360 tour controls">
          <button type="button" onClick={zoomIn} disabled={!imageUrl}>
            +
          </button>
          <button type="button" onClick={zoomOut} disabled={!imageUrl}>
            −
          </button>
          <button type="button" onClick={toggleFullscreen} disabled={!imageUrl}>
            {isFullscreen ? "Exit" : "Full"}
          </button>
        </div>
      </div>

      
    </section>
  );
}
