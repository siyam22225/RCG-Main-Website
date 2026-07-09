"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminNav.module.css";

const singleItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Careers", href: "/admin/careers" },
  { label: "Applications", href: "/admin/career-applications" },
  { label: "Popup", href: "/admin/popup" },
  { label: "Settings", href: "/admin/settings" },
];

const groupedItems = [
  {
    label: "Gallery",
    items: [
      { label: "Photos", href: "/admin/photos" },
      { label: "Videos", href: "/admin/videos" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "News", href: "/admin/news" },
      { label: "Blogs", href: "/admin/blogs" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, items: { href: string }[]) {
  return items.some((item) => isActive(pathname, item.href));
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    [...singleItems, ...groupedItems.flatMap((group) => group.items)].forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function handleGroupEnter(label: string) {
    clearCloseTimer();
    setOpenGroup(label);
  }

  function handleGroupLeave() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenGroup(null);
      closeTimerRef.current = null;
    }, 200);
  }

  function toggleGroup(label: string) {
    clearCloseTimer();
    setOpenGroup((current) => (current === label ? null : label));
  }

  function goTo(href: string) {
    if (pathname === href) return;
    router.push(href);
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("ADMIN_LOGOUT_ERROR", error);
    } finally {
      router.push("/admin/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className={styles.adminNavForce} aria-label="Admin navigation">
      <div className={styles.adminNavForceLinks}>
        {singleItems.slice(0, 1).map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => goTo(item.href)}
            className={`${styles.adminNavForceItem} ${
              isActive(pathname, item.href) ? styles.active : ""
            }`}
          >
            {item.label}
          </button>
        ))}

        {groupedItems.map((group) => (
          <div
            key={group.label}
            className={styles.adminNavGroup}
            onMouseEnter={() => handleGroupEnter(group.label)}
            onMouseLeave={handleGroupLeave}
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className={`${styles.adminNavForceItem} ${
                isGroupActive(pathname, group.items) ? styles.active : ""
              }`}
            >
              {group.label} ▾
            </button>

            {openGroup === group.label ? (
              <div
                className={styles.adminNavDropdown}
                onMouseEnter={() => handleGroupEnter(group.label)}
                onMouseLeave={handleGroupLeave}
              >
                {group.items.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => goTo(item.href)}
                    className={`${styles.adminNavDropdownItem} ${
                      isActive(pathname, item.href) ? styles.active : ""
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {singleItems.slice(1).map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => goTo(item.href)}
            className={`${styles.adminNavForceItem} ${
              isActive(pathname, item.href) ? styles.active : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.adminNavForceLogout}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
}
