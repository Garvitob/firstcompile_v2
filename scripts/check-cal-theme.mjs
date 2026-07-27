/**
 * Verifies the booking embed's theme across duration x theme combinations,
 * sampling several delays after each toggle so a transient light flash cannot
 * hide behind one well-timed screenshot.
 *
 * Cal renders its booker on a transparent html background, so the wrapper's
 * own background is what prevents white showing through. This asserts that
 * wrapper colour and writes screenshots for eyeballing.
 *
 * Usage: node scripts/check-cal-theme.mjs [port]
 */
import { chromium } from "@playwright/test";
import path from "node:path";

const port = process.argv[2] || "4720";
const out = path.resolve(import.meta.dirname, "..", "test-results");

const EXPECTED = {
  dark: "rgb(16, 16, 17)", // --srf dark  #101011
  light: "rgb(255, 255, 255)", // --srf light #ffffff
};

const browser = await chromium.launch();
let failures = 0;

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

  const check = async (label) => {
    const state = await page.evaluate(() => {
      const w = document.querySelector("div.fc-cal");
      const f = document.querySelector("div.fc-cal iframe");
      return {
        wrapperBg: w ? getComputedStyle(w).backgroundColor : "none",
        src: f ? (f.getAttribute("src") || "").match(/theme=(\w+)/)?.[1] : "none",
      };
    });
    const ok = state.wrapperBg === EXPECTED[scheme] && state.src === scheme;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${label.padEnd(18)} wrapper=${state.wrapperBg} iframe-theme=${state.src}`
    );
    await page
      .locator(".cal")
      .screenshot({ path: path.join(out, `cal-${scheme}-${label}.png`) });
  };

  console.log(`${scheme}:`);
  await check("30-initial");

  await page.click('.dur button[data-d="15"]');
  await page.waitForTimeout(900);
  await check("15-at-900ms");
  await page.waitForTimeout(4000);
  await check("15-settled");

  await page.click('.dur button[data-d="30"]');
  await page.waitForTimeout(900);
  await check("30-back-at-900ms");
  await page.waitForTimeout(4000);
  await check("30-back-settled");

  await ctx.close();
}
await browser.close();

console.log(failures === 0 ? "\nALL THEME STATES OK" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
