import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { services } from "../data/services";

const SITE = "http://127.0.0.1:4610";
const CONTRACT = "http://127.0.0.1:4611/contract/firstcompilefinal.html";

const WIDTHS = [1366, 1536, 1920, 2560, 390] as const;
const EXPECTED_MARGIN: Record<number, number> = {
  1366: 88,
  1536: 88,
  1920: 240,
  2560: 560,
  390: 20,
};

type Metrics = {
  scrollWidth: number;
  clientWidth: number;
  innerWidth: number;
  marginLeft: number;
  marginRight: number;
  logoX: number | null;
  h1X: number | null;
  catsX: number | null;
  faqKickX: number | null;
  footLogoX: number | null;
  heroLeft: number | null;
  bgx: number | null;
  h1FontSize: string | null;
  h1FontFamily: string | null;
  bodyBg: string;
  bodyColor: string;
  varBg: string;
  varTx: string;
};

async function collect(page: Page): Promise<Metrics> {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250); // let the grid aligner settle
  return page.evaluate(() => {
    const de = document.documentElement;
    const left = (sel: string): number | null => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().left : null;
    };
    const navIn = document.querySelector(".nav-in")!;
    const rect = navIn.getBoundingClientRect();
    const hero = document.querySelector(".hero");
    const h1 = document.querySelector(".hero .h1");
    let bgx: number | null = null;
    if (hero) {
      const cs = getComputedStyle(hero, "::before");
      bgx = parseFloat(cs.backgroundPosition.split(" ")[0]);
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      innerWidth: window.innerWidth,
      marginLeft: rect.left,
      marginRight: window.innerWidth - rect.right,
      logoX: left(".nav .logo"),
      h1X: left(".hero .h1"),
      catsX: left(".belt-cats"),
      faqKickX: left("#faq .kick"),
      footLogoX: left("footer .logo"),
      heroLeft: hero ? hero.getBoundingClientRect().left : null,
      bgx,
      h1FontSize: h1 ? getComputedStyle(h1).fontSize : null,
      h1FontFamily: h1 ? getComputedStyle(h1).fontFamily : null,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyColor: getComputedStyle(document.body).color,
      varBg: getComputedStyle(de).getPropertyValue("--bg").trim(),
      varTx: getComputedStyle(de).getPropertyValue("--tx").trim(),
    };
  });
}

function mod64(v: number): number {
  return ((v % 64) + 64) % 64;
}

const parityRows: string[] = [];

/* ================================================================
   1–5 · Geometry parity at every audited width
   ================================================================ */
for (const width of WIDTHS) {
  test(`geometry parity @ ${width}px`, async ({ browser }) => {
    const height = width < 800 ? 844 : 900;
    const ctx = await browser.newContext({
      viewport: { width, height },
      colorScheme: "dark",
    });
    const sitePage = await ctx.newPage();
    await sitePage.goto(SITE + "/", { waitUntil: "networkidle" });
    const site = await collect(sitePage);

    const contractPage = await ctx.newPage();
    await contractPage.goto(CONTRACT, { waitUntil: "load" });
    const contract = await collect(contractPage);

    // 1. zero horizontal overflow, both documents
    expect(site.scrollWidth, "site horizontal overflow").toBeLessThanOrEqual(
      site.clientWidth
    );
    expect(
      contract.scrollWidth,
      "contract horizontal overflow"
    ).toBeLessThanOrEqual(contract.clientWidth);

    // 2. symmetric margins at the expected value, matching the contract
    expect(Math.abs(site.marginLeft - site.marginRight)).toBeLessThanOrEqual(1);
    expect(Math.abs(site.marginLeft - EXPECTED_MARGIN[width])).toBeLessThanOrEqual(1);
    expect(Math.abs(site.marginLeft - contract.marginLeft)).toBeLessThanOrEqual(1);

    // 3. one alignment column: nav logo, h1, tech category line, FAQ kicker, footer logo
    const column = [site.logoX, site.h1X, site.catsX, site.faqKickX, site.footLogoX];
    for (const x of column) {
      expect(x).not.toBeNull();
      expect(Math.abs((x as number) - (site.logoX as number))).toBeLessThanOrEqual(1);
    }
    expect(
      Math.abs((site.logoX as number) - (contract.logoX as number))
    ).toBeLessThanOrEqual(1);

    // 4. the E-of-Enterprise tile anchor: h1 sits 32px into a 64px tile
    const siteOffset = mod64(
      (site.h1X as number) - (site.heroLeft as number) - (site.bgx as number)
    );
    expect(Math.abs(siteOffset - 32)).toBeLessThanOrEqual(1);
    const contractOffset = mod64(
      (contract.h1X as number) -
        (contract.heroLeft as number) -
        (contract.bgx as number)
    );
    expect(Math.abs(contractOffset - 32)).toBeLessThanOrEqual(1);

    // 5 (part). H1 type parity at this width
    expect(site.h1FontSize).toBe(contract.h1FontSize);
    expect(site.h1FontFamily || "").toContain("Geist");
    expect(contract.h1FontFamily || "").toContain("Geist");

    parityRows.push(
      `| ${width} | ${site.marginLeft.toFixed(1)}/${site.marginRight.toFixed(1)} | ${contract.marginLeft.toFixed(1)} | ${siteOffset.toFixed(1)} | ${site.h1FontSize} | ok |`
    );
    await ctx.close();
  });
}

