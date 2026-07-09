import { prisma } from "@/lib/prisma";
import { getEffectiveFormerChairmanMessage } from "@/lib/formerChairman";
import { safePublicMediaUrl } from "@/lib/public-media";

const fallbackEnterprises = [
  { id: "land-rpcdl", slug: "land-rpcdl", name: "RC Property", isActive: true },
  { id: "apartment-rchl", slug: "apartment-rchl", name: "RC Holdings", isActive: true },
  { id: "hotel-rc-bay", slug: "hotel-rc-bay", name: "RC-BAY", isActive: true },
  { id: "resda", slug: "resda", name: "RESDA", isActive: true },
  { id: "afsen-group", slug: "afsen-group", name: "AFSEN Construction", isActive: true },
  { id: "abdf", slug: "abdf", name: "ABD Foundation", isActive: true },
];

const fallbackLogo = {
  logoUrl: "/images/logos/Asset 14.png",
  altText: "Real Capita Group",
};

const fallbackOfficeContact = {
  email: "",
  phone: "",
};

export async function getHeaderShellData() {
  try {
    const [
      enterprises,
      logo,
      client,
      formerChairmanMessage,
      officeSetting,
      businessVerticalGroups,
    ] = await Promise.all([
      prisma.enterprise.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          isActive: true,
        },
      }),
      prisma.websiteLogoSetting.findUnique({
        where: { id: "main" },
        select: {
          logoUrl: true,
          altText: true,
          isEnabled: true,
        },
      }),
      prisma.clientLoginSetting.findUnique({
        where: { id: "main" },
        select: {
          buttonText: true,
          buttonUrl: true,
          isEnabled: true,
          openInNewTab: true,
        },
      }),
      getEffectiveFormerChairmanMessage(),
      prisma.officeSetting.findFirst({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          email: true,
          phone: true,
        },
      }),
      prisma.businessVerticalCategory.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          label: true,
          slug: true,
          displayOrder: true,
          isActive: true,
          items: {
            where: { isActive: true },
            orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              label: true,
              enterpriseSlug: true,
              targetUrl: true,
              displayOrder: true,
              isActive: true,
            },
          },
        },
      }),
    ]);

    return {
      enterprises: enterprises.length ? enterprises : fallbackEnterprises,
      mainLogo:
        logo?.isEnabled && logo.logoUrl
          ? {
              logoUrl: logo.logoUrl,
              altText: logo.altText || "Real Capita Group",
            }
          : fallbackLogo,
      officeContact: officeSetting
        ? {
            email: officeSetting.email || "",
            phone: officeSetting.phone || "",
          }
        : fallbackOfficeContact,
      businessVerticalGroups,
      pageVisibility: {
        formerChairman: formerChairmanMessage?.isActive !== false,
      },
      clientLogin:
        client?.isEnabled && client.buttonUrl
          ? {
              show: true,
              buttonText: client.buttonText || "Client Login",
              buttonUrl: client.buttonUrl,
              openInNewTab: client.openInNewTab,
            }
          : { show: false },
    };
  } catch (error) {
    console.error("SITE_SHELL_HEADER_ERROR", error);

    return {
      enterprises: fallbackEnterprises,
      mainLogo: fallbackLogo,
      officeContact: fallbackOfficeContact,
      businessVerticalGroups: [],
      pageVisibility: {
        formerChairman: true,
      },
      clientLogin: { show: false },
    };
  }
}

export async function getContactShellData() {
  try {
    const [offices, socialLinks] = await Promise.all([
      prisma.officeSetting.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          key: true,
          title: true,
          address: true,
          phone: true,
          email: true,
          mapUrl: true,
          sortOrder: true,
        },
      }),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          label: true,
          href: true,
          iconUrl: true,
          sortOrder: true,
        },
      }),
    ]);

    return {
      success: true,
      offices,
      socialLinks,
    };
  } catch (error) {
    console.error("SITE_SHELL_CONTACT_ERROR", error);
    return {
      success: false,
      offices: [],
      socialLinks: [],
    };
  }
}

export async function getPopupShellData() {
  try {
    const popup = await prisma.sitePopupSetting.findUnique({
      where: { id: "main" },
      select: {
        id: true,
        isActive: true,
        isTitleActive: true,
        isMessageActive: true,
        isButtonActive: true,
        title: true,
        message: true,
        imageUrl: true,
        buttonText: true,
        buttonHref: true,
        showOncePerSession: true,
        autoCloseSeconds: true,
        updatedAt: true,
      },
    });

    return popup
      ? {
          ...popup,
          imageUrl: safePublicMediaUrl(popup.imageUrl),
          updatedAt: popup.updatedAt.toISOString(),
        }
      : null;
  } catch (error) {
    console.error("SITE_SHELL_POPUP_ERROR", error);
    return null;
  }
}

export async function getSiteShellData() {
  const [header, contact, popup] = await Promise.all([
    getHeaderShellData(),
    getContactShellData(),
    getPopupShellData(),
  ]);

  return {
    header,
    contact,
    socialLinks: contact.socialLinks,
    popup,
  };
}
