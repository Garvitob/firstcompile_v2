/**
 * Extracts verbatim assets from contract/firstcompilefinal.html so the
 * production app never drifts from the approved design by transcription error.
 *
 * Outputs:
 *   styles/contract.css              — the contract <style> block, with the two
 *                                      font stacks pointed at next/font variables
 *   components/site/belt-data.ts     — the 27 logo chips, byte-for-byte
 *   data/schema/*.json               — the four JSON-LD blocks
 *
 * Re-run after any change to the contract file:  node scripts/extract-contract.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = fs.readFileSync(
  path.join(root, "contract", "firstcompilefinal.html"),
  "utf8"
);

function ensure(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

/* ---------- 1. CSS ---------- */
const styleMatch = src.match(/<style>\r?\n([\s\S]*?)\r?\n<\/style>/);
if (!styleMatch) throw new Error("style block not found");
let css = styleMatch[1];

// Only sanctioned edit: wire the same custom properties to next/font variables.
const sansBefore = css.includes('--sans:"Geist",-apple-system,"Segoe UI",sans-serif;');
const monoBefore = css.includes('--mono:"Geist Mono",ui-monospace,"SF Mono",monospace;');
if (!sansBefore || !monoBefore) throw new Error("font token lines not found — contract changed?");
css = css.replace(
  '--sans:"Geist",-apple-system,"Segoe UI",sans-serif;',
  '--sans:var(--font-geist-sans),"Geist",-apple-system,"Segoe UI",sans-serif;'
);
css = css.replace(
  '--mono:"Geist Mono",ui-monospace,"SF Mono",monospace;',
  '--mono:var(--font-geist-mono),"Geist Mono",ui-monospace,"SF Mono",monospace;'
);

ensure("styles");
fs.writeFileSync(
  path.join(root, "styles", "contract.css"),
  "/* GENERATED from contract/firstcompilefinal.html — do not edit by hand.\n" +
    "   Re-generate with: node scripts/extract-contract.mjs */\n" +
    css +
    "\n",
  "utf8"
);

/* ---------- 2. Belt chips ---------- */
function firstHalf(beltMarker) {
  const beltStart = src.indexOf(beltMarker);
  if (beltStart === -1) throw new Error("belt marker not found: " + beltMarker);
  const halfOpen = src.indexOf('<div class="belt-half">', beltStart);
  const contentStart = src.indexOf("\n", halfOpen) + 1;
  const halfClose = src.indexOf("</div>", contentStart);
  return src.slice(contentStart, halfClose).replace(/\s+$/, "");
}
const beltA = firstHalf('<div class="belt" aria-label="Technologies">');
const beltB = firstHalf('<div class="belt rev" aria-label="Technologies">');

const chipCount = (s) => (s.match(/class="chip"/g) || []).length;
if (chipCount(beltA) !== 14) throw new Error("belt A expected 14 chips, got " + chipCount(beltA));
if (chipCount(beltB) !== 13) throw new Error("belt B expected 13 chips, got " + chipCount(beltB));

ensure("components/site");
fs.writeFileSync(
  path.join(root, "components", "site", "belt-data.ts"),
  "// GENERATED from contract/firstcompilefinal.html — do not edit by hand.\n" +
    "// Re-generate with: node scripts/extract-contract.mjs\n" +
    "// Row A: 14 chips. Row B: 13 chips. Official marks embedded inline, byte-for-byte.\n" +
    `export const BELT_A: string = ${JSON.stringify(beltA)};\n` +
    `export const BELT_B: string = ${JSON.stringify(beltB)};\n`,
  "utf8"
);

/* ---------- 3. JSON-LD ---------- */
const blocks = [...src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
  (m) => m[1]
);
if (blocks.length !== 4) throw new Error("expected 4 JSON-LD blocks, got " + blocks.length);
const names = ["professional-service", "website", "offer-catalog", "faq"];
ensure("data/schema");
blocks.forEach((raw, i) => {
  const parsed = JSON.parse(raw); // validate
  fs.writeFileSync(
    path.join(root, "data", "schema", names[i] + ".json"),
    JSON.stringify(parsed, null, 2) + "\n",
    "utf8"
  );
});

console.log("extracted:");
console.log("  styles/contract.css          " + css.length + " chars");
console.log("  belt A chips: " + chipCount(beltA) + ", belt B chips: " + chipCount(beltB));
console.log("  data/schema: " + names.join(", "));
