/**
 * Contrast audit: every visible text node on every route, dark mode.
 * Reports the worst offenders by WCAG ratio so the fix targets facts.
 * Usage: node tmp-contrast.mjs <port> [scheme]
 */
import { chromium } from "@playwright/test";

const port = process.argv[2] || "4734";
const scheme = process.argv[3] || "dark";

const ROUTES = [
  "/",
  "/services/mvp-development",
  "/services/custom-erp-crm",
  "/work",
  "/products",
  "/about",
  "/careers",
  "/blog",
  "/blog/what-an-mvp-actually-costs-in-2026",
  "/contact",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1536, height: 1000 },
  colorScheme: scheme,
});
const page = await ctx.newPage();

const all = new Map(); // key: route|selector-ish -> sample

for (const route of ROUTES) {
  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() =>
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"))
  );
  await page.waitForTimeout(300);

  const rows = await page.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.map((v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (s) => {
      const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      return m ? { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    // effective background: walk up until an opaque background is found
    const bgOf = (el) => {
      let n = el;
      let acc = null;
      while (n && n !== document) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0) {
          if (!acc) acc = { ...c };
          else {
            // composite acc over c
            const a = acc.a + c.a * (1 - acc.a);
            acc = {
              rgb: acc.rgb.map((v, i) => (v * acc.a + c.rgb[i] * c.a * (1 - acc.a)) / a),
              a,
            };
          }
          if (acc.a >= 0.999) return acc.rgb;
        }
        n = n.parentElement;
      }
      const body = parse(getComputedStyle(document.body).backgroundColor);
      if (!acc) return body ? body.rgb : [6, 6, 7];
      const base = body && body.a > 0 ? body.rgb : [6, 6, 7];
      return acc.rgb.map((v, i) => v * acc.a + base[i] * (1 - acc.a));
    };
    const sig = (el) => {
      const cls = (el.className && typeof el.className === "string")
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "";
      return el.tagName.toLowerCase() + cls;
    };
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    let t;
    while ((t = walker.nextNode())) {
      const el = t.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      const txt = t.textContent.trim();
      if (txt.length < 8) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
      const fg = parse(cs.color);
      if (!fg) continue;
      const bg = bgOf(el);
      const L1 = lum(fg.rgb);
      const L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const px = parseFloat(cs.fontSize);
      const bold = +cs.fontWeight >= 600;
      const large = px >= 24 || (px >= 18.67 && bold);
      out.push({
        sig: sig(el),
        px: +px.toFixed(1),
        w: cs.fontWeight,
        color: cs.color,
        ratio: +ratio.toFixed(2),
        large,
        sample: txt.slice(0, 42),
      });
    }
    return out;
  });

  for (const row of rows) {
    const key = `${row.sig}|${row.color}|${row.px}`;
    if (!all.has(key)) all.set(key, { ...row, routes: new Set() });
    all.get(key).routes.add(route);
  }
}

const list = [...all.values()].sort((a, b) => a.ratio - b.ratio);
console.log(`\n${scheme.toUpperCase()} — unique text styles, worst contrast first`);
console.log("ratio  px    wt   AA?  where                                     e.g.");
for (const r of list) {
  const need = r.large ? 3 : 4.5;
  const aa = r.ratio >= need ? "ok " : "FAIL";
  const routes = [...r.routes];
  const where = routes.length > 3 ? `${routes.length} routes` : routes.join(",");
  console.log(
    `${String(r.ratio).padEnd(6)} ${String(r.px).padEnd(5)} ${String(r.w).padEnd(4)} ${aa}  ${r.sig.slice(0, 40).padEnd(41)} ${where.slice(0, 34)}  "${r.sample.slice(0, 28)}"`
  );
}
await browser.close();
