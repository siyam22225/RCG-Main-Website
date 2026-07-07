import HeroSlider from "@/sections/home/HeroSlider";
import LatestNews from "@/sections/home/LatestNews";

import EnterpriseGrid from "@/sections/home/EnterpriseGrid";
import LogoSlider from "@/sections/home/LogoSlider";
import ContactMap from "@/sections/home/ContactMap";

export default function HomePage() {
  return (
 <div
  style={{
    background: "transparent",
  }}
>
  <HeroSlider />
  <LatestNews />

  <EnterpriseGrid />
  <LogoSlider />
  <ContactMap />
</div>
  );
}