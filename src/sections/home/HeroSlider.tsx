"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HomeSlide = {
  id?: string | number;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  buttonText?: string | null;
  buttonHref?: string | null;
  href?: string | null;
  isActive?: boolean;
};

type HeroSliderProps = {
  slides?: HomeSlide[];
  initialSlides?: HomeSlide[];
};

const FALLBACK_SLIDES: HomeSlide[] = [
  {
    id: "fallback-1",
    title: "",
    subtitle: "",
    imageUrl: "/images/hero/slide-1.jpg",
    buttonText: "",
    buttonHref: "",
  },
];

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function getImage(slide: HomeSlide) {
 return cleanText(slide.imageUrl) || cleanText(slide.image) || "/images/hero/slide-1.jpg";
}

function getAltText(slide: HomeSlide) {
  return cleanText(slide.title) || "Homepage slide";
}

export default function HeroSlider({
  slides = [],
  initialSlides = [],
}: HeroSliderProps) {
  const passedSlides = useMemo(() => {
    const source = slides.length > 0 ? slides : initialSlides;
    return source.filter((slide) => slide.isActive !== false);
  }, [slides, initialSlides]);

  const [loadedSlides, setLoadedSlides] = useState<HomeSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (passedSlides.length > 0) return;

    let mounted = true;

    async function loadSlides() {
      try {
        const res = await fetch("/api/home-slides", {
          cache: "no-store",
          credentials: "include",
        });

        const data = await res.json();

        if (!mounted) return;

        if (data?.success && Array.isArray(data.data)) {
          setLoadedSlides(
            data.data.filter((slide: HomeSlide) => slide.isActive !== false)
          );
        }
      } catch {
        setLoadedSlides([]);
      }
    }

    loadSlides();

    return () => {
      mounted = false;
    };
  }, [passedSlides.length]);

  const heroSlides =
    passedSlides.length > 0
      ? passedSlides
      : loadedSlides.length > 0
        ? loadedSlides
        : FALLBACK_SLIDES;

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  function goPrevious() {
    setActiveIndex((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1
    );
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  }

  return (
    <section className="rchHero"><style>{`
        .rchHero {
          position: relative;
          width: 100vw;
          height: clamp(500px, 72vh, 760px);
          margin-left: calc(50% - 50vw);
          overflow: hidden;
          background: #0f172a;
        }

        .rchHeroTrack {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 1050ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .rchHeroSlide {
          position: relative;
          min-width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .rchHeroImage {
          object-fit: cover;
          transform: scale(1.04);
        }

        .rchHeroOverlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(2, 6, 23, 0.03) 0%,
            rgba(2, 6, 23, 0.08) 45%,
            rgba(2, 6, 23, 0.16) 100%
          );
        }

        .rchHeroCaption {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }

        .rchHeroCaptionInner {
          width: min(92vw, 1080px);
          opacity: 0;
          transform: scale(0.88);
          filter: blur(8px);
          pointer-events: none;
          will-change: transform, opacity, filter;
        }

        .rchHeroCaptionActive {
          animation: rchSmoothCenterReveal 1550ms cubic-bezier(0.16, 1, 0.3, 1) 350ms forwards;
          pointer-events: auto;
        }

        .rchHeroCaption h1 {
          margin: 0;
          color: rgba(255, 255, 255, 0.60);
          font-size: clamp(30px, 4vw, 62px);
          font-weight: 200;
          line-height: 0.98;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: "Helvetica Neue", "Avenir Next", "Segoe UI Light", "Arial Narrow", Arial, sans-serif;
          text-shadow: 0 4px 22px rgba(0, 0, 0, 0.12);
        }

        .rchHeroCaption p {
          margin: 10px auto 0;
          max-width: 980px;
          color: rgba(255, 255, 255, 0.62);
          font-size: clamp(16px, 1.8vw, 28px);
          font-weight: 200;
          line-height: 1.1;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: "Helvetica Neue", "Avenir Next", "Segoe UI Light", "Arial Narrow", Arial, sans-serif;
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
        }

        .rchHeroButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          margin-top: 28px;
          padding: 0 24px;
          border-radius: 999px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.82);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(10px);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .rchHeroButton:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.18);
        }

        .rchHeroArrow {
          position: absolute;
          top: 50%;
          z-index: 4;
          width: 50px;
          height: 50px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.52);
          background: rgba(15, 23, 42, 0.20);
          color: rgba(255, 255, 255, 0.86);
          font-size: 36px;
          line-height: 1;
          cursor: pointer;
          transform: translateY(-50%);
          backdrop-filter: blur(10px);
        }

        .rchHeroArrowLeft {
          left: 28px;
        }

        .rchHeroArrowRight {
          right: 28px;
        }

        .rchHeroDots {
          position: absolute;
          left: 50%;
          bottom: 24px;
          z-index: 4;
          display: flex;
          gap: 10px;
          transform: translateX(-50%);
        }

        .rchHeroDot {
          width: 11px;
          height: 11px;
          border: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
          cursor: pointer;
          transition: width 0.25s ease, background 0.25s ease;
        }

        .rchHeroDotActive {
          width: 34px;
          background: rgba(255, 255, 255, 0.9);
        }

        @keyframes rchSmoothCenterReveal {
          0% {
            opacity: 0;
            transform: scale(0.88);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @media (max-width: 768px) {
          .rchHero {
            height: 520px;
          }

          .rchHeroCaption h1 {
            font-size: 34px;
            letter-spacing: 0.05em;
          }

          .rchHeroCaption p {
            font-size: 16px;
            letter-spacing: 0.04em;
          }

          .rchHeroArrow {
            width: 42px;
            height: 42px;
            font-size: 30px;
          }

          .rchHeroArrowLeft {
            left: 14px;
          }

          .rchHeroArrowRight {
            right: 14px;
          }
        }
      `}</style>
      <div
        className="rchHeroTrack"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {heroSlides.map((slide, index) => {
          const title = cleanText(slide.title);
          const subtitle = cleanText(slide.subtitle);
          const buttonText = cleanText(slide.buttonText);
          const buttonHref = cleanText(slide.buttonHref) || cleanText(slide.href);

          const hasButton = Boolean(buttonText && buttonHref);
          const hasCaption = Boolean(title || subtitle || hasButton);

          return (
            <div className="rchHeroSlide" key={slide.id || index}>
              <Image
                src={getImage(slide)}
                alt={getAltText(slide)}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="rchHeroImage"
              />

              <div className="rchHeroOverlay" />

              {hasCaption ? (
                <div className="rchHeroCaption">
                  <div
                    key={`${activeIndex}-${index}`}
                    className={
                      index === activeIndex
                        ? "rchHeroCaptionInner rchHeroCaptionActive"
                        : "rchHeroCaptionInner"
                    }
                  >
                    {title ? <h1>{title}</h1> : null}
                    {subtitle ? <p>{subtitle}</p> : null}

                    {hasButton ? (
                      <Link href={buttonHref} className="rchHeroButton">
                        {buttonText}
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {heroSlides.length > 1 ? (
        <>
          <button
            type="button"
            className="rchHeroArrow rchHeroArrowLeft"
            onClick={goPrevious}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            type="button"
            className="rchHeroArrow rchHeroArrowRight"
            onClick={goNext}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="rchHeroDots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id || index}
                type="button"
                className={
                  index === activeIndex
                    ? "rchHeroDot rchHeroDotActive"
                    : "rchHeroDot"
                }
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      
    </section>
  );
}
