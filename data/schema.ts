import professionalService from "./schema/professional-service.json";
import website from "./schema/website.json";
import offerCatalog from "./schema/offer-catalog.json";
import faqPage from "./schema/faq.json";

/**
 * The four home-page JSON-LD blocks, extracted verbatim from the contract file
 * (see scripts/extract-contract.mjs). Do not edit the JSON by hand.
 */
export const homeSchemas: object[] = [
  professionalService,
  website,
  offerCatalog,
  faqPage,
];

/* ----------------------------------------------------------------
   Interior-page structured data. Every entity below describes
   something that actually exists on the page — no invented ratings,
   prices, job postings, or reviews.
   ---------------------------------------------------------------- */

import { SITE_URL, PRODUCT_URLS } from "./site";

const ORG = {
  "@type": "Organization",
  name: "FirstCompile",
  url: SITE_URL,
} as const;

export function breadcrumb(
  trail: { name: string; path: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...trail.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

export function aboutSchema(description: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About FirstCompile",
    url: `${SITE_URL}/about`,
    description,
    mainEntity: {
      ...ORG,
      description,
      email: "hello@firstcompile.com",
      areaServed: ["India", "United States", "Worldwide"],
      location: [
        {
          "@type": "Place",
          name: "FirstCompile — Noida",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        },
        {
          "@type": "Place",
          name: "FirstCompile — San Francisco Bay Area",
          address: {
            "@type": "PostalAddress",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            addressCountry: "US",
          },
        },
      ],
    },
  };
}

export function workSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work",
    url: `${SITE_URL}/work`,
    description:
      "Production systems built end to end by FirstCompile, described by their engineering.",
    hasPart: [
      {
        "@type": "SoftwareApplication",
        name: "ShipFlow",
        applicationCategory: "BusinessApplication",
        url: PRODUCT_URLS.shipflow,
        description:
          "Multi-tenant delivery automation: a customer ticket through requirements, task breakdown, and a developer board, with dual-model pull request review.",
        author: ORG,
      },
      {
        "@type": "SoftwareApplication",
        name: "NEXUS",
        applicationCategory: "BusinessApplication",
        url: PRODUCT_URLS.nexus,
        description:
          "An AI workspace across mail, calendar, repositories, issues, and documents, with an assistant that performs real operations in those systems.",
        author: ORG,
      },
    ],
  };
}

export function productsSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Products",
    url: `${SITE_URL}/products`,
    description: "Software FirstCompile builds and runs itself.",
    hasPart: [
      {
        "@type": "SoftwareApplication",
        name: "ShipFlow",
        applicationCategory: "DeveloperApplication",
        url: PRODUCT_URLS.shipflow,
        description:
          "Delivery automation for small software teams. Ticket to merged pull request, with review that reads the requirement. Private beta.",
        author: ORG,
      },
    ],
  };
}

export function blogSchema(
  posts: { slug: string; title: string; date: string; excerpt: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "FirstCompile Writing",
    url: `${SITE_URL}/blog`,
    description: "Plain-English notes on building software.",
    publisher: ORG,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      author: ORG,
    })),
  };
}

export function contactSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact FirstCompile",
    url: `${SITE_URL}/contact`,
    description:
      "Book a 30-minute intro call on Google Meet, or send project details in writing. NDA signed first.",
    mainEntity: {
      ...ORG,
      email: "hello@firstcompile.com",
      telephone: ["+91-7017304973"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@firstcompile.com",
          areaServed: ["IN", "US"],
          availableLanguage: "English",
        },
      ],
    },
  };
}

/**
 * Careers deliberately carries no JobPosting: there are no open roles, and
 * publishing a posting for a role that does not exist would be a lie search
 * engines and applicants would both act on.
 */
export function careersSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Careers at FirstCompile",
    url: `${SITE_URL}/careers`,
    description:
      "No open roles at FirstCompile right now. Speculative applications go to careers@firstcompile.com.",
    publisher: ORG,
  };
}
