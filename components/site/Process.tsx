export default function Process() {
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <div className="sec-head">
          <span className="kick rv">How we work</span>
          <h2 className="h2 rv d1" style={{ marginTop: 14 }}>
            You see the product every week. Not a status deck.
          </h2>
        </div>
        <div className="steps">
          <div className="step rv">
            <span className="step-n">01</span>
            <div>
              <h3>Scope</h3>
              <p>
                A call, then a one-page document: what ships, what does not,
                what it costs, when it lands. You sign it before we write code.
                Disagreements about scope happen here, not in week three.
              </p>
            </div>
            <span className="step-d">Days 1–3</span>
          </div>
          <div className="step rv">
            <span className="step-n">02</span>
            <div>
              <h3>Architecture and design</h3>
              <p>
                The data model, the permissions, and the screens. Decided with
                you, reviewed with you. This is where being wrong is expensive,
                so it happens slowly while everything else happens fast.
              </p>
            </div>
            <span className="step-d">Days 3–8</span>
          </div>
          <div className="step rv">
            <span className="step-n">03</span>
            <div>
              <h3>Build</h3>
              <p>
                A live URL you can click from the end of week one, updated
                continuously. You give feedback on the running product, not on a
                description of it. AI handles volume. Engineers make the calls.
              </p>
            </div>
            <span className="step-d">Week 2 onwards</span>
          </div>
          <div className="step rv">
            <span className="step-n">04</span>
            <div>
              <h3>Ship and hand over</h3>
              <p>
                Production deploy in your accounts, monitoring on, documentation
                written, a recorded walkthrough delivered. Then a 30-day window
                where anything we built that breaks is fixed free.
              </p>
            </div>
            <span className="step-d">Final week</span>
          </div>
        </div>
      </div>
    </section>
  );
}
