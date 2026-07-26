export default function Products() {
  return (
    <section className="sec" id="products">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">Products</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            We build our own software too.
          </h2>
          <p className="lede rv d2">
            The same team and the same quality bar, pointed at software we run
            ourselves. Running our own products keeps us sharp about what
            production really demands.
          </p>
        </div>
        <div className="prods">
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
              Every few client projects, the same missing tool shows up. When it
              shows up three times, we build it once, properly, and run it as a
              product. The next one is in build now.
            </p>
            <ul className="prod-pts">
              <li>Announced when it works, not before</li>
              <li>No waitlist theatre</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
