"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
};

export default function DeleteVideoButton({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this video?");
    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete video");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        border: "none",
        background: "transparent",
        color: "#dc2626",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        padding: 0,
      }}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}