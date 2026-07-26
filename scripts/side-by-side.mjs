/**
 * §11 self-check helper: full-page screenshots of the built site and the
 * contract file at a given width/theme, for a human side-by-side diff.
 * Usage: node scripts/side-by-side.mjs [width=1536] [scheme=dark]
 * Requires `npm run start -- --port 4610` and `node scripts/serve-contract.mjs 4611`.
 */
import { chromium } from "@playwright/test";
import path from "node:path";

const width = Number(process.argv[2] || 1536);
const scheme = process.argv[3] === "light" ? "light" : "dark";
const out = path.resolve(import.meta.dirname, "..", "test-results");

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height: 900 },
  colorScheme: scheme,
});

for (const [name, url] of [
  ["site", "http://127.0.0.1:4610/"],
  ["contract", "http://127.0.0.1:4611/contract/firstcompilefinal.html"],
]) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // reveal everything before capture
  await page.evaluate(() =>
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"))
  );
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(out, `${name}-${width}-${scheme}.png`),
    fullPage: true,
  });
  console.log(`wrote test-results/${name}-${width}-${scheme}.png`);
}
await browser.close();
