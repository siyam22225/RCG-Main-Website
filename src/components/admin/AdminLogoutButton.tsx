"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        cache: "no-store",
      });

   window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        border: "none",
        padding: "12px 18px",
        borderRadius: "999px",
        background: "#dc2626",
        color: "#ffffff",
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 10px 24px rgba(220,38,38,0.22)",
      }}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}