/* ================================================================
   5 · Color tokens match the contract in BOTH themes
   ================================================================ */
for (const scheme of ["dark", "light"] as const) {
  test(`color parity · ${scheme} theme`, async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1536, height: 900 },
      colorScheme: scheme,
    });
    const sitePage = await ctx.newPage();
    await sitePage.goto(SITE + "/", { waitUntil: "networkidle" });
    const site = await collect(sitePage);
    const contractPage = await ctx.newPage();
    await contractPage.goto(CONTRACT, { waitUntil: "load" });
    const contract = await collect(contractPage);

    expect(site.varBg).toBe(contract.varBg);
    expect(site.varTx).toBe(contract.varTx);
    expect(site.bodyBg).toBe(contract.bodyBg);
    expect(site.bodyColor).toBe(contract.bodyColor);
    await ctx.close();
  });
}

/* ================================================================
   6 · Logo belt behaviour
   ================================================================ */
test("belt: animation, hover pause, aria-hidden duplicates", async ({ page }) => {
  await page.goto(SITE + "/", { waitUntil: "networkidle" });
  const names = await page.$$eval(".belt-track", (els) =>
    els.map((el) => getComputedStyle(el).animationName)
  );
  expect(names).toHaveLength(2);
  for (const n of names) expect(n).toBe("beltmove");

  const dupes = await page
    .locator('.belt-half[aria-hidden="true"]')
    .count();
  expect(dupes).toBe(2);

  await page.hover(".belt");
  const paused = await page.$eval(
    ".belt .belt-track",
    (el) => getComputedStyle(el).animationPlayState
  );
  expect(paused).toBe("paused");
});

test("belt: static under reduced motion, reveals visible", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 900 },
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await page.goto(SITE + "/", { waitUntil: "networkidle" });
  const name = await page.$eval(
    ".belt-track",
    (el) => getComputedStyle(el).animationName
  );
  expect(name).toBe("none");
  const h1Opacity = await page.$eval(
    ".hero .h1",
    (el) => getComputedStyle(el).opacity
  );
  expect(h1Opacity).toBe("1");
  await ctx.close();
});

/* ================================================================
   7 · Theme toggle flips and persists
   ================================================================ */
test("theme toggle flips data-theme both ways and persists fc-theme", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 900 },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await page.goto(SITE + "/", { waitUntil: "networkidle" });

  const initial = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme")
  );
  expect(initial).toBe("dark");

  await page.click("#themeBtn");
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.getAttribute("data-theme"))
    )
    .toBe("light");
  const stored = await page.evaluate(() => localStorage.getItem("fc-theme"));
  expect(stored).toBe("light");

  await page.click("#themeBtn");
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.getAttribute("data-theme"))
    )
    .toBe("dark");
  expect(await page.evaluate(() => localStorage.getItem("fc-theme"))).toBe("dark");

  // persists across reload
  await page.click("#themeBtn"); // light again
  await page.reload({ waitUntil: "networkidle" });
  expect(
    await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    )
  ).toBe("light");
  await ctx.close();
});

/* ================================================================
   8 · Semantics: one h1 per route, JSON-LD integrity, FAQ mirror
   ================================================================ */
