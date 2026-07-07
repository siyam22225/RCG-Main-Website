"use client";

import { usePathname } from "next/navigation";
import PublicContentProtection from "@/components/common/PublicContentProtection";

export default function ConditionalPublicContentProtection() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <PublicContentProtection />;
}
