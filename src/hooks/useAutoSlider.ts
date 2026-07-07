"use client";

import { useEffect, useState } from "react";

export function useAutoSlider(totalSlides: number, intervalMs: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalSlides);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, totalSlides]);

  return { activeIndex, setActiveIndex };
}
