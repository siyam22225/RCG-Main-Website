"use client";

import { useEffect, useState } from "react";

type ClientLoginForm = {
  buttonText: string;
  buttonUrl: string;
  isEnabled: boolean;
  openInNewTab: boolean;
};

const defaultForm: ClientLoginForm = {
  buttonText: "Client Login",
  buttonUrl: "",
  isEnabled: false,
  openInNewTab: true,
};

export default function ClientLoginSettingsPage() {
  const [form, setForm] = useState<ClientLoginForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSetting() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/client-login", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load client login setting.");
      }

      setForm({
        buttonText: data.setting?.buttonText || "Client Login",
        buttonUrl: data.setting?.buttonUrl || "",
        isEnabled: Boolean(data.setting?.isEnabled),
        openInNewTab: data.setting?.openInNewTab !== false,
      });
    } catch (error) {
      console.error(error);
      setMessage("Could not load client login setting.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSetting();
  }, []);

  function updateField<K extends keyof ClientLoginForm>(
    key: K,
    value: ClientLoginForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveSetting(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/client-login", {
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
        buttonText: data.setting?.buttonText || "Client Login",
        buttonUrl: data.setting?.buttonUrl || "",
        isEnabled: Boolean(data.setting?.isEnabled),
        openInNewTab: data.setting?.openInNewTab !== false,
      });

      setMessage("Client login button setting saved.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="clientLoginSettingsPage"><style jsx>{`
        .clientLoginSettingsPage {
          min-height: 100vh;
          padding: 40px 24px 72px;
          background: linear-gradient(180deg, #eef8fd, #f8fbff);
          color: #0f172a;
        }

        .settingsHeader,
        .messageBox,
        .settingsCard {
          max-width: 760px;
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

        input {
          width: 100%;
          border: 1px solid #d7e3ee;
          border-radius: 14px;
          padding: 13px 14px;
          color: #0f172a;
          font: inherit;
          outline: none;
          background: #f8fbff;
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

        .previewBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f8fbff, #eef8fd);
          border: 1px solid #dbeafe;
        }

        .previewBox span {
          color: #64748b;
          font-weight: 800;
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

        @media (max-width: 640px) {
          .clientLoginSettingsPage {
            padding: 32px 16px 56px;
          }

          .settingsCard {
            padding: 20px;
          }

          .previewBox {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
      <section className="settingsHeader">
        <p>Admin Settings</p>
        <h1>Client Login Button</h1>
        <span>
          Control the premium client login CTA shown in the website navigation.
        </span>
      </section>

      {message ? <div className="messageBox">{message}</div> : null}

      <form className="settingsCard" onSubmit={saveSetting}>
        {loading ? <p>Loading...</p> : null}

        <label>
          Button Name
          <input
            value={form.buttonText}
            onChange={(e) => updateField("buttonText", e.target.value)}
            placeholder="Client Login"
          />
        </label>

        <label>
          Login Website URL
          <input
            value={form.buttonUrl}
            onChange={(e) => updateField("buttonUrl", e.target.value)}
            placeholder="https://example.com/login"
          />
        </label>

        <label className="checkLabel">
          <input
            type="checkbox"
            checked={form.isEnabled}
            onChange={(e) => updateField("isEnabled", e.target.checked)}
          />
          Show button on website
        </label>

        <label className="checkLabel">
          <input
            type="checkbox"
            checked={form.openInNewTab}
            onChange={(e) => updateField("openInNewTab", e.target.checked)}
          />
          Open in new tab
        </label>

        <div className="previewBox">
          <span>Preview</span>
          <button type="button">
            {form.buttonText || "Client Login"} →
          </button>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Client Login Setting"}
        </button>
      </form>

      
    </main>
  );
}
