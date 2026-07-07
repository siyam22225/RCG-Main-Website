import Link from "next/link";

type SettingsItem = {
  title: string;
  description: string;
  href?: string;
  status: "AVAILABLE" | "COMING SOON";
  accentClass: string;
  icon: string;
  group: "Access" | "Website" | "Company" | "Future";
};

const settingsItems: SettingsItem[] = [
  {
    title: "Admin Login Settings",
    description: "Change admin login email and password securely.",
    href: "/admin/settings/account",
    status: "AVAILABLE",
    accentClass: "greenAccent",
    icon: "AL",
    group: "Access",
  },
  {
    title: "Admin User Management",
    description:
      "View, create, disable, and delete normal admin accounts. Super admin accounts remain protected.",
    href: "/admin/settings/admin-users",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "AU",
    group: "Access",
  },
  {
    title: "About Pages",
    description:
      "Update Corporate Profile and Mission, Vision & Values page content.",
    href: "/admin/settings/about-pages",
    status: "AVAILABLE",
    accentClass: "purpleAccent",
    icon: "AB",
    group: "Website",
  },
  {
    title: "Homepage Slider Settings",
    description:
      "Manage homepage hero slider images, order, active status, and button links.",
    href: "/admin/settings/home-slider",
    status: "AVAILABLE",
    accentClass: "purpleAccent",
    icon: "SL",
    group: "Website",
  },
  {
    title: "Social Media Settings",
    description:
      "Update Facebook, Instagram, YouTube, LinkedIn, and X/Twitter links.",
    href: "/admin/settings/social",
    status: "AVAILABLE",
    accentClass: "pinkAccent",
    icon: "SM",
    group: "Website",
  },
  {
    title: "Contact & Office Settings",
    description:
      "Update corporate office, sales office, phone, email, and map information.",
    href: "/admin/settings/contact-office",
    status: "AVAILABLE",
    accentClass: "orangeAccent",
    icon: "CO",
    group: "Website",
  },
  {
    title: "Client Login Button",
    description:
      "Update the client login button text, external URL, and visibility.",
    href: "/admin/settings/client-login",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "CL",
    group: "Website",
  },
  {
    title: "Website Logos",
    description:
      "Update the main website logo and manage the homepage bottom logo slider.",
    href: "/admin/settings/logos",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "LG",
    group: "Website",
  },
  {
    title: "SEO Settings",
    description:
      "Update website title, meta description, social preview, and indexing.",
    href: "/admin/settings/seo",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "SEO",
    group: "Website",
  },
  {
    title: "Business Vertical Settings",
    description:
      "Create, update, and manage Business Vertical categories and sub-categories.",
    href: "/admin/settings/business-verticals",
    status: "AVAILABLE",
    accentClass: "greenAccent",
    icon: "BV",
    group: "Company",
  },
  {
    title: "Featured Project Settings",
    description:
      "Add, update, and manage featured projects under each Business Vertical sub-category.",
    href: "/admin/business-vertical-projects",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "BP",
    group: "Company",
  },
  {
    title: "Board of Directors Settings",
    description:
      "Add, update, hide, and reorder Board of Directors profile cards.",
    href: "/admin/board-directors",
    status: "AVAILABLE",
    accentClass: "blueAccent",
    icon: "BD",
    group: "Company",
  },
  {
    title: "Former Chairman Settings",
    description:
      "Update the Former Chairman page content, image, profile details, and visibility.",
    href: "/admin/settings/former-chairman",
    status: "AVAILABLE",
    accentClass: "greenAccent",
    icon: "FC",
    group: "Company",
  },
  {
    title: "Website Settings",
    description:
      "Future option for website name, contact info, and general settings.",
    status: "COMING SOON",
    accentClass: "mutedAccent",
    icon: "WS",
    group: "Future",
  },
];

const groups: {
  key: SettingsItem["group"];
  title: string;
  description: string;
}[] = [
  {
    key: "Access",
    title: "Access & Security",
    description: "Admin account, login, and permission-related controls.",
  },
  {
    key: "Website",
    title: "Website Controls",
    description: "Homepage, branding, SEO, social, and contact settings.",
  },
  {
    key: "Company",
    title: "Company Content",
    description: "Concern, project, and leadership content management.",
  },
  {
    key: "Future",
    title: "Upcoming Tools",
    description: "Reserved options planned for later improvement.",
  },
];

