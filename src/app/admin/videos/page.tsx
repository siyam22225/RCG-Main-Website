"use client";

import { FormEvent, useEffect, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string | null;
  category?: string | null;
  sourceType: "youtube" | "raw";
  createdAt: string;
};

const categories = ["Office", "Event", "Community", "Projects", "Directors"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  fontSize: "15px",
  outline: "none",
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Office");
  const [sourceType, setSourceType] = useState<"youtube" | "raw">("youtube");
  const [videoUrl, setVideoUrl] = useState("");
  const [rawVideoFile, setRawVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  async function fetchVideos() {
    try {
      setFetching(true);

      const res = await fetch("/api/videos", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch videos.");
      }

      setVideos(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load videos.");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  async function uploadSingleFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "File upload failed.");
    }

    return data.url as string;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (sourceType === "youtube" && !videoUrl.trim()) {
      alert("Please enter a YouTube URL.");
      return;
    }

    if (sourceType === "raw" && !rawVideoFile) {
      alert("Please choose a raw video file.");
      return;
    }

    try {
      setLoading(true);

      let finalVideoUrl = videoUrl.trim();
      let finalThumbnailUrl: string | null = null;

      if (sourceType === "raw" && rawVideoFile) {
        finalVideoUrl = await uploadSingleFile(rawVideoFile);
      }

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadSingleFile(thumbnailFile);
      }

      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          sourceType,
          videoUrl: finalVideoUrl,
          thumbnail: finalThumbnailUrl,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData?.error || "Failed to save video.");
      }

      setTitle("");
      setCategory("Office");
      setSourceType("youtube");
      setVideoUrl("");
      setRawVideoFile(null);
      setThumbnailFile(null);
      setFileInputKey((prev) => prev + 1);

      await fetchVideos();
      alert("Video added successfully.");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete video.");
      }

      setVideos((prev) => prev.filter((video) => video.id !== id));
      alert("Video deleted successfully.");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "40px 24px 60px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
            border: "1px solid rgba(15,23,42,0.08)",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              margin: "0 0 20px 0",
              fontSize: "34px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Manage Videos
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sourceType}
              onChange={(e) => {
                const value = e.target.value as "youtube" | "raw";
                setSourceType(value);
                setVideoUrl("");
                setRawVideoFile(null);
                setFileInputKey((prev) => prev + 1);
              }}
              style={inputStyle}
            >
              <option value="youtube">YouTube Video</option>
              <option value="raw">Raw Video Upload</option>
            </select>

            {sourceType === "youtube" ? (
              <input
                type="text"
                placeholder="Paste YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={inputStyle}
              />
            ) : (
              <input
                key={`video-${fileInputKey}`}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setRawVideoFile(e.target.files?.[0] || null)}
                style={inputStyle}
              />
            )}

            <div>
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Thumbnail Image (Optional)
              </p>
              <input
                key={`thumb-${fileInputKey}`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                border: "none",
                borderRadius: "14px",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "14px 18px",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Saving..." : "Add Video"}
            </button>
          </form>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px 0",
              fontSize: "26px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Added Videos
          </h2>

          {fetching ? (
            <p style={{ margin: 0, color: "#475569" }}>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p style={{ margin: 0, color: "#475569" }}>No videos added yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                    border: "1px solid rgba(15,23,42,0.08)",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "78px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "#e2e8f0",
                    }}
                  >
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        No Thumbnail
                      </div>
                    )}
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        color: "#0f172a",
                        fontSize: "20px",
                        fontWeight: 700,
                      }}
                    >
                      {video.title}
                    </h3>

                    <p style={{ margin: "0 0 6px 0", color: "#475569" }}>
                      <strong>Category:</strong> {video.category || "N/A"}
                    </p>
                    <p style={{ margin: "0 0 6px 0", color: "#475569" }}>
                      <strong>Source:</strong> {video.sourceType}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#475569",
                        wordBreak: "break-all",
                      }}
                    >
                      <strong>URL:</strong> {video.videoUrl}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                    disabled={deletingId === video.id}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 700,
                      padding: "12px 16px",
                      cursor: "pointer",
                      opacity: deletingId === video.id ? 0.7 : 1,
                    }}
                  >
                    {deletingId === video.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}