"use client";

import { useEffect, useMemo, useState } from "react";

type MainLogo = {
  id: string;
  logoUrl: string;
  altText: string;
  isEnabled: boolean;
};

type BrandLogo = {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

type BrandForm = {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyBrandForm: BrandForm = {
  id: "",
  name: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
  sortOrder: 0,
};

export default function LogoSettingsPage() {
  const [mainLogo, setMainLogo] = useState<MainLogo>({
    id: "main",
    logoUrl: "/images/logos/Asset 14.png",
    altText: "Real Capita Group",
    isEnabled: true,
  });

  const [brandLogos, setBrandLogos] = useState<BrandLogo[]>([]);
  const [brandForm, setBrandForm] = useState<BrandForm>(emptyBrandForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingMain, setSavingMain] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);

  const isEditingBrand = Boolean(brandForm.id);

  const sortedBrandLogos = useMemo(
    () =>
      [...brandLogos].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name);
      }),
    [brandLogos]
  );

  async function loadLogos() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/logos", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load logos.");

      if (data.mainLogo) setMainLogo(data.mainLogo);
      setBrandLogos(data.brandLogos || []);
    } catch (error) {
      console.error(error);
      setMessage("Could not load logo settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogos();
  }, []);

  async function uploadFile(target: "main" | "brand", file: File) {
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

      if (target === "main") {
        setMainLogo((prev) => ({ ...prev, logoUrl: data.url }));
      } else {
        setBrandForm((prev) => ({ ...prev, imageUrl: data.url }));
      }

      setMessage("Upload complete.");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  }

  async function saveMainLogo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingMain(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/logos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "main",
          logoUrl: mainLogo.logoUrl,
          altText: mainLogo.altText,
          isEnabled: mainLogo.isEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Save failed.");

      setMainLogo(data.mainLogo);
      setMessage("Main website logo saved.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSavingMain(false);
    }
  }

  function editBrandLogo(logo: BrandLogo) {
    setBrandForm({
      id: logo.id,
      name: logo.name,
      imageUrl: logo.imageUrl,
      linkUrl: logo.linkUrl || "",
      isActive: logo.isActive,
      sortOrder: logo.sortOrder || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveBrandLogo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingBrand(true);
    setMessage("");

    const payload = {
      type: "brand",
      id: brandForm.id,
      name: brandForm.name,
      imageUrl: brandForm.imageUrl,
      linkUrl: brandForm.linkUrl,
      isActive: brandForm.isActive,
      sortOrder: Number(brandForm.sortOrder || 0),
    };

    try {
      const res = await fetch("/api/admin/settings/logos", {
        method: isEditingBrand ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Save failed.");

      setBrandForm(emptyBrandForm);
      setMessage(isEditingBrand ? "Brand logo updated." : "Brand logo added.");
      await loadLogos();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSavingBrand(false);
    }
  }

  async function deleteBrandLogo(id: string) {
    const ok = window.confirm("Delete this logo from the homepage logo section?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/settings/logos?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Delete failed.");

      setMessage("Brand logo deleted.");
      await loadLogos();
    } catch (error) {
      console.error(error);
      setMessage("Could not delete logo.");
    }
  }

  return (
    <main className="logoSettingsPage"><style jsx>{`
        .logoSettingsPage {
          min-height: 100vh;
          padding: 40px 24px 72px;
          background: linear-gradient(180deg, #eef8fd, #f8fbff);
          color: #0f172a;
        }

        .settingsHeader,
        .messageBox,
        .settingsGrid,
        .logoListCard {
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

        .settingsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          align-items: start;
        }

        .settingsCard,
        .logoListCard {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
        }

        .logoListCard {
          margin-top: 24px;
        }

        h2 {
          margin: 0 0 18px;
          color: #075c9d;
          font-size: 24px;
        }

        label {
          display: grid;
          gap: 7px;
          margin-bottom: 14px;
          color: #334155;
          font-size: 14px;
          font-weight: 800;
        }

        input {
          width: 100%;
          border: 1px solid #d7e3ee;
          border-radius: 14px;
          padding: 12px 13px;
          color: #0f172a;
          font: inherit;
          outline: none;
          background: #f8fbff;
        }

        .checkLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 14px;
          background: #f8fbff;
          border: 1px solid #d7e3ee;
        }

        .checkLabel input {
          width: auto;
        }

        .logoPreview {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 110px;
          margin-bottom: 16px;
          padding: 18px;
          border-radius: 18px;
          background: #f8fbff;
          border: 1px solid #dbeafe;
        }

        .logoPreview img {
          max-width: 260px;
          max-height: 90px;
          object-fit: contain;
        }

        .mainLogoPreview img {
          max-width: 320px;
        }

        .buttonRow,
        .rowActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: 0;
          border-radius: 999px;
          padding: 12px 18px;
          background: linear-gradient(135deg, #0ea5e9, #16a34a);
          color: #ffffff;
          font-weight: 900;
          cursor: pointer;
        }

        button.secondary {
          background: #334155;
        }

        button.danger {
          background: #ef4444;
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .logoList {
          display: grid;
          gap: 14px;
        }

        .logoRow {
          display: grid;
          grid-template-columns: 150px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: #f8fbff;
        }

        .logoRow img {
          width: 150px;
          height: 80px;
          object-fit: contain;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .logoRow p {
          margin: 0 0 4px;
          color: #16a34a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .logoRow h3 {
          margin: 0 0 6px;
          color: #145fb3;
        }

        .logoRow span {
          color: #64748b;
          overflow-wrap: anywhere;
        }

        @media (max-width: 900px) {
          .settingsGrid,
          .logoRow {
            grid-template-columns: 1fr;
          }

          .rowActions {
            justify-content: flex-start;
          }
        }
      `}</style>
      <section className="settingsHeader">
        <p>Admin Settings</p>
        <h1>Website Logos</h1>
        <span>
          Update the main website logo and manage the homepage partner/brand
          logo row.
        </span>
      </section>

      {message ? <div className="messageBox">{message}</div> : null}

      <section className="settingsGrid">
        <form className="settingsCard" onSubmit={saveMainLogo}>
          <h2>Main Website Logo</h2>

          <div className="logoPreview mainLogoPreview">
            <img src={mainLogo.logoUrl} alt={mainLogo.altText} />
          </div>

          <label>
            Logo URL
            <input
              value={mainLogo.logoUrl}
              onChange={(e) =>
                setMainLogo((prev) => ({ ...prev, logoUrl: e.target.value }))
              }
            />
          </label>

          <label>
            Upload Logo
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile("main", file);
              }}
            />
          </label>

          <label>
            Alt Text
            <input
              value={mainLogo.altText}
              onChange={(e) =>
                setMainLogo((prev) => ({ ...prev, altText: e.target.value }))
              }
            />
          </label>

          <label className="checkLabel">
            <input
              type="checkbox"
              checked={mainLogo.isEnabled}
              onChange={(e) =>
                setMainLogo((prev) => ({
                  ...prev,
                  isEnabled: e.target.checked,
                }))
              }
            />
            Use this logo on website
          </label>

          <button type="submit" disabled={savingMain}>
            {savingMain ? "Saving..." : "Save Main Logo"}
          </button>
        </form>

        <form className="settingsCard" onSubmit={saveBrandLogo}>
          <h2>{isEditingBrand ? "Edit Bottom Logo" : "Add Bottom Logo"}</h2>

          {brandForm.imageUrl ? (
            <div className="logoPreview">
              <img src={brandForm.imageUrl} alt={brandForm.name || "Logo"} />
            </div>
          ) : null}

          <label>
            Logo Name
            <input
              value={brandForm.name}
              onChange={(e) =>
                setBrandForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Logo Image URL
            <input
              value={brandForm.imageUrl}
              onChange={(e) =>
                setBrandForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              required
            />
          </label>

          <label>
            Upload Logo Image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile("brand", file);
              }}
            />
          </label>

          <label>
            Optional Link URL
            <input
              value={brandForm.linkUrl}
              onChange={(e) =>
                setBrandForm((prev) => ({ ...prev, linkUrl: e.target.value }))
              }
              placeholder="https://example.com"
            />
          </label>

          <label>
            Sort Order
            <input
              type="number"
              value={brandForm.sortOrder}
              onChange={(e) =>
                setBrandForm((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value),
                }))
              }
            />
          </label>

          <label className="checkLabel">
            <input
              type="checkbox"
              checked={brandForm.isActive}
              onChange={(e) =>
                setBrandForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Active logo
          </label>

          <div className="buttonRow">
            <button type="submit" disabled={savingBrand}>
              {savingBrand
                ? "Saving..."
                : isEditingBrand
                  ? "Update Logo"
                  : "Add Logo"}
            </button>

            {isEditingBrand ? (
              <button
                type="button"
                className="secondary"
                onClick={() => setBrandForm(emptyBrandForm)}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="logoListCard">
        <h2>Current Bottom Logos</h2>

        {loading ? <p>Loading...</p> : null}

        <div className="logoList">
          {sortedBrandLogos.map((logo) => (
            <article className="logoRow" key={logo.id}>
              <img src={logo.imageUrl} alt={logo.name} />

              <div>
                <p>
                  #{logo.sortOrder} · {logo.isActive ? "ACTIVE" : "INACTIVE"}
                </p>
                <h3>{logo.name}</h3>
                <span>{logo.imageUrl}</span>
              </div>

              <div className="rowActions">
                <button type="button" onClick={() => editBrandLogo(logo)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteBrandLogo(logo.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      
    </main>
  );
}
