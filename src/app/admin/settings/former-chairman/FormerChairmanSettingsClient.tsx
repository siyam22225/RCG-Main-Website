"use client";

import { useEffect, useState } from "react";
import styles from "./FormerChairmanSettingsClient.module.css";

type FormerChairmanMessage = {
  id: string;
  isActive: boolean;
  name: string;
  designation: string | null;
  image: string | null;
  title: string;
  eyebrow: string | null;
  introLead: string | null;
  articleLabel: string | null;
  articleHeading: string | null;
  messageBody: string | null;
  profileItems: string | null;
};

const defaultProfileItems = [
  "Position | Chairman",
  "Education | B.Com (Hons), Management",
  "Profession | Businessman & Contractor",
  "Achievements | Recognized for leadership, dedication, and development vision.",
  "Business Activities | First Class Contractor in LGED & Roads & Highways department all over Dhaka City Corporation. (1981-2006)",
  "Legacy | A lasting contribution to structured growth and corporate trust.",
  "Personal Qualities | Known for integrity, vision, and commitment to excellence.",
  "Foreign Visit | India & KSA",
].join("\n");

export default function FormerChairmanSettingsClient() {
  const [form, setForm] = useState<FormerChairmanMessage>({
    id: "",
    isActive: true,
    name: "Former Chairman",
    designation: "",
    image: "/images/message/former-chairman.jpg",
    title: "Former Chairman Message",
    eyebrow: "Who We Are",
    introLead:
      "A vision for planned development, responsible growth, and reliable living opportunities for future generations.",
    articleLabel: "Message",
    articleHeading:
      "Building with vision, trust, and long-term responsibility.",
    messageBody: "",
    profileItems: defaultProfileItems,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadData() {
    setLoading(true);
    setNotice("");

    try {
      const res = await fetch("/api/admin/former-chairman", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load.");
      }

      setForm({
        id: data.message.id,
        isActive: data.message.isActive,
        name: data.message.name || "Former Chairman",
        designation: data.message.designation || "",
        image: data.message.image || "",
        title: data.message.title || "Former Chairman Message",
        eyebrow: data.message.eyebrow || "Who We Are",
        introLead:
          data.message.introLead ||
          "A vision for planned development, responsible growth, and reliable living opportunities for future generations.",
        articleLabel: data.message.articleLabel || "Message",
        articleHeading:
          data.message.articleHeading ||
          "Building with vision, trust, and long-term responsibility.",
        messageBody: data.message.messageBody || "",
        profileItems: data.message.profileItems || defaultProfileItems,
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    setNotice("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      setForm((prev) => ({ ...prev, image: data.url }));
      setNotice("Image uploaded successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    try {
      const res = await fetch("/api/admin/former-chairman", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save.");
      }

      setNotice("Former Chairman page settings updated.");
      setForm({
        id: data.message.id,
        isActive: data.message.isActive,
        name: data.message.name || "Former Chairman",
        designation: data.message.designation || "",
        image: data.message.image || "",
        title: data.message.title || "Former Chairman Message",
        eyebrow: data.message.eyebrow || "Who We Are",
        introLead:
          data.message.introLead ||
          "A vision for planned development, responsible growth, and reliable living opportunities for future generations.",
        articleLabel: data.message.articleLabel || "Message",
        articleHeading:
          data.message.articleHeading ||
          "Building with vision, trust, and long-term responsibility.",
        messageBody: data.message.messageBody || "",
        profileItems: data.message.profileItems || defaultProfileItems,
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.settingsCard}>
      {loading ? <p className={styles.notice}>Loading...</p> : null}
      {notice ? <p className={styles.notice}>{notice}</p> : null}

      <form onSubmit={saveSettings}>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isActive: event.target.checked }))
            }
          />
          Active Former Chairman Page
        </label>

        <label>
          Name
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
        </label>

        <label>
          Designation
          <input
            value={form.designation || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, designation: event.target.value }))
            }
            placeholder="Former Chairman"
          />
        </label>

        <label>
          Image URL
          <input
            value={form.image || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, image: event.target.value }))
            }
            placeholder="/images/message/former-chairman.jpg"
          />
        </label>

        <label>
          Upload Image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
          {uploadingImage ? <span className={styles.uploadNote}>Uploading...</span> : null}
        </label>

        <label>
          Page Eyebrow
          <input
            value={form.eyebrow || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, eyebrow: event.target.value }))
            }
            placeholder="Who We Are"
          />
        </label>

        <label>
          Page Title
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            required
          />
        </label>

        <label>
          Intro Text
          <textarea
            value={form.introLead || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, introLead: event.target.value }))
            }
            rows={3}
          />
        </label>

        <label>
          Message Section Label
          <input
            value={form.articleLabel || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, articleLabel: event.target.value }))
            }
            placeholder="Message"
          />
        </label>

        <label>
          Message Section Heading
          <input
            value={form.articleHeading || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, articleHeading: event.target.value }))
            }
          />
        </label>

        <label>
          Message Body
          <textarea
            value={form.messageBody || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, messageBody: event.target.value }))
            }
            rows={10}
            placeholder="Write the Former Chairman message here..."
          />
        </label>

        <label>
          Profile Details
          <textarea
            value={form.profileItems || ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, profileItems: event.target.value }))
            }
            rows={9}
            placeholder={"Position | Chairman\nEducation | B.Com (Hons), Management"}
          />
        </label>

        <button type="submit" disabled={saving || loading}>
          {saving ? "Saving..." : "Update Former Chairman Page"}
        </button>
      </form>
</div>
  );
}