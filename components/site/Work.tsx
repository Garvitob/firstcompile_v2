import Shot from "./Shot";
import LiveLink from "./LiveLink";

export default function Work() {
  return (
    <section className="sec" id="work">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Work</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            Built end to end, and shipped.
          </h2>
          <p className="lede rv d2">
            Real systems with authentication, background jobs, third-party
            integrations, and deploy pipelines. Not landing pages with a
            waitlist.
          </p>
        </div>

        <div style={{ marginTop: "clamp(34px,4.4vw,48px)" }}>
          <article className="case rv">
            <div className="case-in">
              <div className="case-txt">
                <div className="case-cat">B2B SaaS · Delivery automation</div>
                <h3 className="case-name">ShipFlow</h3>
                <p className="case-sum">
                  A multi-tenant platform that takes a customer ticket through
                  requirements, task breakdown, and a developer board, then
                  reviews the resulting pull request with two independent models
                  before a human opens it.
                </p>
                <ul className="case-pts">
                  <li>Tenant isolation enforced in Postgres, not in application code</li>
                  <li>GitHub App integration with webhook handling and replay</li>
                  <li>Background job pipeline for long-running generation work</li>
                  <li>
                    Cross-vendor review: two models check each PR against its
                    acceptance criteria
                  </li>
                </ul>
                <div className="case-stack case-foot">
                  <span>
                    Turborepo · Next.js · TypeScript · Prisma · PostgreSQL · Inngest
                  </span>
                  <LiveLink product="shipflow" />
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
                  One workspace across mail, calendar, repositories, issues, and
                  documents, with an assistant that performs real operations in
                  those systems instead of describing them.
                </p>
                <ul className="case-pts">
                  <li>Five live third-party integrations behind one permission model</li>
                  <li>Streaming action execution with per-step confirmation</li>
                  <li>Vector search over user-scoped data with row-level access control</li>
                  <li>Token and cost ceilings per workspace</li>
                </ul>
                <div className="case-stack case-foot">
                  <span>
                    Next.js · TypeScript · Clerk · Supabase · pgvector · Prisma
                  </span>
                  <LiveLink product="nexus" />
                </div>
              </div>
              <div className="case-side">
                <Shot name="nexus" alt="NEXUS product interface" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
