"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import PublicContentProtection from "@/components/common/PublicContentProtection";
import SitePopup from "@/components/layout/SitePopup";

const adminBackground =
  "radial-gradient(circle at 8% 0%, rgba(14, 165, 233, 0.18), transparent 30%), radial-gradient(circle at 92% 12%, rgba(34, 197, 94, 0.18), transparent 28%), linear-gradient(135deg, #eef8fd 0%, #f8fbff 50%, #ecfff4 100%)";

export default function SiteChrome({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: adminBackground,
        }}
      >
        {children}
      </main>
    );
  }

  return (
    <>
      <PublicContentProtection />
      <Header />
      <SocialSidebar />
      <main
        style={{
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        {children}
      </main>
      <SitePopup />
      <Footer />
    </>
  );
}