export default function AdminSettingsPage() {
  const availableCount = settingsItems.filter(
    (item) => item.status === "AVAILABLE"
  ).length;

  return (
    <div className="adminSettingsPage"><style>{`
        .adminSettingsPage {
          min-height: 100vh;
          padding: 34px 20px 60px;
          color: #0f172a;
          background:
            radial-gradient(circle at 8% 0%, rgba(14, 165, 233, 0.18), transparent 30%),
            radial-gradient(circle at 92% 12%, rgba(34, 197, 94, 0.18), transparent 28%),
            linear-gradient(135deg, #eef8fd 0%, #f8fbff 50%, #ecfff4 100%);
        }

        .adminSettingsShell {
          max-width: 1240px;
          margin: 0 auto;
        }

        .topBackRow {
          margin-bottom: 18px;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #075c9d;
          font-size: 15px;
          font-weight: 900;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(7, 92, 157, 0.12);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .backLink:hover {
          color: #16a34a;
          transform: translateX(-2px);
        }

        .heroSection {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: end;
          margin-bottom: 18px;
          padding: 32px;
          border-radius: 32px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,255,255,0.76));
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.09);
          backdrop-filter: blur(16px);
        }

        .eyebrow {
          display: inline-flex;
          margin-bottom: 12px;
          padding: 8px 13px;
          border-radius: 999px;
          color: #16a34a;
          background: rgba(34, 197, 94, 0.10);
          border: 1px solid rgba(34, 197, 94, 0.16);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .pageTitle {
          margin: 0;
          color: #075c9d;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          font-weight: 950;
        }

        .pageSubtitle {
          max-width: 680px;
          margin: 16px 0 0;
          color: #475569;
          font-size: 17px;
          line-height: 1.75;
          font-weight: 650;
        }

        .heroStats {
          display: grid;
          grid-template-columns: repeat(2, 132px);
          gap: 12px;
        }

        .heroStats div {
          padding: 18px 16px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
        }

        .heroStats strong {
          display: block;
          color: #0f172a;
          font-size: 32px;
          line-height: 1;
          font-weight: 950;
        }

        .heroStats span {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .quickStrip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 22px;
          padding: 14px;
          border-radius: 24px;
          background: rgba(255,255,255,0.66);
          border: 1px solid rgba(15, 23, 42, 0.07);
        }

        .quickStrip a {
          text-decoration: none;
          color: #075c9d;
          background: #ffffff;
          border: 1px solid rgba(7, 92, 157, 0.12);
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 8px 18px rgba(15,23,42,0.05);
        }

        .settingsGroups {
          display: grid;
          gap: 22px;
        }

        .settingsGroup {
          padding: 22px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.70);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
        }

        .groupHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
          padding: 0 4px;
        }

        .groupHeader h2 {
          margin: 0;
          color: #0f172a;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .groupHeader p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.55;
          font-weight: 650;
        }

        .groupHeader > span {
          flex-shrink: 0;
          color: #16a34a;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.10);
        }

        .settingsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .cardLinkWrap {
          text-decoration: none;
          color: inherit;
          display: block;
          min-height: 100%;
        }

        .settingsCard {
          position: relative;
          overflow: hidden;
          min-height: 218px;
          height: 100%;
          padding: 20px;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
        }

        .settingsCard::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 5px;
          opacity: 0.92;
          background: linear-gradient(180deg, #0ea5e9, #16a34a);
        }

        .cardLinkWrap:not(.staticCard):hover .settingsCard {
          transform: translateY(-5px);
          border-color: rgba(7, 92, 157, 0.18);
          box-shadow: 0 22px 54px rgba(15, 23, 42, 0.12);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .iconBubble {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.04em;
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .statusAvailable {
          color: #166534;
          background: #dcfce7;
        }

        .statusSoon {
          color: #64748b;
          background: #e2e8f0;
        }

        .cardBody h3 {
          margin: 0;
          color: #0f172a;
          font-size: 19px;
          line-height: 1.22;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .cardBody p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.62;
          font-weight: 600;
        }

        .cardFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
        }

        .footerText,
        .footerArrow {
          color: #075c9d;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .footerArrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(135deg, #075c9d, #16a34a);
        }

        .comingSoonText {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 850;
        }

        .staticCard {
          pointer-events: none;
        }

        .staticCard .settingsCard {
          opacity: 0.72;
          background: rgba(255,255,255,0.72);
        }

        .greenAccent::before { background: linear-gradient(180deg, #16a34a, #22c55e); }
        .blueAccent::before { background: linear-gradient(180deg, #075c9d, #38bdf8); }
        .purpleAccent::before { background: linear-gradient(180deg, #7c3aed, #a78bfa); }
        .pinkAccent::before { background: linear-gradient(180deg, #db2777, #f472b6); }
        .orangeAccent::before { background: linear-gradient(180deg, #ea580c, #facc15); }
        .darkAccent::before { background: linear-gradient(180deg, #0f172a, #16a34a); }
        .mutedAccent::before { background: linear-gradient(180deg, #94a3b8, #cbd5e1); }

        @media (max-width: 1040px) {
          .settingsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .heroSection {
            grid-template-columns: 1fr;
          }

          .heroStats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .adminSettingsPage {
            padding: 24px 14px 46px;
          }

          .heroSection,
          .settingsGroup {
            padding: 20px;
            border-radius: 24px;
          }

          .settingsGrid {
            grid-template-columns: 1fr;
          }

          .groupHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .quickStrip {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .quickStrip a {
            text-align: center;
          }

          .settingsCard {
            min-height: 190px;
          }
        }
      `}</style>
      <div className="adminSettingsShell">
        <div className="topBackRow">
          <Link href="/admin" className="backLink">
            {"\u2190"} Back to Dashboard
          </Link>
        </div>

        <section className="heroSection">
          <div>
            <span className="eyebrow">ADMIN CONTROL CENTER</span>
            <h1 className="pageTitle">Settings</h1>
            <p className="pageSubtitle">
              Manage website controls, company content, access, branding, and
              SEO from one organized workspace.
            </p>
          </div>

          <div className="heroStats">
            <div>
              <strong>{availableCount}</strong>
              <span>Active tools</span>
            </div>
            <div>
              <strong>{settingsItems.length}</strong>
              <span>Total options</span>
            </div>
          </div>
        </section>

        <section className="quickStrip">
          <Link href="/admin/settings/logos">Website Logos</Link>
          <Link href="/admin/settings/seo">SEO Settings</Link>
          <Link href="/admin/settings/business-verticals">Business Vertical</Link>
          <Link href="/admin/board-directors">Board Directors</Link>
        </section>

        <div className="settingsGroups">
          {groups.map((group) => {
            const items = settingsItems.filter((item) => item.group === group.key);
            if (!items.length) return null;

            return (
              <section className="settingsGroup" key={group.key}>
                <div className="groupHeader">
                  <div>
                    <h2>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                  <span>{items.length} options</span>
                </div>

                <div className="settingsGrid">
                  {items.map((item, index) => {
                    const cardContent = (
                      <div className={`settingsCard ${item.accentClass}`}>
                        <div className="cardTop">
                          <span className="iconBubble">{item.icon}</span>
                          <span
                            className={`statusBadge ${
                              item.status === "AVAILABLE"
                                ? "statusAvailable"
                                : "statusSoon"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="cardBody">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>

                        <div className="cardFooter">
                          {item.href ? (
                            <>
                              <span className="footerText">Open Settings</span>
                              <span className="footerArrow">{"\u2192"}</span>
                            </>
                          ) : (
                            <span className="comingSoonText">
                              Feature will be added later
                            </span>
                          )}
                        </div>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link
                          key={`${item.title}-${index}`}
                          href={item.href}
                          className="cardLinkWrap"
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="cardLinkWrap staticCard"
                      >
                        {cardContent}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      
    </div>
  );
}