test("exactly one h1 on every route", async ({ request }) => {
  const routes = [
    "/",
    "/work",
    "/products",
    "/careers",
    "/blog",
    "/about",
    "/contact",
    ...services.map((s) => `/services/${s.slug}`),
    "/blog/what-an-mvp-actually-costs-in-2026",
    "/blog/can-a-vibe-coded-app-go-to-production",
    "/blog/authentication-is-not-authorisation",
  ];
  for (const route of routes) {
    const res = await request.get(SITE + route);
    expect(res.status(), route).toBe(200);
    const html = await res.text();
    const count = (html.match(/<h1[\s>]/g) || []).length;
    expect(count, `h1 count on ${route}`).toBe(1);
  }
});

test("home: four JSON-LD blocks parse; FAQPage mirrors the visible FAQ", async ({
  page,
}) => {
  await page.goto(SITE + "/", { waitUntil: "networkidle" });
  const blocks = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.map((el) => el.textContent || "")
  );
  expect(blocks.length).toBe(4);
  const parsed = blocks.map((b) => JSON.parse(b));
  const types = parsed.map((p) => p["@type"]);
  expect(types).toEqual(
    expect.arrayContaining(["ProfessionalService", "WebSite", "Service", "FAQPage"])
  );

  const faq = parsed.find((p) => p["@type"] === "FAQPage");
  const visible = await page.$$eval("#faq details", (els) =>
    els.map((el) => ({
      q: (el.querySelector("summary")?.textContent || "")
        .replace(/\+\s*$/, "")
        .trim(),
      a: (el.querySelector(".fa")?.textContent || "").trim(),
    }))
  );
  expect(visible.length).toBe(faq.mainEntity.length);
  for (let i = 0; i < visible.length; i++) {
    expect(visible[i].q).toBe(faq.mainEntity[i].name);
    expect(visible[i].a).toBe(faq.mainEntity[i].acceptedAnswer.text);
  }
});

/* ================================================================
   9 · Enquiry pipeline: validation, success + stored row, honeypot,
       rate limit surfaced inline
   ================================================================ */
