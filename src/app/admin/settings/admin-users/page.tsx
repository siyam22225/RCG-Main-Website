"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  isProtected: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type NewAdminForm = {
  name: string;
  email: string;
  password: string;
};

export default function AdminUsersSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load admin users");
        return;
      }

      setUsers(data.data || []);
    } catch {
      setError("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalAdmins = users.length;
  const superAdmins = users.filter((user) => user.role === "super_admin").length;
  const normalAdmins = users.filter((user) => user.role !== "super_admin").length;

  function updateUser(
    id: string,
    field: "name" | "email" | "isActive",
    value: string | boolean
  ) {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      )
    );
  }

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreating(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAdmin),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create admin user");
        return;
      }

      setNewAdmin({ name: "", email: "", password: "" });
      setMessage("Admin user created successfully.");
      await loadUsers();
    } catch {
      setError("Failed to create admin user");
    } finally {
      setCreating(false);
    }
  }

  async function saveUser(user: AdminUser, password?: string) {
    if (user.role === "super_admin" || user.isProtected) {
      setError("Super admin accounts cannot be edited here.");
      return;
    }

    if (password && password.length > 0 && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSavingId(user.id);
    setMessage("");
    setError("");

    try {
      const payload: {
        id: string;
        name: string | null;
        email: string;
        isActive: boolean;
        password?: string;
      } = {
        id: user.id,
        name: user.name || null,
        email: user.email,
        isActive: user.isActive,
      };

      if (password && password.length >= 8) {
        payload.password = password;
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update admin user");
        return;
      }

      setMessage("Admin user updated successfully.");
      await loadUsers();
    } catch {
      setError("Failed to update admin user");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (user.role === "super_admin" || user.isProtected) {
      setError("Super admin accounts cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete admin user ${user.email}? This admin will no longer be able to login.`
    );

    if (!confirmed) return;

    setSavingId(user.id);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: user.id }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to delete admin user");
        return;
      }

      setMessage("Admin user deleted successfully. This account can no longer login.");
      await loadUsers();
    } catch {
      setError("Failed to delete admin user");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>Loading admin users...</div>
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
          <span style={styles.badge}>Admin Access</span>
          <h1 style={styles.title}>Admin User Management</h1>
          <p style={styles.subtitle}>
            Super admins can create, update, disable, and delete normal admin accounts. Protected super admins are visible but locked.
          </p>
        </div>

        <div style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <strong style={styles.statNumber}>{totalAdmins}</strong>
              <span style={styles.statLabel}>Total Admins</span>
            </div>

            <div style={styles.statBox}>
              <strong style={styles.statNumber}>{superAdmins}</strong>
              <span style={styles.statLabel}>Super Admins</span>
            </div>

            <div style={styles.statBox}>
              <strong style={styles.statNumber}>{normalAdmins}</strong>
              <span style={styles.statLabel}>Normal Admins</span>
            </div>
          </div>

          <form onSubmit={createAdmin} style={styles.createBox} autoComplete="off">
            <h2 style={styles.sectionTitle}>Create New Normal Admin</h2>

            <div style={styles.createGrid}>
              <div>
                <label style={styles.label}>Name</label>
                <input
                  name="new-admin-name"
                  autoComplete="off"
                  value={newAdmin.name}
                  onChange={(event) =>
                    setNewAdmin((prev) => ({ ...prev, name: event.target.value }))
                  }
                  style={styles.input}
                  placeholder="Admin name"
                />
              </div>

              <div>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="new-admin-email"
                  autoComplete="off"
                  value={newAdmin.email}
                  onChange={(event) =>
                    setNewAdmin((prev) => ({ ...prev, email: event.target.value }))
                  }
                  style={styles.input}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="new-admin-password"
                  autoComplete="new-password"
                  value={newAdmin.password}
                  onChange={(event) =>
                    setNewAdmin((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  style={styles.input}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={creating} style={styles.primaryBtn}>
              {creating ? "Creating..." : "Create Admin"}
            </button>
          </form>

          <div style={styles.list}>
            {users.map((user) => (
              <AdminUserCard
                key={user.id}
                user={user}
                saving={savingId === user.id}
                onChange={updateUser}
                onSave={saveUser}
                onDelete={deleteUser}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminUserCard({
  user,
  saving,
  onChange,
  onSave,
  onDelete,
}: {
  user: AdminUser;
  saving: boolean;
  onChange: (
    id: string,
    field: "name" | "email" | "isActive",
    value: string | boolean
  ) => void;
  onSave: (user: AdminUser, password?: string) => Promise<void>;
  onDelete: (user: AdminUser) => Promise<void>;
}) {
  const locked = user.role === "super_admin" || user.isProtected;
  const [password, setPassword] = useState("");

  return (
    <div style={styles.userCard}>
      <div style={styles.userTop}>
        <div>
          <h3 style={styles.userTitle}>{user.name || user.email}</h3>
          <p style={styles.userMeta}>{user.email}</p>
        </div>

        <span
          style={{
            ...styles.roleBadge,
            background: locked ? "#ecfdf5" : "#eff6ff",
            color: locked ? "#15803d" : "#1d4ed8",
          }}
        >
          {locked ? "Protected Super Admin" : "Normal Admin"}
        </span>
      </div>

      <div style={styles.formGrid}>
        <div>
          <label style={styles.label}>Name</label>
          <input
            value={user.name || ""}
            onChange={(event) => onChange(user.id, "name", event.target.value)}
            style={{
              ...styles.input,
              background: locked ? "#f1f5f9" : "#ffffff",
            }}
            disabled={locked}
          />
        </div>

        <div>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(event) => onChange(user.id, "email", event.target.value)}
            style={{
              ...styles.input,
              background: locked ? "#f1f5f9" : "#ffffff",
            }}
            disabled={locked}
          />
        </div>

        <div>
          <label style={styles.label}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              ...styles.input,
              background: locked ? "#f1f5f9" : "#ffffff",
            }}
            placeholder={locked ? "Locked" : "Leave blank to keep old password"}
            disabled={locked}
            autoComplete="new-password"
          />
        </div>

        <label style={styles.checkWrap}>
          <input
            type="checkbox"
            checked={user.isActive}
            onChange={(event) => onChange(user.id, "isActive", event.target.checked)}
            disabled={locked}
          />
          Active account
        </label>
      </div>

      {locked ? (
        <p style={styles.lockNote}>
          This account is protected. Super admin accounts cannot edit, disable, or delete each other here.
        </p>
      ) : (
        <div style={styles.actions}>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(user, password)}
            style={styles.primaryBtn}
          >
            {saving ? "Saving..." : "Save Admin"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onDelete(user)}
            style={styles.deleteBtn}
          >
            Delete Admin
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef8fb 0%, #dff4fb 100%)",
    padding: "64px 24px",
  },
  wrapper: {
    maxWidth: "1080px",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  statBox: {
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "18px",
  },
  statNumber: {
    display: "block",
    color: "#0f172a",
    fontSize: "30px",
    fontWeight: 900,
    lineHeight: 1,
  },
  statLabel: {
    display: "block",
    marginTop: "8px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 900,
  },
  createBox: {
    borderRadius: "24px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "22px",
    marginBottom: "26px",
  },
  sectionTitle: {
    margin: "0 0 18px",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 900,
  },
  createGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "18px",
  },
  list: {
    display: "grid",
    gap: "18px",
  },
  userCard: {
    borderRadius: "24px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "22px",
  },
  userTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
    alignItems: "center",
  },
  userTitle: {
    margin: "0 0 4px",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: 900,
  },
  userMeta: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 700,
  },
  roleBadge: {
    borderRadius: "999px",
    padding: "9px 14px",
    fontSize: "12px",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
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
    outline: "none",
  },
  checkWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800,
  },
  lockNote: {
    margin: "16px 0 0",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    minHeight: "44px",
    border: "none",
    borderRadius: "999px",
    padding: "0 22px",
    background: "linear-gradient(135deg, #16a34a 0%, #2563eb 100%)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
  },
  deleteBtn: {
    minHeight: "44px",
    border: "none",
    borderRadius: "999px",
    padding: "0 22px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
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
};