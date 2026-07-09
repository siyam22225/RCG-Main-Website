"use client";

import { useEffect, useMemo, useState } from "react";

type AboutPage = {
  id: string;
  pageKey: string;
  title: string;
  imageUrl: string;
  paragraphs: string[];
  isActive: boolean;
};

type FormState = {
  pageKey: string;
  title: string;
  imageUrl: string;
  isActive: boolean;

  introParagraph: string;
  whoWeAre: string;
  businessScope: string;
  commitment: string;

  mission: string;
  vision: string;
  values: string;
};

const defaultWhoWeAre =
  "Real Capita Group brings together disciplined planning, dependable execution, and a forward-looking corporate vision under one growing business platform.";

const defaultForm: FormState = {
  pageKey: "corporate-profile",
  title: "",
  imageUrl: "",
  isActive: true,

  introParagraph: "",
  whoWeAre: defaultWhoWeAre,
  businessScope: "",
  commitment: "",

  mission: "",
  vision: "",
  values: "",
};

function pageLabel(pageKey: string) {
  if (pageKey === "corporate-profile") return "Corporate Profile";
  if (pageKey === "mission-vision-values") return "Mission, Vision & Values";
  return pageKey;
}

function splitLegacyVisionValues(paragraphs: string[]) {
  const mission = paragraphs[0] || "";
  let vision = paragraphs[1] || "";
  let values = paragraphs[2] || "";

  const marker = "Our values are built";

  if (!values && vision.includes(marker)) {
    const markerIndex = vision.indexOf(marker);

    if (markerIndex >= 0) {
      values = vision.slice(markerIndex).trim();
      vision = vision.slice(0, markerIndex).trim();
    }
  }

  return { mission, vision, values };
}

function buildFormFromPage(page: AboutPage): FormState {
  const paragraphs = Array.isArray(page.paragraphs) ? page.paragraphs : [];

  if (page.pageKey === "corporate-profile") {
    const isStructured = paragraphs.length >= 4;

    return {
      pageKey: page.pageKey,
      title: page.title || "",
      imageUrl: page.imageUrl || "",
      isActive: page.isActive !== false,

      introParagraph: paragraphs[0] || "",
      whoWeAre: isStructured ? paragraphs[1] || defaultWhoWeAre : defaultWhoWeAre,
      businessScope: isStructured ? paragraphs[2] || "" : paragraphs[1] || "",
      commitment: isStructured ? paragraphs[3] || "" : paragraphs[2] || "",

      mission: "",
      vision: "",
      values: "",
    };
  }

  const missionParts = splitLegacyVisionValues(paragraphs);

  return {
    pageKey: page.pageKey,
    title: page.title || "",
    imageUrl: page.imageUrl || "",
    isActive: page.isActive !== false,

    introParagraph: "",
    whoWeAre: defaultWhoWeAre,
    businessScope: "",
    commitment: "",

    mission: missionParts.mission,
    vision: missionParts.vision,
    values: missionParts.values,
  };
}

