"use client";

import { useEffect, useState } from "react";

type SocialLink = {
  id?: string | number;
  label?: string | null;
  name?: string | null;
  title?: string | null;
  platform?: string | null;
  href?: string | null;
  url?: string | null;
  link?: string | null;
  isActive?: boolean;
};

function getLabel(item: SocialLink) {
  return String(item.label || item.name || item.title || item.platform || "").trim();
}

function getHref(item: SocialLink) {
  return String(item.href || item.url || item.link || "").trim();
}

function getPlatform(label: string) {
  const value = label.toLowerCase();

  if (value.includes("facebook")) return "facebook";
  if (value.includes("instagram")) return "instagram";
  if (value.includes("youtube")) return "youtube";
  if (value.includes("linkedin")) return "linkedin";
  if (value.includes("whatsapp")) return "whatsapp";
  if (value.includes("messenger")) return "messenger";
  if (value.includes("phone") || value.includes("call")) return "phone";
  if (value.includes("x") || value.includes("twitter")) return "x";

  return "default";
}

export default function SocialSidebar() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadLinks() {
      try {
        const res = await fetch("/api/site-contact-settings");
        const json = await res.json();

        const data = Array.isArray(json?.socialLinks)
          ? json.socialLinks
          : Array.isArray(json?.data)
            ? json.data
            : [];

        if (!mounted) return;

        setLinks(
          data.filter((item: SocialLink) => {
            const href = getHref(item);
            return href && item.isActive !== false;
          })
        );
      } catch (error) {
        console.error("SOCIAL_SIDEBAR_ERROR", error);
        if (mounted) setLinks([]);
      }
    }

    loadLinks();

    return () => {
      mounted = false;
    };
  }, []);

  if (!links.length) return null;

  return (
    <div className="socialDock" aria-label="Social links"><style>{`
        .socialDock {
          position: fixed;
          right: 18px;
          bottom: 28px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .socialBubble {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: 3px solid rgba(255, 255, 255, 0.96);
          box-shadow: 0 14px 26px rgba(15, 23, 42, 0.24);
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            background 0.24s ease,
            filter 0.24s ease;
        }

        .socialBubble:hover {
          transform: translateY(-5px) scale(1.08);
          box-shadow:
            0 20px 38px rgba(15, 23, 42, 0.32),
            0 0 0 4px rgba(255, 255, 255, 0.24);
          filter: brightness(1.08) saturate(1.15);
        }
        .social-facebook {
          background: #1877f2;
        }
        .social-facebook:hover {
          background: #166fe5;
        }
        .social-instagram {
          background: linear-gradient(
            135deg,
            #feda75 0%,
            #fa7e1e 22%,
            #d62976 52%,
            #962fbf 76%,
            #4f5bd5 100%
          );
        }
        .social-instagram:hover {
          background: linear-gradient(
            135deg,
            #feda75 0%,
            #fa7e1e 22%,
            #d62976 52%,
            #962fbf 76%,
            #4f5bd5 100%
          );
        }
        .social-youtube {
          background: #ff0000;
        }
        .social-youtube:hover {
          background: #e60000;
        }
        .social-linkedin {
          background: #0a66c2;
        }
        .social-linkedin:hover {
          background: #0958a8;
        }

        .social-whatsapp {
          background: #25d366;
        }

        .social-whatsapp:hover {
          background: linear-gradient(135deg, #111827 0%, #f8fafc 100%);
        }

        .social-messenger {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
        }

        .social-messenger:hover {
          background: linear-gradient(135deg, #2563eb 0%, #f43f5e 100%);
        }

        .social-phone {
          background: #111827;
        }

        .social-phone:hover {
          background: linear-gradient(135deg, #020617 0%, #dc2626 100%);
        }
        .social-x {
          background: #000000;
        }
        .social-x:hover {
          background: #000000;
        }

        .social-default {
          background: #334155;
        }

        .social-default:hover {
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
        }

        .fbIcon {
          color: #ffffff;
          font-size: 31px;
          font-weight: 900;
          font-family: Arial, sans-serif;
          line-height: 1;
          transform: translateY(2px);
        }

        .instaIcon {
          width: 25px;
          height: 25px;
          border: 3px solid #ffffff;
          border-radius: 8px;
          position: relative;
          display: block;
        }

        .instaIcon::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border: 3px solid #ffffff;
          border-radius: 999px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .instaIcon::after {
          content: "";
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ffffff;
          border-radius: 999px;
          right: 3px;
          top: 3px;
        }

        .youtubeIcon {
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 17px solid #ffffff;
          margin-left: 4px;
        }

        .linkedinIcon,
        .xIcon,
        .phoneIcon,
        .messengerIcon,
        .defaultIcon {
          color: #ffffff;
          font-size: 24px;
          font-weight: 900;
          font-family: Arial, sans-serif;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .socialDock {
            right: 12px;
            bottom: 20px;
            gap: 10px;
          }

          .socialBubble {
            width: 48px;
            height: 48px;
            border-width: 2.5px;
          }

          .fbIcon {
            font-size: 28px;
          }

          .instaIcon {
            width: 22px;
            height: 22px;
          }

          .youtubeIcon {
            border-top-width: 8px;
            border-bottom-width: 8px;
            border-left-width: 15px;
          }
        }
      `}</style>
      {links.map((item, index) => {
        const label = getLabel(item) || "Social";
        const href = getHref(item);
        const platform = getPlatform(label);

        return (
          <a
            key={item.id || `${href}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`socialBubble social-${platform}`}
            aria-label={label}
            title={label}
          >
            {platform === "facebook" && <span className="fbIcon">f</span>}
            {platform === "instagram" && <span className="instaIcon" />}
            {platform === "youtube" && <span className="youtubeIcon" />}
            {platform === "linkedin" && <span className="linkedinIcon">in</span>}
            {platform === "whatsapp" && <span className="phoneIcon">☎</span>}
            {platform === "messenger" && <span className="messengerIcon">↯</span>}
            {platform === "phone" && <span className="phoneIcon">☎</span>}
            {platform === "x" && <span className="xIcon">𝕏</span>}
            {platform === "default" && <span className="defaultIcon">•</span>}
          </a>
        );
      })}

      
    </div>
  );
}