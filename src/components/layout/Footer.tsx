"use client";

import { useEffect, useState } from "react";
import { officeInfo as staticOfficeInfo } from "@/data/offices";
import { socialLinks as staticSocialLinks } from "@/data/socialLinks";

type SocialLink = {
  label: string;
  href: string;
  iconUrl?: string | null;
  sortOrder?: number;
};

type OfficeSetting = {
  title: string;
  address: string;
  phone: string;
  email: string;
  sortOrder?: number;
};

export default function Footer() {
  const [officeInfo, setOfficeInfo] = useState<OfficeSetting[]>(
    staticOfficeInfo.map((item, index) => ({
      title: item.title,
      address: item.address,
      phone: item.phone,
      email: item.email,
      sortOrder: index + 1,
    }))
  );

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    staticSocialLinks.map((item, index) => ({
      label: item.label,
      href: item.href,
      sortOrder: index + 1,
    }))
  );

  useEffect(() => {
    async function loadSiteContactSettings() {
      try {
        const res = await fetch("/api/site-contact-settings");
        const data = await res.json();

        if (!res.ok || !data.success) return;

        const dynamicOffices = Array.isArray(data.offices)
          ? data.offices
              .filter((item: OfficeSetting) => item.title && item.address)
              .sort(
                (a: OfficeSetting, b: OfficeSetting) =>
                  (a.sortOrder || 0) - (b.sortOrder || 0)
              )
              .map((item: OfficeSetting) => ({
                title: item.title,
                address: item.address,
                phone: item.phone,
                email: item.email,
                sortOrder: item.sortOrder || 0,
              }))
          : [];

        const dynamicLinks = Array.isArray(data.socialLinks)
          ? data.socialLinks
              .filter((item: SocialLink) => item.label && item.href)
              .sort(
                (a: SocialLink, b: SocialLink) =>
                  (a.sortOrder || 0) - (b.sortOrder || 0)
              )
              .map((item: SocialLink) => ({
                label: item.label,
                href: item.href,
                iconUrl: item.iconUrl || null,
                sortOrder: item.sortOrder || 0,
              }))
          : [];

        if (dynamicOffices.length > 0) setOfficeInfo(dynamicOffices);
        if (dynamicLinks.length > 0) setSocialLinks(dynamicLinks);
      } catch {
        // Keep static fallback office and social info if API fails.
      }
    }

    loadSiteContactSettings();
  }, []);

  return (
    <footer className="rcgFooter"><style>{`
        .rcgFooter {
          position: relative;
          overflow: hidden;
          padding: 64px 0 28px;
          color: #ffffff;
          background:
            radial-gradient(circle at 10% 5%, rgba(34, 197, 94, 0.28), transparent 30%),
            radial-gradient(circle at 86% 16%, rgba(37, 99, 235, 0.24), transparent 34%),
            linear-gradient(135deg, #020617 0%, #062f2a 46%, #071827 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.10);
        }

        .rcgFooter::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.055), transparent 35%, rgba(255,255,255,0.035)),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,0.08), transparent 42%);
        }

        .rcgFooterGlow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          filter: blur(34px);
          opacity: 0.34;
          pointer-events: none;
        }

        .rcgFooterGlowOne {
          left: -80px;
          top: 30px;
          background: #16a34a;
        }

        .rcgFooterGlowTwo {
          right: -80px;
          bottom: 20px;
          background: #2563eb;
        }

        .rcgFooterContainer {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .rcgFooterTop {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
          gap: 28px;
          align-items: end;
          margin-bottom: 34px;
        }

        .rcgFooterEyebrow {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.18);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .rcgFooterTitle {
          margin: 16px 0 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .rcgFooterIntro {
          margin: 0;
          color: rgba(226, 232, 240, 0.76);
          font-size: 16px;
          line-height: 1.8;
          font-weight: 600;
        }

        .rcgOfficeGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
          margin-bottom: 34px;
        }

        .rcgOfficeCard {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 30px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.105), rgba(255,255,255,0.055));
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow:
            0 22px 52px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          transition:
            transform 0.28s ease,
            border-color 0.28s ease,
            box-shadow 0.28s ease,
            background 0.28s ease;
        }

        .rcgOfficeCard::after {
          content: "";
          position: absolute;
          right: -48px;
          top: -48px;
          width: 120px;
          height: 120px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.14);
          opacity: 0;
          transition: opacity 0.28s ease;
        }

        .rcgOfficeCard:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.28);
          box-shadow:
            0 30px 70px rgba(7, 92, 157, 0.24),
            0 0 0 5px rgba(21, 148, 71, 0.12);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.065));
        }

        .rcgOfficeCard:hover::after {
          opacity: 1;
        }

        .rcgOfficeCardTop {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .rcgOfficeIcon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          font-size: 22px;
          font-weight: 900;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
          flex-shrink: 0;
        }

        .rcgOfficeCard h3 {
          margin: 0;
          color: #ffffff;
          font-size: 25px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.035em;
        }

        .rcgOfficeDetails {
          display: grid;
          gap: 13px;
          color: rgba(226,232,240,0.78);
          font-size: 16px;
          line-height: 1.75;
          font-weight: 600;
        }

        .rcgOfficeDetails p {
          margin: 0;
          color: rgba(226,232,240,0.78);
        }

        .rcgOfficeLink {
          width: fit-content;
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          font-weight: 800;
          transition: color 0.22s ease, transform 0.22s ease;
        }

        .rcgOfficeLink:hover {
          color: #bbf7d0;
          transform: translateX(3px);
        }

        .rcgFooterDivider {
          height: 1px;
          background:
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent 100%);
          margin-bottom: 24px;
        }

        .rcgFooterBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .rcgCopyright {
          margin: 0;
          color: rgba(226,232,240,0.74);
          font-size: 15px;
          font-weight: 700;
        }

        .rcgFooterSocials {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rcgFooterSocialLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.065);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transition:
            transform 0.22s ease,
            background 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .rcgFooterSocialLink:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%);
          border-color: rgba(255,255,255,0.32);
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
        }

        @media (max-width: 900px) {
          .rcgFooter {
            padding: 52px 0 26px;
          }

          .rcgFooterTop {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 26px;
          }

          .rcgOfficeGrid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .rcgOfficeCard {
            padding: 24px;
            border-radius: 24px;
          }

          .rcgFooterBottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .rcgFooterSocials {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .rcgFooterContainer {
            padding: 0 16px;
          }

          .rcgFooterTitle {
            font-size: 32px;
          }

          .rcgFooterIntro {
            font-size: 15px;
          }

          .rcgOfficeCard {
            padding: 20px;
          }

          .rcgOfficeCardTop {
            align-items: flex-start;
          }

          .rcgOfficeIcon {
            width: 40px;
            height: 40px;
            border-radius: 14px;
          }

          .rcgOfficeCard h3 {
            font-size: 22px;
          }

          .rcgOfficeDetails {
            font-size: 15px;
            line-height: 1.7;
          }

          .rcgFooterSocialLink {
            min-height: 40px;
            padding: 0 15px;
            font-size: 13px;
          }
        }
                /* RCG_FOOTER_COLOR_FIX_START */
        .rcgFooter {
          color: #f8fafc !important;
          background:
            radial-gradient(circle at 8% 10%, rgba(255,255,255,0.16), transparent 32%),
            radial-gradient(circle at 88% 12%, rgba(255,255,255,0.10), transparent 34%),
            linear-gradient(135deg, #075c9d 0%, #0b7f97 48%, #159447 100%) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.14) !important;
        }

        .rcgFooter::before {
          background:
            linear-gradient(90deg, rgba(255,255,255,0.08), transparent 40%, rgba(255,255,255,0.05)),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,0.08), transparent 42%) !important;
        }

        .rcgFooterGlowOne {
          background: #075c9d !important;
          opacity: 0.26 !important;
        }

        .rcgFooterGlowTwo {
          background: #159447 !important;
          opacity: 0.24 !important;
        }

        .rcgOfficeCard {
          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid rgba(255, 255, 255, 0.20) !important;
          box-shadow:
            0 18px 44px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255,255,255,0.10) !important;
        }

        .rcgOfficeCard:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(255, 255, 255, 0.28) !important;
        }

        .rcgFooterEyebrow {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(255, 255, 255, 0.24) !important;
        }

        .rcgFooterIntro,
        .rcgOfficeDetails,
        .rcgOfficeDetails p,
        .rcgCopyright {
          color: rgba(255,255,255,0.88) !important;
        }

        .rcgOfficeLink {
          color: #ffffff !important;
        }

        .rcgOfficeLink:hover {
          color: #d9fff0 !important;
        }

        .rcgOfficeIcon {
          font-size: 0 !important;
          background: linear-gradient(135deg, #075c9d 0%, #159447 100%) !important;
        }

        .rcgOfficeIcon::before {
          content: "\\2302";
          font-size: 22px;
          line-height: 1;
          color: #ffffff;
        }

        .rcgFooterDivider {
          background:
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.24) 20%, rgba(255,255,255,0.24) 80%, transparent 100%) !important;
        }

        .rcgFooterSocialLink {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.14) !important;
          border: 1px solid rgba(255, 255, 255, 0.22) !important;
        }

        .rcgFooterSocialLink:hover {
          color: #ffffff !important;
          background: linear-gradient(135deg, #075c9d 0%, #159447 100%) !important;
          border-color: rgba(255,255,255,0.34) !important;
        }
        .rcgOfficeCard:hover {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.18),
              rgba(255,255,255,0.12)
            ) !important;
          border-color: rgba(255,255,255,0.30) !important;
          box-shadow:
            0 24px 56px rgba(7, 92, 157, 0.22),
            0 0 0 5px rgba(21, 148, 71, 0.10),
            inset 0 1px 0 rgba(255,255,255,0.12) !important;
        }

        .rcgFooterSocialLink:hover {
          color: #ffffff !important;
          background: linear-gradient(
            135deg,
            #075c9d 0%,
            #159447 100%
          ) !important;
          border-color: rgba(255,255,255,0.34) !important;
          box-shadow:
            0 14px 28px rgba(7, 92, 157, 0.22) !important;
        }
        .rcgFooter,
        .rcgFooter:hover,
        .rcgFooter:focus,
        .rcgFooter:focus-within {
          background:
            radial-gradient(circle at 8% 10%, rgba(255,255,255,0.16), transparent 32%),
            radial-gradient(circle at 88% 12%, rgba(255,255,255,0.10), transparent 34%),
            linear-gradient(135deg, #075c9d 0%, #0b7f97 48%, #159447 100%) !important;
        }
        /* RCG_FOOTER_COLOR_FIX_END */



      `}</style>
      <div className="rcgFooterGlow rcgFooterGlowOne" />
      <div className="rcgFooterGlow rcgFooterGlowTwo" />

      <div className="rcgFooterContainer">
        <div className="rcgFooterTop">
          <div>
            <span className="rcgFooterEyebrow">Real Capita Group</span>
            <h2 className="rcgFooterTitle">Contact Information</h2>
          </div>

          <p className="rcgFooterIntro">
            Reach our corporate and sales offices for project, service, and
            business-related communication.
          </p>
        </div>

        <div className="rcgOfficeGrid">
          {officeInfo.map((office) => {
            const phoneNumber = office.phone.replace("Tel:", "").trim();
            const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;

            return (
              <div key={office.title} className="rcgOfficeCard">
                <div className="rcgOfficeCardTop">
                  <span className="rcgOfficeIcon">âŒ‚</span>
                  <h3>{office.title}</h3>
                </div>

                <div className="rcgOfficeDetails">
                  <p>{office.address}</p>

                  {office.phone ? (
                    <a href={phoneHref} className="rcgOfficeLink">
                      {office.phone}
                    </a>
                  ) : null}

                  {office.email ? (
                    <a href={`mailto:${office.email}`} className="rcgOfficeLink">
                      {office.email}
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rcgFooterDivider" />

        <div className="rcgFooterBottom">
          <p className="rcgCopyright">
            © 2026 Real Capita Group. All rights reserved.
          </p>

          <div className="rcgFooterSocials">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rcgFooterSocialLink"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      
    </footer>
  );
}


