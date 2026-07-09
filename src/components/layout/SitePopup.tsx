"use client";

import { useEffect, useState } from "react";
import { useSiteShell } from "@/components/layout/SiteShellContext";

type PopupSetting = {
  id: string;
  isActive: boolean;
  isTitleActive: boolean;
  isMessageActive: boolean;
  isButtonActive: boolean;
  title: string;
  message: string;
  imageUrl: string | null;
  buttonText: string | null;
  buttonHref: string | null;
  showOncePerSession: boolean;
  autoCloseSeconds?: number;
  updatedAt: string;
};

const POPUP_SEEN_THIS_VISIT_KEY = "real_capita_popup_seen_this_visit_v2";

function hasText(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function hasSeenThisVisit() {
  try {
    return window.sessionStorage.getItem(POPUP_SEEN_THIS_VISIT_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeenThisVisit() {
  try {
    window.sessionStorage.setItem(POPUP_SEEN_THIS_VISIT_KEY, "1");
  } catch {
    // ignore
  }
}

export default function SitePopup() {
  const { data: siteShell, isLoading } = useSiteShell();
  const [popup, setPopup] = useState<PopupSetting | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const shellPopup = siteShell?.popup as PopupSetting | null | undefined;

    if (!shellPopup || shellPopup.isActive !== true) {
      setPopup(null);
      setIsVisible(false);
      return;
    }

    if (hasSeenThisVisit()) return;

    setPopup(shellPopup);
    setIsVisible(true);
    markSeenThisVisit();
  }, [isLoading, siteShell?.popup]);

  useEffect(() => {
    setImageFailed(false);
  }, [popup?.imageUrl]);

  useEffect(() => {
    if (!popup || !isVisible) return;

    const seconds = Number(popup.autoCloseSeconds || 0);
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    const safeSeconds = Math.min(Math.max(Math.round(seconds), 1), 60);

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, safeSeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [popup, isVisible]);

  function closePopup() {
    markSeenThisVisit();
    setIsVisible(false);
  }

  if (!popup || !isVisible) return null;

  const showTitle = popup.isTitleActive && hasText(popup.title);
  const showMessage = popup.isMessageActive && hasText(popup.message);
  const showButton = popup.isButtonActive && hasText(popup.buttonText) && hasText(popup.buttonHref);

  return (
    <div className="sitePopupOverlay" role="dialog" aria-modal="true">
      <style jsx>{`
        .sitePopupOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(6px);
        }

        .sitePopupCard {
          position: relative;
          width: min(470px, 92vw);
          max-height: calc(100vh - 36px);
          overflow-y: auto;
          background: #ffffff;
          border-radius: 4px;
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.34);
        }

        .sitePopupClose {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
          width: 42px;
          height: 42px;
          border: 2px solid #ffffff;
          border-radius: 999px;
          background: #0f172a;
          color: #ffffff;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .sitePopupImageWrap img {
          width: 100%;
          height: auto;
          max-height: 62vh;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .sitePopupBody {
          padding: 24px 24px 28px;
          text-align: center;
        }

        .sitePopupBody h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 950;
          line-height: 1.1;
        }

        .sitePopupBody p {
          margin: 14px auto 0;
          color: #475569;
          font-size: 17px;
          line-height: 1.65;
        }

        .sitePopupAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 22px;
          min-height: 48px;
          padding: 0 30px;
          border-radius: 999px;
          background: linear-gradient(135deg, #075c9d, #12a06f);
          color: #ffffff;
          font-size: 14px;
          font-weight: 950;
          text-transform: uppercase;
          text-decoration: none;
        }
      `}</style>

      <div className="sitePopupCard">
        <button type="button" className="sitePopupClose" onClick={closePopup} aria-label="Close popup">
          X
        </button>

        {hasText(popup.imageUrl) && !imageFailed ? (
          <div className="sitePopupImageWrap">
            <img
              src={popup.imageUrl || ""}
              alt={popup.title || "Popup"}
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : null}

        {showTitle || showMessage || showButton ? (
          <div className="sitePopupBody">
            {showTitle ? <h2>{popup.title}</h2> : null}
            {showMessage ? <p>{popup.message}</p> : null}
            {showButton ? (
              <a href={popup.buttonHref || "#"} className="sitePopupAction">
                {popup.buttonText}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
