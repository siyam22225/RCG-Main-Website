"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type HomeSlide = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  buttonHref?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminHomeSliderSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSlides() {
      try {
        const res = await fetch("/api/admin/home-slides", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 401) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load homepage slides");
          return;
        }

        setSlides(data.data || []);
      } catch {
        setError("Failed to load homepage slides");
      } finally {
        setLoading(false);
      }
    }

    loadSlides();
  }, [router, pathname]);

  function updateSlide(
    index: number,
    field: keyof HomeSlide,
    value: string | number | boolean
  ) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide
      )
    );
  }

  function addSlide() {
    setSlides((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        title: "",
        subtitle: "",
        imageUrl: "/images/hero/slide-1.jpg",
        buttonText: "",
        buttonHref: "",
        sortOrder: current.length + 1,
        isActive: true,
      },
    ]);
  }

  async function deleteSlide(index: number) {
    const slide = slides[index];

    const confirmed = window.confirm(
      "Are you sure you want to delete this slide?"
    );

    if (!confirmed) return;

    if (!slide.id || slide.id.startsWith("new-")) {
      setSlides((current) =>
        current.filter((_, itemIndex) => itemIndex !== index)
      );
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/home-slides", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: slide.id }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to delete slide");
        return;
      }

      setSlides((current) =>
        current.filter((_, itemIndex) => itemIndex !== index)
      );
      setMessage("Slide deleted successfully.");
    } catch {
      setError("Failed to delete slide");
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

      updateSlide(index, "imageUrl", data.url);
      setMessage("Image uploaded. Click Save Slider to apply it.");
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
      const res = await fetch("/api/admin/home-slides", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          slides: slides.map((slide) => ({
            id: slide.id?.startsWith("new-") ? undefined : slide.id,
            title: slide.title || null,
            subtitle: slide.subtitle || null,
            imageUrl: slide.imageUrl,
            buttonText: slide.buttonText || null,
            buttonHref: slide.buttonHref || null,
            sortOrder: Number(slide.sortOrder) || 0,
            isActive: slide.isActive,
          })),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update homepage slider");
        return;
      }

      setSlides(data.data || slides);
      setMessage("Homepage slider updated successfully.");
    } catch {
      setError("Failed to update homepage slider");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>Loading homepage slider settings...</div>
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
          <span style={styles.badge}>Homepage</span>
          <h1 style={styles.title}>Home Slider Settings</h1>
          <p style={styles.subtitle}>
            Manage homepage slider images, order, button links, and active
            status.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.topActions}>
            <button type="button" onClick={addSlide} style={styles.secondaryBtn}>
              Add New Slide
            </button>
          </div>

          <div style={styles.list}>
            {slides.map((slide, index) => (
              <div key={slide.id || index} style={styles.slideCard}>
                <button
                  type="button"
                  onClick={() => deleteSlide(index)}
                  disabled={saving}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>

                <div style={styles.previewWrap}>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title || "Slide preview"}
                    style={styles.preview}
                  />
                </div>

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>Title</label>
                    <input
                      value={slide.title || ""}
                      onChange={(event) =>
                        updateSlide(index, "title", event.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Sort Order</label>
                    <input
                      type="number"
                      value={slide.sortOrder}
                      onChange={(event) =>
                        updateSlide(
                          index,
                          "sortOrder",
                          Number(event.target.value)
                        )
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Subtitle</label>
                    <input
                      value={slide.subtitle || ""}
                      onChange={(event) =>
                        updateSlide(index, "subtitle", event.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Image URL</label>
                    <input
                      value={slide.imageUrl}
                      onChange={(event) =>
                        updateSlide(index, "imageUrl", event.target.value)
                      }
                      required
                      style={styles.input}
                      placeholder="/images/hero/slide-1.jpg"
                    />

                    <label style={styles.uploadBtn}>
                      {uploadingIndex === index
                        ? "Uploading..."
                        : "Upload Image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => handleImageUpload(index, event)}
                        style={{ display: "none" }}
                        disabled={uploadingIndex === index}
                      />
                    </label>
                  </div>

                  <div>
                    <label style={styles.label}>Button Text</label>
                    <input
                      value={slide.buttonText || ""}
                      onChange={(event) =>
                        updateSlide(index, "buttonText", event.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Button Link</label>
                    <input
                      value={slide.buttonHref || ""}
                      onChange={(event) =>
                        updateSlide(index, "buttonHref", event.target.value)
                      }
                      style={styles.input}
                      placeholder="/enterprise"
                    />
                  </div>

                  <label style={styles.checkWrap}>
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={(event) =>
                        updateSlide(index, "isActive", event.target.checked)
                      }
                    />
                    Active slide
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving..." : "Save Slider"}
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
  topActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "22px",
  },
  list: {
    display: "grid",
    gap: "24px",
  },
  slideCard: {
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
    minHeight: "170px",
  },
  preview: {
    width: "100%",
    height: "100%",
    minHeight: "170px",
    objectFit: "cover",
    display: "block",
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