"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "60px 0", background: "transparent" }}><style jsx>{`
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
      <div className="container" style={{ maxWidth: "520px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid rgba(21,150,212,0.08)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              color: "#16a34a",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Admin Access
          </p>

          <h1
            style={{
              margin: "0 0 20px 0",
              color: "#0f172a",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 42px)",
            }}
          >
            Login
          </h1>

          {errorMessage ? (
            <div
              style={{
                marginBottom: "16px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label className="admin-label">Email</label>
              <input
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="admin-label">Password</label>
              <input
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      
    </section>
  );
}
