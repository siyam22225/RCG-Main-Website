"use client";

import { useEffect, useState } from "react";

type CareerVacancy = {
  id: string;
  title: string;
  department: string;
  jobType: string;
  location: string;
  salaryRange: string | null;
  deadline: string | null;
  shortDescription: string;
  responsibilities: string | null;
  requirements: string | null;
  experience: string | null;
  numberOfVacancies: number | null;
  maxCvSizeMb: number;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  _count?: {
    applications: number;
  };
};

type CareerForm = {
  title: string;
  department: string;
  jobType: string;
  location: string;
  salaryRange: string;
  deadline: string;
  shortDescription: string;
  responsibilities: string;
  requirements: string;
  experience: string;
  numberOfVacancies: string;
  maxCvSizeMb: string;
  status: string;
  isFeatured: boolean;
};

type CareerPageForm = {
  sectionTag: string;
  headline: string;
  introText: string;
  point1: string;
  point2: string;
  point3: string;
  point4: string;
  currentOpenTitle: string;
  noVacancyText: string;
  applyTag: string;
  applyTitle: string;
  applyIntro: string;
  openApplicationLabel: string;
  preferredPositionLabel: string;
  preferredPositionPlaceholder: string;
  customPositionsText: string;
};

const emptyForm: CareerForm = {
  title: "",
  department: "Real Estate",
  jobType: "Full-time",
  location: "Dhaka, Bangladesh",
  salaryRange: "",
  deadline: "",
  shortDescription: "",
  responsibilities: "",
  requirements: "",
  experience: "",
  numberOfVacancies: "",
  maxCvSizeMb: "5",
  status: "draft",
  isFeatured: false,
};

const defaultCareerPageForm: CareerPageForm = {
  sectionTag: "Career",
  headline: "Join Real Capita Group",
  introText:
    "Real Capita Group welcomes responsible, skilled, and motivated professionals who want to build their career with a diversified business group. Candidates may submit their CV for suitable current or future opportunities.",
  point1: "Professional and respectful work environment",
  point2: "Opportunities across multiple business verticals",
  point3: "Practical learning through real business operations",
  point4: "Career growth through discipline, teamwork, and responsibility",
  currentOpenTitle: "Current Open Positions",
  noVacancyText:
    "No active vacancy is available at this moment. Candidates may still submit an open application for future opportunities.",
  applyTag: "Apply Now",
  applyTitle: "Submit Your CV",
  applyIntro:
    "Select an available position or submit an open application with your preferred role.",
  openApplicationLabel: "Open Application / Future Opportunity",
  preferredPositionLabel: "Preferred Position",
  preferredPositionPlaceholder: "Example: Sales Executive, IT Officer, Accounts Officer",
  customPositionsText: "",
};

function parsePositionText(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSavedPositions(value: unknown) {
  if (typeof value !== "string") return "";

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join("\n") : "";
  } catch {
    return "";
  }
}

