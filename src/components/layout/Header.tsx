import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type EnterpriseMenuItem = {
  id: string | number;
  slug: string;
  name: string;
  isActive?: boolean;
};

type ClientLoginSetting = {
  show: boolean;
  buttonText: string;
  buttonUrl: string;
  openInNewTab: boolean;
};

type HeaderLogoSetting = {
  logoUrl: string;
  altText: string;
};

type PageVisibilitySetting = {
  formerChairman: boolean;
};

type OfficeContactSetting = {
  email: string;
  phone: string;
};

type BusinessVerticalItem = {
  id?: string;
  label: string;
  enterpriseSlug?: string | null;
  targetUrl?: string | null;
  fallbackSlug?: string;
  match?: string[];
};

type BusinessVerticalGroup = {
  id?: string;
  label: string;
  items: BusinessVerticalItem[];
};

const galleryItems = [
  { label: "Photos", href: "/media/photos" },
  { label: "Videos", href: "/media/videos" },
];

const mediaItems = [
  { label: "News", href: "/media/news" },
  { label: "Blogs", href: "/media/blogs" },
];

function normalizeEnterprises(data: unknown): EnterpriseMenuItem[] {
  const source = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown[] })?.data)
      ? (data as { data: unknown[] }).data
      : Array.isArray((data as { enterprises?: unknown[] })?.enterprises)
        ? (data as { enterprises: unknown[] }).enterprises
        : [];

  return source
    .map((item) => {
      const enterprise = item as Partial<EnterpriseMenuItem>;
      return {
        id: enterprise.id || enterprise.slug || enterprise.name || "",
        slug: String(enterprise.slug || "").trim(),
        name: String(enterprise.name || "").trim(),
        isActive: enterprise.isActive,
      };
    })
    .filter((item) => item.slug && item.name && item.isActive !== false);
}

function normalizeBusinessVerticalGroups(data: unknown): BusinessVerticalGroup[] {
  const source = Array.isArray(data)
    ? data
    : Array.isArray((data as { categories?: unknown[] })?.categories)
      ? (data as { categories: unknown[] }).categories
      : [];

  return source
    .map((group) => {
      const category = group as {
        id?: string | number;
        label?: string;
        items?: unknown[];
        isActive?: boolean;
      };

      return {
        id: String(category.id || category.label || ""),
        label: String(category.label || "").trim(),
        items: Array.isArray(category.items)
          ? category.items
              .map((item) => {
                const verticalItem = item as {
                  id?: string | number;
                  label?: string;
                  enterpriseSlug?: string | null;
                  targetUrl?: string | null;
                  isActive?: boolean;
                };

                return {
                  id: String(verticalItem.id || verticalItem.label || ""),
                  label: String(verticalItem.label || "").trim(),
                  enterpriseSlug: verticalItem.enterpriseSlug || null,
                  targetUrl: verticalItem.targetUrl || null,
                  isActive: verticalItem.isActive,
                };
              })
              .filter((item) => item.label && item.isActive !== false)
          : [],
        isActive: category.isActive,
      };
    })
    .filter((group) => group.label && group.isActive !== false);
}

