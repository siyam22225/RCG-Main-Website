"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { EnterpriseItem } from "@/data/enterprises";

type EnterpriseCardProps = {
  item: EnterpriseItem;
};

export default function EnterpriseCard({ item }: EnterpriseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#ffffff",
        boxShadow: isHovered
          ? "0 18px 36px rgba(0,0,0,0.22)"
          : "0 10px 24px rgba(0,0,0,0.14)",
        overflow: "hidden",
        height: "100%",
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s ease",
        cursor: "pointer",
      }}
    >
      <Link
        href={`/business-verticals/${item.slug}`}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "280px",
            overflow: "hidden",
            background: "#e5e7eb",
          }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            style={{
              objectFit: "cover",
              transform: isHovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.45s ease",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isHovered
                ? "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.18))"
                : "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
              transition: "background 0.35s ease",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "20px",
              bottom: "18px",
              color: "#fff",
              transform: isHovered ? "translateY(-4px)" : "translateY(0)",
              transition: "transform 0.35s ease",
            }}
          >
            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "1.3",
              }}
            >
              {item.name}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                opacity: 0.95,
              }}
            >
              {item.location}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}