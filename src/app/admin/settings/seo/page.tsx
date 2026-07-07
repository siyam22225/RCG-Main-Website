"use client";

import { useEffect, useState } from "react";

type SeoForm = {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  googleVerificationCode: string;
  allowIndexing: boolean;
};

const defaultForm: SeoForm = {
  siteTitle: "Real Capita Group",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  googleVerificationCode: "",
  allowIndexing: true,
};

export default function SeoSettingsPage() {
  const [form, setForm] = useState<SeoForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSeo() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/seo", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load SEO settings.");
      }

      setForm({
        siteTitle: data.setting?.siteTitle || "Real Capita Group",
        metaDescription: data.setting?.metaDescription || "",
        metaKeywords: data.setting?.metaKeywords || "",
        ogTitle: data.setting?.ogTitle || "",
        ogDescription: data.setting?.ogDescription || "",
        ogImage: data.setting?.ogImage || "",
        googleVerificationCode: data.setting?.googleVerificationCode || "",
        allowIndexing: data.setting?.allowIndexing !== false,
      });
    } catch (error) {
      console.error(error);
      setMessage("Could not load SEO settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSeo();
  }, []);

  function updateField<K extends keyof SeoForm>(key: K, value: SeoForm[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function uploadOgImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setMessage("Uploading...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed.");

      updateField("ogImage", data.url);
      setMessage("OG image uploaded.");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  }

  async function saveSeo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      setForm({
        siteTitle: data.setting?.siteTitle || "Real Capita Group",
        metaDescription: data.setting?.metaDescription || "",
        metaKeywords: data.setting?.metaKeywords || "",
        ogTitle: data.setting?.ogTitle || "",
        ogDescription: data.setting?.ogDescription || "",
        ogImage: data.setting?.ogImage || "",
        googleVerificationCode: data.setting?.googleVerificationCode || "",
        allowIndexing: data.setting?.allowIndexing !== false,
      });

      setMessage("SEO settings saved.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="seoSettingsPage"><style jsx>{`
        .seoSettingsPage {
          min-height: 100vh;
          padding: 40px 24px 72px;
          background: linear-gradient(180deg, #eef8fd, #f8fbff);
          color: #0f172a;
        }

        .settingsHeader,
        .messageBox,
        .settingsCard {
          max-width: 840px;
          margin-left: auto;
          margin-right: auto;
        }

        .settingsHeader {
          margin-bottom: 22px;
        }

        .settingsHeader p {
          margin: 0 0 8px;
          color: #16a34a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .settingsHeader h1 {
          margin: 0 0 8px;
          color: #145fb3;
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .settingsHeader span {
          color: #475569;
          line-height: 1.7;
        }

        .messageBox {
          margin-bottom: 18px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbeafe;
          color: #075c9d;
          font-weight: 800;
        }

        .settingsCard {
          display: grid;
          gap: 16px;
          padding: 26px;
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
        }

        label {
          display: grid;
          gap: 8px;
          color: #334155;
          font-size: 14px;
          font-weight: 850;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #d7e3ee;
          border-radius: 14px;
          padding: 13px 14px;
          color: #0f172a;
          font: inherit;
          outline: none;
          background: #f8fbff;
        }

        textarea {
          resize: vertical;
        }

        .checkLabel {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 14px;
          border-radius: 14px;
          background: #f8fbff;
          border: 1px solid #d7e3ee;
        }

        .checkLabel input {
          width: auto;
        }

        .imagePreview {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          border-radius: 18px;
          background: #f8fbff;
          border: 1px solid #dbeafe;
        }

        .imagePreview img {
          max-width: 100%;
          max-height: 240px;
          object-fit: contain;
          border-radius: 14px;
        }

        button {
          border: 0;
          border-radius: 999px;
          padding: 13px 20px;
          background: linear-gradient(135deg, #075c9d, #16a34a);
          color: #ffffff;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(14, 165, 233, 0.24);
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>
      <section className="settingsHeader">
        <p>Admin Settings</p>
        <h1>SEO Settings</h1>
        <span>
          Manage default website title, meta description, social sharing, and
          search indexing.
        </span>
      </section>

      {message ? <div className="messageBox">{message}</div> : null}

      <form className="settingsCard" onSubmit={saveSeo}>
        {loading ? <p>Loading...</p> : null}

        <label>
          Website Title
          <input
            value={form.siteTitle}
            onChange={(e) => updateField("siteTitle", e.target.value)}
            placeholder="Real Capita Group"
          />
        </label>

        <label>
          Meta Description
          <textarea
            rows={4}
            value={form.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            placeholder="Short search engine description for the website."
          />
        </label>

        <label>
          Meta Keywords
          <input
            value={form.metaKeywords}
            onChange={(e) => updateField("metaKeywords", e.target.value)}
            placeholder="real estate, property, land, apartment, Bangladesh"
          />
        </label>

        <label>
          Open Graph Title
          <input
            value={form.ogTitle}
            onChange={(e) => updateField("ogTitle", e.target.value)}
            placeholder="Real Capita Group"
          />
        </label>

        <label>
          Open Graph Description
          <textarea
            rows={3}
            value={form.ogDescription}
            onChange={(e) => updateField("ogDescription", e.target.value)}
            placeholder="Description shown when the website is shared."
          />
        </label>

        <label>
          OG / Social Share Image URL
          <input
            value={form.ogImage}
            onChange={(e) => updateField("ogImage", e.target.value)}
            placeholder="/images/hero/slide-1.jpg"
          />
        </label>

        <label>
          Upload OG Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadOgImage(file);
            }}
          />
        </label>

        {form.ogImage ? (
          <div className="imagePreview">
            <img src={form.ogImage} alt="OG preview" />
          </div>
        ) : null}

        <label>
          Google Site Verification Code
          <input
            value={form.googleVerificationCode}
            onChange={(e) =>
              updateField("googleVerificationCode", e.target.value)
            }
            placeholder="Only the verification content value"
          />
        </label>

        <label className="checkLabel">
          <input
            type="checkbox"
            checked={form.allowIndexing}
            onChange={(e) => updateField("allowIndexing", e.target.checked)}
          />
          Allow search engines to index this website
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </form>

      
    </main>
  );
}
