"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type SocialLink = {
  id: string;
  label: string;
  href: string;
  iconUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminSocialSettingsPage() {
      const router = useRouter();
  const pathname = usePathname();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLinks() {
      try {
        const res = await fetch("/api/admin/social-links", {
          credentials: "include",
        });

    const data = await res.json();

if (res.status === 401) {
  router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  return;
}

if (!res.ok || !data.success) {
  setError(data.message || "Failed to load social links");
  return;
}
        setLinks(data.data || []);
      } catch {
        setError("Failed to load social links");
      } finally {
        setLoading(false);
      }
    }

    loadLinks();
   }, [router, pathname]);

  function updateLink(index: number, field: keyof SocialLink, value: string | boolean) {
    setLinks((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/social-links", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          links: links.map((item) => ({
            label: item.label,
            href: item.href,
            iconUrl: item.iconUrl,
            sortOrder: item.sortOrder,
            isActive: item.isActive,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update social links");
        return;
      }

      setLinks(data.data || links);
      setMessage("Social media links updated successfully.");
    } catch {
      setError("Failed to update social links");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <p style={styles.text}>Loading social media settings...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <a href="/admin/settings" style={styles.backLink}>
          ← Back to Settings
        </a>

        <div style={styles.header}>
          <span style={styles.badge}>Social Media</span>
          <h1 style={styles.title}>Social Media Settings</h1>
          <p style={styles.subtitle}>
            Update footer and floating social media links from one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.list}>
            {links.map((item, index) => (
              <div key={item.id || item.label} style={styles.row}>
                <div style={styles.rowHeader}>
                  <div>
                    <h2 style={styles.linkTitle}>{item.label}</h2>
                    <p style={styles.linkHint}>Update the public {item.label} URL.</p>
                  </div>

                  <label style={styles.toggleWrap}>
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(event) =>
                        updateLink(index, "isActive", event.target.checked)
                      }
                    />
                    <span>Active</span>
                  </label>
                </div>

                <label style={styles.label}>URL</label>
                <input
                  type="url"
                  value={item.href}
                  onChange={(event) => updateLink(index, "href", event.target.value)}
                  placeholder={`Enter ${item.label} link`}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save Social Links"}
            </button>

            <a href="/admin/settings" style={styles.secondaryBtn}>
              Back
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef8fb 0%, #dff4fb 100%)",
    padding: "64px 24px",
  },
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-flex",
    marginBottom: "22px",
    color: "#15803d",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 800,
  },
  header: {
    marginBottom: "26px",
  },
  badge: {
    display: "inline-block",
    marginBottom: "10px",
    color: "#16a34a",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 10px",
    color: "#0f172a",
    fontSize: "44px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "17px",
    lineHeight: 1.7,
  },
  card: {
    borderRadius: "28px",
    background: "#ffffff",
    border: "1px solid rgba(226,232,240,0.95)",
    boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
    padding: "34px",
  },
  list: {
    display: "grid",
    gap: "20px",
  },
  row: {
    borderRadius: "22px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "22px",
  },
  rowHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  linkTitle: {
    margin: "0 0 5px",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: 900,
  },
  linkHint: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  toggleWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800,
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "14px 16px",
    fontSize: "16px",
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginTop: "28px",
  },
  primaryBtn: {
    minHeight: "50px",
    border: "none",
    borderRadius: "999px",
    padding: "0 30px",
    background: "linear-gradient(135deg, #16a34a 0%, #2563eb 100%)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37,99,235,0.24)",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50px",
    borderRadius: "999px",
    padding: "0 30px",
    background: "#0f172a",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  successBox: {
    marginBottom: "22px",
    borderRadius: "14px",
    border: "1px solid #bbf7d0",
    background: "#ecfdf5",
    color: "#15803d",
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: 800,
  },
  errorBox: {
    marginBottom: "22px",
    borderRadius: "14px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: 800,
  },
  text: {
    color: "#475569",
    fontSize: "16px",
  },
};