export default function Header() {
  const [showAboutMenu, setShowAboutMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [showEnterpriseMenu, setShowEnterpriseMenu] = useState(false);
  const [hoveredBusinessGroup, setHoveredBusinessGroup] = useState<string | null>(null);
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileMessageOpen, setMobileMessageOpen] = useState(false);
  const [mobileEnterpriseOpen, setMobileEnterpriseOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);

  const [enterpriseItems, setEnterpriseItems] = useState<EnterpriseMenuItem[]>([]);
  const [dynamicBusinessVerticalGroups, setDynamicBusinessVerticalGroups] = useState<BusinessVerticalGroup[]>([]);

  const [clientLogin, setClientLogin] = useState<ClientLoginSetting | null>(null);
  const [pageVisibility, setPageVisibility] = useState<PageVisibilitySetting>({
    formerChairman: false,
  });
  const [topHeaderContact, setTopHeaderContact] = useState<OfficeContactSetting>({
    email: "",
    phone: "",
  });

  const [headerLogo, setHeaderLogo] = useState<HeaderLogoSetting>({
    logoUrl: "/images/logos/Asset 14.png",
    altText: "",
  });

  const aboutMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterpriseMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const galleryMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHeaderSettings() {
      try {
        const response = await fetch("/api/header-settings", { cache: "no-store" });

        const json = await response.json();

        if (!mounted) return;

        setEnterpriseItems(normalizeEnterprises(json?.enterprises || []));
        setPageVisibility({
          formerChairman: json?.pageVisibility?.formerChairman !== false,
        });
        setTopHeaderContact({
          email: String(json?.officeContact?.email || "").trim(),
          phone: String(json?.officeContact?.phone || "").trim(),
        });
        setDynamicBusinessVerticalGroups(
          normalizeBusinessVerticalGroups(json?.businessVerticalGroups || [])
        );

        if (json?.mainLogo?.logoUrl) {
          setHeaderLogo({
            logoUrl: json.mainLogo.logoUrl,
            altText: "",
          });
        }

        if (json?.clientLogin?.show && json?.clientLogin?.buttonUrl) {
          setClientLogin({
            show: true,
            buttonText: json.clientLogin.buttonText || "Client Login",
            buttonUrl: json.clientLogin.buttonUrl,
            openInNewTab: json.clientLogin.openInNewTab !== false,
          });
        } else {
          setClientLogin(null);
        }
      } catch (error) {
        console.error("HEADER_SETTINGS_LOAD_ERROR", error);
      }
    }

    loadHeaderSettings();

    return () => {
      mounted = false;
    };
  }, []);







  const openAboutMenu = () => {
    if (aboutMenuTimeout.current) clearTimeout(aboutMenuTimeout.current);
    setShowAboutMenu(true);
  };

  const closeAboutMenu = () => {
    aboutMenuTimeout.current = setTimeout(() => {
      setShowAboutMenu(false);
    }, 250);
  };

  const openMessageMenu = () => {
    if (messageMenuTimeout.current) clearTimeout(messageMenuTimeout.current);
    setShowMessageMenu(true);
  };

  const closeMessageMenu = () => {
    messageMenuTimeout.current = setTimeout(() => {
      setShowMessageMenu(false);
    }, 650);
  };

  const openEnterpriseMenu = () => {
    if (enterpriseMenuTimeout.current) clearTimeout(enterpriseMenuTimeout.current);
    setShowEnterpriseMenu(true);
  };

  const closeEnterpriseMenu = () => {
    enterpriseMenuTimeout.current = setTimeout(() => {
      setShowEnterpriseMenu(false);
    }, 250);
  };

  const openGalleryMenu = () => {
    if (galleryMenuTimeout.current) clearTimeout(galleryMenuTimeout.current);
    setShowGalleryMenu(true);
  };

  const closeGalleryMenu = () => {
    galleryMenuTimeout.current = setTimeout(() => {
      setShowGalleryMenu(false);
    }, 250);
  };

  const openMediaMenu = () => {
    if (mediaMenuTimeout.current) clearTimeout(mediaMenuTimeout.current);
    setShowMediaMenu(true);
  };

  const closeMediaMenu = () => {
    mediaMenuTimeout.current = setTimeout(() => {
      setShowMediaMenu(false);
    }, 250);
  };

  const menuButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    color: "#111111",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "5px",
    padding: "6px 0",
    height: "100%",
    letterSpacing: "0.045em",
    textTransform: "none" as const,
    fontFamily: "Arial, Helvetica, sans-serif",
    transition: "color 0.2s ease, transform 0.2s ease",
  };

  const compactDropdownStyle = {
    position: "absolute" as const,
    top: "calc(100% + 10px)",
    left: 0,
    right: "auto",
    minWidth: "220px",
    background: "#ffffff",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "16px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    padding: "8px 0",
    zIndex: 1000,
    overflow: "hidden",
  };

  const compactLinkStyle = {
    display: "block",
    padding: "12px 18px",
    color: "#111111",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 750,
    letterSpacing: "0.025em",
    textTransform: "capitalize" as const,
    fontFamily: "Arial, Helvetica, sans-serif",
    background: "#ffffff",
    transition: "all 0.2s ease",
  };

  const fallbackBusinessVerticalGroups: BusinessVerticalGroup[] = [
    {
      label: "Real Estate",
      items: [
        { label: "RC Property", fallbackSlug: "rc-property", match: ["property"] },
        { label: "RC Holdings", fallbackSlug: "rc-holdings", match: ["holdings"] },
        { label: "RC Bay", fallbackSlug: "rc-bay", match: ["bay"] },
      ],
    },
    {
      label: "Information Technology",
      items: [{ label: "RESDA", fallbackSlug: "resda", match: ["resda"] }],
    },
    {
      label: "Supply Chain",
      items: [
        {
          label: "AFSEN Construction",
          fallbackSlug: "afsen-construction",
          match: ["construction"],
        },
      ],
    },
    {
      label: "Agro",
      items: [
        { label: "AFSEN Agro Firm", fallbackSlug: "afsen-agro-firm", match: ["agro"] },
      ],
    },
    {
      label: "Hospitality",
      items: [
        {
          label: "ABD Foundation",
          fallbackSlug: "abd-foundation",
          match: ["abd", "foundation"],
        },
      ],
    },
  ];

  const businessVerticalGroups =
    dynamicBusinessVerticalGroups.length > 0
      ? dynamicBusinessVerticalGroups
      : fallbackBusinessVerticalGroups;

  const headerBusinessVerticalGroups = (() => {
    const housingItems: BusinessVerticalItem[] = [];
    const apartmentItems: BusinessVerticalItem[] = [];
    const hospitalityItems: BusinessVerticalItem[] = [];
    const remainingGroups: BusinessVerticalGroup[] = [];

    businessVerticalGroups.forEach((group) => {
      const groupLabel = group.label.trim().toLowerCase();

      if (groupLabel !== "real estate") {
        remainingGroups.push(group);
        return;
      }

      const leftoverItems: BusinessVerticalItem[] = [];

      group.items.forEach((item) => {
        const label = String(item.label || "").toLowerCase();
        const slug = String(item.enterpriseSlug || "").toLowerCase();

        if (label.includes("property") || slug.includes("rc-property")) {
          housingItems.push(item);
          return;
        }

        if (label.includes("holdings") || slug.includes("rc-holdings")) {
          apartmentItems.push(item);
          return;
        }

        if (label.includes("bay") || slug.includes("rc-bay")) {
          hospitalityItems.push(item);
          return;
        }

        leftoverItems.push(item);
      });

      if (leftoverItems.length > 0) {
        remainingGroups.unshift({
          ...group,
          items: leftoverItems,
        });
      }
    });

    const structuredGroups: BusinessVerticalGroup[] = [];

    if (housingItems.length > 0) {
      structuredGroups.push({
        label: "Real Estate (Housing)",
        items: housingItems,
      });
    }

    if (apartmentItems.length > 0) {
      structuredGroups.push({
        label: "Real Estate (Apartment)",
        items: apartmentItems,
      });
    }

    if (hospitalityItems.length > 0) {
      structuredGroups.push({
        label: "Real Estate (Hospitality)",
        items: hospitalityItems,
      });
    }

    return [
      ...structuredGroups,
      ...remainingGroups.filter(
        (group) => group.label.trim().toLowerCase() !== "hospitality"
      ),
    ];
  })();

  const getEnterpriseHref = (match: string[], fallbackSlug: string) => {
    const found = enterpriseItems.find((enterprise) => {
      const name = enterprise.name.toLowerCase();
      const slug = enterprise.slug.toLowerCase();
      return match.some((keyword) => name.includes(keyword) || slug.includes(keyword));
    });

    return `/business-verticals/${found?.slug || fallbackSlug}`;
  };

  const getBusinessItemHref = (item: BusinessVerticalItem) => {
    const label = String(item.label || "").toLowerCase();
    const enterpriseSlug = String(item.enterpriseSlug || "").trim().toLowerCase();
    const customUrl = String(item.targetUrl || "").trim();

    /*
      Dynamic Business Vertical items must use their own saved route first.
      This prevents old legacy enterprise matching from redirecting a new
      sub-category such as AFSEN Construction to /afsen-group.
    */
    if (customUrl) {
      return customUrl;
    }

    if (enterpriseSlug) {
      return `/business-verticals/${enterpriseSlug.replace(/^\/+/, "")}`;
    }

    const words = label
      .replace(/rc/g, "")
      .replace(/afsen/g, "")
      .split(/[^a-z0-9]+/)
      .map((word) => word.trim())
      .filter((word) => word.length >= 3);

    const matchedEnterprise = enterpriseItems.find((enterprise) => {
      const name = enterprise.name.toLowerCase();
      const slug = enterprise.slug.toLowerCase();

      if (words.some((word) => name.includes(word) || slug.includes(word))) {
        return true;
      }

      return false;
    });

    if (matchedEnterprise?.slug) {
      return `/business-verticals/${matchedEnterprise.slug}`;
    }

    if (item.match && item.fallbackSlug) {
      return getEnterpriseHref(item.match, item.fallbackSlug);
    }

    return "#";
  };

  const formatBusinessVerticalGroupLabel = (label: string) => {
    const normalized = label.trim().toLowerCase();

    if (normalized === "real estate") return "Real Estate (Housing)";
    if (normalized === "apartment") return "Real Estate (Apartment)";
    if (normalized === "hospitality") return "Real Estate (Hospitality)";

    return label;
  };

  const hasTopHeaderContact = Boolean(topHeaderContact.email || topHeaderContact.phone);

  return (
    <header className="header rcgHeader"><style>{`

        /* Mobile/tablet menu premium light theme */
        .mobile-menu-overlay {
          background: rgba(255, 255, 255, 0.96) !important;
          backdrop-filter: blur(18px) !important;
        }

        .mobile-menu-panel {
          background: #ffffff !important;
          color: #111827 !important;
        }

        .mobile-menu-panel a:not(.client-login-mobile-cta) {
          color: #111827 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          text-decoration: none !important;
        }

        .mobile-submenu-toggle {
          color: #111827 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          font-weight: 900 !important;
        }

        .mobile-submenu-toggle.active {
          color: #111827 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .mobile-submenu-toggle span {
          color: inherit !important;
        }

        .mobile-submenu {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .mobile-submenu a {
          color: #111827 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .mobile-menu-close,
        .mobile-close-button {
          color: #111827 !important;
        }



        .client-login-mobile-cta {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: calc(100% - 34px) !important;
          margin: 22px 17px 0 !important;
          padding: 15px 18px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          color: #ffffff !important;
          background: linear-gradient(135deg, #075c9d, #16a34a) !important;
          box-shadow: 0 16px 34px rgba(7, 92, 157, 0.24) !important;
          font-size: 13px !important;
          font-weight: 950 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        .client-login-mobile-cta span {
          color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1 !important;
        }

        .rcgHeaderInner {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding-left: 78px !important;
          padding-right: 78px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }

        .rcgHeaderLogoWrap {
          position: relative;
          width: 380px;
          height: 64px;
        }

        .rcgDesktopNav {
          margin-left: auto !important;
          margin-right: 0 !important;
          justify-content: flex-end !important;
        }

        .mobile-menu-toggle {
          width: 56px !important;
          height: 56px !important;
          padding: 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 18px !important;
          background: #050816 !important;
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.22),
            0 0 0 4px rgba(255, 255, 255, 0.72) !important;
          display: none !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            background 0.24s ease,
            border-color 0.24s ease !important;
        }

        .mobile-menu-toggle:hover {
          transform: translateY(-3px) scale(1.04) !important;
          background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%) !important;
          border-color: rgba(255, 255, 255, 0.22) !important;
          box-shadow:
            0 18px 34px rgba(37, 99, 235, 0.22),
            0 0 0 5px rgba(37, 99, 235, 0.12) !important;
        }

        .mobile-menu-dot-badge {
          width: 18px !important;
          height: 18px !important;
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          grid-template-rows: repeat(3, 1fr) !important;
          gap: 3px !important;
          place-items: center !important;
          align-content: center !important;
          justify-content: center !important;
          margin: 0 auto !important;
        }

        .mobile-menu-dot-badge span {
          width: 4px !important;
          height: 4px !important;
          border-radius: 999px !important;
          background: #ffffff !important;
          display: block !important;
          transition:
            background 0.24s ease,
            transform 0.24s ease,
            opacity 0.24s ease !important;
        }

        .mobile-menu-toggle:hover .mobile-menu-dot-badge span {
          background: #ffffff !important;
          transform: scale(1.08) !important;
        }

        @media (max-width: 1200px) {
  
        .client-login-mobile-cta {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: calc(100% - 34px) !important;
          margin: 22px 17px 0 !important;
          padding: 15px 18px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          color: #ffffff !important;
          background: linear-gradient(135deg, #075c9d, #16a34a) !important;
          box-shadow: 0 16px 34px rgba(7, 92, 157, 0.24) !important;
          font-size: 13px !important;
          font-weight: 950 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        .client-login-mobile-cta span {
          color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1 !important;
        }

        .rcgHeaderInner {
            padding-left: 34px !important;
            padding-right: 34px !important;
          }

          .rcgHeaderLogoWrap {
            width: 320px;
            height: 58px;
          }

          .rcgDesktopNav {
            gap: 20px !important;
          }
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: inline-flex !important;
          }

          .desktop-nav,
          .rcgDesktopNav {
            display: none !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-menu-toggle {
            display: none !important;
          }

          .desktop-nav,
          .rcgDesktopNav {
            display: flex !important;
          }
        }

        @media (max-width: 900px) {
  
        .client-login-mobile-cta {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: calc(100% - 34px) !important;
          margin: 22px 17px 0 !important;
          padding: 15px 18px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          color: #ffffff !important;
          background: linear-gradient(135deg, #075c9d, #16a34a) !important;
          box-shadow: 0 16px 34px rgba(7, 92, 157, 0.24) !important;
          font-size: 13px !important;
          font-weight: 950 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        .client-login-mobile-cta span {
          color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1 !important;
        }

        .rcgHeaderInner {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .rcgHeaderLogoWrap {
            width: 250px;
            height: 54px;
          }
        }
          @media (max-width: 1024px) {
  .rcgHeaderInner {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 12px !important;
    min-height: 86px !important;
    padding-left: 18px !important;
    padding-right: 18px !important;
  }

  .rcgHeaderLogoLink {
    margin-right: auto !important;
    flex-shrink: 1 !important;
  }

  .rcgHeaderLogoWrap {
    width: 240px !important;
    height: 56px !important;
  }

  .mobile-menu-toggle {
    display: inline-flex !important;
    margin-left: auto !important;
    margin-right: 0 !important;
    flex-shrink: 0 !important;
  }

  .desktop-nav,
  .rcgDesktopNav {
    display: none !important;
  }
}

@media (max-width: 520px) {
  .rcgHeaderInner {
    min-height: 82px !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
  }

  .rcgHeaderLogoWrap {
    width: 220px !important;
    height: 52px !important;
  }

  .mobile-menu-toggle {
    width: 52px !important;
    height: 52px !important;
    border-radius: 17px !important;
  }
}

        /* Final Client Login CTA desktop/mobile style */
        .client-login-desktop-cta {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          min-height: 42px !important;
          padding: 0 18px !important;
          border-radius: 999px !important;
          text-decoration: none !important;
          color: #ffffff !important;
          background: linear-gradient(135deg, #075c9d, #16a34a) !important;
          box-shadow: 0 14px 30px rgba(7, 92, 157, 0.22) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
          font-family: Arial, Helvetica, sans-serif !important;
          white-space: nowrap !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }

        .client-login-desktop-cta:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 18px 38px rgba(7, 92, 157, 0.3) !important;
        }

        .client-login-desktop-cta span {
          color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1 !important;
        }
        .rcgDesktopNav > a,
        .rcgDesktopNav > div > button.desktop-menu-btn {
          text-transform: none !important;
        }



        /* RCG_TOP_HEADER_RIGHT_ALIGN_START */
        .rcgTopHeaderBar {
          width: 100% !important;
        }

        .rcgTopHeaderBar > .container,
        .rcgTopHeaderBar .container {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 34px !important;
          padding-right: 92px !important;
          text-align: right !important;
        }

        .rcgTopHeaderBar a {
          white-space: nowrap !important;
        }

        @media (max-width: 768px) {
          .rcgTopHeaderBar > .container,
          .rcgTopHeaderBar .container {
            justify-content: center !important;
            padding-right: 16px !important;
            padding-left: 16px !important;
            gap: 16px !important;
            flex-wrap: wrap !important;
          }
        }
        /* RCG_TOP_HEADER_RIGHT_ALIGN_END */
      `}</style>
      {hasTopHeaderContact ? (
        <div
          className="rcgTopHeaderBar"
          style={{
            background: "linear-gradient(90deg, #075c9d 0%, #159447 100%)",
            color: "#ffffff",
          }}
        >
          <div
            className="container"
            style={{
              minHeight: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "36px",
              flexWrap: "wrap",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {topHeaderContact.email ? (
              <a
                href={`mailto:${topHeaderContact.email}`}
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                E-mail: {topHeaderContact.email}
              </a>
            ) : null}

            {topHeaderContact.phone ? (
              <a
                href={`tel:${topHeaderContact.phone.replace(/[^+\\d]/g, "")}`}
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Hotline: {topHeaderContact.phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="container header-inner rcgHeaderInner">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="rcgHeaderLogoLink"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div className="header-logo-wrap rcgHeaderLogoWrap">
            <Image
              src={headerLogo.logoUrl}
              alt=""
              fill
              priority
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </div>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="mobile-menu-dot-badge" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

                <nav
          className="nav desktop-nav rcgDesktopNav"
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            position: "relative",
          }}
        >
          <Link
            href="/"
            className="desktop-home-link"
            aria-label="Home"
            title="Home"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              border: "1px solid rgba(15,23,42,0.16)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#111111",
              textDecoration: "none",
              background: "#ffffff",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.8V21h14V9.8" />
              <path d="M9.5 21v-6h5v6" />
            </svg>
          </Link>

          <div
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            onMouseEnter={openAboutMenu}
            onMouseLeave={closeAboutMenu}
          >
            <button
              type="button"
              onClick={() => setShowAboutMenu((prev) => !prev)}
              className="desktop-menu-btn"
              style={{
                ...menuButtonStyle,
                color: showAboutMenu ? "#3aa0ff" : "#111111",
              }}
            >
              About Us {"\u25BE"}
            </button>

            {showAboutMenu && (
              <div
                onMouseEnter={openAboutMenu}
                onMouseLeave={closeAboutMenu}
                style={{ ...compactDropdownStyle, width: "285px", overflow: "visible" }}
              >
                <Link
                  href="/about/corporate-profile"
                  onClick={() => setShowAboutMenu(false)}
                  className="dropdown-sub-link"
                  style={{
                    ...compactLinkStyle,
                    borderBottom: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Corporate Profile
                </Link>

                <Link
                  href="/about/mission-vision-values"
                  onClick={() => setShowAboutMenu(false)}
                  className="dropdown-sub-link"
                  style={{
                    ...compactLinkStyle,
                    borderBottom: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Mission Vision &amp; Values
                </Link>

                {pageVisibility.formerChairman ? (
                  <Link
                    href="/message/former-chairman"
                    onClick={() => setShowAboutMenu(false)}
                    className="dropdown-sub-link"
                    style={{
                      ...compactLinkStyle,
                      borderBottom: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Chairman Message
                  </Link>
                ) : null}

                <Link
                  href="/message/board-of-directors/mohammad-arifuzzaman"
                  onClick={() => setShowAboutMenu(false)}
                  className="dropdown-sub-link"
                  style={{
                    ...compactLinkStyle,
                    borderBottom: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Managing Director &amp; CEO Message
                </Link>

                <Link
                  href="/message/board-of-directors"
                  onClick={() => setShowAboutMenu(false)}
                  className="dropdown-sub-link"
                  style={compactLinkStyle}
                >
                  Board of Director's Message
                </Link>
              </div>
            )}

          </div>
          <div
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            onMouseEnter={openEnterpriseMenu}
            onMouseLeave={closeEnterpriseMenu}
          >
            <button
              type="button"
              onClick={() => setShowEnterpriseMenu((prev) => !prev)}
              className="desktop-menu-btn"
              style={{
                ...menuButtonStyle,
                color: showEnterpriseMenu ? "#3aa0ff" : "#111111",
              }}
            >
              Business Vertical {"\u25BE"}
            </button>

            {showEnterpriseMenu && (
              <div
                onMouseEnter={openEnterpriseMenu}
                onMouseLeave={() => {
                  closeEnterpriseMenu();
                  setHoveredBusinessGroup(null);
                }}
                style={{
                  ...compactDropdownStyle,
                  left: 0,
                  right: "auto",
                  width: "260px",
                  overflow: "visible",
                  padding: "8px 0",
                }}
              >
                {headerBusinessVerticalGroups.map((group, groupIndex) => (
                  <div
                    key={group.label}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredBusinessGroup(group.label)}
                  >
                    <button
                      type="button"
                      className="dropdown-sub-link"
                      onClick={() =>
                        setHoveredBusinessGroup((prev) =>
                          prev === group.label ? null : group.label
                        )
                      }
                      style={{
                        ...compactLinkStyle,
                        width: "100%",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom:
                          groupIndex !== headerBusinessVerticalGroups.length - 1
                            ? "1px solid rgba(15,23,42,0.08)"
                            : "none",
                        color: "#111111",
                        fontWeight: 700,
                        textTransform: "none",
                        letterSpacing: "normal",
                      }}
                    >
                      <span>{formatBusinessVerticalGroupLabel(group.label)}</span>
                      <span>{"\u203A"}</span>
                    </button>

                    {hoveredBusinessGroup === group.label && (
                      <div
                        style={{
                          ...compactDropdownStyle,
                          top: 0,
                          left: "calc(100% - 1px)",
                          marginLeft: "0px",
                          width: "220px",
                          overflow: "hidden",
                          zIndex: 9999,
                        }}
                      >
                        {group.items.map((item, itemIndex) => (
                          <Link
                            key={item.label}
                            href={getBusinessItemHref(item)}
                            className="dropdown-sub-link"
                            onClick={() => {
                              setShowEnterpriseMenu(false);
                              setHoveredBusinessGroup(null);
                            }}
                            style={{
                              ...compactLinkStyle,
                              borderBottom:
                                itemIndex !== group.items.length - 1
                                  ? "1px solid rgba(15,23,42,0.08)"
                                  : "none",
                              textTransform: "none",
                              color: "#111111",
                              fontWeight: 700,
                              letterSpacing: "normal",
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            onMouseEnter={openGalleryMenu}
            onMouseLeave={closeGalleryMenu}
          >
            <button
              type="button"
              onClick={() => setShowGalleryMenu((prev) => !prev)}
              className="desktop-menu-btn"
              style={{
                ...menuButtonStyle,
                color: showGalleryMenu ? "#3aa0ff" : "#111111",
              }}
            >
              Gallery {"\u25BE"}
            </button>

            {showGalleryMenu && (
              <div
                onMouseEnter={openGalleryMenu}
                onMouseLeave={closeGalleryMenu}
                style={{ ...compactDropdownStyle, width: "190px" }}
              >
                {galleryItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="dropdown-sub-link"
                    onClick={() => setShowGalleryMenu(false)}
                    style={{
                      ...compactLinkStyle,
                      borderBottom:
                        index !== galleryItems.length - 1
                          ? "1px solid rgba(15,23,42,0.08)"
                          : "none",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            style={{ position: "relative", display: "flex", alignItems: "center" }}
            onMouseEnter={openMediaMenu}
            onMouseLeave={closeMediaMenu}
          >
            <button
              type="button"
              onClick={() => setShowMediaMenu((prev) => !prev)}
              className="desktop-menu-btn"
              style={{
                ...menuButtonStyle,
                color: showMediaMenu ? "#3aa0ff" : "#111111",
              }}
            >
              Media {"\u25BE"}
            </button>

            {showMediaMenu && (
              <div
                onMouseEnter={openMediaMenu}
                onMouseLeave={closeMediaMenu}
                style={{ ...compactDropdownStyle, width: "190px" }}
              >
                {mediaItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="dropdown-sub-link"
                    onClick={() => setShowMediaMenu(false)}
                    style={{
                      ...compactLinkStyle,
                      borderBottom:
                        index !== mediaItems.length - 1
                          ? "1px solid rgba(15,23,42,0.08)"
                          : "none",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/career"
            className="desktop-career-link"
            style={{
              textDecoration: "none",
              color: "#111111",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.045em",
              textTransform: "none",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            Career
          </Link>


          <Link
            href="/contact"
            className="desktop-contact-link"
            style={{
              textDecoration: "none",
              color: "#111111",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.045em",
              textTransform: "none",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            Contact
          </Link>

          {clientLogin ? (
            <a
              href={clientLogin.buttonUrl}
              className="client-login-desktop-cta"
              target={clientLogin.openInNewTab ? "_blank" : undefined}
              rel={clientLogin.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {clientLogin.buttonText} <span>{"\u2192"}</span>
            </a>
          ) : null}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-top">
              <div className="mobile-menu-logo">
                <Image
                  src={headerLogo.logoUrl}
                  alt=""
                  fill
                  style={{ objectFit: "contain", objectPosition: "left center" }}
                />
              </div>

              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

                        <div className="mobile-menu-links">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>

              <button
                type="button"
                className={`mobile-submenu-toggle ${mobileAboutOpen ? "active" : ""}`}
                onClick={() => setMobileAboutOpen((prev) => !prev)}
              >
                <span>About Us</span>
                <span>{"\u25BE"}</span>
              </button>

              {mobileAboutOpen && (
                <div className="mobile-submenu">
                  <Link
                    href="/about/corporate-profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Corporate Profile
                  </Link>

                  <Link
                    href="/about/mission-vision-values"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mission Vision &amp; Values
                  </Link>

                  {pageVisibility.formerChairman ? (
                    <Link
                      href="/message/former-chairman"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Chairman Message
                    </Link>
                  ) : null}

                  <Link
                    href="/message/board-of-directors/mohammad-arifuzzaman"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Managing Director &amp; CEO Message
                  </Link>

                  <Link
                    href="/message/board-of-directors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Board of Director's Message
                  </Link>
                </div>
              )}


              <button
                type="button"
                className={`mobile-submenu-toggle ${
                  mobileEnterpriseOpen ? "active" : ""
                }`}
                onClick={() => setMobileEnterpriseOpen((prev) => !prev)}
              >
                <span>Business Vertical</span>
                <span>{"\u25BE"}</span>
              </button>

              {mobileEnterpriseOpen && (
                <div className="mobile-submenu">
                  {headerBusinessVerticalGroups.map((group) => (
                    <div
                      key={group.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          margin: "12px 0 4px",
                          color: "#111111",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "normal",
                          textTransform: "none",
                        }}
                      >
                        {group.label}
                      </div>

                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={getBusinessItemHref(item)}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ paddingLeft: "14px" }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className={`mobile-submenu-toggle ${mobileGalleryOpen ? "active" : ""}`}
                onClick={() => setMobileGalleryOpen((prev) => !prev)}
              >
                <span>Gallery</span>
                <span>{"\u25BE"}</span>
              </button>

              {mobileGalleryOpen && (
                <div className="mobile-submenu">
                  {galleryItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={`mobile-submenu-toggle ${mobileMediaOpen ? "active" : ""}`}
                onClick={() => setMobileMediaOpen((prev) => !prev)}
              >
                <span>Media</span>
                <span>{"\u25BE"}</span>
              </button>

              {mobileMediaOpen && (
                <div className="mobile-submenu">
                  {mediaItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/career" onClick={() => setMobileMenuOpen(false)}>
                Career
              </Link>


              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>

              {clientLogin ? (
                <a
                  href={clientLogin.buttonUrl}
                  className="client-login-mobile-cta"
                  target={clientLogin.openInNewTab ? "_blank" : undefined}
                  rel={clientLogin.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {clientLogin.buttonText} <span>{"\u2192"}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}

      
    </header>
  );
}


















