"use client";

import { FormEvent, useEffect, useState } from "react";

type AdminInfo = {
  email: string;
  updatedAt: string;
};

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Unable to load admin settings");
          return;
        }

        setAdmin(data.admin);
        setEmail(data.admin.email);
      } catch {
        setError("Unable to load admin settings");
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Unable to update settings");
        return;
      }

      setAdmin(data.admin);
      setEmail(data.admin.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Admin login settings updated successfully.");
    } catch {
      setError("Unable to update settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p style={styles.text}>Loading admin settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.badge}>Admin Access</span>
          <h1 style={styles.title}>Admin Settings</h1>
          <p style={styles.subtitle}>
            Change admin login email and password securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Change Login Email</h2>
            <p style={styles.sectionText}>
              Update the email address used for admin login.
            </p>

            <label style={styles.label}>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Security Verification</h2>
            <p style={styles.sectionText}>
              Current password is required before changing email or password.
            </p>

            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Change Password</h2>
            <p style={styles.sectionText}>
              Leave these fields empty if you only want to change the email.
            </p>

            <div style={styles.grid}>
              <div>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {admin?.updatedAt && (
            <p style={styles.updatedText}>
              Last updated: {new Date(admin.updatedAt).toLocaleString()}
            </p>
          )}

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <a href="/admin" style={styles.secondaryBtn}>
              Back to Dashboard
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
    maxWidth: "850px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  badge: {
    display: "inline-block",
    marginBottom: "12px",
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
    background: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(226, 232, 240, 0.95)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
    padding: "34px",
  },
  section: {
    marginBottom: "8px",
  },
  sectionTitle: {
    margin: "0 0 8px",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: 900,
  },
  sectionText: {
    margin: "0 0 18px",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: 1.7,
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
    background: "#f8fafc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },
  divider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "28px 0",
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
  updatedText: {
    marginTop: "22px",
    color: "#64748b",
    fontSize: "14px",
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
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.24)",
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
    boxShadow: "0 14px 28px rgba(15, 23, 42, 0.18)",
  },
  text: {
    color: "#475569",
    fontSize: "16px",
  },
};