"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  imageUrl: string;
  category: string;
};

export default function AddPhotoPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    imageUrl: "/images/news/photo-1.jpg",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add photo");
      }

      setSuccessMessage("Photo added successfully.");

      setForm({
        title: "",
        imageUrl: "/images/news/photo-1.jpg",
        category: "",
      });

      setTimeout(() => {
        router.push("/admin/photos");
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
    <section style={{ padding: "48px 0 70px", background: "transparent" }}><style jsx>{`
        .admin-label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
        }
        .admin-input {
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
        .primary-btn {
          border: none;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(90deg, #0f9d7a 0%, #1d9bf0 100%);
          color: #ffffff;
        }
        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      <div className="container" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: "0 0 10px 0", color: "#16a34a", fontSize: "14px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Admin Panel
          </p>
          <h1 style={{ margin: 0, color: "#0f172a", fontWeight: 800, fontSize: "clamp(28px, 5vw, 48px)" }}>
            Add Photo
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
            <div style={{ marginBottom: "16px", padding: "14px 16px", borderRadius: "14px", background: "#dcfce7", color: "#166534", border: "1px solid #86efac", fontWeight: 700 }}>
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div style={{ marginBottom: "16px", padding: "14px 16px", borderRadius: "14px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", fontWeight: 700 }}>
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label className="admin-label">Title</label>
              <input className="admin-input" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <label className="admin-label">Category</label>
             <select
  className="admin-input"
  name="category"
  value={form.category}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, category: e.target.value }))
  }
>
  <option value="">Select Album</option>
  <option value="Office">Office</option>
  <option value="Event">Event</option>
  <option value="Community">Community</option>
  <option value="Projects">Projects</option>
  <option value="Directors">Directors</option>
</select>
            </div>

            <div>
              <label className="admin-label">Image URL</label>
              <input className="admin-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
            </div>

            <div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Photo"}
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </section>
  );
}