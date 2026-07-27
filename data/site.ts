export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://firstcompile.com"
).replace(/\/$/, "");

export const SITE_NAME = "FirstCompile";

export const HOME_TITLE =
  "FirstCompile — Enterprise-grade software, at startup speed";

export const HOME_DESCRIPTION =
  "AI-native software company building MVPs, custom ERP & CRM, mobile apps, AI systems, and automation for startups and businesses in India and the US. Fixed price.";

/**
 * Live deployments of the products we build and run ourselves. Declared once
 * so the visible link, the case footer, and the JSON-LD can never disagree
 * about where a product actually runs.
 */
export const PRODUCT_URLS = {
  shipflow: "https://shipflow.garvitoberoi.com",
  nexus: "https://nexus.garvitoberoi.com",
} as const;
