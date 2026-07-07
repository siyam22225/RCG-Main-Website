"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type OfficeSetting = {
  id?: string;
  key: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  mapUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function ContactOfficeSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [offices, setOffices] = useState<OfficeSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffices() {
      try {
        const res = await fetch("/api/admin/office-settings", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 401) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load office settings");
          return;
        }

        setOffices(data.data || []);
      } catch {
        setError("Failed to load office settings");
      } finally {
        setLoading(false);
      }
    }

    loadOffices();
  }, [router, pathname]);

  function updateOffice(
    index: number,
    field: keyof OfficeSetting,
    value: string | number | boolean
  ) {
    setOffices((current) =>
      current.map((office, officeIndex) =>
        officeIndex === index ? { ...office, [field]: value } : office
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/office-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          offices: offices.map((office) => ({
            key: office.key,
            title: office.title,
            address: office.address,
            phone: office.phone,
            email: office.email,
            mapUrl: office.mapUrl || null,
            sortOrder: Number(office.sortOrder) || 0,
            isActive: office.isActive,
          })),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update office settings");
        return;
      }

      setOffices(data.data || offices);
      setMessage("Contact and office settings updated successfully.");
    } catch {
      setError("Failed to update office settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>Loading contact and office settings...</div>
        </section>
      </main>
    );
  }

  const topHeaderOffice = offices[0];

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <a href="/admin/settings" style={styles.backLink}>
          {"\u2190"} Back to Settings
        </a>

        <div style={styles.header}>
          <span style={styles.badge}>Contact</span>
          <h1 style={styles.title}>Contact & Office Settings</h1>
          <p style={styles.subtitle}>
            Update corporate office, sales office, phone, email, and map related
            information from one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <section style={styles.topHeaderEditor}>
            <div style={styles.topHeaderEditorTop}>
              <div>
                <span style={styles.topHeaderMiniBadge}>Header Contact</span>
                <h2 style={styles.topHeaderEditorTitle}>
                  Top Header E-mail & Hotline
                </h2>
                <p style={styles.topHeaderEditorText}>
                  These two fields control the clickable E-mail and Hotline shown
                  in the public website top header.
                </p>
              </div>

              <span style={styles.topHeaderSourceBadge}>
                Linked to first office
              </span>
            </div>

            {topHeaderOffice ? (
              <div style={styles.topHeaderGrid}>
                <div>
                  <label style={styles.label}>Top Header E-mail</label>
                  <input
                    type="email"
                    value={topHeaderOffice.email}
                    onChange={(event) =>
                      updateOffice(0, "email", event.target.value)
                    }
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Top Header Hotline</label>
                  <input
                    value={topHeaderOffice.phone}
                    onChange={(event) =>
                      updateOffice(0, "phone", event.target.value)
                    }
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            ) : (
              <div style={styles.topHeaderMissing}>
                No office entry found. Add office data first to control the top header.
              </div>
            )}
          </section>

          <div style={styles.sectionDivider} />

          <div style={styles.list}>
            {offices.map((office, index) => (
              <div key={office.key} style={styles.officeCard}>
                <div style={styles.officeTop}>
                  <div>
                    <h2 style={styles.officeTitle}>{office.title}</h2>
                    <p style={styles.officeKey}>{office.key}</p>

                    {index === 0 ? (
                      <span style={styles.officeHeaderBadge}>
                        Top Header Source
                      </span>
                    ) : null}
                  </div>

                  <label style={styles.checkWrap}>
                    <input
                      type="checkbox"
                      checked={office.isActive}
                      onChange={(event) =>
                        updateOffice(index, "isActive", event.target.checked)
                      }
                    />
                    Active
                  </label>
                </div>

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>Office Title</label>
                    <input
                      value={office.title}
                      onChange={(event) =>
                        updateOffice(index, "title", event.target.value)
                      }
                      style={styles.input}
                      required
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Sort Order</label>
                    <input
                      type="number"
                      value={office.sortOrder}
                      onChange={(event) =>
                        updateOffice(index, "sortOrder", Number(event.target.value))
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Address</label>
                    <textarea
                      value={office.address}
                      onChange={(event) =>
                        updateOffice(index, "address", event.target.value)
                      }
                      style={styles.textarea}
                      required
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Phone</label>
                    <input
                      value={office.phone}
                      onChange={(event) =>
                        updateOffice(index, "phone", event.target.value)
                      }
                      style={styles.input}
                      required
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      value={office.email}
                      onChange={(event) =>
                        updateOffice(index, "email", event.target.value)
                      }
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Map URL / Embed Link</label>
                    <input
                      value={office.mapUrl || ""}
                      onChange={(event) =>
                        updateOffice(index, "mapUrl", event.target.value)
                      }
                      style={styles.input}
                      placeholder="Optional Google Map link"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save Office Settings"}
            </button>

            <a href="/admin/settings" style={styles.darkBtn}>
              Back
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef8fb 0%, #dff4fb 100%)",
    padding: "64px 24px",
  },
  wrapper: {
    maxWidth: "980px",
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
  topHeaderEditor: {
    borderRadius: "24px",
    padding: "24px",
    background:
      "linear-gradient(135deg, rgba(7,92,157,0.08), rgba(21,148,71,0.10))",
    border: "1px solid rgba(7,92,157,0.16)",
  },
  topHeaderEditorTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "18px",
    marginBottom: "20px",
  },
  topHeaderMiniBadge: {
    display: "inline-flex",
    marginBottom: "10px",
    borderRadius: "999px",
    padding: "6px 11px",
    background: "rgba(7,92,157,0.10)",
    color: "#075c9d",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  topHeaderEditorTitle: {
    margin: "0 0 8px",
    color: "#075c9d",
    fontSize: "24px",
    lineHeight: 1.25,
    fontWeight: 900,
  },
  topHeaderEditorText: {
    margin: 0,
    maxWidth: "680px",
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.7,
    fontWeight: 700,
  },
  topHeaderSourceBadge: {
    display: "inline-flex",
    flexShrink: 0,
    borderRadius: "999px",
    padding: "8px 13px",
    background: "linear-gradient(135deg, #075c9d, #159447)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  topHeaderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  topHeaderMissing: {
    borderRadius: "16px",
    padding: "14px 16px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    color: "#9a3412",
    fontSize: "14px",
    lineHeight: 1.6,
    fontWeight: 800,
  },
  sectionDivider: {
    height: "1px",
    margin: "28px 0",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(7,92,157,0.18) 20%, rgba(7,92,157,0.18) 80%, transparent 100%)",
  },
  list: {
    display: "grid",
    gap: "24px",
  },
  officeCard: {
    borderRadius: "24px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "24px",
  },
  officeTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  officeTitle: {
    margin: "0 0 5px",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 900,
  },
  officeKey: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 800,
  },
  officeHeaderBadge: {
    display: "inline-flex",
    marginTop: "10px",
    borderRadius: "999px",
    padding: "6px 11px",
    background: "linear-gradient(135deg, #075c9d, #159447)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 160px",
    gap: "16px",
  },
  full: {
    gridColumn: "1 / -1",
  },
  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 900,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "13px",
    border: "1px solid #cbd5e1",
    padding: "13px 14px",
    fontSize: "15px",
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "96px",
    boxSizing: "border-box",
    borderRadius: "13px",
    border: "1px solid #cbd5e1",
    padding: "13px 14px",
    fontSize: "15px",
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    resize: "vertical",
  },
  checkWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800,
  },
  actions: {
    display: "flex",
    gap: "14px",
    marginTop: "28px",
    flexWrap: "wrap",
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
  },
  darkBtn: {
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
};
