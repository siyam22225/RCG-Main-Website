import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/data/news";

type CardProps = {
  item: NewsItem;
  clampDescription?: boolean;
};

export default function Card({
  item,
  clampDescription = true,
}: CardProps) {
  return (
    <article
      style={{
        background: "#fff",
        border: "6px solid #fff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Link href={item.href} style={{ display: "block" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "260px",
            background: "#e5e7eb",
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div style={{ padding: "16px" }}>
        <h3
          style={{
            margin: "0 0 10px 0",
            fontSize: "20px",
            lineHeight: "1.4",
            color: "#555",
            minHeight: "56px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <Link href={item.href} style={{ color: "inherit", textDecoration: "none" }}>
            {item.title}
          </Link>
        </h3>

        <p
          style={{
            margin: "0 0 8px 0",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {item.date}
        </p>

        <p
          style={
            clampDescription
              ? {
                  margin: 0,
                  color: "#666",
                  fontSize: "15px",
                  lineHeight: "1.8",
                  minHeight: "78px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : {
                  margin: 0,
                  color: "#666",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }
          }
        >
          {item.description}
        </p>
      </div>
    </article>
  );
}