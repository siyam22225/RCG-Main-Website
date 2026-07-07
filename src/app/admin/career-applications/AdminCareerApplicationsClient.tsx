"use client";

import { useEffect, useMemo, useState } from "react";

type CareerApplication = {
  id: string;
  vacancyId: string | null;
  position: string;
  name: string;
  phone: string;
  email: string;
  experience: string | null;
  expectedSalary: string | null;
  message: string | null;
  cvUrl: string;
  status: string;
  createdAt: string;
  vacancy: {
    id: string;
    title: string;
    department: string;
    status: string;
  } | null;
};

const statusOptions = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminCareerApplicationsClient() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadApplications() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/career-applications", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load applications.");
      }

      setApplications(data.applications || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.position.toLowerCase().includes(q) ||
        item.vacancy?.title.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/career-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update application.");
      }

      setApplications((current) =>
        current.map((item) => (item.id === id ? data.application : item))
      );
      setMessage("Application status updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update application.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteApplication(id: string) {
    const ok = window.confirm("Delete this application?");
    if (!ok) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/career-applications/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete application.");
      }

      setApplications((current) => current.filter((item) => item.id !== id));
      setMessage("Application deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="applicationsWrap"><style jsx>{`
        .applicationsWrap {
          display: grid;
          gap: 22px;
        }

        .adminCard {
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.08);
          padding: 26px;
        }

        .toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .toolbar h2 {
          margin: 0;
          color: #0f172a;
          font-size: 26px;
          font-weight: 900;
        }

        .toolbar p {
          margin: 7px 0 0;
          color: #64748b;
          line-height: 1.6;
        }

        .toolbar button,
        .actions a,
        .actions button {
          border: 0;
          border-radius: 999px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          text-decoration: none;
        }

        .toolbar button,
        .actions a {
          background: #075c9d;
          color: #ffffff;
        }

        .filters {
          display: grid;
          grid-template-columns: 1fr 220px;
          gap: 12px;
          margin-bottom: 16px;
        }

        .filters input,
        .filters select,
        .applicationTop select {
          width: 100%;
          border: 1px solid rgba(15, 23, 42, 0.14);
          border-radius: 16px;
          padding: 13px 14px;
          background: #f8fafc;
          color: #111827;
          font: inherit;
          font-weight: 700;
          outline: none;
        }

        .message {
          margin: 0 0 14px;
          color: #075c9d;
          font-weight: 850;
        }

        .empty {
          margin: 0;
          padding: 22px;
          border-radius: 18px;
          background: #f8fafc;
          color: #64748b;
          font-weight: 800;
        }

        .applicationList {
          display: grid;
          gap: 16px;
        }

        .applicationItem {
          padding: 20px;
          border-radius: 22px;
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .applicationTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .applicationTop h3 {
          margin: 0;
          color: #0f172a;
          font-size: 22px;
          font-weight: 950;
        }

        .applicationTop p {
          margin: 7px 0 0;
          color: #475569;
          font-weight: 750;
        }

        .applicationTop select {
          max-width: 190px;
          background: #ffffff;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .infoGrid div {
          padding: 13px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.07);
        }

        .infoGrid span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .infoGrid strong {
          display: block;
          margin-top: 5px;
          color: #111827;
          font-size: 14px;
          word-break: break-word;
        }

        .applicantMessage {
          margin: 16px 0 0;
          padding: 14px;
          border-radius: 16px;
          background: #ffffff;
          color: #334155;
          line-height: 1.7;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .deleteBtn {
          background: #fee2e2;
          color: #b91c1c;
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 860px) {
          .toolbar,
          .applicationTop {
            flex-direction: column;
          }

          .filters,
          .infoGrid {
            grid-template-columns: 1fr;
          }

          .applicationTop select {
            max-width: none;
          }
        }
      `}</style>
      <div className="adminCard">
        <div className="toolbar">
          <div>
            <h2>Submitted Applications</h2>
            <p>Review applicant details, download CVs, and update selection status.</p>
          </div>

          <button type="button" onClick={loadApplications} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="filters">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone, or position"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {message ? <p className="message">{message}</p> : null}

        {loading && applications.length === 0 ? (
          <p className="empty">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="empty">No application found.</p>
        ) : (
          <div className="applicationList">
            {filteredApplications.map((item) => (
              <article key={item.id} className="applicationItem">
                <div className="applicationTop">
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.position}
                      {item.vacancy ? ` | ${item.vacancy.department}` : ""}
                    </p>
                  </div>

                  <select
                    value={item.status}
                    onChange={(event) => updateStatus(item.id, event.target.value)}
                    disabled={loading}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="infoGrid">
                  <div>
                    <span>Email</span>
                    <strong>{item.email}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{item.phone}</strong>
                  </div>
                  <div>
                    <span>Experience</span>
                    <strong>{item.experience || "Not given"}</strong>
                  </div>
                  <div>
                    <span>Submitted</span>
                    <strong>{formatDate(item.createdAt)}</strong>
                  </div>
                </div>

                {item.message ? <p className="applicantMessage">{item.message}</p> : null}

                <div className="actions">
                  <a href={item.cvUrl} target="_blank" rel="noreferrer">
                    View / Download CV
                  </a>

                  <button
                    type="button"
                    className="deleteBtn"
                    onClick={() => deleteApplication(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
}
