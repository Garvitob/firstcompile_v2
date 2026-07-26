"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      className="icon-btn"
      id="themeBtn"
      type="button"
      aria-label="Switch theme"
      onClick={() => {
        const current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
      }}
    >
      <svg
        className="ic-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      <svg
        className="ic-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z" />
      </svg>
    </button>
  );
}
