"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type BlogFormStatus = "draft" | "published";

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  status: BlogFormStatus;
  isFeatured: boolean;
  publishedAt?: string | null;
  metaTitle: string;
  metaDescription: string;
};

type Props = {
  mode: "create" | "edit";
  postId?: string;
  initialValues?: BlogFormValues;
};

const emptyValues: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  category: "",
  status: "draft",
  isFeatured: false,
  publishedAt: null,
  metaTitle: "",
  metaDescription: "",
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPostForm({ mode, postId, initialValues }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormValues>(initialValues || emptyValues);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: !slugTouched && !prev.slug ? toSlug(value) : prev.slug,
      }));
      return;
    }

    if (name === "slug") {
      setSlugTouched(true);
      setForm((prev) => ({ ...prev, slug: toSlug(value) }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isFeatured: e.target.checked }));
  };

  const makeSlug = () => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: toSlug(prev.title) }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to upload image");
      }

      setForm((prev) => ({ ...prev, imageUrl: data.url || "" }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      ...form,
      slug: form.slug ? toSlug(form.slug) : toSlug(form.title),
    };

    try {
      const res = await fetch(
        mode === "edit" && postId ? `/api/admin/blogs/${postId}` : "/api/admin/blogs",
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save blog post");
      }

      setSuccessMessage(
        mode === "edit"
          ? "Blog post updated successfully."
          : "Blog post added successfully."
      );

      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 700);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid rgba(21,150,212,0.08)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
      }}
    >
      <style jsx>{`
        .admin-label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
        }

        .admin-input,
        .admin-select,
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

        .primary-btn:disabled,
        .secondary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

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

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
        <div>
          <label className="admin-label" htmlFor="blog-title">
            Title
          </label>
          <input
            id="blog-title"
            className="admin-input"
            name="title"
            value={form.title}
            onChange={handleTextChange}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
          <div>
            <label className="admin-label" htmlFor="blog-slug">
              Slug
            </label>
            <input
              id="blog-slug"
              className="admin-input"
              name="slug"
              value={form.slug}
              onChange={handleTextChange}
              placeholder="blog-post-slug"
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
          <label className="admin-label" htmlFor="blog-excerpt">
            Excerpt
          </label>
          <textarea
            id="blog-excerpt"
            className="admin-textarea"
            name="excerpt"
            value={form.excerpt}
            onChange={handleTextChange}
            placeholder="Short summary"
            required
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="blog-content">
            Content
          </label>
          <textarea
            id="blog-content"
            className="admin-textarea"
            name="content"
            value={form.content}
            onChange={handleTextChange}
            placeholder="Full blog content"
            required
            style={{ minHeight: "220px" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label className="admin-label" htmlFor="blog-category">
              Category
            </label>
            <input
              id="blog-category"
              className="admin-input"
              name="category"
              value={form.category}
              onChange={handleTextChange}
              placeholder="Real Estate Guide"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="blog-status">
              Status
            </label>
            <select
              id="blog-status"
              className="admin-select"
              name="status"
              value={form.status}
              onChange={handleTextChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="admin-label" htmlFor="blog-image-url">
            Image URL
          </label>
          <input
            id="blog-image-url"
            className="admin-input"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleTextChange}
            placeholder="/uploads/images/blog-image.webp"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="blog-image-upload">
            Upload Image
          </label>
          <input
            id="blog-image-upload"
            className="admin-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading ? (
            <p style={{ margin: "8px 0 0", color: "#64748b", fontWeight: 700 }}>
              Uploading image...
            </p>
          ) : null}
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleFeaturedChange}
          />
          Featured blog
        </label>

        <div>
          <label className="admin-label" htmlFor="blog-meta-title">
            Meta Title
          </label>
          <input
            id="blog-meta-title"
            className="admin-input"
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleTextChange}
            placeholder="Optional SEO title"
          />
        </div>

        <div>
          <label className="admin-label" htmlFor="blog-meta-description">
            Meta Description
          </label>
          <textarea
            id="blog-meta-description"
            className="admin-textarea"
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleTextChange}
            placeholder="Optional SEO description"
          />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button type="submit" className="primary-btn" disabled={loading || uploading}>
            {loading ? "Saving..." : mode === "edit" ? "Update Blog" : "Save Blog"}
          </button>

          <Link
            href="/admin/blogs"
            className="secondary-btn"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
