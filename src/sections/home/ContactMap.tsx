"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteShell } from "@/components/layout/SiteShellContext";

type Office = {
  id: string;
  key: string;
  name: string;
  address: string;
  color: string;
  embedSrc: string;
  sortOrder: number;
};

type OfficeApiItem = {
  key: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  mapUrl?: string | null;
  sortOrder?: number;
};

const fallbackOffices: Office[] = [
  {
    id: "corporate-office",
    key: "corporate-office",
    name: "Corporate Office",
    address:
      "House# 05, Flat# C-4 & C-5, Road# 21, Gulshan-1, Dhaka-1212, Bangladesh",
    color: "#2f9e44",
    embedSrc:
      "https://maps.google.com/maps?q=Real%20Capita%20Group%20Gulshan%20Dhaka&z=16&output=embed",
    sortOrder: 1,
  },
  {
    id: "sales-office",
    key: "sales-office",
    name: "Sales Office",
    address:
      "Level-19, Nafi Tower, 53, Gulshan-Avenue, Gulshan-1, Dhaka-1212, Bangladesh",
    color: "#3b82f6",
    embedSrc:
      "https://maps.google.com/maps?q=Nafi%20Tower%20Gulshan%201%20Dhaka&z=16&output=embed",
    sortOrder: 2,
  },
];

function getOfficeColor(key: string, index: number) {
  if (key.includes("corporate")) return "#2f9e44";
  if (key.includes("sales")) return "#3b82f6";
  return index % 2 === 0 ? "#2f9e44" : "#3b82f6";
}

function getFallbackMap(key: string) {
  if (key.includes("sales")) {
    return "https://maps.google.com/maps?q=Nafi%20Tower%20Gulshan%201%20Dhaka&z=16&output=embed";
  }

  return "https://maps.google.com/maps?q=Real%20Capita%20Group%20Gulshan%20Dhaka&z=16&output=embed";
}

function getMapSrc(item: OfficeApiItem) {
  const mapUrl = item.mapUrl?.trim();

  if (
    mapUrl &&
    (mapUrl.includes("google.com/maps") || mapUrl.includes("maps.google.com"))
  ) {
    return mapUrl;
  }

  return getFallbackMap(item.key);
}

export default function ContactMap() {
  const { data: siteShell } = useSiteShell();
  const [selectedOfficeId, setSelectedOfficeId] =
    useState<string>("corporate-office");

  const offices = useMemo(() => {
    const dynamicOffices = Array.isArray(siteShell?.contact?.offices)
      ? (siteShell.contact.offices as OfficeApiItem[])
          .filter((item) => item.key && item.title && item.address)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((item, index) => ({
            id: item.key,
            key: item.key,
            name: item.title,
            address: item.address,
            color: getOfficeColor(item.key, index),
            embedSrc: getMapSrc(item),
            sortOrder: item.sortOrder || index + 1,
          }))
      : [];

    return dynamicOffices.length > 0 ? dynamicOffices : fallbackOffices;
  }, [siteShell?.contact?.offices]);

  useEffect(() => {
    if (!offices.some((office) => office.id === selectedOfficeId)) {
      setSelectedOfficeId(offices[0]?.id || "corporate-office");
    }
  }, [offices, selectedOfficeId]);

  const selectedOffice = useMemo(() => {
    return offices.find((office) => office.id === selectedOfficeId) ?? offices[0];
  }, [offices, selectedOfficeId]);

  return (
    <section
      style={{
        padding: "28px 0 48px",
        background: "transparent",
      }}
    >
      <div className="container">
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "24px",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid rgba(15,23,42,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.96) 100%)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(20px, 2vw, 30px)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
              }}
            >
              Office Locations
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              padding: "16px 16px 14px",
              background: "#f8fafc",
            }}
          >
            {offices.map((office) => {
              const isActive = selectedOfficeId === office.id;

              return (
                <button
                  key={office.id}
                  type="button"
                  onClick={() => setSelectedOfficeId(office.id)}
                  style={{
                    textAlign: "left",
                    padding: "18px 18px 16px",
                    borderRadius: "18px",
                    border: isActive
                      ? `1.5px solid ${office.color}`
                      : "1px solid rgba(15,23,42,0.10)",
                    background: isActive
                      ? "rgba(255,255,255,0.98)"
                      : "rgba(255,255,255,0.94)",
                    boxShadow: isActive
                      ? "0 10px 24px rgba(15,23,42,0.10)"
                      : "0 4px 14px rgba(15,23,42,0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "999px",
                        background: office.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {office.name}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: "15px",
                      lineHeight: 1.55,
                    }}
                  >
                    {office.address}
                  </p>
                </button>
              );
            })}
          </div>

          <div
            style={{
              width: "100%",
              height: "clamp(260px, 34vw, 380px)",
              background: "#e5e7eb",
            }}
          >
            <iframe
              key={selectedOffice.id}
              src={selectedOffice.embedSrc}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${selectedOffice.name} location map`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
