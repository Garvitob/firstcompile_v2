import type { Metadata } from "next";
import Shot from "@/components/site/Shot";
import JsonLd from "@/components/site/JsonLd";
import { workSchema, breadcrumb } from "@/data/schema";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Two production systems built end to end by FirstCompile: ShipFlow, a multi-tenant delivery automation platform, and NEXUS, an AI workspace that acts in real tools.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd data={workSchema()} />
      <JsonLd data={breadcrumb([{ name: "Work", path: "/work" }])} />
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">Work</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            Built end to end, and shipped.
          </h1>
          <p className="lede rv d2">
            Two products, both built and owned by FirstCompile. No client logos,
            no borrowed numbers. What follows is the engineering: the problems,
            the decisions, the trade-offs we accepted. Every claim here is one
            we can defend on a call.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <article className="case rv">
            <div className="case-in">
              <div className="case-txt">
                <div className="case-cat">B2B SaaS · Delivery automation · Private beta</div>
                <h3 className="case-name">ShipFlow</h3>
                <p className="case-sum">
                  ShipFlow is our own product: a multi-tenant platform that takes
                  a customer ticket and walks it through requirements, task
                  breakdown, a developer board, and finally a pull request that
                  two AI models review before a human opens it. The pitch is
                  automation. The engineering is mostly not about AI at all. It
                  is about isolation, unreliable webhooks, and jobs that run for
                  minutes when the web expects milliseconds.
                </p>
                <p className="case-sum">
                  Tenant isolation is enforced in Postgres, not in application
                  code. That was a deliberate trade. Database-level isolation is
                  slower to build and harder to debug than a where-clause, but
                  it means a bug in application code cannot hand one tenant
                  another tenant&apos;s data. The database refuses. For a
                  product holding customer requirements and code, we did not
                  want that guarantee resting on every developer remembering
                  every filter, forever.
                </p>
                <p className="case-sum">
                  The GitHub App integration assumes failure. Webhooks get
                  dropped, duplicated, and delivered out of order, so handlers
                  tolerate repeats and missed events can be replayed on demand.
                  Generation runs as a background job pipeline on Inngest, with
                  retries, because long-running work does not belong in a
                  request handler. Then the review step: every PR is checked
                  against the ticket&apos;s acceptance criteria by two models
                  from different vendors. Two reviews cost more than one. We pay
                  it, because a model marking its own homework is a weak check.
                  A human still opens every PR. ShipFlow is in private beta,
                  which means we are still finding its sharp edges ourselves.
                  That is the honest status.
                </p>
                <ul className="case-pts">
                  <li>
                    Multi-tenant isolation enforced at the database layer, where
                    application bugs cannot undo it
                  </li>
                  <li>
                    Webhook handling that survives drops, duplicates, and
                    out-of-order delivery, plus on-demand replay
                  </li>
                  <li>
                    Long-running AI generation run as durable background jobs
                    with retries, kept out of request handlers
                  </li>
                  <li>
                    Cross-vendor AI review against written acceptance criteria,
                    with a human making the final call
                  </li>
                </ul>
                <div className="case-stack">
                  Turborepo · Next.js · TypeScript · Prisma · PostgreSQL · Inngest
                </div>
              </div>
              <div className="case-side">
                <Shot name="shipflow" alt="ShipFlow product interface" />
              </div>
            </div>
          </article>

          <article className="case rv">
            <div className="case-in">
              <div className="case-txt">
                <div className="case-cat">AI workspace · Tool integration</div>
                <h3 className="case-name">NEXUS</h3>
                <p className="case-sum">
                  NEXUS is one workspace across mail, calendar, repositories,
                  issues, and documents, with an assistant that performs real
                  operations in those systems instead of describing them. That
                  distinction carries the whole build. An assistant that drafts
                  an email is a text problem. An assistant that sends one needs
                  authorisation, confirmation, and a way to stop.
                </p>
                <p className="case-sum">
                  Five live third-party integrations sit behind one permission
                  model. Each vendor ships its own auth, its own scopes, its own
                  failure modes. Normalising all of that into a single
                  authorisation layer was the slowest part of the project, and
                  the least visible. Actions stream to the user as they execute,
                  and each step waits for confirmation before it runs. That is
                  friction, added on purpose. Autonomy is cheap to demo and
                  expensive to trust.
                </p>
                <p className="case-sum">
                  Retrieval is scoped the same way. Vector search runs on
                  pgvector over user-scoped data with row-level access control,
                  so a search cannot surface a document its user could not
                  already open. Not filtered after the fact. Refused at the row.
                  And every workspace carries token and cost ceilings. Hard
                  ones. When a workspace hits its ceiling, the assistant stops.
                  We would rather explain a paused task than an open-ended
                  invoice.
                </p>
                <ul className="case-pts">
                  <li>
                    One authorisation model holding across five external
                    systems, so access rules live in one place instead of five
                  </li>
                  <li>
                    Streaming action execution with per-step human confirmation
                    for operations that touch real data
                  </li>
                  <li>
                    Row-level access control applied to vector search, so
                    retrieval obeys the same permissions as every page
                  </li>
                  <li>
                    Hard token and cost ceilings per workspace. The assistant
                    stops when it hits one
                  </li>
                </ul>
                <div className="case-stack">
                  Next.js · TypeScript · Clerk · Supabase · pgvector · Prisma
                </div>
              </div>
              <div className="case-side">
                <Shot name="nexus" alt="NEXUS product interface" />
              </div>
            </div>
          </article>

          <p
            className="mut rv"
            style={{ marginTop: 34, fontSize: 15, maxWidth: "62ch", lineHeight: 1.66 }}
          >
            To walk through either build in detail, write to{" "}
            <a
              href="mailto:hello@firstcompile.com"
              style={{ borderBottom: "1px solid var(--line2)" }}
            >
              hello@firstcompile.com
            </a>
            . A mutual NDA is signed before you share anything, same day, as
            standard.
          </p>
        </div>
      </section>
    </>
  );
}
