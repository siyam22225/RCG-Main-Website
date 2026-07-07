"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  queryType: string;
  subject: string;
  message: string;
  createdAt: string;
};

type AdminMessagesClientProps = {
  initialMessages: ContactMessage[];
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminMessagesClient({ initialMessages }: AdminMessagesClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function deleteMessage(id: string) {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;

    setDeletingId(id);
    setNotice("");

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete message.");
      }

      setMessages((current) => current.filter((message) => message.id !== id));
      setNotice("Message deleted successfully.");
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Failed to delete message.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="messagesCard"><style jsx>{`
        .messagesCard {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .noticeText {
          margin: 0;
          padding: 14px 18px;
          color: #075c9d;
          font-weight: 850;
          border-bottom: 1px solid #e5e7eb;
        }

        .tableWrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1120px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 16px 18px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          vertical-align: top;
          color: #334155;
          font-size: 14px;
        }

        th {
          color: #020617;
          font-weight: 900;
          background: #f8fafc;
        }

        .deleteBtn {
          border: 0;
          border-radius: 999px;
          padding: 8px 13px;
          background: #fee2e2;
          color: #b91c1c;
          font-weight: 900;
          cursor: pointer;
        }

        .deleteBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
      {notice ? <p className="noticeText">{notice}</p> : null}

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Query Type</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={8}>No messages found.</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.phone}</td>
                  <td>{msg.queryType}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>{formatDate(msg.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="deleteBtn"
                      disabled={deletingId === msg.id}
                      onClick={() => deleteMessage(msg.id)}
                    >
                      {deletingId === msg.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}
