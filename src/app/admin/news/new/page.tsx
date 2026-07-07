"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
};

export default function AddNewsPage() {
  const router = useRouter();

 const [form, setForm] = useState<FormState>({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "/images/news/photo-1.jpg",
  publishedAt: new Date().toISOString().slice(0, 16),
});

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const makeSlug = () => {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add news");
      }

      setSuccessMessage("News added successfully.");

     setForm({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "/images/news/photo-1.jpg",
  publishedAt: new Date().toISOString().slice(0, 16),
});

      setTimeout(() => {
        router.push("/admin/news");
        router.refresh();
      }, 800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}><style jsx>{`
        .admin-label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
        }

        .admin-input,
        .admin-textarea {
          width: 100%;
          border: 1px solid #dbe2ea;
          border-radius: 14px;
          background: #ffffff;
          color: #334155;
          font-size: 15px;
          padding: 14px 16px;
          outline: none;
          box-sizing: border-box;
        }

        .admin-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .primary-btn,
        .secondary-btn {
          border: none;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-btn {
          background: linear-gradient(90deg, #0f9d7a 0%, #1d9bf0 100%);
          color: #ffffff;
        }

        .secondary-btn {
          background: #e5e7eb;
          color: #111827;
        }

        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      <div className="container" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 10px 0",
              color: "#16a34a",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </p>

          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 48px)",
            }}
          >
            Add News
          </h1>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid rgba(21,150,212,0.08)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
          }}
        >
          {successMessage ? (
            <div
              style={{
                marginBottom: "16px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#dcfce7",
                color: "#166534",
                border: "1px solid #86efac",
                fontWeight: 700,
              }}
            >
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div
              style={{
                marginBottom: "16px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "18px" }}
          >
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter news title"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
              <div>
                <label className="admin-label">Slug</label>
                <input
                  className="admin-input"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="news-slug"
                  required
                />
              </div>

              <div style={{ alignSelf: "end" }}>
                <button type="button" onClick={makeSlug} className="secondary-btn">
                  Auto Slug
                </button>
              </div>
            </div>

            <div>
              <label className="admin-label">Excerpt</label>
              <textarea
                className="admin-textarea"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short summary"
                required
              />
            </div>

            <div>
              <label className="admin-label">Content</label>
              <textarea
                className="admin-textarea"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Full news content"
                required
                style={{ minHeight: "180px" }}
              />
            </div>
            <div>
  <label className="admin-label">Published Date & Time</label>
  <input
    className="admin-input"
    type="datetime-local"
    name="publishedAt"
    value={form.publishedAt}
    onChange={handleChange}
    required
  />
</div>

            <div>
              <label className="admin-label">Image URL</label>
              <input
                className="admin-input"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="/images/news/photo-1.jpg"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Saving..." : "Save News"}
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </section>
  );
}