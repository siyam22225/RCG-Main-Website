"use client";

import { FormEvent, useEffect, useState } from "react";

type PopupForm = {
  isActive: boolean;
  isTitleActive: boolean;
  isMessageActive: boolean;
  isButtonActive: boolean;
  title: string;
  message: string;
  imageUrl: string;
  buttonText: string;
  buttonHref: string;
  showOncePerSession: boolean;
  autoCloseSeconds: number;
};

const emptyForm: PopupForm = {
  isActive: false,
  isTitleActive: true,
  isMessageActive: true,
  isButtonActive: true,
  title: "",
  message: "",
  imageUrl: "",
  buttonText: "",
  buttonHref: "",
  showOncePerSession: true,
  autoCloseSeconds: 0,
};

export default function AdminPopupPage() {
  const [form, setForm] = useState<PopupForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPopup() {
      setLoading(true);

      try {
        const res = await fetch("/api/admin/site-popup", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load popup setting.");
        }

        if (data.popup) {
          setForm({
            isActive: Boolean(data.popup.isActive),
            isTitleActive: data.popup.isTitleActive !== false,
            isMessageActive: data.popup.isMessageActive !== false,
            isButtonActive: data.popup.isButtonActive !== false,
            title: data.popup.title || "",
            message: data.popup.message || "",
            imageUrl: data.popup.imageUrl || "",
            buttonText: data.popup.buttonText || "",
            buttonHref: data.popup.buttonHref || "",
            showOncePerSession: data.popup.showOncePerSession !== false,
            autoCloseSeconds: Number(data.popup.autoCloseSeconds || 0),
          });
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to load popup setting.");
      } finally {
        setLoading(false);
      }
    }

    void loadPopup();
  }, []);

  function updateField<K extends keyof PopupForm>(key: K, value: PopupForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadPopupImage(file: File) {
    setImageUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Image upload failed.");
      }

      const uploadedUrl = data?.url || data?.fileUrl || data?.path;

      if (!uploadedUrl) {
        throw new Error("Upload completed but image URL was not returned.");
      }

      updateField("imageUrl", uploadedUrl);
      setMessage("Popup image uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  }

  async function savePopup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/site-popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save popup setting.");
      }

      setMessage("Popup setting saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save popup setting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="popupAdminPage"><style jsx>{`
        .popupAdminPage {
          min-height: 100vh;
          padding: 72px min(8vw, 120px);
          background:
            radial-gradient(circle at 8% 0%, rgba(14, 165, 233, 0.18), transparent 30%),
            radial-gradient(circle at 92% 12%, rgba(34, 197, 94, 0.18), transparent 28%),
            linear-gradient(135deg, #eef8fd 0%, #f8fbff 50%, #ecfff4 100%);
        }

        .popupHero {
          margin-bottom: 28px;
        }

        .popupHero p {
          margin: 0 0 14px;
          color: #0aa360;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .popupHero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .popupHero span {
          display: block;
          margin-top: 12px;
          color: #64748b;
          font-size: 16px;
        }

        .popupCard {
          width: min(760px, 100%);
          display: grid;
          gap: 18px;
          padding: 28px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        label {
          display: grid;
          gap: 8px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 850;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #dbe3ec;
          border-radius: 16px;
          padding: 13px 15px;
          background: #ffffff;
          color: #111827;
          font: inherit;
        }

        textarea {
          resize: vertical;
        }

        .grid2,
        .toggleGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .toggleRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toggleRow input {
          width: auto;
        }

        small {
          color: #64748b;
          font-weight: 700;
        }

        button {
          width: fit-content;
          border: 0;
          border-radius: 999px;
          padding: 13px 24px;
          background: linear-gradient(135deg, #075c9d, #12a06f);
          color: #ffffff;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 26px rgba(7, 92, 157, 0.18);
        }

        button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .message {
          margin: 0;
          color: #075c9d;
          font-weight: 850;
        }

        @media (max-width: 700px) {
          .popupAdminPage {
            padding: 52px 16px;
          }

          .grid2,
          .toggleGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="popupHero">
        <p>ADMIN PANEL</p>
        <h1>Website Popup</h1>
        <span>Control the popup shown to public website visitors.</span>
      </section>

      <form className="popupCard" onSubmit={savePopup}>
        <div className="toggleGrid">
          <label className="toggleRow">
            <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} />
            Popup Active
          </label>

          <label className="toggleRow">
            <input type="checkbox" checked={form.isTitleActive} onChange={(e) => updateField("isTitleActive", e.target.checked)} />
            Title Active
          </label>

          <label className="toggleRow">
            <input type="checkbox" checked={form.isMessageActive} onChange={(e) => updateField("isMessageActive", e.target.checked)} />
            Message Active
          </label>

          <label className="toggleRow">
            <input type="checkbox" checked={form.isButtonActive} onChange={(e) => updateField("isButtonActive", e.target.checked)} />
            Button Active
          </label>
        </div>

        <label>
          Popup Title
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Write popup title" />
        </label>

        <label>
          Popup Message
          <textarea value={form.message} onChange={(e) => updateField("message", e.target.value)} rows={5} placeholder="Write popup message" />
        </label>

        <label>
          Image URL
          <input value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="/images/popup.jpg" />
        </label>

        <label>
          Upload Popup Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadPopupImage(file);
            }}
          />
          <small>{imageUploading ? "Uploading image..." : "Upload an image or paste an image URL above."}</small>
        </label>

        <div className="grid2">
          <label>
            Button Text
            <input value={form.buttonText} onChange={(e) => updateField("buttonText", e.target.value)} placeholder="Learn More" />
          </label>

          <label>
            Button Link
            <input value={form.buttonHref} onChange={(e) => updateField("buttonHref", e.target.value)} placeholder="/career" />
          </label>
        </div>

        <label className="toggleRow">
          <input
            type="checkbox"
            checked={form.showOncePerSession}
            onChange={(e) => updateField("showOncePerSession", e.target.checked)}
          />
          Show once per browser session
        </label>

        <label>
  Auto Close Timer (seconds)
  <input
    type="number"
    min="0"
    max="60"
    value={form.autoCloseSeconds}
    onChange={(e) => updateField("autoCloseSeconds", Number(e.target.value))}
    placeholder="Example: 5"
  />
  <small>Set 0 for manual close only. Use 1 to 60 seconds for automatic close.</small>
</label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Popup"}
        </button>

        {message ? <p className="message">{message}</p> : null}
      </form>

      
    </main>
  );
}

