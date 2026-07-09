import HeroSlider from "@/sections/home/HeroSlider";
import LatestNews from "@/sections/home/LatestNews";

import EnterpriseGrid from "@/sections/home/EnterpriseGrid";
import LogoSlider from "@/sections/home/LogoSlider";
import ContactMap from "@/sections/home/ContactMap";
import { getHomePageData } from "@/lib/home-page-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const homePageData = await getHomePageData();

  return (
 <div
  style={{
    background: "transparent",
  }}
>
  <HeroSlider initialSlides={homePageData.heroSlides} />
  <LatestNews />

  <EnterpriseGrid />
  <LogoSlider initialLogos={homePageData.logoSettings.brandLogos} />
  <ContactMap />
</div>
  );
}
