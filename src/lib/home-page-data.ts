import { prisma } from "@/lib/prisma";
import { safePublicMediaUrl } from "@/lib/public-media";

export type HomePageSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonHref: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type HomePageBrandLogo = {
  id: string | number;
  name: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder?: number;
};

const FALLBACK_HERO_IMAGE = "/images/hero/slide-1.jpg";

const fallbackSlides: HomePageSlide[] = [
  {
    id: "fallback-1",
    title: "",
    subtitle: "",
    imageUrl: FALLBACK_HERO_IMAGE,
    buttonText: "",
    buttonHref: "",
    isActive: true,
  },
];

const fallbackBrandLogos: HomePageBrandLogo[] = [
  { id: 1, name: "Logo 01", imageUrl: "/images/logos/logo-1.png" },
  { id: 2, name: "Logo 02", imageUrl: "/images/logos/logo-2.png" },
  { id: 3, name: "Logo 03", imageUrl: "/images/logos/logo-3.png" },
  { id: 4, name: "Logo 04", imageUrl: "/images/logos/logo-4.png" },
];

const fallbackMainLogo = {
  logoUrl: "/images/logos/Asset 14.png",
  altText: "Real Capita Group",
  isEnabled: true,
};

async function getHomeSlides() {
  try {
    const slides = await prisma.homeSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        subtitle: true,
        imageUrl: true,
        buttonText: true,
        buttonHref: true,
        sortOrder: true,
        isActive: true,
      },
    });

    if (!slides.length) return fallbackSlides;

    return slides.map((slide) => ({
      ...slide,
      imageUrl: safePublicMediaUrl(slide.imageUrl, FALLBACK_HERO_IMAGE) || FALLBACK_HERO_IMAGE,
    }));
  } catch (error) {
    console.error("HOME_PAGE_SLIDES_ERROR", error);
    return fallbackSlides;
  }
}

async function getHomepageLogoSettings() {
  try {
    const [mainLogo, brandLogos] = await Promise.all([
      prisma.websiteLogoSetting.findUnique({
        where: { id: "main" },
        select: {
          logoUrl: true,
          altText: true,
          isEnabled: true,
        },
      }),
      prisma.brandLogo.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          name: true,
          imageUrl: true,
          linkUrl: true,
          sortOrder: true,
        },
      }),
    ]);

    const validBrandLogos: HomePageBrandLogo[] = [];

    for (const logo of brandLogos) {
      const imageUrl = safePublicMediaUrl(logo.imageUrl);

      if (imageUrl) {
        validBrandLogos.push({
          ...logo,
          name: logo.name || "Brand Logo",
          imageUrl,
        });
      }
    }

    return {
      mainLogo:
        mainLogo?.isEnabled && safePublicMediaUrl(mainLogo.logoUrl)
          ? {
              logoUrl: mainLogo.logoUrl,
              altText: mainLogo.altText || fallbackMainLogo.altText,
              isEnabled: true,
            }
          : fallbackMainLogo,
      brandLogos: validBrandLogos.length ? validBrandLogos : fallbackBrandLogos,
    };
  } catch (error) {
    console.error("HOME_PAGE_LOGOS_ERROR", error);
    return {
      mainLogo: fallbackMainLogo,
      brandLogos: fallbackBrandLogos,
    };
  }
}

export async function getHomePageData() {
  const [heroSlides, logoSettings] = await Promise.all([
    getHomeSlides(),
    getHomepageLogoSettings(),
  ]);

  return {
    heroSlides,
    logoSettings,
  };
}