export default function AdminCareersClient() {
  const [careers, setCareers] = useState<CareerVacancy[]>([]);
  const [form, setForm] = useState<CareerForm>(emptyForm);
  const [careerPageForm, setCareerPageForm] = useState<CareerPageForm>(defaultCareerPageForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  async function loadCareers() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/careers", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load vacancies.");
      }

      setCareers(data.careers || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load vacancies.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCareerPageSettings() {
    setPageLoading(true);
    setPageMessage("");

    try {
      const res = await fetch("/api/admin/career-page-settings", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load career page content.");
      }

      const settings = data.settings || {};

      setCareerPageForm({
        sectionTag: settings.sectionTag || defaultCareerPageForm.sectionTag,
        headline: settings.headline || defaultCareerPageForm.headline,
        introText: settings.introText || defaultCareerPageForm.introText,
        point1: settings.point1 || defaultCareerPageForm.point1,
        point2: settings.point2 || defaultCareerPageForm.point2,
        point3: settings.point3 || defaultCareerPageForm.point3,
        point4: settings.point4 || defaultCareerPageForm.point4,
        currentOpenTitle: settings.currentOpenTitle || defaultCareerPageForm.currentOpenTitle,
        noVacancyText: settings.noVacancyText || defaultCareerPageForm.noVacancyText,
        applyTag: settings.applyTag || defaultCareerPageForm.applyTag,
        applyTitle: settings.applyTitle || defaultCareerPageForm.applyTitle,
        applyIntro: settings.applyIntro || defaultCareerPageForm.applyIntro,
        openApplicationLabel:
          settings.openApplicationLabel || defaultCareerPageForm.openApplicationLabel,
        preferredPositionLabel:
          settings.preferredPositionLabel || defaultCareerPageForm.preferredPositionLabel,
        preferredPositionPlaceholder:
          settings.preferredPositionPlaceholder ||
          defaultCareerPageForm.preferredPositionPlaceholder,
        customPositionsText: parseSavedPositions(settings.customPositions),
      });
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Failed to load career page content."
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadCareers();
    loadCareerPageSettings();
  }, []);

  function updateField<K extends keyof CareerForm>(key: K, value: CareerForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateCareerPageField<K extends keyof CareerPageForm>(
    key: K,
    value: CareerPageForm[K]
  ) {
    setCareerPageForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: CareerVacancy) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      department: item.department,
      jobType: item.jobType,
      location: item.location,
      salaryRange: item.salaryRange || "",
      deadline: item.deadline ? item.deadline.slice(0, 10) : "",
      shortDescription: item.shortDescription,
      responsibilities: item.responsibilities || "",
      requirements: item.requirements || "",
      experience: item.experience || "",
      numberOfVacancies: item.numberOfVacancies ? String(item.numberOfVacancies) : "",
      maxCvSizeMb: item.maxCvSizeMb ? String(item.maxCvSizeMb) : "5",
      status: item.status,
      isFeatured: item.isFeatured,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveCareerPageSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPageLoading(true);
    setPageMessage("");

    try {
      const res = await fetch("/api/admin/career-page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...careerPageForm,
          customPositions: parsePositionText(careerPageForm.customPositionsText),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save career page content.");
      }

      setPageMessage("Career page content updated successfully.");
    } catch (error) {
      setPageMessage(
        error instanceof Error ? error.message : "Failed to save career page content."
      );
    } finally {
      setPageLoading(false);
    }
  }

  async function saveCareer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/careers/${editingId}` : "/api/admin/careers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          numberOfVacancies: form.numberOfVacancies ? Number(form.numberOfVacancies) : null,
          maxCvSizeMb: form.maxCvSizeMb ? Number(form.maxCvSizeMb) : 5,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save vacancy.");
      }

      setMessage(editingId ? "Vacancy updated successfully." : "Vacancy created successfully.");
      resetForm();
      await loadCareers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save vacancy.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCareer(id: string) {
    const ok = window.confirm("Delete this vacancy?");
    if (!ok) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete vacancy.");
      }

      setMessage("Vacancy deleted successfully.");
      await loadCareers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete vacancy.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adminCareerWrap"><style jsx>{`
        .adminCareerWrap {
          display: grid;
          gap: 26px;
        }

        .adminCard {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(21, 150, 212, 0.08);
          border-radius: 24px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
          padding: 24px;
        }

        .formCard {
          display: grid;
          gap: 16px;
        }

        .formHeader,
        .tableHeader {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        h2 {
          margin: 0;
          color: #0f172a;
          font-size: 26px;
          font-weight: 900;
        }

        p {
          margin: 7px 0 0;
          color: #64748b;
          line-height: 1.6;
        }

        small {
          color: #64748b;
          font-weight: 700;
        }

        .grid2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        label {
          display: grid;
          gap: 8px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #dbe3ec;
          border-radius: 14px;
          padding: 12px 13px;
          color: #111827;
          background: #ffffff;
          font: inherit;
        }

        textarea {
          resize: vertical;
        }

        .checkboxRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkboxRow input {
          width: auto;
        }

        .primaryBtn,
        .ghostBtn,
        .editBtn,
        .deleteBtn {
          border: 0;
          border-radius: 999px;
          padding: 10px 15px;
          font-weight: 850;
          cursor: pointer;
        }

        .primaryBtn {
          background: linear-gradient(90deg, #0f9d7a 0%, #1d9bf0 100%);
          color: #ffffff;
          width: fit-content;
        }

        .ghostBtn {
          background: #f1f5f9;
          color: #0f172a;
        }

        .editBtn {
          background: #e8f7f2;
          color: #047857;
          margin-right: 8px;
        }

        .deleteBtn {
          background: #fee2e2;
          color: #b91c1c;
        }

        .message {
          color: #075c9d;
          font-weight: 800;
        }

        .tableWrap {
          margin-top: 18px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 920px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          color: #475569;
          vertical-align: top;
          font-size: 14px;
        }

        th {
          background: #f8fbff;
          color: #0f172a;
          font-weight: 900;
        }

        td strong {
          display: block;
          color: #0f172a;
        }

        td span {
          display: block;
          margin-top: 4px;
          color: #64748b;
        }

        .status {
          display: inline-flex;
          border-radius: 999px;
          padding: 6px 10px;
          text-transform: capitalize;
          font-weight: 900;
        }

        .status.open {
          background: #e8f7f2;
          color: #047857;
        }

        .status.closed {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status.draft {
          background: #f1f5f9;
          color: #475569;
        }

        @media (max-width: 800px) {
          .grid2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <form className="adminCard formCard" onSubmit={saveCareerPageSettings}>
        <div className="formHeader">
          <div>
            <h2>Career Page Content</h2>
            <p>Edit public career page text and application dropdown positions.</p>
          </div>
        </div>

        <div className="grid2">
          <label>
            Section Tag
            <input
              value={careerPageForm.sectionTag}
              onChange={(e) => updateCareerPageField("sectionTag", e.target.value)}
            />
          </label>

          <label>
            Main Heading
            <input
              value={careerPageForm.headline}
              onChange={(e) => updateCareerPageField("headline", e.target.value)}
            />
          </label>
        </div>

        <label>
          Intro Text
          <textarea
            value={careerPageForm.introText}
            onChange={(e) => updateCareerPageField("introText", e.target.value)}
            rows={3}
          />
        </label>

        <div className="grid2">
          <label>
            Point 1
            <input
              value={careerPageForm.point1}
              onChange={(e) => updateCareerPageField("point1", e.target.value)}
            />
          </label>

          <label>
            Point 2
            <input
              value={careerPageForm.point2}
              onChange={(e) => updateCareerPageField("point2", e.target.value)}
            />
          </label>

          <label>
            Point 3
            <input
              value={careerPageForm.point3}
              onChange={(e) => updateCareerPageField("point3", e.target.value)}
            />
          </label>

          <label>
            Point 4
            <input
              value={careerPageForm.point4}
              onChange={(e) => updateCareerPageField("point4", e.target.value)}
            />
          </label>
        </div>

        <div className="grid2">
          <label>
            Open Positions Title
            <input
              value={careerPageForm.currentOpenTitle}
              onChange={(e) => updateCareerPageField("currentOpenTitle", e.target.value)}
            />
          </label>

          <label>
            Apply Form Tag
            <input
              value={careerPageForm.applyTag}
              onChange={(e) => updateCareerPageField("applyTag", e.target.value)}
            />
          </label>
        </div>

        <label>
          No Vacancy Text
          <textarea
            value={careerPageForm.noVacancyText}
            onChange={(e) => updateCareerPageField("noVacancyText", e.target.value)}
            rows={2}
          />
        </label>

        <div className="grid2">
          <label>
            Apply Form Title
            <input
              value={careerPageForm.applyTitle}
              onChange={(e) => updateCareerPageField("applyTitle", e.target.value)}
            />
          </label>

          <label>
            Open Application Label
            <input
              value={careerPageForm.openApplicationLabel}
              onChange={(e) => updateCareerPageField("openApplicationLabel", e.target.value)}
            />
          </label>
        </div>

        <label>
          Apply Form Intro
          <textarea
            value={careerPageForm.applyIntro}
            onChange={(e) => updateCareerPageField("applyIntro", e.target.value)}
            rows={2}
          />
        </label>

        <div className="grid2">
          <label>
            Preferred Position Label
            <input
              value={careerPageForm.preferredPositionLabel}
              onChange={(e) => updateCareerPageField("preferredPositionLabel", e.target.value)}
            />
          </label>

          <label>
            Preferred Position Placeholder
            <input
              value={careerPageForm.preferredPositionPlaceholder}
              onChange={(e) =>
                updateCareerPageField("preferredPositionPlaceholder", e.target.value)
              }
            />
          </label>
        </div>

        <label>
          Applying For Custom Positions
          <textarea
            value={careerPageForm.customPositionsText}
            onChange={(e) => updateCareerPageField("customPositionsText", e.target.value)}
            rows={5}
            placeholder={"Sales Executive\nIT Officer\nAccounts Officer"}
          />
          <small>One position per line. These will appear in the public Applying For dropdown.</small>
        </label>

        <button className="primaryBtn" type="submit" disabled={pageLoading}>
          {pageLoading ? "Saving..." : "Update Career Page Content"}
        </button>

        {pageMessage ? <p className="message">{pageMessage}</p> : null}
      </form>

      <form className="adminCard formCard" onSubmit={saveCareer}>
        <div className="formHeader">
          <div>
            <h2>{editingId ? "Edit Vacancy" : "Create Vacancy"}</h2>
            <p>Manage position, department, deadline, and vacancy status.</p>
          </div>

          {editingId ? (
            <button type="button" className="ghostBtn" onClick={resetForm}>
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="grid2">
          <label>
            Position Title *
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Example: Sales Executive"
              required
            />
          </label>

          <label>
            Department *
            <select value={form.department} onChange={(e) => updateField("department", e.target.value)}>
              <option>Real Estate</option>
              <option>Information Technology</option>
              <option>Supply Chain</option>
              <option>Agro</option>
              <option>Hospitality</option>
              <option>Accounts & Finance</option>
              <option>Administration</option>
              <option>Sales & Marketing</option>
            </select>
          </label>

          <label>
            Job Type *
            <select value={form.jobType} onChange={(e) => updateField("jobType", e.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </label>

          <label>
            Location *
            <input
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              required
            />
          </label>

          <label>
            Salary Range
            <input
              value={form.salaryRange}
              onChange={(e) => updateField("salaryRange", e.target.value)}
              placeholder="Negotiable / 25,000 - 35,000"
            />
          </label>

          <label>
            Deadline
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => updateField("deadline", e.target.value)}
            />
          </label>

          <label>
            Number of Vacancies
            <input
              type="number"
              min="1"
              value={form.numberOfVacancies}
              onChange={(e) => updateField("numberOfVacancies", e.target.value)}
              placeholder="1"
            />
          </label>

          <label>
            CV Max Size (MB)
            <input
              type="number"
              min="1"
              max="25"
              value={form.maxCvSizeMb}
              onChange={(e) => updateField("maxCvSizeMb", e.target.value)}
              placeholder="5"
            />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>

        <label>
          Short Description *
          <textarea
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            rows={3}
            required
          />
        </label>

        <label>
          Responsibilities
          <textarea
            value={form.responsibilities}
            onChange={(e) => updateField("responsibilities", e.target.value)}
            rows={4}
          />
        </label>

        <label>
          Requirements
          <textarea
            value={form.requirements}
            onChange={(e) => updateField("requirements", e.target.value)}
            rows={4}
          />
        </label>

        <label>
          Experience
          <input
            value={form.experience}
            onChange={(e) => updateField("experience", e.target.value)}
            placeholder="Example: 2 years / Fresher"
          />
        </label>

        <label className="checkboxRow">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
          />
          Featured vacancy
        </label>

        <button className="primaryBtn" type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Vacancy" : "Create Vacancy"}
        </button>

        {message ? <p className="message">{message}</p> : null}
      </form>

      <div className="adminCard">
        <div className="tableHeader">
          <h2>Vacancy List</h2>
          <p>{careers.length} item(s)</p>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 ? (
                <tr>
                  <td colSpan={7}>No vacancy created yet.</td>
                </tr>
              ) : (
                careers.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <span>{item.location}</span>
                    </td>
                    <td>{item.department}</td>
                    <td>{item.jobType}</td>
                    <td>
                      <span className={`status ${item.status}`}>{item.status}</span>
                    </td>
                    <td>{item._count?.applications ?? 0}</td>
                    <td>{item.deadline ? new Date(item.deadline).toLocaleDateString() : "Not set"}</td>
                    <td>
                      <button type="button" className="editBtn" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="deleteBtn" onClick={() => deleteCareer(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}
