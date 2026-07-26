/**
 * Live SEO/GEO audit against a running server.
 * Usage: node scripts/seo-audit.mjs [http://127.0.0.1:4650]
 * Reports per-route head coverage plus the machine-readable layer.
 */
const BASE = process.argv[2] || "http://127.0.0.1:4650";

const ROUTES = [
  "/",
  "/services/mvp-development",
  "/services/ai-app-security-audit",
  "/work",
  "/products",
  "/about",
  "/contact",
  "/careers",
  "/blog",
  "/blog/authentication-is-not-authorisation",
];

const get = async (p) => {
  const res = await fetch(BASE + p);
  return { status: res.status, type: res.headers.get("content-type") || "", body: await res.text() };
};
const has = (html, re) => (re.test(html) ? "yes" : "NO");
const one = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

console.log("ROUTE HEAD COVERAGE");
console.log(
  "| route | h1 | title | desc | canonical | og:img | tw | jsonld |"
);
console.log("|---|---|---|---|---|---|---|---|");

let gaps = 0;
for (const route of ROUTES) {
  const { status, body } = await get(route);
  if (status !== 200) {
    console.log(`| ${route} | HTTP ${status} |`);
    gaps++;
    continue;
  }
  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  const title = has(body, /<title>[^<]{10,}<\/title>/);
  const desc = has(body, /<meta name="description" content="[^"]{50,}"/);
  const canon = has(body, /<link rel="canonical" href="https:\/\/firstcompile\.com/);
  const ogImg = has(body, /<meta property="og:image"/);
  const tw = has(body, /<meta name="twitter:card"/);
  const ld = (body.match(/application\/ld\+json/g) || []).length;
  const row = `| ${route} | ${h1} | ${title} | ${desc} | ${canon} | ${ogImg} | ${tw} | ${ld} |`;
  console.log(row);
  if (h1 !== 1 || [title, desc, canon, ogImg, tw].includes("NO") || ld === 0) gaps++;
}

console.log("\nMACHINE LAYER");
for (const p of ["/robots.txt", "/llms.txt", "/sitemap.xml", "/og.png"]) {
  const res = await fetch(BASE + p);
  const len = (await res.arrayBuffer()).byteLength;
  console.log(
    `  ${p.padEnd(14)} ${res.status}  ${(res.headers.get("content-type") || "").split(";")[0].padEnd(24)} ${len} bytes`
  );
}

const robots = (await get("/robots.txt")).body;
const bots = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User",
  "PerplexityBot", "Google-Extended", "Applebot-Extended",
];
const missing = bots.filter((b) => !robots.includes(b));
console.log(
  `\n  AI crawlers named in robots.txt: ${bots.length - missing.length}/${bots.length}` +
    (missing.length ? ` MISSING: ${missing.join(", ")}` : "")
);
console.log(`  Sitemap declared in robots.txt: ${robots.includes("Sitemap:") ? "yes" : "NO"}`);

const sitemap = (await get("/sitemap.xml")).body;
console.log(`  Sitemap URL count: ${(sitemap.match(/<loc>/g) || []).length}`);
console.log(
  `  Admin excluded from sitemap: ${sitemap.includes("/admin") ? "NO" : "yes"}`
);

const home = (await get("/")).body;
const types = [...home.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
console.log(`\n  Home JSON-LD top-level types: ${[...new Set(types)].slice(0, 8).join(", ")}`);
console.log(`  Home canonical: ${one(home, /<link rel="canonical" href="([^"]+)"/)}`);
console.log(`  Home title: ${one(home, /<title>([^<]+)<\/title>/)}`);

console.log(`\n${gaps === 0 ? "NO GAPS" : gaps + " route(s) with gaps"}`);
