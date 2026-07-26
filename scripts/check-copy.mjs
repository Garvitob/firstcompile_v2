/**
 * Deterministic voice/structure gate for generated copy.
 * Fails loudly on: banned words, em-dashes, exclamation marks, emoji,
 * malformed service JSON (key set, item counts, bad related slugs),
 * or a FirstCompile price anywhere.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SLUGS = [
  "mvp-development", "startup-tech-partner", "vibe-code-to-production",
  "ai-app-security-audit", "custom-erp-crm", "application-development",
  "ai-machine-learning", "custom-ai-agents", "workflow-automation",
  "data-business-intelligence", "industry-4-0-industrial-automation",
  "mobile-apps", "cloud-devops", "seo-geo", "technology-consulting",
];

const BANNED = [
  /\bseamless(ly)?\b/i, /\bempower(s|ed|ing|ment)?\b/i, /\bcutting[- ]edge\b/i,
  /\bpassionate(ly)?\b/i, /\brobust(ly|ness)?\b/i, /\belevate(s|d)?\b/i,
  /\bunlock(s|ed|ing)?\b/i, /\bsupercharge/i, /\bgame[- ]chang/i,
  /in today'?s (fast[- ]paced )?world/i, /\bleverag(e|es|ed|ing)\b/i,
  /\bstreamlin(e|es|ed|ing)\b/i, /\bholistic\b/i, /\bsynergy\b/i,
  /\bbest[- ]in[- ]class\b/i, /\bworld[- ]class\b/i, /\binnovativ/i,
  /\brevolutioniz/i, /\btrusted by\b/i, /!/, /—/, /✨/,
  /[\u{1F300}-\u{1FAFF}]/u,
];

let failures = 0;
function fail(file, msg) {
  failures++;
  console.log(`FAIL  ${file}: ${msg}`);
}

function scanText(file, text, { allowMarketRanges = false } = {}) {
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) {
      // en-dash ranges are fine; the em-dash regex only matches em-dash itself
      fail(file, `banned pattern ${re} → "${String(m[0]).slice(0, 40)}"`);
    }
  }
  if (!allowMarketRanges) {
    const price = text.match(/(?:₹|\$|USD|INR)\s?[\d,]{3,}/);
    if (price) fail(file, `price-like string "${price[0]}"`);
  }
}

// ---- service JSONs ----
const REQUIRED = [
  "slug", "name", "oneLiner", "metaTitle", "metaDescription", "kicker", "h1",
  "intro", "whoFor", "included", "steps", "faq", "related", "relatedProse",
];
for (const slug of SLUGS) {
  const file = `data/services-drafts/${slug}.json`;
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { fail(file, "missing"); continue; }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) { fail(file, "invalid JSON: " + e.message); continue; }
  for (const key of REQUIRED) if (!(key in data)) fail(file, `missing key ${key}`);
  const extra = Object.keys(data).filter((k) => !REQUIRED.includes(k));
  if (extra.length) fail(file, `extra keys: ${extra.join(",")}`);
  if (data.slug !== slug) fail(file, `slug mismatch: ${data.slug}`);
  if (data.intro?.length < 2 || data.intro?.length > 3) fail(file, `intro count ${data.intro?.length}`);
  if (data.included?.length < 5 || data.included?.length > 8) fail(file, `included count ${data.included?.length}`);
  if (data.steps?.length < 3 || data.steps?.length > 4) fail(file, `steps count ${data.steps?.length}`);
  if (data.faq?.length < 3 || data.faq?.length > 4) fail(file, `faq count ${data.faq?.length}`);
  if (data.metaDescription && (data.metaDescription.length < 120 || data.metaDescription.length > 165))
    fail(file, `metaDescription length ${data.metaDescription.length}`);
  for (const r of data.related ?? [])
    if (!SLUGS.includes(r)) fail(file, `bad related slug ${r}`);
  if (data.related?.includes(slug)) fail(file, "related includes itself");
  scanText(file, JSON.stringify(data));
}

// ---- blog + page drafts ----
const mdFiles = [
  ["content/blog/what-an-mvp-actually-costs-in-2026.mdx", { allowMarketRanges: true }],
  ["content/blog/can-a-vibe-coded-app-go-to-production.mdx", {}],
  ["content/blog/authentication-is-not-authorisation.mdx", {}],
];
for (const [file, opts] of mdFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { fail(file, "missing"); continue; }
  const text = fs.readFileSync(full, "utf8");
  scanText(file, text, opts);
  if (file.startsWith("content/blog/")) {
    const words = text.replace(/^---[\s\S]*?---/, "").split(/\s+/).filter(Boolean).length;
    if (words < 800 || words > 1600) fail(file, `word count ${words}`);
    if (!/^---\ntitle: "/.test(text)) fail(file, "frontmatter shape off");
  }
}

console.log(failures === 0 ? "ALL CLEAN" : `${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
