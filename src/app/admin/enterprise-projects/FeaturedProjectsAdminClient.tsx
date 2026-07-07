"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./FeaturedProjectsAdmin.module.css";

type BusinessVerticalItem = {
  id: string;
  label: string;
  enterpriseSlug: string | null;
  targetUrl: string | null;
  isActive: boolean;
};

type BusinessVerticalCategory = {
  id: string;
  label: string;
  isActive: boolean;
  items: BusinessVerticalItem[];
};

type ProjectMedia = {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  alt: string;
};

type EnterpriseProject = {
  id: string;
  enterpriseSlug: string;
  slug: string;
  name: string;
  location: string | null;
  image: string | null;
  shortDescription: string | null;
  fullDescription: string[] | null;
  media: ProjectMedia[] | null;
  profilePdf: string | null;
  layoutPdf: string | null;
  websiteUrl: string | null;
  tour360Image: string | null;
  isActive: boolean;
  displayOrder: number;
};

type FormState = {
  enterpriseSlug: string;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescriptionText: string;
  profilePdf: string;
  layoutPdf: string;
  websiteUrl: string;
  tour360Image: string;
  displayOrder: string;
  isActive: boolean;
};

type UploadTarget = keyof Pick<
  FormState,
  "image" | "profilePdf" | "layoutPdf" | "tour360Image"
>;

const emptyForm: FormState = {
  enterpriseSlug: "",
  slug: "",
  name: "",
  location: "",
  image: "",
  shortDescription: "",
  fullDescriptionText: "",
  profilePdf: "",
  layoutPdf: "",
  websiteUrl: "",
  tour360Image: "",
  displayOrder: "0",
  isActive: true,
};

const frontendSourceSlugs: Record<string, string[]> = {
  "land-rpcdl": ["land-rpcdl", "rc-property"],
  "rc-property": ["rc-property", "land-rpcdl"],
  "apartment-rchl": ["apartment-rchl", "rc-holdings"],
  "rc-holdings": ["rc-holdings", "apartment-rchl"],
};