export default function AboutPagesSettingsPage() {
  const [pages, setPages] = useState<AboutPage[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedPage = useMemo(
    () => pages.find((page) => page.pageKey === form.pageKey),
    [pages, form.pageKey]
  );

  async function loadPages(preferredPageKey?: string) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/about-pages", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load about pages.");
      }

      const loadedPages = Array.isArray(data.pages) ? data.pages : [];
      setPages(loadedPages);

      const preferredPage =
        loadedPages.find((page: AboutPage) => page.pageKey === preferredPageKey) ||
        loadedPages[0];

      if (preferredPage) {
        setForm(buildFormFromPage(preferredPage));
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load about page settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  function selectPage(pageKey: string) {
    const page = pages.find((item) => item.pageKey === pageKey);

    if (!page) {
      setForm((prev) => ({ ...prev, pageKey }));
      return;
    }

    setForm(buildFormFromPage(page));
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function uploadImage(file: File) {
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

      updateField("imageUrl", data.url);
      setMessage("Image uploaded.");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  }

  function buildParagraphsForSave() {
    if (form.pageKey === "corporate-profile") {
      return [
        form.introParagraph.trim(),
        form.whoWeAre.trim(),
        form.businessScope.trim(),
        form.commitment.trim(),
      ];
    }

    return [
      form.mission.trim(),
      form.vision.trim(),
      form.values.trim(),
    ];
  }

  async function savePage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const paragraphs = buildParagraphsForSave();

    if (paragraphs.some((paragraph) => !paragraph)) {
      setMessage("Please complete every visible content field before saving.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/settings/about-pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageKey: form.pageKey,
          title: form.title,
          imageUrl: form.imageUrl,
          isActive: form.isActive,
          paragraphs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      setMessage(`${pageLabel(form.pageKey)} updated.`);
      await loadPages(form.pageKey);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="aboutSettingsPage"><style jsx>{`
        .aboutSettingsPage {
          min-height: 100vh;
          padding: 40px 24px 72px;
          color: #0f172a;
          background: linear-gradient(180deg, #eef8fd, #f8fbff);
        }

        .settingsHeader,
        .messageBox,
        .settingsLayout {
          max-width: 1180px;
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

        .settingsLayout {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .pageListCard,
        .settingsCard {
          border-radius: 24px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
        }

        .pageListCard {
          display: grid;
          gap: 12px;
          padding: 20px;
          position: sticky;
          top: 24px;
        }

        .settingsCard {
          display: grid;
          gap: 16px;
          padding: 26px;
        }

        h2 {
          margin: 0 0 10px;
          color: #075c9d;
          font-size: 24px;
        }

        .pageListCard button {
          display: grid;
          gap: 6px;
          text-align: left;
          border: 1px solid #dbeafe;
          border-radius: 18px;
          padding: 16px;
          background: #f8fbff;
          cursor: pointer;
        }

        .pageListCard button.activePage {
          color: #ffffff;
          background: linear-gradient(135deg, #075c9d, #16a34a);
          border-color: transparent;
        }

        .pageListCard button strong {
          font-size: 15px;
        }

        .pageListCard button span {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        label {
          display: grid;
          gap: 8px;
          color: #334155;
          font-size: 14px;
          font-weight: 850;
        }

        input,
        textarea,
        select {
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
          padding: 16px;
          border-radius: 18px;
          background: #f8fbff;
          border: 1px solid #dbeafe;
        }

        .imagePreview img {
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
          border-radius: 14px;
        }

        .previewCard {
          padding: 18px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f8fbff, #eef8fd);
          border: 1px solid #dbeafe;
        }

        .previewCard span {
          color: #16a34a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .previewCard h3 {
          margin: 8px 0;
          color: #0f172a;
          font-size: 22px;
        }

        .previewCard p {
          margin: 0;
          color: #475569;
          line-height: 1.7;
        }

        button[type="submit"] {
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

        @media (max-width: 900px) {
          .settingsLayout {
            grid-template-columns: 1fr;
          }

          .pageListCard {
            position: static;
          }
        }
      `}</style>

      <section className="settingsHeader">
        <p>Admin Settings</p>
        <h1>About Pages</h1>
        <span>
          Update Corporate Profile and Mission, Vision & Values content without
          changing the public page design.
        </span>
      </section>

      {message ? <div className="messageBox">{message}</div> : null}

      <section className="settingsLayout">
        <aside className="pageListCard">
          <h2>Pages</h2>

          {loading ? <p>Loading...</p> : null}

          {pages.map((page) => (
            <button
              type="button"
              key={page.pageKey}
              className={form.pageKey === page.pageKey ? "activePage" : ""}
              onClick={() => selectPage(page.pageKey)}
            >
              <strong>{pageLabel(page.pageKey)}</strong>
              <span>{page.isActive ? "Active" : "Inactive"}</span>
            </button>
          ))}
        </aside>

        <form className="settingsCard" onSubmit={savePage}>
          <h2>Edit {pageLabel(form.pageKey)}</h2>

          <label>
            Page
            <select
              value={form.pageKey}
              onChange={(e) => selectPage(e.target.value)}
            >
              {pages.map((page) => (
                <option key={page.pageKey} value={page.pageKey}>
                  {pageLabel(page.pageKey)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Page Title
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </label>

          <label>
            Image URL
            <input
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              required
            />
          </label>

          <label>
            Upload Image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>

          {form.imageUrl ? (
            <div className="imagePreview">
              <img src={form.imageUrl} alt={form.title || "About page"} />
            </div>
          ) : null}

          {form.pageKey === "corporate-profile" ? (
            <>
              <label>
                Intro Paragraph
                <textarea
                  rows={5}
                  value={form.introParagraph}
                  onChange={(e) => updateField("introParagraph", e.target.value)}
                  required
                />
              </label>

              <label>
                Who We Are
                <textarea
                  rows={4}
                  value={form.whoWeAre}
                  onChange={(e) => updateField("whoWeAre", e.target.value)}
                  required
                />
              </label>

              <label>
                Our Business Scope
                <textarea
                  rows={5}
                  value={form.businessScope}
                  onChange={(e) => updateField("businessScope", e.target.value)}
                  required
                />
              </label>

              <label>
                Our Commitment
                <textarea
                  rows={5}
                  value={form.commitment}
                  onChange={(e) => updateField("commitment", e.target.value)}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Mission
                <textarea
                  rows={5}
                  value={form.mission}
                  onChange={(e) => updateField("mission", e.target.value)}
                  required
                />
              </label>

              <label>
                Vision
                <textarea
                  rows={5}
                  value={form.vision}
                  onChange={(e) => updateField("vision", e.target.value)}
                  required
                />
              </label>

              <label>
                Values
                <textarea
                  rows={5}
                  value={form.values}
                  onChange={(e) => updateField("values", e.target.value)}
                  required
                />
              </label>
            </>
          )}

          <label className="checkLabel">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            Active page content
          </label>

          <div className="previewCard">
            <span>Preview</span>
            <h3>{form.title || selectedPage?.title}</h3>
            <p>
              {form.pageKey === "corporate-profile"
                ? form.introParagraph || "Intro paragraph preview will appear here."
                : form.mission || "Mission preview will appear here."}
            </p>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save About Page"}
          </button>
        </form>
      </section>
    </main>
  );
}
