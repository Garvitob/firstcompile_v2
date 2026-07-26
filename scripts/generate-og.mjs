/**
 * Generates public/og.png (1200×630) by rendering a small HTML file in
 * headless Chromium (Playwright, already a dev dependency) with the real Geist
 * fonts from node_modules. Matches the site: #060607 background, the ">" logo
 * mark, the wordmark, and the headline. No gradients.
 *
 * Run: npm run og   (commit the resulting public/og.png)
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");

function findFont(dir, hint) {
  const base = path.join(root, "node_modules", "geist", "dist", dir);
  if (!fs.existsSync(base)) return null;
  const files = fs.readdirSync(base).filter((f) => f.endsWith(".woff2"));
  const preferred =
    files.find((f) => f.toLowerCase().includes(hint)) || files[0];
  return preferred ? pathToFileURL(path.join(base, preferred)).href : null;
}

const sans =
  findFont("fonts/geist-sans", "variable") || findFont("fonts/geist-sans", "");
const mono =
  findFont("fonts/geist-mono", "variable") || findFont("fonts/geist-mono", "");
if (!sans) {
  console.error("Geist font not found in node_modules/geist — run npm install first.");
  process.exit(1);
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url("${sans}") format("woff2");font-weight:100 900}
${mono ? `@font-face{font-family:GeistMono;src:url("${mono}") format("woff2");font-weight:100 900}` : ""}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#060607;color:#f2f2f4;font-family:Geist,sans-serif;
  position:relative;overflow:hidden;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.032) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.032) 1px,transparent 1px);
  background-size:64px 64px;background-position:48px 0;
  -webkit-mask-image:radial-gradient(ellipse 78% 70% at 30% 4%,#000 16%,transparent 74%);
  mask-image:radial-gradient(ellipse 78% 70% at 30% 4%,#000 16%,transparent 74%)}
.top{display:flex;align-items:center;gap:14px;position:relative}
.mark{width:44px;height:44px;border-radius:12px;background:#eef0f5;color:#08090c;display:grid;place-items:center;
  font-family:${mono ? "GeistMono" : "monospace"},monospace;font-size:22px;font-weight:700}
.word{font-size:28px;font-weight:680;letter-spacing:-.024em}
h1{position:relative;font-size:76px;font-weight:680;letter-spacing:-.042em;line-height:1.02;max-width:17ch}
.bottom{position:relative;display:flex;justify-content:space-between;align-items:baseline;
  font-size:20px;color:#9b9ba3;border-top:1px solid rgba(255,255,255,.08);padding-top:26px}
.bottom b{color:#f2f2f4;font-weight:600}
</style></head><body>
<div class="grid"></div>
<div class="top"><div class="mark">&gt;</div><div class="word">FirstCompile</div></div>
<h1>Enterprise-grade software, at startup speed.</h1>
<div class="bottom"><span>Fixed-price quotes · NDA first · India &amp; US</span><b>firstcompile.com</b></div>
</body></html>`;

const tmp = path.join(root, ".og-tmp.html");
fs.writeFileSync(tmp, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.join(root, "public"), { recursive: true });
await page.screenshot({ path: path.join(root, "public", "og.png") });
await browser.close();
fs.unlinkSync(tmp);
console.log("wrote public/og.png (1200×630)");
