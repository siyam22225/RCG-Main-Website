"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteShellData = {
  header: unknown;
  contact: {
    success?: boolean;
    offices?: unknown[];
    socialLinks?: unknown[];
  };
  socialLinks?: unknown[];
  popup?: unknown;
};

type SiteShellContextValue = {
  data: SiteShellData | null;
  isLoading: boolean;
  hasError: boolean;
};

const SiteShellContext = createContext<SiteShellContextValue>({
  data: null,
  isLoading: true,
  hasError: false,
});

export function SiteShellProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteShellData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSiteShell() {
      try {
        const response = await fetch("/api/site-shell", { cache: "no-store" });
        const json = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error("Failed to load site shell settings");
        }

        setData(json as SiteShellData);
        setHasError(false);
      } catch (error) {
        console.error("SITE_SHELL_LOAD_ERROR", error);
        if (!cancelled) {
          setData(null);
          setHasError(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadSiteShell();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      data,
      isLoading,
      hasError,
    }),
    [data, isLoading, hasError]
  );

  return (
    <SiteShellContext.Provider value={value}>
      {children}
    </SiteShellContext.Provider>
  );
}

export function useSiteShell() {
  return useContext(SiteShellContext);
}
