import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software FirstCompile builds and runs itself: ShipFlow, delivery automation for small software teams, in private beta. Announced when it works, not before.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kick rv">Products</span>
          <h1 className="h1i rv d1" style={{ marginTop: 14 }}>
            We build our own software too.
          </h1>
          <p className="lede rv d2">
            The same team and the same quality bar, pointed at software we run
            ourselves. Running our own products keeps us sharp about what
            production really demands.
          </p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="prods" style={{ marginTop: 0 }}>
            <article className="prod rv">
              <div className="prod-top">
                <h3 className="prod-name">ShipFlow</h3>
                <span className="pill">Private beta</span>
              </div>
              <p className="prod-line">Delivery automation for small software teams.</p>
              <p className="prod-body">
                Ticket to merged pull request. Requirements, tasks, and board in
                one place, with review that reads the requirement instead of
                guessing at intent.
              </p>
              <ul className="prod-pts">
                <li>Dual-model pull request review</li>
                <li>Works with the GitHub you already use</li>
                <li>Findings trace back to the acceptance criterion they violate</li>
              </ul>
            </article>
            <article className="prod rv d1">
              <div className="prod-top">
                <h3 className="prod-name">Next product</h3>
                <span className="pill">In build</span>
              </div>
              <p className="prod-line">
                Chosen from problems we keep solving by hand for clients.
              </p>
              <p className="prod-body">
                Every few client projects, the same missing tool shows up. When
                it shows up three times, we build it once, properly, and run it
                as a product. The next one is in build now.
              </p>
              <ul className="prod-pts">
                <li>Announced when it works, not before</li>
                <li>No waitlist theatre</li>
              </ul>
            </article>
          </div>
          <p
            className="mut rv"
            style={{ marginTop: 34, fontSize: 15, maxWidth: "62ch", lineHeight: 1.66 }}
          >
            The engineering behind ShipFlow is written up on the{" "}
            <a href="/work" style={{ borderBottom: "1px solid var(--line2)" }}>
              work page
            </a>
            . For beta access, write to{" "}
            <a
              href="mailto:hello@firstcompile.com"
              style={{ borderBottom: "1px solid var(--line2)" }}
            >
              hello@firstcompile.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
