"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";

const CORE_ENTERPRISE_SLUGS = [
  "land-rpcdl",
  "apartment-rchl",
  "hotel-rc-bay",
  "resda",
  "afsen-group",
  "abdf",
];

type EnterpriseItem = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  location?: string | null;
  buttonText?: string | null;
  buttonHref?: string | null;
  profileUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function EnterpriseSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<EnterpriseItem[]>([]);
  const [lockedCoreIds, setLockedCoreIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEnterprises() {
      try {
        const res = await fetch("/api/admin/enterprises", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 401) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load enterprise concerns");
          return;
        }

        const loadedItems: EnterpriseItem[] = data.data || [];
        setItems(loadedItems);

        setLockedCoreIds(
          loadedItems
            .filter((item) => item.id && CORE_ENTERPRISE_SLUGS.includes(item.slug))
            .map((item) => item.id as string)
        );
      } catch {
        setError("Failed to load enterprise concerns");
      } finally {
        setLoading(false);
      }
    }

    loadEnterprises();
  }, [router, pathname]);

  function isDefaultConcern(item: EnterpriseItem) {
    return Boolean(
      item.id &&
        !item.id.startsWith("new-") &&
        (lockedCoreIds.includes(item.id) ||
          CORE_ENTERPRISE_SLUGS.includes(item.slug))
    );
  }

  function updateItem(
    index: number,
    field: keyof EnterpriseItem,
    value: string | number | boolean
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addConcern() {
    setItems((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        name: "",
        slug: "",
        description: "",
        imageUrl: "/images/enterprises/enterprise-1.jpg",
        location: "",
        buttonText: "Visit Website",
        buttonHref: "",
        profileUrl: "",
        sortOrder: current.length + 1,
        isActive: true,
      },
    ]);
  }

  async function deleteConcern(index: number) {
    const item = items[index];

    if (isDefaultConcern(item)) {
      setError("Default enterprise concerns cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this concern?"
    );

    if (!confirmed) return;

    if (!item.id || item.id.startsWith("new-")) {
      setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
      setMessage("Unsaved concern removed.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/enterprises", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: item.id }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || data.message || "Failed to delete enterprise concern");
        return;
      }

      setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
      setMessage("Enterprise concern deleted successfully.");
    } catch {
      setError("Failed to delete enterprise concern");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Image upload failed");
        return;
      }

      updateItem(index, "imageUrl", data.url);
      setMessage("Image uploaded. Click Save Concerns to apply it.");
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/enterprises", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          enterprises: items.map((item) => ({
            id: item.id?.startsWith("new-") ? undefined : item.id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            imageUrl: item.imageUrl || null,
            location: item.location || null,
            buttonText: item.buttonText || null,
            buttonHref: item.buttonHref || null,
            profileUrl: item.profileUrl || null,
            sortOrder: Number(item.sortOrder) || 0,
            isActive: item.isActive,
          })),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || data.message || "Failed to update enterprise concerns");
        return;
      }

      const updatedItems: EnterpriseItem[] = data.data || items;
      setItems(updatedItems);
      setLockedCoreIds(
        updatedItems
          .filter((item) => item.id && CORE_ENTERPRISE_SLUGS.includes(item.slug))
          .map((item) => item.id as string)
      );
      setMessage("Enterprise concerns updated successfully.");
    } catch {
      setError("Failed to update enterprise concerns");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>Loading enterprise concern settings...</div>
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
          <span style={styles.badge}>Our Concern</span>
          <h1 style={styles.title}>Enterprise / Concern Settings</h1>
          <p style={styles.subtitle}>
            Manage concern name, image, location, description, link, order, and active status.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.topActions}>
            <button type="button" onClick={addConcern} style={styles.secondaryBtn}>
              Add New Concern
            </button>
          </div>

          <div style={styles.list}>
            {items.map((item, index) => {
              const isDefault = isDefaultConcern(item);

              return (
                <div key={item.id || index} style={styles.concernCard}>
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={() => deleteConcern(index)}
                      disabled={saving}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  )}

                  <div style={styles.previewWrap}>
                    <img
                      src={item.imageUrl || "/images/enterprises/enterprise-1.jpg"}
                      alt={item.name || "Concern preview"}
                      style={styles.preview}
                    />
                  </div>

                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Concern Name</label>
                      <input
                        value={item.name}
                        onChange={(event) =>
                          updateItem(index, "name", event.target.value)
                        }
                        style={styles.input}
                        required
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Sort Order</label>
                      <input
                        type="number"
                        value={item.sortOrder}
                        onChange={(event) =>
                          updateItem(index, "sortOrder", Number(event.target.value))
                        }
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Slug</label>
                      <input
                        value={item.slug}
                        onChange={(event) =>
                          updateItem(index, "slug", event.target.value)
                        }
                        style={{
                          ...styles.input,
                          background: isDefault ? "#f1f5f9" : "#ffffff",
                          color: isDefault ? "#64748b" : "#0f172a",
                        }}
                        required
                        disabled={isDefault}
                      />
                      {isDefault && (
                        <p style={styles.helpText}>
                          Default concern slug is locked.
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={styles.label}>Location</label>
                      <input
                        value={item.location || ""}
                        onChange={(event) =>
                          updateItem(index, "location", event.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.full}>
                      <label style={styles.label}>Image URL</label>
                      <input
                        value={item.imageUrl || ""}
                        onChange={(event) =>
                          updateItem(index, "imageUrl", event.target.value)
                        }
                        style={styles.input}
                        placeholder="/images/enterprises/enterprise-1.jpg"
                      />

                      <label style={styles.uploadBtn}>
                        {uploadingIndex === index ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => handleImageUpload(index, event)}
                          style={{ display: "none" }}
                          disabled={uploadingIndex === index}
                        />
                      </label>
                    </div>

                    <div style={styles.full}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          updateItem(index, "description", event.target.value)
                        }
                        style={styles.textarea}
                        required
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Button Text</label>
                      <input
                        value={item.buttonText || ""}
                        onChange={(event) =>
                          updateItem(index, "buttonText", event.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Button Link</label>
                      <input
                        value={item.buttonHref || ""}
                        onChange={(event) =>
                          updateItem(index, "buttonHref", event.target.value)
                        }
                        style={styles.input}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div style={styles.full}>
                      <label style={styles.label}>Profile / Brochure URL</label>
                      <input
                        value={item.profileUrl || ""}
                        onChange={(event) =>
                          updateItem(index, "profileUrl", event.target.value)
                        }
                        style={styles.input}
                        placeholder="/profiles/company-profile.pdf"
                      />
                    </div>

                    <label style={styles.checkWrap}>
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(event) =>
                          updateItem(index, "isActive", event.target.checked)
                        }
                      />
                      Active concern
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save Concerns"}
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
  topActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "22px",
  },
  list: {
    display: "grid",
    gap: "24px",
  },
  concernCard: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "22px",
    borderRadius: "24px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "22px",
  },
  deleteBtn: {
    position: "absolute",
    top: "18px",
    right: "18px",
    minHeight: "38px",
    border: "none",
    borderRadius: "999px",
    padding: "0 16px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
    zIndex: 2,
  },
  previewWrap: {
    borderRadius: "18px",
    overflow: "hidden",
    background: "#e2e8f0",
    minHeight: "190px",
  },
  preview: {
    width: "100%",
    height: "100%",
    minHeight: "190px",
    objectFit: "cover",
    display: "block",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
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
    minHeight: "120px",
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
  uploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    minHeight: "42px",
    borderRadius: "999px",
    padding: "0 18px",
    background: "#ecfdf5",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
  },
  helpText: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
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
  secondaryBtn: {
    minHeight: "44px",
    border: "none",
    borderRadius: "999px",
    padding: "0 22px",
    background: "#ecfdf5",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: 900,
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