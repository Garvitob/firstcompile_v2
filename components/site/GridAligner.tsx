"use client";

import { useEffect } from "react";

/**
 * Behavioural port of the contract's alignGrid(): the hero's 64px tile grid is
 * positioned at runtime so the H1's left edge sits exactly 32px into a tile
 * (the "E of Enterprise starts at tile middle" rule). Runs on mount, on
 * debounced resize, and again once fonts finish loading. The CSS
 * `var(--gx, calc(...))` fallback covers the no-JS case.
 */
export default function GridAligner() {
  useEffect(() => {
    const align = () => {
      const h = document.querySelector<HTMLElement>(".hero .h1");
      const hero = document.querySelector<HTMLElement>(".hero");
      if (!h || !hero) return;
      const x = h.getBoundingClientRect().left - hero.getBoundingClientRect().left;
      hero.style.setProperty("--gx", `${x - 32}px`);
    };

    align();

    let t: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(align, 80);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) align();
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