test.describe.serial("enquiry pipeline", () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.delete(SITE + "/api/test-enquiries");
    expect(res.status()).toBe(200);
  });

  test("empty submit shows 3 inline errors", async ({ page }) => {
    await page.goto(SITE + "/", { waitUntil: "networkidle" });
    await page.locator("#sendBtn").scrollIntoViewIfNeeded();
    await page.click("#sendBtn");
    await expect(page.locator(".field.bad")).toHaveCount(3);
  });

  test("valid submit shows success panel and stores a row", async ({ page, request }) => {
    await page.goto(SITE + "/", { waitUntil: "networkidle" });
    await page.fill("#fn", "Parity Tester");
    await page.fill("#fe", "parity@example.com");
    await page.fill("#fm", "A valid parity-test message with enough length.");
    await page.click("#sendBtn");
    await expect(page.locator("#done")).toHaveClass(/show/);
    const rows = await (await request.get(SITE + "/api/test-enquiries")).json();
    expect(rows.rows.length).toBe(1);
    expect(rows.rows[0].name).toBe("Parity Tester");
  });

  test("honeypot returns 200 and stores nothing", async ({ request }) => {
    const res = await request.post(SITE + "/api/enquiry", {
      data: {
        name: "Bot",
        email: "bot@spam.com",
        service: "MVP development",
        budget: "1-5",
        message: "Buy backlinks now with this message.",
        _url: "http://spam.example",
      },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
    const rows = await (await request.get(SITE + "/api/test-enquiries")).json();
    expect(rows.rows.length).toBe(1);
  });

  test("invalid API payload gets 400 with field errors", async ({ request }) => {
    const res = await request.post(SITE + "/api/enquiry", {
      data: { name: "X", email: "nope", service: "MVP development", budget: "1-5", message: "short" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.errors).toBeTruthy();
    expect(Object.keys(body.errors)).toEqual(
      expect.arrayContaining(["name", "email", "message"])
    );
  });

  test("email failure never loses the lead (A4-14)", async ({ request }) => {
    // The server runs with TEST_EMAIL=fail: every send attempt fails. The
    // enquiry must still be stored and the caller must still see success.
    const res = await request.post(SITE + "/api/enquiry", {
      data: {
        name: "Email Failure Case",
        email: "emailfail@example.com",
        service: "MVP development",
        budget: "1-5",
        message: "Store must happen before the email attempt.",
      },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
    const rows = await (await request.get(SITE + "/api/test-enquiries")).json();
    expect(rows.rows.length).toBe(2);
    expect(rows.rows[0].name).toBe("Email Failure Case");
  });

  test("6th rapid submit is rate limited and surfaced inline", async ({
    page,
    request,
  }) => {
    // bring the store to 5 recent rows for this IP bucket
    for (let i = 3; i <= 5; i++) {
      const res = await request.post(SITE + "/api/enquiry", {
        data: {
          name: `Parity Tester ${i}`,
          email: `parity${i}@example.com`,
          service: "MVP development",
          budget: "1-5",
          message: "Another valid parity-test message, long enough.",
        },
      });
      expect(res.status()).toBe(200);
    }
    const sixth = await request.post(SITE + "/api/enquiry", {
      data: {
        name: "Parity Tester 6",
        email: "parity6@example.com",
        service: "MVP development",
        budget: "1-5",
        message: "The sixth valid message inside one hour window.",
      },
    });
    expect(sixth.status()).toBe(429);

    // and the form surfaces it inline
    await page.goto(SITE + "/", { waitUntil: "networkidle" });
    await page.fill("#fn", "Parity Tester UI");
    await page.fill("#fe", "parity-ui@example.com");
    await page.fill("#fm", "One more valid message to hit the limiter.");
    await page.click("#sendBtn");
    await expect(page.locator('#leadForm [role="alert"]')).toContainText(
      /Too many enquiries/i
    );
    const rows = await (await request.get(SITE + "/api/test-enquiries")).json();
    expect(rows.rows.length).toBe(5);
  });
});

/* ================================================================
   13–15 · Addendum A: email builder, root-domain grep guard
   ================================================================ */
test("email builder: notify From, link counts, header-injection safety (A4-13)", async () => {
  const { buildInternalEmail, buildAckEmail, resolveFrom } = await import(
    "../lib/email"
  );
  const crafted = {
    name: "X\r\nBcc: victim@example.com",
    email: "attacker@example.com\r\nCc: victim@example.com",
    company: null,
    service: "MVP development\nX-Injected: 1",
    budgetLabel: "$1k – $5k",
    message: "A normal project description with no links in it.",
    ip: "203.0.113.7",
  };

  // From domain is always the notify subdomain (env unset here → default)
  expect(resolveFrom()).toContain("@notify.firstcompile.com");

  const internal = buildInternalEmail(crafted);
  expect(internal.from).toContain("@notify.firstcompile.com");
  expect(internal.subject).not.toMatch(/[\r\n]/);
  expect(internal.replyTo).not.toMatch(/[\r\n]/);
  expect(internal.text.match(/https?:\/\//g) || []).toHaveLength(0);

  const ack = buildAckEmail(crafted);
  expect(ack.from).toContain("@notify.firstcompile.com");
  expect(ack.subject).toBe("We received your enquiry — FirstCompile");
  expect(ack.subject).not.toMatch(/[\r\n]/);
  expect(ack.to).not.toMatch(/[\r\n]/);
  expect(ack.replyTo).toBe("hello@firstcompile.com");
  expect(ack.text.match(/https?:\/\//g) || []).toHaveLength(1);
  expect(ack.text).toContain("https://firstcompile.com");
  // body ≤ 70 words
  expect(ack.text.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(70);
});

test("grep guard: no root-domain From anywhere in the codebase (A4-15)", () => {
  const banned = "@firstcompile" + ".com>"; // split so this file never matches itself
  const rootDir = path.join(__dirname, "..");
  const scanDirs = ["app", "components", "lib", "data", "styles", "scripts"];
  const scanFiles = [".env.example", "README.md", "playwright.config.ts", "middleware.ts"];
  const offenders: string[] = [];

  const scan = (file: string) => {
    if (path.resolve(file) === path.resolve(__filename)) return;
    const text = fs.readFileSync(file, "utf8");
    if (text.includes(banned)) offenders.push(path.relative(rootDir, file));
  };
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx|js|mjs|json|css|md|mdx|example)$/.test(entry.name))
        scan(full);
    }
  };
  for (const dir of scanDirs) walk(path.join(rootDir, dir));
  for (const file of scanFiles) scan(path.join(rootDir, file));

  expect(offenders, `root-domain From found in: ${offenders.join(", ")}`).toEqual([]);
  expect(
    fs.readFileSync(path.join(rootDir, "lib", "email.ts"), "utf8")
  ).toContain("notify.firstcompile.com");
});

/* ================================================================
   10 · Admin: 401 without credentials, table with them
   ================================================================ */
test("admin requires Basic Auth and renders the table with it", async ({
  request,
  browser,
}) => {
  const anon = await request.get(SITE + "/admin/enquiries");
  expect(anon.status()).toBe(401);

  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 900 },
    httpCredentials: { username: "admin", password: "parity-test-password" },
  });
  const page = await ctx.newPage();
  const res = await page.goto(SITE + "/admin/enquiries");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("Enquiries");
  await expect(page.locator("table.ct")).toContainText("Parity Tester");
  await ctx.close();
});

/* ================================================================
   11 · Service pages, sitemap coverage, machine files byte-match
   ================================================================ */
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

test("every service page renders statically with its own head + schemas", async ({
  request,
}) => {
  for (const service of services) {
    const res = await request.get(SITE + `/services/${service.slug}`);
    expect(res.status(), service.slug).toBe(200);
    const html = await res.text();
    expect(html).toContain(`<title>${escapeHtml(service.metaTitle)}</title>`);
    expect(html).toContain(escapeHtml(service.metaDescription).slice(0, 60));
    const ld = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )].map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    const types = ld.map((x) => x["@type"]);
    expect(types, service.slug).toEqual(
      expect.arrayContaining(["Service", "FAQPage", "BreadcrumbList"])
    );
    const faq = ld.find((x) => x["@type"] === "FAQPage");
    expect(faq.mainEntity.length, service.slug).toBe(service.faq.length);
  }
});

