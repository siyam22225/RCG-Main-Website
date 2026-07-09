"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./BoardDirectorsAdmin.module.css";

type BoardDirector = {
  id: string;
  slug: string;
  name: string;
  role: string;
  education: string | null;
  shortMessage: string | null;
  profileDetails: string | null;
  messageTitle: string | null;
  messageBody: string | null;
  showMessage: boolean;
  image: string | null;
  facebook: string | null;
  whatsapp: string | null;
  website: string | null;
  profileEnabled: boolean;
  isActive: boolean;
  displayOrder: number;
};

type FormState = {
  id: string;
  slug: string;
  name: string;
  role: string;
  education: string;
  shortMessage: string;
  profileDetails: string;
  messageTitle: string;
  messageBody: string;
  showMessage: boolean;
  image: string;
  facebook: string;
  whatsapp: string;
  website: string;
  profileEnabled: boolean;
  isActive: boolean;
  displayOrder: number;
};

const emptyForm: FormState = {
  id: "",
  slug: "",
  name: "",
  role: "",
  education: "",
  shortMessage: "",
  profileDetails: "",
  messageTitle: "",
  messageBody: "",
  showMessage: true,
  image: "",
  facebook: "#",
  whatsapp: "#",
  website: "#",
  profileEnabled: false,
  isActive: true,
  displayOrder: 0,
};
const CORE_DIRECTOR_SLUGS = new Set([
  "mohammad-arifuzzaman",
  "manzur-ahammad-sohan",
  "ishtiak-al-mamoon",
  "palash-hendry-sen",
  "md-ali-haider",
  "rabaya-akhter",
  "tania-tanjia",
  "sushmita-islam",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminBoardDirectorsPage() {
  const [directors, setDirectors] = useState<BoardDirector[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const isEditing = Boolean(form.id);

  const sortedDirectors = useMemo(
    () => [...directors].sort((a, b) => a.displayOrder - b.displayOrder),
    [directors]
  );

  async function loadDirectors() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/board-directors", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load board directors.");
      }

      const data = await res.json();
      setDirectors(data.directors || []);
    } catch (error) {
      console.error(error);
      setMessage("Could not load board directors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDirectors();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && !prev.id ? { slug: slugify(String(value)) } : {}),
    }));
  }

  function editDirector(director: BoardDirector) {
    setForm({
      id: director.id,
      slug: director.slug,
      name: director.name,
      role: director.role,
      education: director.education || "",
      shortMessage: director.shortMessage || "",
      profileDetails: director.profileDetails || "",
      messageTitle: director.messageTitle || "",
      messageBody: director.messageBody || "",
      showMessage: director.showMessage !== false,
      image: director.image || "",
      facebook: director.facebook || "#",
      whatsapp: director.whatsapp || "#",
      website: director.website || "#",
      profileEnabled: director.profileEnabled,
      isActive: director.isActive,
      displayOrder: director.displayOrder || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      updateField("image", data.url);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      slug: slugify(form.slug || form.name),
      name: form.name,
      role: form.role,
      education: form.education,
      shortMessage: form.shortMessage,
      profileDetails: form.profileDetails,
      messageTitle: form.messageTitle,
      messageBody: form.messageBody,
      showMessage: form.showMessage,
      image: form.image,
      facebook: form.facebook,
      whatsapp: form.whatsapp,
      website: form.website,
      profileEnabled: form.profileEnabled,
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder || 0),
    };

    try {
      const res = await fetch(
        isEditing
          ? `/api/admin/board-directors/${form.id}`
          : "/api/admin/board-directors",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed.");
      }

      setForm(emptyForm);
      setMessage(isEditing ? "Director updated." : "Director added.");
      await loadDirectors();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

 async function toggleCoreDirectorStatus(director: BoardDirector) {
  const nextStatus = !director.isActive;

  try {
    const res = await fetch(`/api/admin/board-directors/${director.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: director.slug,
        name: director.name,
        role: director.role,
        education: director.education || "",
        shortMessage: director.shortMessage || "",
        image: director.image || "",
        facebook: director.facebook || "#",
        whatsapp: director.whatsapp || "#",
        profileEnabled: director.profileEnabled,
        isActive: nextStatus,
        displayOrder: director.displayOrder,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Status update failed.");
    }

    setMessage(nextStatus ? "Director activated." : "Director set inactive.");
    await loadDirectors();
  } catch (error) {
    console.error(error);
    setMessage("Could not update director status.");
  }
}

async function deleteExtraDirector(id: string) {
  const ok = window.confirm("Delete this extra director permanently?");
  if (!ok) return;

  try {
    const res = await fetch(`/api/admin/board-directors/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Delete failed.");
    }

    setMessage("Extra director deleted.");
    await loadDirectors();
  } catch (error) {
    console.error(error);
    setMessage(error instanceof Error ? error.message : "Could not delete director.");
  }
}

  return (
    <main className={styles["admin-board-page"]}>
<section className={styles["admin-board-header"]}>
        <p>Admin Settings</p>
        <h1>Board of Directors</h1>
        <span>
          Manage the public Board of Directors cards. Detail pages remain fixed
          for the first two leadership profiles.
        </span>
      </section>

      {message ? <div className={styles["admin-message"]}>{message}</div> : null}

      <section className={styles["admin-board-grid"]}>
        <form className={styles["admin-board-form"]} onSubmit={submitForm}>
          <h2>{isEditing ? "Edit Director" : "Add Director"}</h2>

          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </label>

          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", slugify(e.target.value))}
              required
            />
          </label>

          <label>
            Role
            <input
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              required
            />
          </label>

          <label>
            Education
            <textarea
              value={form.education}
              onChange={(e) => updateField("education", e.target.value)}
              rows={2}
            />
          </label>

          <label>
            Short Message
            <textarea
              value={form.shortMessage}
              onChange={(e) => updateField("shortMessage", e.target.value)}
              rows={4}
            />
          </label>

          <label>
            Profile Details
            <textarea
              value={form.profileDetails}
              onChange={(e) => updateField("profileDetails", e.target.value)}
              rows={5}
            />
          </label>

          <label>
            Message Title
            <input
              value={form.messageTitle}
              onChange={(e) => updateField("messageTitle", e.target.value)}
              placeholder="Managing Director Message"
            />
          </label>

          <label>
            Message Body
            <textarea
              value={form.messageBody}
              onChange={(e) => updateField("messageBody", e.target.value)}
              rows={6}
            />
          </label>

          <label>
            Image URL
            <input
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="/images/message/director-1.jpg"
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
            {uploading ? <small>Uploading...</small> : null}
          </label>

          <label>
            Facebook Link
            <input
              value={form.facebook}
              onChange={(e) => updateField("facebook", e.target.value)}
            />
          </label>

          <label>
            WhatsApp Link
            <input
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
            />
          </label>

          <label>
            Website Link
            <input
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <div className={styles["admin-check-row"]}>
            <label>
              <input
                type="checkbox"
                checked={form.profileEnabled}
                onChange={(e) =>
                  updateField("profileEnabled", e.target.checked)
                }
              />
              Show View Profile button
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.showMessage}
                onChange={(e) => updateField("showMessage", e.target.checked)}
              />
              Show Message section
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
              />
              Active
            </label>
          </div>

          <label>
            Display Order
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                updateField("displayOrder", Number(e.target.value))
              }
            />
          </label>

          <div className={styles["admin-actions"]}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update Director" : "Add Director"}
            </button>

            {isEditing ? (
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setForm(emptyForm)}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className={styles["admin-board-list"]}>
          <h2>Current Directors</h2>

          {loading ? <p>Loading...</p> : null}

          {!loading && sortedDirectors.length === 0 ? (
            <p>No directors found.</p>
          ) : null}

          {sortedDirectors.map((director) => (
            <article className={styles["admin-director-card"]} key={director.id}>
              <img
                src={director.image || "/images/message/director-1.jpg"}
                alt={director.name}
              />

              <div>
                <p className={styles["status-line"]}>
                  #{director.displayOrder} Â·{" "}
                  {director.isActive ? "Active" : "Hidden"}
                </p>
                <h3>{director.name}</h3>
                <strong>{director.role}</strong>
                <p>{director.shortMessage}</p>

                <div className={styles["card-actions"]}>
                  <button type="button" onClick={() => editDirector(director)}>
                    Edit
                  </button>
                 {CORE_DIRECTOR_SLUGS.has(director.slug) ? (
  <button
    type="button"
    className={director.isActive ? styles.danger : styles.secondary}
    onClick={() => toggleCoreDirectorStatus(director)}
  >
    {director.isActive ? "Set Inactive" : "Set Active"}
  </button>
) : (
  <button
    type="button"
    className={styles.danger}
    onClick={() => deleteExtraDirector(director.id)}
  >
    Delete
  </button>
)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      
    </main>
  );
}

