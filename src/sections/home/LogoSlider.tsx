"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BrandLogo = {
  id: string | number;
  name: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder?: number;
};

const fallbackLogos: BrandLogo[] = [
  { id: 1, name: "Logo 01", imageUrl: "/images/logos/logo-1.png" },
  { id: 2, name: "Logo 02", imageUrl: "/images/logos/logo-2.png" },
  { id: 3, name: "Logo 03", imageUrl: "/images/logos/logo-3.png" },
  { id: 4, name: "Logo 04", imageUrl: "/images/logos/logo-4.png" },
];

export default function LogoSlider() {
  const [logos, setLogos] = useState<BrandLogo[]>(fallbackLogos);

  useEffect(() => {
    let mounted = true;

    async function loadLogos() {
      try {
        const res = await fetch("/api/logo-settings");
        const data = await res.json();

        const loaded = Array.isArray(data.brandLogos)
          ? data.brandLogos
              .filter((logo: any) => logo.imageUrl)
              .map((logo: any) => ({
                id: logo.id,
                name: logo.name || "Brand Logo",
                imageUrl: logo.imageUrl,
                linkUrl: logo.linkUrl || null,
                sortOrder: logo.sortOrder || 0,
              }))
          : [];

        if (mounted && loaded.length) setLogos(loaded);
      } catch (error) {
        console.error("LOGO_SLIDER_LOAD_ERROR", error);
        if (mounted) setLogos(fallbackLogos);
      }
    }

    loadLogos();

    return () => {
      mounted = false;
    };
  }, []);

  const loopLogos = useMemo(() => [...logos, ...logos], [logos]);

  return (
    <section className="logo-section"><style jsx>{`
        .logo-section {
          width: 100%;
          padding: 46px 0;
          background: #e8f8ff;
          overflow: hidden;
        }

        .logo-marquee {
          width: 100%;
          overflow: hidden;
        }

        .logo-track {
          display: flex;
          align-items: center;
          gap: 74px;
          width: max-content;
          animation: logoScroll 28s linear infinite;
        }

        .logo-marquee:hover .logo-track {
          animation-play-state: paused;
        }

        .logo-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 190px;
          height: 92px;
        }

        .logo-item :global(img) {
          width: auto;
          max-width: 220px;
          height: auto;
          max-height: 82px;
          object-fit: contain;
          filter: none;
        }

        .logo-item :global(a) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        @keyframes logoScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .logo-section {
            padding: 34px 0;
          }

          .logo-track {
            gap: 46px;
            animation-duration: 22s;
          }

          .logo-item {
            min-width: 145px;
            height: 76px;
          }

          .logo-item :global(img) {
            max-width: 150px;
            max-height: 64px;
          }
        }
      `}</style>
      <div className="logo-marquee">
        <div className="logo-track">
          {loopLogos.map((logo, index) => {
            const content = (
              <Image
                src={logo.imageUrl}
                alt={logo.name}
                width={220}
                height={90}
                sizes="(max-width: 768px) 150px, 220px"
              />
            );

            return (
              <div className="logo-item" key={`${logo.id}-${index}`}>
                {logo.linkUrl ? (
                  <a href={logo.linkUrl} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>

      
    </section>
  );
}
