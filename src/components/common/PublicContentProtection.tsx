"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();

  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable ||
    Boolean(target.closest("[data-allow-copy]"))
  );
}

export default function PublicContentProtection() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;

    const root = document.documentElement;
    root.classList.add("publicContentGuard");

    const blockEvent = (event: Event) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const blockShortcuts = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;

      const blocked =
        event.key === "F12" ||
        (ctrlOrMeta && ["c", "x", "u", "s", "p", "a"].includes(key)) ||
        (ctrlOrMeta && event.shiftKey && ["i", "j", "c"].includes(key));

      if (blocked) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("selectstart", blockEvent);
    document.addEventListener("dragstart", blockEvent);
    document.addEventListener("drop", blockEvent);
    document.addEventListener("keydown", blockShortcuts);

    return () => {
      root.classList.remove("publicContentGuard");
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("selectstart", blockEvent);
      document.removeEventListener("dragstart", blockEvent);
      document.removeEventListener("drop", blockEvent);
      document.removeEventListener("keydown", blockShortcuts);
    };
  }, [isAdminRoute]);

  if (isAdminRoute) return null;

  return (
    <><style jsx global>{`
        html.publicContentGuard body {
          -webkit-touch-callout: none;
        }

        html.publicContentGuard body * {
          -webkit-user-select: none;
          user-select: none;
        }

        html.publicContentGuard input,
        html.publicContentGuard textarea,
        html.publicContentGuard select,
        html.publicContentGuard button,
        html.publicContentGuard label,
        html.publicContentGuard [contenteditable="true"],
        html.publicContentGuard [data-allow-copy] {
          -webkit-user-select: auto;
          user-select: auto;
        }

        html.publicContentGuard img,
        html.publicContentGuard video {
          -webkit-user-drag: none;
          user-drag: none;
        }

        .publicWatermark {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 2147483000;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
          justify-items: center;
          opacity: 0.045;
          transform: rotate(-18deg);
          mix-blend-mode: multiply;
        }

        .publicWatermark span {
          color: #0f172a;
          font-size: clamp(18px, 2vw, 30px);
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          body::before {
            content: "Printing is restricted for Real Capita Group website content.";
            visibility: visible !important;
            display: block;
            padding: 40px;
            color: #111827;
            font-size: 22px;
            font-weight: 800;
          }
        }
      `}</style>
      <div className="publicWatermark" aria-hidden="true">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </div>

      
    </>
  );
}

