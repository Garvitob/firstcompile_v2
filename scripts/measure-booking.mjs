/**
 * Measures the rendered booking panel and captures it, so the Cal embed can
 * be checked against the size the design contract allocates (699 x 468).
 * Usage: node scripts/measure-booking.mjs [port] [theme]
 */
import { chromium } from "@playwright/test";
import path from "node:path";

const port = process.argv[2] || "4680";
const scheme = process.argv[3] === "light" ? "light" : "dark";
const out = path.resolve(import.meta.dirname, "..", "test-results");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1536, height: 1000 },
  colorScheme: scheme,
});
await page.goto(`http://127.0.0.1:${port}/#book`, { waitUntil: "networkidle" });
await page.evaluate(() =>
  document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"))
);
await page.waitForTimeout(6000); // Cal iframe needs time to load availability

const m = await page.evaluate(() => {
  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    calPanel: box(".cal"),
    calHeader: box(".cal-h"),
    embedBox: box(".cal-embed"),
    iframe: box(".cal-embed iframe"),
    calFooter: box(".cal-f"),
    bookSection: box("#book"),
    pageHeight: document.documentElement.scrollHeight,
    horizontalOverflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
});
console.log(JSON.stringify(m, null, 2));

const panel = await page.locator(".cal").boundingBox();
if (panel) {
  await page.screenshot({
    path: path.join(out, `booking-panel-${scheme}.png`),
    clip: {
      x: Math.max(0, panel.x - 24),
      y: Math.max(0, panel.y - 24),
      width: Math.min(1536, panel.width + 48),
      height: panel.height + 48,
    },
  });
  console.log(`wrote test-results/booking-panel-${scheme}.png`);
}
await browser.close();
