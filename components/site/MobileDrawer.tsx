"use client";

import { useEffect } from "react";

/**
 * Behavioural port of the contract's burger/drawer script. The markup itself
 * is server-rendered inside <Nav/>; this component only wires the two
 * elements together, exactly as the contract's inline script did.
 */
export default function MobileDrawer() {
  useEffect(() => {
    const burger = document.getElementById("burger");
    const drawer = document.getElementById("drawer");
    if (!burger || !drawer) return;

    const onBurger = () => {
      const open = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    };
    const onDrawer = (e: Event) => {
      if ((e.target as HTMLElement).tagName === "A") {
        drawer.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    };

    burger.addEventListener("click", onBurger);
    drawer.addEventListener("click", onDrawer);
    return () => {
      burger.removeEventListener("click", onBurger);
      drawer.removeEventListener("click", onDrawer);
    };
  }, []);

  return null;
}