test("sitemap covers home, 15 services, work, products, careers, blog + posts", async ({
  request,
}) => {
  const res = await request.get(SITE + "/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  const must = [
    "https://firstcompile.com/",
    ...services.map((s) => `https://firstcompile.com/services/${s.slug}`),
    "https://firstcompile.com/work",
    "https://firstcompile.com/products",
    "https://firstcompile.com/careers",
    "https://firstcompile.com/blog",
    "https://firstcompile.com/blog/what-an-mvp-actually-costs-in-2026",
    "https://firstcompile.com/blog/can-a-vibe-coded-app-go-to-production",
    "https://firstcompile.com/blog/authentication-is-not-authorisation",
  ];
  for (const url of must) expect(xml).toContain(`<loc>${url}</loc>`);
});

test("robots.txt and llms.txt byte-match the contract files", async ({ request }) => {
  const robots = await (await request.get(SITE + "/robots.txt")).text();
  const llms = await (await request.get(SITE + "/llms.txt")).text();
  const contractRobots = fs.readFileSync(
    path.join(__dirname, "..", "contract", "robots.txt"),
    "utf8"
  );
  const contractLlms = fs.readFileSync(
    path.join(__dirname, "..", "contract", "llms.txt"),
    "utf8"
  );
  expect(robots).toBe(contractRobots);
  expect(llms).toBe(contractLlms);
});

/* ================================================================
   12 · Zero console errors/warnings on the home page
   ================================================================ */
test("no console errors or warnings on /", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 900 },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      problems.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));

  await page.goto(SITE + "/", { waitUntil: "networkidle" });
  // exercise the interactive surface
  await page.click("#themeBtn");
  await page.click("#themeBtn");
  await page.click("#faq details summary");
  await page.mouse.wheel(0, 20000);
  await page.waitForTimeout(800);

  expect(problems, problems.join("\n")).toEqual([]);
  await ctx.close();
});

/* ================================================================
   Final parity table
   ================================================================ */
test.afterAll(() => {
  if (parityRows.length) {
    console.log("\nPARITY TABLE");
    console.log("| width | site margins L/R | contract margin | tile offset | h1 size | status |");
    console.log("|-------|------------------|-----------------|-------------|---------|--------|");
    for (const row of parityRows) console.log(row);
  }
});