function getFrontendSourceSlugs(slug: string) {
  return frontendSourceSlugs[slug] ?? [slug];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeParagraphs(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getProjectParagraphText(project: EnterpriseProject) {
  return Array.isArray(project.fullDescription)
    ? project.fullDescription.join("\n")
    : "";
}

function getProjectMedia(project: EnterpriseProject) {
  return Array.isArray(project.media) ? project.media : [];
}

export default function FeaturedProjectsAdminClient() {
  const [categories, setCategories] = useState<BusinessVerticalCategory[]>([]);
  const [projects, setProjects] = useState<EnterpriseProject[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [mediaDraft, setMediaDraft] = useState<Omit<ProjectMedia, "id">>({
    type: "image",
    src: "",
    thumbnail: "",
    alt: "",
  });
  const [mediaItems, setMediaItems] = useState<ProjectMedia[]>([]);

  const verticalOptions = useMemo(() => {
    return categories.flatMap((category) =>
      category.items
        .filter((item) => item.enterpriseSlug)
        .map((item) => ({
          id: item.id,
          label: `${category.label} / ${item.label}`,
          enterpriseSlug: item.enterpriseSlug || "",
          isActive: item.isActive && category.isActive,
        }))
    );
  }, [categories]);

  const verticalLabelBySlug = useMemo(() => {
    const map = new Map<string, string>();
    verticalOptions.forEach((option) => {
      map.set(option.enterpriseSlug, option.label);
    });
    return map;
  }, [verticalOptions]);

  const selectedSourceSlugs = useMemo(
    () => getFrontendSourceSlugs(form.enterpriseSlug),
    [form.enterpriseSlug]
  );

  const selectedProjects = useMemo(() => {
    if (!form.enterpriseSlug) return [];
    return projects.filter((project) =>
      selectedSourceSlugs.includes(project.enterpriseSlug)
    );
  }, [projects, selectedSourceSlugs, form.enterpriseSlug]);

  const selectedVerticalLabel =
    verticalLabelBySlug.get(form.enterpriseSlug) ||
    form.enterpriseSlug ||
    "No Business Vertical selected";

  const selectedPublicPath = form.enterpriseSlug
    ? `/business-verticals/${form.enterpriseSlug}`
    : "";

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const [verticalRes, projectRes] = await Promise.all([
        fetch("/api/admin/business-verticals", { cache: "no-store" }),
        fetch("/api/admin/enterprise-projects", { cache: "no-store" }),
      ]);

      const verticalData = await verticalRes.json();
      const projectData = await projectRes.json();

      if (!verticalRes.ok) {
        throw new Error(verticalData?.message || "Failed to load Business Verticals.");
      }

      if (!projectRes.ok) {
        throw new Error(projectData?.error || "Failed to load Featured Projects.");
      }

      const loadedCategories = verticalData.categories || [];
      const loadedProjects = projectData.projects || [];

      setCategories(loadedCategories);
      setProjects(loadedProjects);

      if (!form.enterpriseSlug) {
        const firstSlug = loadedCategories
          .flatMap((category: BusinessVerticalCategory) => category.items || [])
          .find((item: BusinessVerticalItem) => item.enterpriseSlug)?.enterpriseSlug;

        if (firstSlug) {
          setForm((current) => ({ ...current, enterpriseSlug: firstSlug }));
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    const firstSlug = verticalOptions[0]?.enterpriseSlug || "";
    setEditingId(null);
    setForm({ ...emptyForm, enterpriseSlug: firstSlug });
    setMediaItems([]);
    setMediaDraft({ type: "image", src: "", thumbnail: "", alt: "" });
  }

  function editProject(project: EnterpriseProject) {
    const selectedSources = getFrontendSourceSlugs(form.enterpriseSlug);
    const targetEnterpriseSlug =
      form.enterpriseSlug && selectedSources.includes(project.enterpriseSlug)
        ? form.enterpriseSlug
        : project.enterpriseSlug || "";

    setEditingId(project.id);
    setForm({
      enterpriseSlug: targetEnterpriseSlug,
      slug: project.slug || "",
      name: project.name || "",
      location: project.location || "",
      image: project.image || "",
      shortDescription: project.shortDescription || "",
      fullDescriptionText: getProjectParagraphText(project),
      profilePdf: project.profilePdf || "",
      layoutPdf: project.layoutPdf || "",
      websiteUrl: project.websiteUrl || "",
      tour360Image: project.tour360Image || "",
      displayOrder: String(project.displayOrder || 0),
      isActive: project.isActive,
    });
    setMediaItems(getProjectMedia(project));
    setMediaDraft({ type: "image", src: "", thumbnail: "", alt: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadFile(file: File, onDone: (url: string) => void, targetLabel: string) {
    setUploadingField(targetLabel);
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
        throw new Error(data?.error || "Upload failed.");
      }

      onDone(data.url);
      setMessage("File uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleFieldUpload(field: UploadTarget, fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    await uploadFile(file, (url) => updateField(field, url), field);
  }

  async function handleMediaUpload(field: "src" | "thumbnail", fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    await uploadFile(
      file,
      (url) => setMediaDraft((current) => ({ ...current, [field]: url })),
      `media-${field}`
    );
  }

  function addMediaItem() {
    const src = mediaDraft.src.trim();

    if (!src) {
      setMessage("Media file or URL is required before adding media.");
      return;
    }

    setMediaItems((current) => [
      ...current,
      {
        id: Date.now(),
        type: mediaDraft.type,
        src,
        thumbnail: mediaDraft.thumbnail?.trim() || undefined,
        alt: mediaDraft.alt.trim() || form.name.trim() || "Featured project media",
      },
    ]);

    setMediaDraft({ type: "image", src: "", thumbnail: "", alt: "" });
    setMessage("");
  }

  function removeMediaItem(id: number) {
    setMediaItems((current) => current.filter((item) => item.id !== id));
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        enterpriseSlug: form.enterpriseSlug,
        slug: form.slug || slugify(form.name),
        name: form.name,
        location: form.location,
        image: form.image,
        shortDescription: form.shortDescription,
        fullDescription: normalizeParagraphs(form.fullDescriptionText),
        media: mediaItems,
        profilePdf: form.profilePdf,
        layoutPdf: form.layoutPdf,
        websiteUrl: form.websiteUrl,
        tour360Image: form.tour360Image,
        displayOrder: Number(form.displayOrder || 0),
        isActive: form.isActive,
      };

      const res = await fetch(
        editingId ? `/api/admin/enterprise-projects/${editingId}` : "/api/admin/enterprise-projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save Featured Project.");
      }

      setMessage(editingId ? "Featured Project updated successfully." : "Featured Project added successfully.");
      resetForm();
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save Featured Project.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleProjectStatus(project: EnterpriseProject) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/enterprise-projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enterpriseSlug: project.enterpriseSlug,
          slug: project.slug,
          name: project.name,
          location: project.location || "",
          image: project.image || "",
          shortDescription: project.shortDescription || "",
          fullDescription: Array.isArray(project.fullDescription) ? project.fullDescription : [],
          media: Array.isArray(project.media) ? project.media : [],
          profilePdf: project.profilePdf || "",
          layoutPdf: project.layoutPdf || "",
          websiteUrl: project.websiteUrl || "",
          tour360Image: project.tour360Image || "",
          displayOrder: project.displayOrder || 0,
          isActive: !project.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update Featured Project status.");
      }

      setMessage(project.isActive ? "Featured Project hidden successfully." : "Featured Project shown successfully.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update Featured Project status.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(project: EnterpriseProject) {
    const confirmed = confirm(`Delete or hide this Featured Project?\n\n${project.name}`);

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/enterprise-projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete Featured Project.");
      }

      setMessage(
        data.action === "set-inactive"
          ? "Default Featured Project was hidden instead of deleted."
          : "Featured Project deleted successfully."
      );
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete Featured Project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.adminEnterpriseProjects}>
      <div className={styles.headerBlock}>
        <p>Admin Panel</p>
        <h1>Featured Project Settings</h1>
        <span>
          Manage the project cards and detail-page content that appear on the existing public Business Vertical frontend pages.
        </span>
      </div>

      {message ? <div className={styles.messageBox}>{message}</div> : null}

      <div className={styles.adminGrid}>
        <form className={styles.formCard} onSubmit={saveProject}>
          <h2>{editingId ? "Edit Featured Project" : "Add Featured Project"}</h2>

          <label>
            Business Vertical Sub-category
            <select
              value={form.enterpriseSlug}
              onChange={(event) => updateField("enterpriseSlug", event.target.value)}
              required
            >
              <option value="">Select sub-category</option>
              {verticalOptions.map((option) => (
                <option key={option.id} value={option.enterpriseSlug}>
                  {option.label} {option.isActive ? "" : "(Hidden)"}
                </option>
              ))}
            </select>
          </label>

          <label>
            Project Name
            <input
              value={form.name}
              onChange={(event) => {
                updateField("name", event.target.value);
                if (!editingId && !form.slug) {
                  updateField("slug", slugify(event.target.value));
                }
              }}
              placeholder="RC Bay"
              required
            />
          </label>

          <label>
            Project Slug
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", slugify(event.target.value))}
              placeholder="rc-bay"
              required
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Dhaka, Bangladesh"
            />
          </label>

          <label>
            Main Image URL
            <input
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="/uploads/images/project.jpg"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleFieldUpload("image", event.target.files)}
            />
          </label>

          <label>
            Short Description
            <textarea
              rows={4}
              value={form.shortDescription}
              onChange={(event) => updateField("shortDescription", event.target.value)}
              placeholder="Short project summary for the card."
            />
          </label>

          <label>
            Full Description
            <textarea
              rows={7}
              value={form.fullDescriptionText}
              onChange={(event) => updateField("fullDescriptionText", event.target.value)}
              placeholder="Write one paragraph per line. These lines will appear on the detail page."
            />
          </label>

          <label>
            Profile PDF URL
            <input
              value={form.profilePdf}
              onChange={(event) => updateField("profilePdf", event.target.value)}
              placeholder="/uploads/documents/profile.pdf"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => handleFieldUpload("profilePdf", event.target.files)}
            />
          </label>

          <label>
            Layout PDF URL
            <input
              value={form.layoutPdf}
              onChange={(event) => updateField("layoutPdf", event.target.value)}
              placeholder="/uploads/documents/layout.pdf"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => handleFieldUpload("layoutPdf", event.target.files)}
            />
          </label>

          <label>
            Website URL
            <input
              value={form.websiteUrl}
              onChange={(event) => updateField("websiteUrl", event.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label>
            360 Tour Image URL
            <input
              value={form.tour360Image}
              onChange={(event) => updateField("tour360Image", event.target.value)}
              placeholder="/uploads/images/tour.jpg"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleFieldUpload("tour360Image", event.target.files)}
            />
          </label>

          <div className={styles.mediaManager}>
            <h3>Project Media</h3>
            <p>Add gallery images or videos for the project detail page.</p>

            <div className={styles.mediaDraftGrid}>
              <label>
                Media Type
                <select
                  value={mediaDraft.type}
                  onChange={(event) =>
                    setMediaDraft((current) => ({
                      ...current,
                      type: event.target.value as "image" | "video",
                    }))
                  }
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </label>

              <label>
                Media URL
                <input
                  value={mediaDraft.src}
                  onChange={(event) =>
                    setMediaDraft((current) => ({ ...current, src: event.target.value }))
                  }
                  placeholder="/uploads/images/gallery.jpg or video URL"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  onChange={(event) => handleMediaUpload("src", event.target.files)}
                />
              </label>

              <label>
                Thumbnail URL
                <input
                  value={mediaDraft.thumbnail || ""}
                  onChange={(event) =>
                    setMediaDraft((current) => ({ ...current, thumbnail: event.target.value }))
                  }
                  placeholder="Optional thumbnail image"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleMediaUpload("thumbnail", event.target.files)}
                />
              </label>

              <label>
                Alt Text / Caption
                <input
                  value={mediaDraft.alt}
                  onChange={(event) =>
                    setMediaDraft((current) => ({ ...current, alt: event.target.value }))
                  }
                  placeholder="Project exterior view"
                />
              </label>

              <button type="button" className={styles.secondary} onClick={addMediaItem}>
                Add Media
              </button>
            </div>

            <div className={styles.mediaList}>
              {mediaItems.length === 0 ? (
                <span className={styles.emptyMedia}>No media added yet.</span>
              ) : (
                mediaItems.map((item) => (
                  <div className={styles.mediaItem} key={item.id}>
                    <div>
                      <strong>{item.type.toUpperCase()}</strong>
                      <span>{item.src}</span>
                      {item.thumbnail ? <small>Thumbnail: {item.thumbnail}</small> : null}
                      <small>{item.alt}</small>
                    </div>
                    <button type="button" className={styles.danger} onClick={() => removeMediaItem(item.id)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <label>
            Display Order
            <input
              type="number"
              value={form.displayOrder}
              onChange={(event) => updateField("displayOrder", event.target.value)}
            />
          </label>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
            Active / visible on public website
          </label>

          <div className={styles.actions}>
            <button type="submit" disabled={loading || Boolean(uploadingField)}>
              {loading ? "Saving..." : editingId ? "Update Project" : "Add Project"}
            </button>
            {editingId ? (
              <button type="button" className={styles.secondary} onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          {uploadingField ? <p className={styles.emptyMedia}>Uploading {uploadingField}...</p> : null}
        </form>

        <div className={styles.listCard}>
          <h2>Featured Project List</h2>
          <p className={styles.emptyMedia}>
            Showing projects for: <strong>{selectedVerticalLabel}</strong>
            {selectedPublicPath ? (
              <>
                {" "}· Frontend page:{" "}
                <a href={selectedPublicPath} target="_blank" rel="noreferrer">
                  {selectedPublicPath}
                </a>
              </>
            ) : null}
          </p>

          {loading && selectedProjects.length === 0 ? (
            <p className={styles.emptyMedia}>Loading projects...</p>
          ) : selectedProjects.length === 0 ? (
            <p className={styles.emptyMedia}>No Featured Project has been added yet.</p>
          ) : (
            selectedProjects.map((project) => (
              <article className={styles.projectCard} key={project.id}>
                <img
                  src={project.image || "/images/placeholder-project.jpg"}
                  alt={project.name}
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />

                <div>
                  <p className={styles.status}>
                    {project.isActive ? "Active" : "Hidden"} · Order {project.displayOrder}
                  </p>
                  <h3>{project.name}</h3>
                  <strong>
                    {verticalLabelBySlug.get(project.enterpriseSlug) || project.enterpriseSlug}
                  </strong>
                  <p>{project.shortDescription || "No short description added."}</p>
                  <small>Project slug: {project.slug}</small>
                  <small>Saved source: {project.enterpriseSlug}</small>
                  <small>
                    Frontend detail URL: /business-verticals/{form.enterpriseSlug || project.enterpriseSlug}/{project.slug}
                  </small>
                  {project.location ? <small>Location: {project.location}</small> : null}
                  {project.profilePdf ? <small>Profile PDF: {project.profilePdf}</small> : null}
                  {project.layoutPdf ? <small>Layout PDF: {project.layoutPdf}</small> : null}

                  <div className={styles.actions}>
                    <button type="button" onClick={() => editProject(project)}>
                      Edit
                    </button>
                    <a
                      className={styles.linkButton}
                      href={`/business-verticals/${form.enterpriseSlug || project.enterpriseSlug}/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Frontend
                    </a>
                    <button
                      type="button"
                      className={styles.secondary}
                      onClick={() => toggleProjectStatus(project)}
                    >
                      {project.isActive ? "Hide" : "Show"}
                    </button>
                    <button type="button" className={styles.danger} onClick={() => deleteProject(project)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

