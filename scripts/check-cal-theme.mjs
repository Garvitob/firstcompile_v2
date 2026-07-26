/**
 * Captures the booking panel in every duration x theme combination, including
 * switching back and forth, so the embed's theme can be verified rather than
 * assumed. Usage: node scripts/check-cal-theme.mjs [port]
 */
import { chromium } from "@playwright/test";
import path from "node:path";

const port = process.argv[2] || "4710";
const out = path.resolve(import.meta.dirname, "..", "test-results");

const browser = await chromium.launch();

for (const scheme of ["dark", "light"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 1000 },
    colorScheme: scheme,
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/#book`, { waitUntil: "networkidle" });
  await page.evaluate(() =>
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"))
  );
  await page.waitForTimeout(6500);

  const shoot = async (label) => {
    const panel = await page.locator(".cal").boundingBox();
    if (!panel) return;
    await page.screenshot({
      path: path.join(out, `cal-${scheme}-${label}.png`),
      clip: {
        x: Math.max(0, panel.x),
        y: Math.max(0, panel.y),
        width: Math.min(1536, panel.width),
        height: panel.height,
      },
    });
    console.log(`  wrote cal-${scheme}-${label}.png`);
  };

  console.log(`${scheme}:`);
  await shoot("30-initial");

  await page.click('.dur button[data-d="15"]');
  await page.waitForTimeout(5000);
  await shoot("15");

  await page.click('.dur button[data-d="30"]');
  await page.waitForTimeout(5000);
  await shoot("30-return");

  await ctx.close();
}
await browser.close();
