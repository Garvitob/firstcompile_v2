export default function Difference() {
  return (
    <section className="sec" id="difference">
      <div className="wrap split">
        <div>
          <span className="kick rv">The difference</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            AI-built is not the same as vibe-coded.
          </h2>
          <p className="lede rv d2" style={{ marginTop: 18 }}>
            We use AI heavily. It writes the boilerplate, the tests, the
            migrations. That is why our quotes are lower and our timelines
            shorter. But every schema, every permission check, and every line
            that touches money is designed and reviewed by an engineer. That is
            the difference between software that demos well and software that
            runs a business. We build the second kind.
          </p>
          <div className="deflist">
            <div className="defrow rv">
              <h4>What AI does</h4>
              <p>
                Boilerplate, test scaffolding, migrations, type definitions,
                repeated refactors. Work where the right answer is known and the
                cost is typing.
              </p>
            </div>
            <div className="defrow rv">
              <h4>What engineers always do</h4>
              <p>
                Data models, permissions, anything touching money or personal
                data, interface design, and the final read of every change
                before it merges.
              </p>
            </div>
            <div className="defrow rv">
              <h4>What gets reviewed twice</h4>
              <p>
                Generated code is read by a person, then checked by a second
                model against the requirement it was written for.
              </p>
            </div>
            <div className="defrow rv">
              <h4>The stack we trust</h4>
              <p>
                Next.js, TypeScript, PostgreSQL, React Native. Deliberately
                common, so any engineer you hire later can take over without us.
              </p>
            </div>
          </div>
        </div>
        <div className="rv d2" aria-hidden="true">
          <div className="mock">
            <div className="mock-bar">
              <span className="mdots">
                <i></i>
                <i></i>
                <i></i>
              </span>
              <span className="maddr">workflow · lead-intake · run #2,481</span>
            </div>
            <div className="mbody">
              <div className="mlist">
                <div className="mli">
                  <span className="ck" aria-hidden="true">
                    ✓
                  </span>
                  <em>Form submitted</em>
                  <time>0.4s</time>
                </div>
                <div className="mli">
                  <span className="ck" aria-hidden="true">
                    ✓
                  </span>
                  <em>Enriched and scored</em>
                  <time>1.1s</time>
                </div>
                <div className="mli">
                  <span className="ck" aria-hidden="true">
                    ✓
                  </span>
                  <em>Written to CRM</em>
                  <time>1.8s</time>
                </div>
                <div className="mli">
                  <span className="ck" aria-hidden="true">
                    ✓
                  </span>
                  <em>Owner notified on WhatsApp</em>
                  <time>2.2s</time>
                </div>
                <div className="mli">
                  <span className="ck run" aria-hidden="true">
                    →
                  </span>
                  <em>Invoice draft queued</em>
                  <time>running</time>
                </div>
              </div>
              <div className="mrow">
                <div className="mstat">
                  <b>2,481</b>
                  <span>Runs this month</span>
                </div>
                <div className="mstat">
                  <b>0</b>
                  <span>In dead letter</span>
                </div>
                <div className="mstat">
                  <b>99.8%</b>
                  <span>Success rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
