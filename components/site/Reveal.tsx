"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Behavioural port of the contract's reveal script: every `.rv` element rises
 * 13px and fades in once when it enters the viewport. Disabled entirely under
 * prefers-reduced-motion. Re-runs on every route change.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>(".rv");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
