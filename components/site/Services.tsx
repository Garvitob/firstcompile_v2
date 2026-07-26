import Link from "next/link";

const startupRows = [
  {
    num: "1.1",
    slug: "mvp-development",
    name: "MVP development",
    line: "Idea to a live product users can pay for, in weeks.",
  },
  {
    num: "1.2",
    slug: "startup-tech-partner",
    name: "Startup tech partner",
    line: "No CTO yet. We run product and engineering until you hire one.",
  },
  {
    num: "1.3",
    slug: "vibe-code-to-production",
    name: "Vibe-code to production",
    line: "Built fast with AI tools. We make it secure, stable, and ready to scale.",
  },
  {
    num: "1.4",
    slug: "ai-app-security-audit",
    name: "AI app security audit",
    line: "A full security review of your AI-generated codebase. Report in 5 working days.",
  },
];

const businessRows = [
  {
    num: "2.1",
    slug: "custom-erp-crm",
    name: "Custom ERP & CRM",
    line: "Software shaped around how your company actually runs. Not the template.",
  },
  {
    num: "2.2",
    slug: "application-development",
    name: "Application development",
    line: "Web platforms, portals, and internal tools. Includes Shopify and WordPress builds and migrations.",
  },
  {
    num: "2.3",
    slug: "ai-machine-learning",
    name: "AI & machine learning",
    line: "Practical AI in production: search, document intelligence, forecasting.",
  },
  {
    num: "2.4",
    slug: "custom-ai-agents",
    name: "Custom AI agents",
    line: "Agents that take real actions in your tools, with approvals, limits, and audit logs.",
  },
  {
    num: "2.5",
    slug: "workflow-automation",
    name: "Workflow automation",
    line: "Integrations and background jobs that do not fail silently. The work nobody should do by hand.",
  },
  {
    num: "2.6",
    slug: "data-business-intelligence",
    name: "Data & business intelligence",
    line: "One source of truth for your numbers. Reporting your team actually opens.",
  },
  {
    num: "2.7",
    slug: "industry-4-0-industrial-automation",
    name: "Industry 4.0 & industrial automation",
    line: "Machine monitoring, plant dashboards, and control software for factories.",
  },
  {
    num: "2.8",
    slug: "mobile-apps",
    name: "Mobile apps",
    line: "iOS and Android from one codebase. Same backend, same quality bar.",
  },
  {
    num: "2.9",
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    line: "Deployments, environments, and monitoring done properly. Releases stop being scary.",
  },
  {
    num: "2.10",
    slug: "seo-geo",
    name: "SEO & GEO",
    line: "Get found on Google and quoted by ChatGPT. Technical work, not tricks.",
  },
  {
    num: "2.11",
    slug: "technology-consulting",
    name: "Technology consulting",
    line: "A senior technical brain before you commit money. Reviews, audits, build-vs-buy calls.",
  },
];

function Row({ num, slug, name, line }: (typeof startupRows)[number]) {
  return (
    <Link className="svc" href={`/services/${slug}`}>
      <span className="svc-num">{num}</span>
      <span>
        <span className="svc-name">{name}</span>
        <span className="svc-line" style={{ display: "block" }}>
          {line}
        </span>
      </span>
      <span className="svc-go" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export default function Services() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">What we build</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            Every kind of software a growing company needs.
          </h2>
          <p className="lede rv d2">
            One quality bar across everything. Scoped in writing, priced upfront
            as a single fixed number, and delivered in your own accounts.
          </p>
        </div>

        <div className="svc-groups">
          <div className="svc-g rv">
            <h3>
              <span className="kick">01</span> For startups
            </h3>
            {startupRows.map((row) => (
              <Row key={row.slug} {...row} />
            ))}
            <p className="svc-note">
              Startups get everything below too — cloud, mobile apps, AI, data,
              and custom software included. These four are simply where founders
              usually begin.
            </p>
          </div>

          <div className="svc-g rv">
            <h3>
              <span className="kick">02</span> For businesses
            </h3>
            {businessRows.map((row) => (
              <Row key={row.slug} {...row} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
